import { motion } from 'framer-motion'

export default function ProgressBar({ completed, total, size = 'md', showText = true, className = '' }) {
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0
  
  const sizeClasses = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3'
  }
  
  const textSizes = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base'
  }

  return (
    <div className={`w-full ${className}`}>
      {showText && (
        <div className={`mb-1 flex items-center justify-between ${textSizes[size]}`}>
          <span className="font-medium text-neutral-300">
            {completed} / {total}
          </span>
          <span className="text-neutral-500">{percentage}%</span>
        </div>
      )}
      <div className={`relative overflow-hidden rounded-full bg-neutral-800 ${sizeClasses[size]}`}>
        <motion.div
          className="h-full bg-gradient-to-r from-indigo-500 to-indigo-400"
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ 
            duration: 0.8, 
            ease: [0.25, 0.1, 0.25, 1], // Custom easing for smooth animation
            delay: 0.1 
          }}
        />
        {percentage > 0 && (
          <motion.div
            className="absolute inset-0 h-full bg-gradient-to-r from-transparent via-white/10 to-transparent"
            initial={{ x: '-100%' }}
            animate={{ x: '100%' }}
            transition={{ 
              duration: 2, 
              repeat: Infinity, 
              repeatDelay: 3,
              ease: "linear"
            }}
          />
        )}
      </div>
    </div>
  )
}
