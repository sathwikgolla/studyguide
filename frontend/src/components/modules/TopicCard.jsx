import { motion } from 'framer-motion'

export default function TopicCard({ topic, stats, isActive, onClick, variant }) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileHover={{ y: -3, scale: 1.01 }}
      className={[
        'rounded-xl border p-4 text-left transition',
        isActive ? `${variant.chip} bg-white/[0.03]` : `border-white/10 bg-neutral-950/55 ${variant.card}`,
      ].join(' ')}
    >
      <p className="text-sm font-semibold text-white">{topic}</p>
      <p className="mt-1 text-xs text-neutral-400">
        {stats.done}/{stats.total} completed
      </p>
      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/10">
        <div className={`h-full rounded-full bg-gradient-to-r ${variant.progress}`} style={{ width: `${stats.pct}%` }} />
      </div>
    </motion.button>
  )
}
