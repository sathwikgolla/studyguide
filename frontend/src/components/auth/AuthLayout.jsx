import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { BookOpen } from 'lucide-react'

const MotionDiv = motion.div

export default function AuthLayout({ title, subtitle, children, footer }) {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-black px-4 py-12">
      <MotionDiv
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(99,102,241,0.24),transparent)]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      />
      <MotionDiv
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_100%_100%,rgba(139,92,246,0.15),transparent)]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      />
      <MotionDiv
        className="relative z-10 w-full max-w-md"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="mb-8 text-center">
          <Link
            to="/"
            className="mx-auto mb-4 flex size-12 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 shadow-lg shadow-indigo-500/25"
            aria-label="PrepFlow home"
          >
            <BookOpen className="size-6 text-white" aria-hidden />
          </Link>
          <h1 className="text-2xl font-semibold tracking-tight text-white">{title}</h1>
          {subtitle ? <p className="mt-2 text-sm text-neutral-400">{subtitle}</p> : null}
        </div>

        <div className="rounded-2xl border border-white/15 bg-white/[0.04] p-8 shadow-2xl shadow-black/50 backdrop-blur-xl">
          {children}
          {footer}
        </div>
      </MotionDiv>
    </div>
  )
}
