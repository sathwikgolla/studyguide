import { AlertTriangle } from 'lucide-react'

export default function WeakTopicsCard({ weakTopics = [] }) {
  return (
    <section className="rounded-2xl border border-white/10 bg-neutral-950/65 p-4">
      <div className="flex items-center gap-2">
        <AlertTriangle className="size-4 text-amber-300" aria-hidden />
        <h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-neutral-300">Weak Areas</h3>
      </div>
      <div className="mt-3 space-y-2">
        {!weakTopics.length ? (
          <p className="text-xs text-neutral-500">No weak areas detected yet.</p>
        ) : (
          weakTopics.slice(0, 4).map((w) => (
            <div key={w.topic} className="rounded-lg border border-white/10 bg-white/[0.02] px-3 py-2">
              <p className="text-xs font-medium text-neutral-200">{w.topic}</p>
              <p className="text-[11px] text-neutral-500">{w.completed}/{w.total} completed ({w.pct}%)</p>
            </div>
          ))
        )}
      </div>
    </section>
  )
}
