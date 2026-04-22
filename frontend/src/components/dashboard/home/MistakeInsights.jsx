export default function MistakeInsights({ insights = [] }) {
  return (
    <section className="rounded-2xl border border-white/10 bg-neutral-950/65 p-4">
      <h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-neutral-300">Mistake Insights</h3>
      <div className="mt-3 space-y-2">
        {insights.length ? (
          insights.slice(0, 5).map((i) => (
            <div key={i.topic} className="rounded-lg border border-white/10 bg-white/[0.02] px-3 py-2">
              <p className="text-xs text-neutral-200">{i.topic}</p>
              <p className="text-[11px] text-neutral-500">Incorrect attempts: {i.incorrectCount}</p>
            </div>
          ))
        ) : (
          <p className="text-xs text-neutral-500">No mistake patterns yet.</p>
        )}
      </div>
    </section>
  )
}
