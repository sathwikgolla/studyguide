import { CalendarCheck2, CheckCircle2, Circle, Sparkles, Star } from 'lucide-react'

export default function DailyPlanCard({ tasks = [], progress, profile, reward }) {
  const completedCount = progress?.completedCount ?? tasks.filter((t) => t.completed).length
  const totalTasks = progress?.totalTasks ?? tasks.length
  const stars = profile?.stars ?? 0
  const rank = profile?.rank ?? 'Rookie'

  return (
    <section className="rounded-2xl border border-white/10 bg-neutral-950/65 p-4">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
        <CalendarCheck2 className="size-4 text-indigo-300" aria-hidden />
        <h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-neutral-300">Today's Plan</h3>
        </div>
        <div className="flex items-center gap-2 text-xs text-amber-200">
          <Star className="size-3.5 text-amber-300" aria-hidden />
          <span>{stars} stars</span>
          <span className="text-neutral-500">·</span>
          <span>{rank}</span>
        </div>
      </div>
      <div className="mt-2 rounded-lg border border-white/10 bg-white/[0.02] px-3 py-2">
        <p className="text-xs text-neutral-300">
          Completed <span className="font-semibold text-white">{completedCount}</span> /{' '}
          <span className="font-semibold text-white">{totalTasks || 5}</span> questions today
        </p>
        <div className="mt-2 h-2 overflow-hidden rounded-full bg-neutral-800">
          <div
            className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-violet-500 to-fuchsia-400 transition-all"
            style={{ width: `${totalTasks ? Math.min(100, (completedCount / totalTasks) * 100) : 0}%` }}
          />
        </div>
      </div>
      {reward ? (
        <div className="mt-3 flex items-center gap-2 rounded-lg border border-amber-400/30 bg-amber-500/10 px-3 py-2 text-xs text-amber-100">
          <Sparkles className="size-3.5 text-amber-300" aria-hidden />
          <p>
            Daily challenge complete! +{reward.starsEarned} stars and +{reward.xpEarned} XP earned.
          </p>
        </div>
      ) : null}
      <div className="mt-3 space-y-2">
        {!tasks.length ? (
          <p className="text-xs text-neutral-500">No tasks generated yet. Complete any question to generate smart plan.</p>
        ) : (
          tasks.slice(0, 5).map((task, idx) => (
            <div key={`${task.questionId}-${idx}`} className="rounded-lg border border-white/10 bg-white/[0.02] px-3 py-2">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-medium text-neutral-200">{task.questionId}</p>
                  <p className="text-[11px] uppercase tracking-wide text-neutral-500">
                    {task.categoryId || task.kind}
                  </p>
                </div>
                {task.completed ? (
                  <CheckCircle2 className="size-4 text-emerald-300" aria-hidden />
                ) : (
                  <Circle className="size-4 text-neutral-600" aria-hidden />
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  )
}
