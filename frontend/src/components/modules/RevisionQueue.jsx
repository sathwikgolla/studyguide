export default function RevisionQueue({ items = [] }) {
  return (
    <section className="rounded-xl border border-white/10 bg-neutral-950/60 p-3">
      <h4 className="text-xs font-semibold uppercase tracking-[0.12em] text-neutral-400">Revision Queue</h4>
      <div className="mt-2 space-y-1">
        {items.slice(0, 5).map((item) => (
          <p key={item.questionId} className="text-xs text-neutral-300">{item.questionId}</p>
        ))}
        {!items.length && <p className="text-xs text-neutral-500">No due revision items.</p>}
      </div>
    </section>
  )
}
