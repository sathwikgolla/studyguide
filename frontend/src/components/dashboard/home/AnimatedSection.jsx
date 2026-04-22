import { motion } from 'framer-motion'

const MotionSection = motion.section

export default function AnimatedSection({ children, delay = 0, className = '' }) {
  return (
    <MotionSection
      className={className}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </MotionSection>
  )
}
