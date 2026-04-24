export default function RevisionQueue({ items = [], onMarkDone }) {
  return (
    <section className="rounded-xl border border-white/10 bg-neutral-950/60 p-3">
      <h4 className="text-xs font-semibold uppercase tracking-[0.12em] text-neutral-400">Questions to Revise Today</h4>
      <div className="mt-2 space-y-1">
        {items.slice(0, 8).map((item) => (
          <div key={item.questionId} className="flex items-center justify-between rounded-lg border border-white/10 bg-white/[0.02] px-2 py-1.5">
            <p className="text-xs text-neutral-300">{item.questionId}</p>
            {onMarkDone ? (
              <button
                type="button"
                onClick={() => onMarkDone(item)}
                className="rounded border border-white/10 px-2 py-0.5 text-[10px] text-neutral-300 transition hover:border-indigo-400/40"
              >
                Mark revised
              </button>
            ) : null}
          </div>
        ))}
        {!items.length && <p className="text-xs text-neutral-500">No due revision items.</p>}
      </div>
    </section>
  )
}
