import { motion } from 'framer-motion'

export default function GradientProgressBar({ completed, total, className = '', size = 'md' }) {
  const percentage = total ? Math.round((completed / total) * 100) : 0
  const heights = { sm: 'h-1.5', md: 'h-2.5', lg: 'h-3.5' }

  return (
    <div className={className}>
      <div className={`relative overflow-hidden rounded-full border border-white/10 bg-white/[0.04] ${heights[size]}`}>
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-blue-500 via-indigo-500 to-violet-500 shadow-[0_0_20px_rgba(99,102,241,0.35)]"
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        />
        {percentage > 0 && (
          <motion.div
            className="absolute inset-y-0 w-10 bg-gradient-to-r from-transparent via-white/35 to-transparent"
            initial={{ x: '-120%' }}
            animate={{ x: '430%' }}
            transition={{ duration: 1.9, repeat: Infinity, repeatDelay: 2.4, ease: 'linear' }}
          />
        )}
      </div>
    </div>
  )
}
