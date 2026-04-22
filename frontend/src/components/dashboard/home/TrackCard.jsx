import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'

export default function TrackCard({ item, progressText }) {
  const Icon = item.icon

  return (
    <motion.div
      whileHover={{ y: -4, rotateX: 1.5 }}
      transition={{ type: 'spring', stiffness: 260, damping: 22 }}
      className="h-full"
    >
      <Link
        to={item.path}
        className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-neutral-950/75 p-5 shadow-[0_10px_35px_rgba(0,0,0,0.4)]"
      >
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-indigo-500/0 via-indigo-500/0 to-violet-500/0 opacity-0 transition duration-500 group-hover:from-indigo-500/10 group-hover:via-transparent group-hover:to-violet-500/10 group-hover:opacity-100" />
        <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-indigo-500/20 blur-2xl opacity-0 transition duration-500 group-hover:opacity-100" />

        <div className="relative z-10 flex items-start justify-between gap-3">
          <motion.span
            className="flex size-11 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] text-indigo-300 shadow-[inset_0_0_20px_rgba(99,102,241,0.15)]"
            whileHover={{ rotate: -6, scale: 1.06 }}
            transition={{ type: 'spring', stiffness: 280, damping: 17 }}
          >
            <Icon className="size-5" strokeWidth={1.9} aria-hidden />
          </motion.span>
          <ArrowUpRight className="size-4 text-neutral-500 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-indigo-300" />
        </div>

        <h3 className="relative z-10 mt-4 text-sm font-semibold text-white">{item.label}</h3>
        <p className="relative z-10 mt-1 text-xs leading-relaxed text-neutral-400">
          Structured module with checkpoints, notes, and completion tracking.
        </p>
        <p className="relative z-10 mt-4 text-[11px] font-medium uppercase tracking-wide text-indigo-300/90">
          {progressText}
        </p>
      </Link>
    </motion.div>
  )
}
