import { CalendarCheck2 } from 'lucide-react'

export default function DailyPlanCard({ tasks = [] }) {
  return (
    <section className="rounded-2xl border border-white/10 bg-neutral-950/65 p-4">
      <div className="flex items-center gap-2">
        <CalendarCheck2 className="size-4 text-indigo-300" aria-hidden />
        <h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-neutral-300">Today's Plan</h3>
      </div>
      <div className="mt-3 space-y-2">
        {!tasks.length ? (
          <p className="text-xs text-neutral-500">No tasks generated yet. Complete any question to generate smart plan.</p>
        ) : (
          tasks.slice(0, 4).map((task, idx) => (
            <div key={`${task.questionId}-${idx}`} className="rounded-lg border border-white/10 bg-white/[0.02] px-3 py-2">
              <p className="text-xs font-medium text-neutral-200">{task.questionId}</p>
              <p className="text-[11px] uppercase tracking-wide text-neutral-500">{task.kind}</p>
            </div>
          ))
        )}
      </div>
    </section>
  )
}
