import { useEffect, useMemo, useState } from 'react'
import { Search } from 'lucide-react'
import { AnimatePresence } from 'framer-motion'
import { getJson } from '../lib/api'
import { useProgress } from '../context/ProgressContext'
import { fullStackSections } from '../data/fullstackRoadmap'
import FullStackOverview from '../components/fullstack/FullStackOverview'
import ProgressHeader from '../components/fullstack/ProgressHeader'
import SectionCard from '../components/fullstack/SectionCard'
import TopicGroupAccordion from '../components/fullstack/TopicGroupAccordion'
import LearningItemRow from '../components/fullstack/LearningItemRow'
import NotesModal from '../components/fullstack/NotesModal'

const difficulties = ['All', 'Easy', 'Medium', 'Hard']
const resourceTypes = ['All', 'topic', 'resource', 'practice', 'video']
const subsectionOptions = ['All', ...fullStackSections.map((s) => s.title)]

function asLookup(items) {
  const out = {}
  for (const item of items) out[item.id] = item
  return out
}

export default function FullStackRoadmapPage() {
  const { map, hydrated, toggleDone, saveQuestionNotes } = useProgress()
  const [remoteItems, setRemoteItems] = useState([])
  const [openSections, setOpenSections] = useState(() => new Set(['frontend']))
  const [openGroups, setOpenGroups] = useState(() => new Set(['html-css']))
  const [search, setSearch] = useState('')
  const [difficulty, setDifficulty] = useState('All')
  const [resourceType, setResourceType] = useState('All')
  const [subsection, setSubsection] = useState('All')
  const [notesModal, setNotesModal] = useState(null)

  useEffect(() => {
    let cancelled = false
    void (async () => {
      try {
        const [itemsRes] = await Promise.all([
          getJson('/api/fullstack/items'),
          getJson('/api/fullstack/sections'),
        ])
        if (cancelled) return
        setRemoteItems(itemsRes.items ?? [])
      } catch {
        if (!cancelled) {
          setRemoteItems([])
        }
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  const sectionsSource = fullStackSections

  const itemLookup = useMemo(
    () =>
      asLookup([
        ...sectionsSource.flatMap((s) => s.topicGroups.flatMap((g) => g.items)),
        ...remoteItems,
      ]),
    [remoteItems, sectionsSource]
  )

  const filteredSections = useMemo(() => {
    const q = search.trim().toLowerCase()
    return sectionsSource
      .filter((section) => subsection === 'All' || section.title === subsection)
      .map((section) => ({
        ...section,
        topicGroups: section.topicGroups
          .map((group) => ({
            ...group,
            items: group.items.filter((item) => {
              if (difficulty !== 'All' && item.difficulty !== difficulty) return false
              if (resourceType !== 'All' && item.resourceType !== resourceType) return false
              if (q && !item.title.toLowerCase().includes(q)) return false
              return true
            }),
          }))
          .filter((group) => group.items.length > 0),
      }))
      .filter((section) => section.topicGroups.length > 0)
  }, [search, difficulty, resourceType, subsection, sectionsSource])

  const overall = useMemo(() => {
    const all = filteredSections.flatMap((s) => s.topicGroups.flatMap((g) => g.items))
    const done = all.reduce((n, item) => n + (map[item.id]?.completed ? 1 : 0), 0)
    return { done, total: all.length }
  }, [filteredSections, map])

  const getSectionStats = (section) => {
    const items = section.topicGroups.flatMap((g) => g.items)
    const done = items.reduce((n, item) => n + (map[item.id]?.completed ? 1 : 0), 0)
    return { done, total: items.length }
  }

  const getGroupStats = (group) => {
    const done = group.items.reduce((n, item) => n + (map[item.id]?.completed ? 1 : 0), 0)
    return { done, total: group.items.length }
  }

  const toggleSection = (sectionId) => {
    setOpenSections((prev) => {
      const next = new Set(prev)
      if (next.has(sectionId)) next.delete(sectionId)
      else next.add(sectionId)
      return next
    })
  }

  const toggleGroup = (groupId) => {
    setOpenGroups((prev) => {
      const next = new Set(prev)
      if (next.has(groupId)) next.delete(groupId)
      else next.add(groupId)
      return next
    })
  }

  const openNotes = (itemId) => {
    const item = itemLookup[itemId]
    if (!item) return
    setNotesModal({
      id: itemId,
      title: item.title,
      notes: map[itemId]?.notes ?? '',
      progressKey: `fullstack-${item.subcategory.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
    })
  }

  return (
    <div className="space-y-6">
      <ProgressHeader
        title="Full Stack Development Roadmap"
        subtitle="Structured learning path with nested sections, resources, progress, and notes."
        completed={overall.done}
        total={overall.total}
      />

      <FullStackOverview
        sections={sectionsSource}
        getSectionStats={getSectionStats}
        onJump={(sectionId) => {
          setOpenSections((prev) => new Set(prev).add(sectionId))
          const el = document.getElementById(`fullstack-section-${sectionId}`)
          if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }}
      />

      <section className="rounded-xl border border-neutral-800 bg-neutral-950/50 p-4">
        <div className="grid gap-3 lg:grid-cols-4">
          <label className="relative lg:col-span-2">
            <Search className="pointer-events-none absolute left-3 top-2.5 size-4 text-neutral-500" aria-hidden />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search topics by title"
              className="w-full rounded-lg border border-neutral-700 bg-neutral-900 py-2 pl-9 pr-3 text-sm text-neutral-100 outline-none transition focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20"
            />
          </label>
          <select
            value={subsection}
            onChange={(e) => setSubsection(e.target.value)}
            className="rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-2 text-sm text-neutral-200 outline-none transition focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20"
          >
            {subsectionOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
          <div className="grid grid-cols-2 gap-2">
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              className="rounded-lg border border-neutral-700 bg-neutral-900 px-2 py-2 text-xs text-neutral-200 outline-none transition focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20"
            >
              {difficulties.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
            <select
              value={resourceType}
              onChange={(e) => setResourceType(e.target.value)}
              className="rounded-lg border border-neutral-700 bg-neutral-900 px-2 py-2 text-xs text-neutral-200 outline-none transition focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20"
            >
              {resourceTypes.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {!hydrated ? (
        <p className="py-10 text-center text-sm text-neutral-500">Loading progress...</p>
      ) : (
        <div className="space-y-4">
          {filteredSections.map((section) => {
            const sectionStats = getSectionStats(section)
            const sectionOpen = openSections.has(section.id)
            return (
              <div id={`fullstack-section-${section.id}`} key={section.id}>
                <SectionCard
                  section={section}
                  open={sectionOpen}
                  onToggleOpen={() => toggleSection(section.id)}
                  completedCount={sectionStats.done}
                  totalCount={sectionStats.total}
                >
                  {section.topicGroups.map((group) => {
                    const groupOpen = openGroups.has(group.id)
                    const groupStats = getGroupStats(group)
                    return (
                      <TopicGroupAccordion
                        key={group.id}
                        group={group}
                        items={group.items}
                        open={groupOpen}
                        onToggleOpen={() => toggleGroup(group.id)}
                        completedCount={groupStats.done}
                        totalCount={groupStats.total}
                        renderRow={(item) => (
                          <LearningItemRow
                            key={item.id}
                            item={item}
                            done={Boolean(map[item.id]?.completed)}
                            notes={map[item.id]?.notes ?? ''}
                            onToggle={() =>
                              toggleDone(
                                `fullstack-${section.id}-${group.id}`,
                                item.id
                              )
                            }
                            onOpenNotes={() => openNotes(item.id)}
                          />
                        )}
                      />
                    )
                  })}
                </SectionCard>
              </div>
            )
          })}
        </div>
      )}

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
