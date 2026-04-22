import { AnimatePresence, motion } from 'framer-motion'
import { ChevronDown, ChevronRight } from 'lucide-react'
import ProgressBar from '../dsa/ProgressBar'
import LearningItemRow from './LearningItemRow'

export default function TopicGroupAccordion({
  group,
  items,
  open,
  onToggleOpen,
  completedCount,
  totalCount,
  renderRow,
}) {
  return (
    <section className="overflow-hidden rounded-xl border border-neutral-800 bg-neutral-950/45">
      <button
        type="button"
        onClick={onToggleOpen}
        className="flex w-full items-center justify-between gap-4 border-b border-neutral-800/80 bg-neutral-900/50 px-4 py-3 text-left transition hover:bg-neutral-900/80"
      >
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-white">{group.title}</p>
          <p className="mt-0.5 text-xs text-neutral-500">
            {completedCount}/{totalCount} complete
          </p>
          <div className="mt-2">
            <ProgressBar completed={completedCount} total={totalCount} size="sm" showText={false} />
          </div>
        </div>
        {open ? (
          <ChevronDown className="size-5 shrink-0 text-neutral-500" aria-hidden />
        ) : (
          <ChevronRight className="size-5 shrink-0 text-neutral-500" aria-hidden />
        )}
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key={`${group.id}-open`}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div className="space-y-3 p-4">
              {items.map((item) =>
                renderRow ? (
                  renderRow(item)
                ) : (
                  <LearningItemRow key={item.id} item={item} done={false} notes="" onToggle={() => {}} onOpenNotes={() => {}} />
                )
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
