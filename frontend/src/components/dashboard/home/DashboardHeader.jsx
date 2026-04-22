import { Sparkles } from 'lucide-react'

export default function DashboardHeader({ isAuthenticated }) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-neutral-950/70 px-5 py-4 shadow-[0_8px_28px_rgba(0,0,0,0.35)]">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-indigo-500/10 via-transparent to-violet-500/10" />
      <div className="relative z-10 max-w-3xl">
        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-indigo-300">
          <Sparkles className="size-3.5" aria-hidden />
          Overview
        </div>
        <h2 className="mt-3 text-2xl font-semibold tracking-tight text-white sm:text-3xl">Your prep command center</h2>
        <p className="mt-2 text-sm leading-relaxed text-neutral-400">
          {isAuthenticated
            ? 'Jump into any module with a live snapshot of your progress, notes, and completion momentum.'
            : 'Explore tracks and unlock persistent progress, notes, and analytics by signing in.'}
        </p>
      </div>
    </div>
  )
}
