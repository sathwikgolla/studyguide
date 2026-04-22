import { Flame } from 'lucide-react'

export default function StreakBadge({ current = 0, longest = 0 }) {
  return (
    <div className="rounded-xl border border-orange-400/30 bg-orange-500/10 px-3 py-2">
      <p className="flex items-center gap-1 text-xs font-semibold uppercase tracking-[0.12em] text-orange-200">
        <Flame className="size-3.5" aria-hidden />
        Streak
      </p>
      <p className="mt-1 text-sm font-semibold text-white">
        {current} day{current === 1 ? '' : 's'}
      </p>
      <p className="text-[11px] text-orange-100/70">Best: {longest}</p>
    </div>
  )
}
