import { Link } from 'react-router-dom'
import { Lock } from 'lucide-react'
import { motion } from 'framer-motion'

export default function PremiumLockOverlay({ title = 'Premium feature', description = 'Upgrade to unlock this feature.' }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="absolute inset-0 z-20 flex items-center justify-center rounded-2xl bg-black/65 backdrop-blur-sm"
    >
      <div className="mx-4 max-w-sm rounded-xl border border-white/20 bg-neutral-950/90 p-4 text-center">
        <Lock className="mx-auto size-5 text-amber-300" aria-hidden />
        <p className="mt-2 text-sm font-semibold text-white">{title}</p>
        <p className="mt-1 text-xs text-neutral-400">{description}</p>
        <Link
          to="/pricing"
          className="mt-3 inline-flex rounded-lg bg-gradient-to-r from-indigo-600 to-violet-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:brightness-110"
        >
          Upgrade to Premium
        </Link>
      </div>
    </motion.div>
  )
}
