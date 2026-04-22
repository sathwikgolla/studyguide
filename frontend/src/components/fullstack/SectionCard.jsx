import { AnimatePresence, motion } from 'framer-motion'
import { ChevronDown, ChevronRight } from 'lucide-react'
import ProgressBar from '../dsa/ProgressBar'

export default function SectionCard({
  section,
  open,
  onToggleOpen,
  completedCount,
  totalCount,
  children,
}) {
  return (
    <section className="overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-950/40">
      <button
        type="button"
        onClick={onToggleOpen}
        className="flex w-full items-center justify-between gap-4 border-b border-neutral-800/80 bg-neutral-900/45 px-5 py-4 text-left transition hover:bg-neutral-900/70"
      >
        <div className="min-w-0 flex-1">
          <h3 className="text-base font-semibold text-white">{section.title}</h3>
          <p className="mt-1 text-xs text-neutral-400">{section.description}</p>
          <p className="mt-1 text-xs text-neutral-500">
            {completedCount}/{totalCount} completed
          </p>
          <div className="mt-3">
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
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div className="space-y-3 p-4">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
