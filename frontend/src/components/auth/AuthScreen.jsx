import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { BookOpen } from 'lucide-react'

const MotionDiv = motion.div
const MotionH1 = motion.h1
const MotionP = motion.p

const cardVariants = {
  hidden: { opacity: 0, y: 24, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.4,
      ease: [0.22, 1, 0.36, 1],
    },
  },
}

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.35 },
  },
}

export default function AuthScreen({ title, subtitle, children, footer }) {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-black px-4 py-12">
      <MotionDiv
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(99,102,241,0.22),transparent)]"
        variants={backdropVariants}
        initial="hidden"
        animate="visible"
      />
      <MotionDiv
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_100%_100%,rgba(139,92,246,0.12),transparent)]"
        variants={backdropVariants}
        initial="hidden"
        animate="visible"
      />

      <MotionDiv
        className="relative z-10 w-full max-w-md"
        variants={cardVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="mb-8 flex flex-col items-center text-center">
          <Link
            to="/"
            className="mb-4 flex size-12 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 shadow-lg shadow-indigo-500/25 outline-none ring-offset-2 ring-offset-black transition hover:opacity-95 focus-visible:ring-2 focus-visible:ring-indigo-400"
            aria-label="PrepFlow home"
          >
            <BookOpen className="size-6 text-white" aria-hidden />
          </Link>
          <MotionH1
            className="text-2xl font-semibold tracking-tight text-white"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08, duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            {title}
          </MotionH1>
          {subtitle && (
            <MotionP
              className="mt-2 max-w-sm text-sm text-neutral-400"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.14, duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            >
              {subtitle}
            </MotionP>
          )}
        </div>

        <div className="rounded-2xl border border-neutral-800/80 bg-neutral-950/70 p-8 shadow-2xl shadow-black/50 backdrop-blur-md">
          {children}
          {footer}
        </div>
      </MotionDiv>
    </div>
  )
}
