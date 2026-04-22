import ProgressBar from '../dsa/ProgressBar'

export default function TopicProgressStats({ topic, stats, difficultyStats, variant }) {
  return (
    <section className="rounded-2xl border border-white/10 bg-black/35 p-4">
      <div className="flex items-center justify-between gap-2">
        <h3 className="text-base font-semibold text-white">{topic}</h3>
        <span className={`rounded-md border px-2 py-1 text-xs font-semibold ${variant.chip}`}>
          {stats.done}/{stats.total}
        </span>
      </div>
      <div className="mt-3">
        <ProgressBar completed={stats.done} total={stats.total} size="sm" />
      </div>
      <div className="mt-3 grid gap-2 sm:grid-cols-3">
        {['Easy', 'Medium', 'Hard'].map((d) => {
          const s = difficultyStats[d] ?? { done: 0, total: 0 }
          return (
            <div key={d} className="rounded-lg border border-white/10 bg-neutral-900/40 px-3 py-2">
              <p className="text-[11px] uppercase tracking-[0.1em] text-neutral-500">{d}</p>
              <p className="text-sm font-semibold text-neutral-100">
                {s.done}/{s.total}
              </p>
            </div>
          )
        })}
      </div>
    </section>
  )
}
