import ProgressBar from '../dsa/ProgressBar'

export default function ModuleProgressHero({ title, stats, variant }) {
  return (
    <section className="rounded-2xl border border-white/10 bg-black/35 p-5">
      <div className="flex items-end justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.12em] text-neutral-500">Module Progress</p>
          <h3 className="mt-1 text-lg font-semibold text-white">{title}</h3>
        </div>
        <p className={`rounded-md border px-2 py-1 text-xs font-semibold ${variant.chip}`}>
          {stats.done}/{stats.total}
        </p>
      </div>
      <div className="mt-3">
        <ProgressBar completed={stats.done} total={stats.total} size="md" />
      </div>
    </section>
  )
}
