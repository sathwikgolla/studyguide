import { useMemo, useState } from 'react'
import DifficultySection from './DifficultySection'
import QuestionRow from './QuestionRow'
import { progressForItems } from '../../lib/moduleItems'

const DIFFS = ['Easy', 'Medium', 'Hard']

export default function TopicDetailView({
  topic,
  items,
  map,
  onToggle,
  onNotes,
  onFavorite,
  onTag,
  variant,
}) {
  const [open, setOpen] = useState(() => new Set(DIFFS))

  const byDifficulty = useMemo(() => {
    const out = { Easy: [], Medium: [], Hard: [] }
    for (const item of items) out[item.difficulty]?.push(item)
    return out
  }, [items])

  return (
    <section className="space-y-3">
      {DIFFS.map((d) => {
        const diffItems = byDifficulty[d] ?? []
        const stats = progressForItems(diffItems, map)
        const isOpen = open.has(d)
        return (
          <DifficultySection
            key={d}
            difficulty={d}
            stats={stats}
            open={isOpen}
            onToggle={() =>
              setOpen((prev) => {
                const next = new Set(prev)
                if (next.has(d)) next.delete(d)
                else next.add(d)
                return next
              })
            }
          >
            {diffItems.length ? (
              diffItems.map((item) => (
                <QuestionRow
                  key={item.id}
                  item={item}
                  done={Boolean(map[item.id]?.completed)}
                  notes={map[item.id]?.notes ?? ''}
                  favorite={Boolean(map[item.id]?.favorite)}
                  revisit={Boolean(map[item.id]?.revisit)}
                  important={Boolean(map[item.id]?.important)}
                  confusing={Boolean(map[item.id]?.confusing)}
                  variant={variant}
                  onToggle={() => onToggle(item)}
                  onNotes={() => onNotes(item)}
                  onFavorite={() => onFavorite(item)}
                  onTag={(name, value) => onTag(item, name, value)}
                />
              ))
            ) : (
              <p className="rounded-lg border border-dashed border-white/10 px-3 py-4 text-sm text-neutral-500">
                No items in {d} for {topic}.
              </p>
            )}
          </DifficultySection>
        )
      })}
    </section>
  )
}
