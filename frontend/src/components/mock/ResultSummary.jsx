export default function ResultSummary({ result }) {
  if (!result) return null
  return (
    <section className="rounded-2xl border border-emerald-400/30 bg-emerald-500/10 p-4">
      <h3 className="text-sm font-semibold text-emerald-100">Mock Interview Summary</h3>
      <div className="mt-2 grid gap-2 sm:grid-cols-4">
        <p className="text-xs text-emerald-100">Attempted: {result.attempted}</p>
        <p className="text-xs text-emerald-100">Correct: {result.correct}</p>
        <p className="text-xs text-emerald-100">Accuracy: {result.accuracy}%</p>
        <p className="text-xs text-emerald-100">Time: {Math.round((result.timeTakenSeconds || 0) / 60)}m</p>
      </div>
    </section>
  )
}
