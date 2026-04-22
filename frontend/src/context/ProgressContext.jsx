/* eslint-disable react-refresh/only-export-components -- ProgressProvider + useProgress pair */
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { useAuth } from './AuthContext'
import { getJson, postJson } from '../lib/api'
import { loadProgress, saveProgress } from '../lib/dsaProgress'
import { dsaSheets } from '../data/dsa'
import { getInterviewTopic, interviewTopicIds } from '../data/interviewTopics'
import { fullStackSections } from '../data/fullstackRoadmap'
import { buildAdditionalModuleItems } from '../data/additionalModules'

const extraModuleIds = [
  'aptitude',
  'logical-reasoning',
  'system-design',
  'devops-cloud',
  'hr-behavioral',
  'testing-qa',
  'design-patterns',
  'mobile-development',
  'web3-blockchain',
  'core-cs-fundamentals',
]

const ProgressContext = createContext(null)

function buildCatalog() {
  const questions = []
  const byQuestionId = {}

  dsaSheets.forEach((sheet, sheetIndex) => {
    for (const q of sheet.questions ?? []) {
      const meta = {
        questionId: q.link,
        categoryId: 'dsa',
        categoryLabel: 'DSA',
        sheetId: `dsa-${sheetIndex}`,
        sheetLabel: sheet.title,
      }
      questions.push(meta)
      byQuestionId[q.link] = meta
    }
  })

  for (const topicId of interviewTopicIds) {
    if (topicId === 'fullstack') continue
    const topic = getInterviewTopic(topicId)
    for (const cat of topic?.categories ?? []) {
      for (const q of cat.questions ?? []) {
        const meta = {
          questionId: q.link,
          categoryId: topicId,
          categoryLabel: topic.title,
          sheetId: `${topicId}-${cat.id}`,
          sheetLabel: `${topic.title} - ${cat.label}`,
        }
        questions.push(meta)
        byQuestionId[q.link] = meta
      }
    }
  }

  for (const section of fullStackSections) {
    for (const group of section.topicGroups ?? []) {
      for (const item of group.items ?? []) {
        const meta = {
          questionId: item.id,
          categoryId: 'fullstack',
          categoryLabel: 'Full Stack Development',
          sheetId: `fullstack-${section.id}`,
          sheetLabel: `Full Stack - ${section.title}`,
        }
        questions.push(meta)
        byQuestionId[item.id] = meta
      }
    }
  }

  for (const moduleId of extraModuleIds) {
    const moduleItems = buildAdditionalModuleItems(moduleId)
    for (const item of moduleItems) {
      const meta = {
        questionId: item.id,
        categoryId: moduleId,
        categoryLabel: item.category,
        sheetId: `${moduleId}-${item.topic}`.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        sheetLabel: `${item.category} - ${item.topic}`,
      }
      questions.push(meta)
      byQuestionId[item.id] = meta
    }
  }

  return { questions, byQuestionId }
}

const catalog = buildCatalog()

function toPercent(done, total) {
  return total ? Math.round((done / total) * 100) : 0
}

function buildSummary(map) {
  const perCategory = {}
  const perSheet = {}
  const completedQuestionIds = []
  let notesCount = 0

  for (const q of catalog.questions) {
    if (!perCategory[q.categoryId]) {
      perCategory[q.categoryId] = {
        id: q.categoryId,
        label: q.categoryLabel,
        done: 0,
        total: 0,
        pct: 0,
      }
    }
    if (!perSheet[q.sheetId]) {
      perSheet[q.sheetId] = {
        id: q.sheetId,
        label: q.sheetLabel,
        categoryId: q.categoryId,
        done: 0,
        total: 0,
        pct: 0,
      }
    }

    perCategory[q.categoryId].total += 1
    perSheet[q.sheetId].total += 1

    const entry = map[q.questionId]
    if (entry?.completed) {
      completedQuestionIds.push(q.questionId)
      perCategory[q.categoryId].done += 1
      perSheet[q.sheetId].done += 1
    }
    if (entry?.notes?.trim()) notesCount += 1
  }

  Object.values(perCategory).forEach((s) => {
    s.pct = toPercent(s.done, s.total)
  })
  Object.values(perSheet).forEach((s) => {
    s.pct = toPercent(s.done, s.total)
  })

  return {
    completedQuestionIds,
    totalCompleted: completedQuestionIds.length,
    totalQuestions: catalog.questions.length,
    totalPct: toPercent(completedQuestionIds.length, catalog.questions.length),
    notesCount,
    perCategory,
    perSheet,
  }
}

export function ProgressProvider({ children }) {
  const { token, userId } = useAuth()
  const useRemote = Boolean(token && userId)

  const [map, setMap] = useState({})
  const [hydrated, setHydrated] = useState(false)
  const loadedKeysRef = useRef(new Set())

  // ── Hydrate on mount / auth change ──────────────────────────────
  useEffect(() => {
    if (useRemote) {
      let cancelled = false
      void (async () => {
        try {
          const data = await getJson(`/api/progress/${userId}`, { token })
          const next = {}
          for (const row of data.progress ?? []) {
            next[row.questionId] = {
              completed: Boolean(row.completed),
              notes: row.notes ?? '',
              revisit: Boolean(row.revisit),
              important: Boolean(row.important),
              confusing: Boolean(row.confusing),
              favorite: Boolean(row.favorite),
            }
          }
          if (!cancelled) {
            setMap(next)
            setHydrated(true)
          }
        } catch {
          if (!cancelled) setHydrated(true)
        }
      })()
      return () => { cancelled = true }
    }

    // Guest: load from localStorage for all known progressKeys
    const next = {}
    const loadKey = (key) => {
      if (loadedKeysRef.current.has(key)) return
      loadedKeysRef.current.add(key)
      const p = loadProgress(key)
      for (const [link, done] of Object.entries(p.done)) {
        if (done) next[link] = { ...(next[link] ?? {}), completed: true }
      }
      for (const [link, notes] of Object.entries(p.notes)) {
        if (notes?.trim()) next[link] = { ...(next[link] ?? {}), notes }
      }
    }

    dsaSheets.forEach((_, i) => loadKey(`dsa-${i}`))
    for (const tid of interviewTopicIds) {
      if (tid === 'fullstack') continue
      const topic = getInterviewTopic(tid)
      for (const cat of topic?.categories ?? []) loadKey(`${tid}-${cat.id}`)
    }
    for (const section of fullStackSections) {
      for (const group of section.topicGroups ?? []) {
        loadKey(`fullstack-${section.id}-${group.id}`)
      }
    }
    for (const moduleId of extraModuleIds) {
      const moduleItems = buildAdditionalModuleItems(moduleId)
      for (const item of moduleItems) {
        loadKey(`${moduleId}-${item.topic}`.toLowerCase().replace(/[^a-z0-9]+/g, '-'))
        loadKey(`${moduleId}-${item.topic}-${item.difficulty}`.toLowerCase().replace(/[^a-z0-9]+/g, '-'))
      }
    }

    setMap(next)
    setHydrated(true)
  }, [useRemote, userId, token])

  /** Toggle a single question. Returns new boolean value. */
  const toggleDone = useCallback(
    async (progressKey, link) => {
      const current = map[link]
      const nextDone = !(current?.completed)
      const entry = { ...(current ?? {}), completed: nextDone }
      const meta = catalog.byQuestionId[link]

      // optimistic update
      setMap((prev) => ({ ...prev, [link]: entry }))

      // persist local grouped state for both guests and signed-in users
      const grouped = { ...loadProgress(progressKey) }
      grouped.done = { ...grouped.done, [link]: nextDone }
      if (!nextDone) delete grouped.done[link]
      saveProgress(progressKey, grouped)

      if (useRemote) {
        try {
          await postJson(
            '/api/progress/toggle',
            {
              questionId: link,
              userId,
              categoryId: meta?.categoryId,
              sheetId: meta?.sheetId ?? progressKey,
            },
            { token }
          )
        } catch {
          // Compatibility fallback: some deployments may still expose only /api/progress.
          // Keep optimistic state so UI remains responsive even when network is flaky.
          postJson(
            '/api/progress',
            {
              questionId: link,
              completed: nextDone,
              notes: current?.notes ?? '',
              categoryId: meta?.categoryId,
              sheetId: meta?.sheetId ?? progressKey,
            },
            { token }
          ).catch(() => {})
        }
      }
      return nextDone
    },
    [map, token, useRemote, userId]
  )

  /** Save notes for a single question. */
  const saveQuestionNotes = useCallback(
    (progressKey, link, text) => {
      const current = map[link]
      const entry = { completed: Boolean(current?.completed), notes: text }
      const meta = catalog.byQuestionId[link]
      setMap((prev) => ({ ...prev, [link]: entry }))
      // Persist to localStorage
      const grouped = { ...loadProgress(progressKey) }
      grouped.notes = { ...grouped.notes, [link]: text }
      saveProgress(progressKey, grouped)
      // Persist to API
      if (useRemote) {
        postJson(
          '/api/progress',
          {
            questionId: link,
            completed: Boolean(current?.completed),
            notes: text,
            categoryId: meta?.categoryId,
            sheetId: meta?.sheetId ?? progressKey,
          },
          { token }
        ).catch(() => {})
      }
    },
    [map, useRemote, token]
  )

  /** Update flags/tags for a single question. */
  const saveQuestionFlags = useCallback(
    (progressKey, link, flags) => {
      const current = map[link] ?? {}
      const entry = {
        completed: Boolean(current.completed),
        notes: current.notes ?? '',
        revisit: typeof flags.revisit === 'boolean' ? flags.revisit : Boolean(current.revisit),
        important: typeof flags.important === 'boolean' ? flags.important : Boolean(current.important),
        confusing: typeof flags.confusing === 'boolean' ? flags.confusing : Boolean(current.confusing),
        favorite: typeof flags.favorite === 'boolean' ? flags.favorite : Boolean(current.favorite),
      }
      const meta = catalog.byQuestionId[link]
      setMap((prev) => ({ ...prev, [link]: entry }))
      if (useRemote) {
        postJson(
          '/api/progress',
          {
            questionId: link,
            completed: Boolean(current.completed),
            notes: current.notes ?? '',
            revisit: entry.revisit,
            important: entry.important,
            confusing: entry.confusing,
            favorite: entry.favorite,
            categoryId: meta?.categoryId,
            sheetId: meta?.sheetId ?? progressKey,
          },
          { token }
        ).catch(() => {})
      }
    },
    [map, token, useRemote]
  )

  const toggleFavorite = useCallback(
    async (progressKey, link) => {
      const current = map[link] ?? {}
      const nextFavorite = !Boolean(current.favorite)
      const meta = catalog.byQuestionId[link]
      setMap((prev) => ({ ...prev, [link]: { ...current, favorite: nextFavorite } }))
      if (useRemote) {
        try {
          await postJson(
            '/api/favorites/toggle',
            {
              questionId: link,
              categoryId: meta?.categoryId,
              sheetId: meta?.sheetId ?? progressKey,
            },
            { token }
          )
        } catch {
          postJson(
            '/api/progress/favorites/toggle',
            {
              questionId: link,
              categoryId: meta?.categoryId,
              sheetId: meta?.sheetId ?? progressKey,
            },
            { token }
          ).catch(() => {
            setMap((prev) => ({ ...prev, [link]: { ...current, favorite: Boolean(current.favorite) } }))
          })
        }
      }
      return nextFavorite
    },
    [map, token, useRemote]
  )

  const summary = useMemo(() => buildSummary(map), [map])

  const getQuestionMeta = useCallback((questionId) => catalog.byQuestionId[questionId] ?? null, [])

  const value = useMemo(
    () => ({
      map,
      hydrated,
      completedQuestionIds: summary.completedQuestionIds,
      totalCompletedCount: summary.totalCompleted,
      progressSummary: summary,
      toggleDone,
      saveQuestionNotes,
      saveQuestionFlags,
      toggleFavorite,
      getQuestionMeta,
    }),
    [map, hydrated, summary, toggleDone, saveQuestionNotes, saveQuestionFlags, toggleFavorite, getQuestionMeta]
  )

  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>
}

export function useProgress() {
  const ctx = useContext(ProgressContext)
  if (!ctx) {
    throw new Error('useProgress must be used within ProgressProvider')
  }
  return ctx
}
