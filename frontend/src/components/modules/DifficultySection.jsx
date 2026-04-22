import { AnimatePresence, motion } from 'framer-motion'
import { ChevronDown, ChevronRight } from 'lucide-react'

const MotionDiv = motion.div

export default function DifficultySection({
  difficulty,
  open,
  onToggle,
  stats,
  children,
}) {
  return (
    <section className="overflow-hidden rounded-xl border border-white/10 bg-black/30">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between border-b border-white/10 bg-white/[0.02] px-4 py-3 text-left"
      >
        <div>
          <p className="text-sm font-semibold text-white">{difficulty}</p>
          <p className="text-xs text-neutral-500">
            {stats.done}/{stats.total} completed
          </p>
        </div>
        {open ? <ChevronDown className="size-5 text-neutral-500" /> : <ChevronRight className="size-5 text-neutral-500" />}
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <MotionDiv
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div className="space-y-2 p-3">{children}</div>
          </MotionDiv>
        )}
      </AnimatePresence>
    </section>
  )
}
