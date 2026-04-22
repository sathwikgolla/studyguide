import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowUpRight, BookOpenCheck, NotebookTabs } from 'lucide-react'
import GradientProgressBar from './GradientProgressBar'
import { useCountUp } from '../../../hooks/useCountUp'

const MotionLink = motion(Link)

export default function OverviewHeroCard({ summary }) {
  const completedCount = useCountUp(summary.totalCompleted, 760)
  const totalCount = useCountUp(summary.totalQuestions, 860)
  const pctCount = useCountUp(summary.totalPct, 760)

  return (
    <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-indigo-500/15 via-neutral-950/90 to-violet-500/15 p-6 shadow-[0_14px_70px_rgba(79,70,229,0.25)]">
      <div className="pointer-events-none absolute -right-16 -top-12 h-52 w-52 rounded-full bg-indigo-400/20 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 left-1/4 h-36 w-36 rounded-full bg-violet-400/20 blur-3xl" />

      <div className="relative z-10 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-300/30 bg-indigo-500/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-indigo-200">
            <BookOpenCheck className="size-3.5" aria-hidden />
            Overall Progress
          </div>
          <div>
            <p className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
              {completedCount}
              <span className="ml-2 text-xl font-medium text-white/45 sm:text-2xl">/ {totalCount}</span>
            </p>
            <p className="mt-1 text-sm text-neutral-300">
              <span className="font-semibold text-emerald-300">{pctCount}% complete</span>
              <span className="mx-2 text-neutral-600">•</span>
              <NotebookTabs className="mr-1 inline size-3.5 text-violet-300" aria-hidden />
              {summary.notesCount} notes saved
            </p>
          </div>
        </div>

        <MotionLink
          to="/dsa"
          whileHover={{ y: -3, scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="group inline-flex items-center justify-center gap-2 rounded-xl border border-indigo-300/35 bg-gradient-to-r from-indigo-500 to-violet-600 px-5 py-3 text-sm font-semibold text-white shadow-[0_10px_30px_rgba(99,102,241,0.4)]"
        >
          Continue DSA
          <motion.span className="inline-flex" whileHover={{ x: 3 }}>
            <ArrowUpRight className="size-4" aria-hidden />
          </motion.span>
        </MotionLink>
      </div>

      <div className="relative z-10 mt-5 space-y-2">
        <div className="flex items-center justify-between text-xs text-neutral-400">
          <span>Learning completion</span>
          <span>{summary.totalPct}%</span>
        </div>
        <GradientProgressBar completed={summary.totalCompleted} total={summary.totalQuestions} size="lg" />
      </div>
    </div>
  )
}
