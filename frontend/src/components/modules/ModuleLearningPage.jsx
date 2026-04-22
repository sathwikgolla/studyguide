import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import { Play } from 'lucide-react'
import { moduleVariants } from '../../config/moduleVariants'
import { progressForItems, topicsForModule } from '../../lib/moduleItems'
import ModuleOverviewHeader from './ModuleOverviewHeader'
import ModuleProgressHero from './ModuleProgressHero'
import TopicCardGrid from './TopicCardGrid'
import ModuleSearchBar from './ModuleSearchBar'
import FilterBar from './FilterBar'
import TopicProgressStats from './TopicProgressStats'
import TopicDetailView from './TopicDetailView'
import NotesModal from './NotesModal'
import TimerComponent from './TimerComponent'
import RevisionQueue from './RevisionQueue'
import FlashcardView from './FlashcardView'
import { postJson, getJson } from '../../lib/api'
import { useAuth } from '../../context/AuthContext'

export default function ModuleLearningPage({
  moduleId,
  items,
  map,
  toggleDone,
  saveQuestionNotes,
  saveQuestionFlags = () => {},
  toggleFavorite = () => {},
}) {
  const keyOf = (text) => String(text).toLowerCase().replace(/[^a-z0-9]+/g, '-')
  const variant = moduleVariants[moduleId]
  const topics = useMemo(() => topicsForModule(moduleId), [moduleId])
  const [selectedTopic, setSelectedTopic] = useState(() => {
    try {
      return localStorage.getItem(`prepflow:last-topic:${moduleId}`) || topics[0]
    } catch {
      return topics[0]
    }
  })
  const [search, setSearch] = useState('')
  const [difficulty, setDifficulty] = useState('All')
  const [sortBy, setSortBy] = useState('order')
  const [revisionMode, setRevisionMode] = useState(false)
  const [tagFilter, setTagFilter] = useState('All')
  const [companyFilter, setCompanyFilter] = useState('All')
  const [timerRunning, setTimerRunning] = useState(false)
  const [timerQuestionId, setTimerQuestionId] = useState(null)
  const [revisionQueue, setRevisionQueue] = useState([])
  const [notesModal, setNotesModal] = useState(null)
  const { token } = useAuth()

  useEffect(() => {
    if (!topics.includes(selectedTopic)) setSelectedTopic(topics[0])
  }, [topics, selectedTopic])

  useEffect(() => {
    try {
      if (selectedTopic) localStorage.setItem(`prepflow:last-topic:${moduleId}`, selectedTopic)
    } catch {
      /* ignore */
    }
  }, [moduleId, selectedTopic])

  const moduleStats = useMemo(() => progressForItems(items, map), [items, map])

  const statsByTopic = useMemo(() => {
    const out = {}
    for (const topic of topics) {
      out[topic] = progressForItems(
        items.filter((i) => i.topic === topic),
        map
      )
    }
    return out
  }, [topics, items, map])

  const filteredTopicItems = useMemo(() => {
    let rows = items.filter((i) => i.topic === selectedTopic)
    const q = search.trim().toLowerCase()
    if (q) rows = rows.filter((i) => i.title.toLowerCase().includes(q))
    if (difficulty !== 'All') rows = rows.filter((i) => i.difficulty === difficulty)
    if (revisionMode) {
      rows = rows.filter((i) => i.difficulty === 'Hard' || map[i.id]?.revisit)
    }
    if (tagFilter !== 'All') {
      rows = rows.filter((i) => Boolean(map[i.id]?.[tagFilter]))
    }
    if (companyFilter !== 'All') {
      rows = rows.filter((i) => (i.company || 'General') === companyFilter)
    }
    rows = [...rows].sort((a, b) => {
      if (sortBy === 'completion') {
        return Number(Boolean(map[b.id]?.completed)) - Number(Boolean(map[a.id]?.completed))
      }
      return a.order - b.order
    })
    return rows
  }, [items, selectedTopic, search, difficulty, sortBy, map, revisionMode, tagFilter, companyFilter])

  const companies = useMemo(() => ['All', ...new Set(items.map((i) => i.company || 'General'))], [items])

  useEffect(() => {
    if (!token) return
    void (async () => {
      try {
        const data = await getJson('/api/revision', { token })
        setRevisionQueue(data.queue ?? [])
      } catch {
        setRevisionQueue([])
      }
    })()
  }, [token, map])

  const difficultyStats = useMemo(() => {
    const out = { Easy: { done: 0, total: 0 }, Medium: { done: 0, total: 0 }, Hard: { done: 0, total: 0 } }
    for (const item of items.filter((i) => i.topic === selectedTopic)) {
      const bucket = out[item.difficulty]
      if (!bucket) continue
      bucket.total += 1
      if (map[item.id]?.completed) bucket.done += 1
    }
    return out
  }, [items, selectedTopic, map])

  return (
    <div className="space-y-5">
      <ModuleOverviewHeader variant={variant} />
      <ModuleProgressHero title={variant.title} stats={moduleStats} variant={variant} />

      <TopicCardGrid
        topics={topics}
        selectedTopic={selectedTopic}
        onSelectTopic={setSelectedTopic}
        statsByTopic={statsByTopic}
        variant={variant}
      />

      <section className="grid gap-3 lg:grid-cols-2">
        <ModuleSearchBar value={search} onChange={setSearch} variant={variant} />
        <FilterBar
          topic={selectedTopic}
          topics={topics}
          onTopic={setSelectedTopic}
          difficulty={difficulty}
          onDifficulty={setDifficulty}
          sortBy={sortBy}
          onSortBy={setSortBy}
          variant={variant}
        />
      </section>
      <section className="flex flex-wrap items-center gap-2 rounded-xl border border-white/10 bg-black/25 px-3 py-2">
        <button
          type="button"
          onClick={() => setRevisionMode((v) => !v)}
          className={`rounded-md border px-2.5 py-1.5 text-xs font-medium transition ${
            revisionMode ? variant.chip : 'border-white/10 text-neutral-300'
          }`}
        >
          Revision Mode
        </button>
        <select
          value={tagFilter}
          onChange={(e) => setTagFilter(e.target.value)}
          className={`rounded-md border border-white/10 bg-neutral-950/65 px-2.5 py-1.5 text-xs text-neutral-200 outline-none ${variant.focus}`}
        >
          <option value="All">All Tags</option>
          <option value="important">Important</option>
          <option value="confusing">Confusing</option>
          <option value="revisit">Revisit</option>
          <option value="favorite">Favorite</option>
        </select>
        <button
          type="button"
          onClick={() => {
            const unsolved = items.find((i) => !map[i.id]?.completed)
            if (unsolved) {
              setSelectedTopic(unsolved.topic)
              setSearch(unsolved.title)
              setTimerQuestionId(unsolved.id)
              setTimerRunning(true)
            }
          }}
          className="inline-flex items-center gap-1 rounded-md border border-white/10 bg-white/[0.03] px-2.5 py-1.5 text-xs font-medium text-neutral-200 transition hover:border-white/25"
        >
          <Play className="size-3.5" aria-hidden />
          Start Quick Solve
        </button>
        <select
          value={companyFilter}
          onChange={(e) => setCompanyFilter(e.target.value)}
          className={`rounded-md border border-white/10 bg-neutral-950/65 px-2.5 py-1.5 text-xs text-neutral-200 outline-none ${variant.focus}`}
        >
          {companies.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        {timerRunning ? (
          <TimerComponent
            running={timerRunning}
            onStop={(seconds) => {
              setTimerRunning(false)
              const qid = timerQuestionId
              if (!qid || !token) return
              const item = items.find((i) => i.id === qid)
              postJson(
                '/api/practice/timer',
                {
                  questionId: qid,
                  timeSeconds: seconds,
                  correct: Boolean(map[qid]?.completed),
                  categoryId: item?.category?.toLowerCase() || moduleId,
                  sheetId: `${keyOf(moduleId)}-${keyOf(item?.topic || selectedTopic)}`,
                },
                { token }
              ).catch(() => {})
            }}
          />
        ) : null}
      </section>
      <section className="grid gap-3 lg:grid-cols-2">
        <RevisionQueue items={revisionQueue} />
        {['os', 'cn', 'dbms'].includes(moduleId) ? (
          <FlashcardView
            card={{
              question: `What is the core idea of ${selectedTopic}?`,
              answer: `Review key definition, practical use cases, and tradeoffs for ${selectedTopic}.`,
            }}
          />
        ) : (
          <div className="rounded-xl border border-white/10 bg-neutral-950/60 p-3 text-xs text-neutral-500">
            Flashcards are enabled for OS / CN / DBMS modules.
          </div>
        )}
      </section>

      <TopicProgressStats
        topic={selectedTopic}
        stats={statsByTopic[selectedTopic] ?? { done: 0, total: 0, pct: 0 }}
        difficultyStats={difficultyStats}
        variant={variant}
      />

      <TopicDetailView
        topic={selectedTopic}
        items={filteredTopicItems}
        map={map}
        variant={variant}
        onToggle={(item) => toggleDone(`${keyOf(moduleId)}-${keyOf(item.topic)}-${keyOf(item.difficulty)}`, item.id)}
        onNotes={(item) =>
          setNotesModal({
            id: item.id,
            title: item.title,
            progressKey: `${keyOf(moduleId)}-${keyOf(item.topic)}`,
            notes: map[item.id]?.notes ?? '',
          })
        }
        onFavorite={(item) => toggleFavorite(`${keyOf(moduleId)}-${keyOf(item.topic)}`, item.id)}
        onTag={(item, name, value) =>
          saveQuestionFlags(`${keyOf(moduleId)}-${keyOf(item.topic)}`, item.id, { [name]: value })
        }
      />

      <AnimatePresence>
        {notesModal && (
          <NotesModal
            key={notesModal.id}
            title={notesModal.title}
            initialNotes={notesModal.notes}
            onClose={() => setNotesModal(null)}
            onSave={(text) => {
              saveQuestionNotes(notesModal.progressKey, notesModal.id, text)
              setNotesModal(null)
            }}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
