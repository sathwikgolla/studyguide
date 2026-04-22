import { useMemo, useState } from 'react'
import { AnimatePresence } from 'framer-motion'
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

export default function ModuleLearningPage({
  moduleId,
  items,
  map,
  toggleDone,
  saveQuestionNotes,
}) {
  const keyOf = (text) => String(text).toLowerCase().replace(/[^a-z0-9]+/g, '-')
  const variant = moduleVariants[moduleId]
  const topics = useMemo(() => topicsForModule(moduleId), [moduleId])
  const [selectedTopic, setSelectedTopic] = useState(topics[0])
  const [search, setSearch] = useState('')
  const [difficulty, setDifficulty] = useState('All')
  const [sortBy, setSortBy] = useState('order')
  const [notesModal, setNotesModal] = useState(null)

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
    rows = [...rows].sort((a, b) => {
      if (sortBy === 'completion') {
        return Number(Boolean(map[b.id]?.completed)) - Number(Boolean(map[a.id]?.completed))
      }
      return a.order - b.order
    })
    return rows
  }, [items, selectedTopic, search, difficulty, sortBy, map])

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
          difficulty={difficulty}
          onDifficulty={setDifficulty}
          sortBy={sortBy}
          onSortBy={setSortBy}
          variant={variant}
        />
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
