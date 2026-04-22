import { Zap } from 'lucide-react'
import { motion } from 'framer-motion'

export default function QuickSolveButton({ onClick }) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileHover={{ y: -2, scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      className="inline-flex items-center gap-2 rounded-xl border border-indigo-400/35 bg-indigo-500/10 px-4 py-2 text-sm font-semibold text-indigo-100 transition hover:bg-indigo-500/15"
    >
      <Zap className="size-4" aria-hidden />
      Start Quick Solve
    </motion.button>
  )
}
