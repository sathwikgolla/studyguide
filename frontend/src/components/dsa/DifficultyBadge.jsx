export default function DifficultyBadge({ difficulty }) {
  const styles = {
    Easy: 'bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-500/25',
    Medium: 'bg-amber-500/15 text-amber-200 ring-1 ring-amber-500/25',
    Hard: 'bg-rose-500/15 text-rose-200 ring-1 ring-rose-500/25',
  }
  return (
    <span
      className={`inline-flex rounded-md px-2 py-0.5 text-xs font-semibold ${styles[difficulty] ?? 'bg-neutral-800 text-neutral-300'}`}
    >
      {difficulty}
    </span>
  )
}
