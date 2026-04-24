export default function WeakTopicsCard({ weakTopics = [] }) {
  return (
    <section className="rounded-2xl border border-white/10 bg-neutral-950/60 p-4">
      <h3 className="text-sm font-semibold text-neutral-200">Weak Topics</h3>
      <div className="mt-3 space-y-2">
        {!weakTopics.length ? (
          <p className="text-xs text-neutral-500">No weak topics detected yet.</p>
        ) : (
          weakTopics.slice(0, 6).map((topic) => (
            <div key={topic.topic} className="rounded-lg border border-white/10 bg-white/[0.02] px-3 py-2">
              <p className="text-xs text-neutral-200">{topic.topic}</p>
              <p className="text-[11px] text-neutral-500">{topic.completionPct}% completion</p>
            </div>
          ))
        )}
      </div>
    </section>
  )
}
