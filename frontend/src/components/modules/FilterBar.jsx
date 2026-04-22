export default function FilterBar({
  difficulty,
  onDifficulty,
  sortBy,
  onSortBy,
  variant,
}) {
  return (
    <div className="grid gap-2 sm:grid-cols-2">
      <select
        value={difficulty}
        onChange={(e) => onDifficulty(e.target.value)}
        className={`rounded-xl border border-white/10 bg-neutral-950/65 px-3 py-2 text-sm text-neutral-200 outline-none transition focus:ring-2 ${variant.focus}`}
      >
        {['All', 'Easy', 'Medium', 'Hard'].map((d) => (
          <option key={d} value={d}>
            {d}
          </option>
        ))}
      </select>
      <select
        value={sortBy}
        onChange={(e) => onSortBy(e.target.value)}
        className={`rounded-xl border border-white/10 bg-neutral-950/65 px-3 py-2 text-sm text-neutral-200 outline-none transition focus:ring-2 ${variant.focus}`}
      >
        <option value="order">Sort: Order</option>
        <option value="completion">Sort: Completion</option>
      </select>
    </div>
  )
}
