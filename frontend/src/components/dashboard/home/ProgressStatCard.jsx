import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import GradientProgressBar from './GradientProgressBar'

const accents = {
  dsa: 'from-sky-500/30 to-indigo-500/20',
  os: 'from-fuchsia-500/30 to-violet-500/20',
  cn: 'from-cyan-500/30 to-blue-500/20',
  dbms: 'from-emerald-500/30 to-teal-500/20',
  fullstack: 'from-indigo-500/30 to-purple-500/20',
}

export default function ProgressStatCard({ id, label, stats, to }) {
  return (
    <motion.div whileHover={{ y: -3, scale: 1.01 }} transition={{ type: 'spring', stiffness: 260, damping: 22 }}>
      <Link
        to={to}
        className="group relative block overflow-hidden rounded-2xl border border-white/10 bg-black/40 p-4 shadow-[0_8px_30px_rgba(0,0,0,0.35)]"
      >
        <div className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${accents[id] ?? accents.fullstack} opacity-45`} />
        <div className="pointer-events-none absolute inset-px rounded-2xl border border-white/10" />
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium uppercase tracking-wider text-neutral-300">{label}</p>
            <ArrowUpRight className="size-4 text-neutral-500 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-indigo-300" />
          </div>
          <p className="mt-2 text-lg font-semibold text-white">{stats.done}/{stats.total}</p>
          <p className="text-xs text-neutral-400">{stats.pct}% completed</p>
          <GradientProgressBar className="mt-3" completed={stats.done} total={stats.total} size="sm" />
        </div>
      </Link>
    </motion.div>
  )
}
