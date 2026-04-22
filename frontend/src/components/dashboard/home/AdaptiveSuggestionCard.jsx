import { Link } from 'react-router-dom'

export default function AdaptiveSuggestionCard({ preferredDifficulty = 'Medium', suggestions = [] }) {
  return (
    <section className="rounded-2xl border border-white/10 bg-neutral-950/65 p-4">
      <h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-neutral-300">Adaptive Suggestions</h3>
      <p className="mt-1 text-xs text-neutral-500">Recommended difficulty: {preferredDifficulty}</p>
      <div className="mt-3 space-y-2">
        {suggestions.slice(0, 4).map((s) => (
          <Link
            key={s.questionId}
            to={s.modulePath || '/dsa'}
            className="block rounded-lg border border-white/10 bg-white/[0.02] px-3 py-2 text-xs text-neutral-200 transition hover:border-indigo-400/35 hover:bg-indigo-500/10"
          >
            <p className="truncate">{s.questionId}</p>
            <p className="mt-0.5 text-[11px] text-neutral-500">{s.categoryId}</p>
          </Link>
        ))}
        {!suggestions.length && <p className="text-xs text-neutral-500">No adaptive suggestions yet.</p>}
      </div>
    </section>
  )
}
