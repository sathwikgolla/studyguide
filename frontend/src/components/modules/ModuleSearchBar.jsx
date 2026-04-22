import { Search } from 'lucide-react'

export default function ModuleSearchBar({ value, onChange, variant }) {
  return (
    <label className="relative block">
      <Search className="pointer-events-none absolute left-3 top-2.5 size-4 text-neutral-500" aria-hidden />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search by title..."
        className={`w-full rounded-xl border border-white/10 bg-neutral-950/65 py-2 pl-9 pr-3 text-sm text-neutral-100 outline-none transition focus:ring-2 ${variant.focus}`}
      />
    </label>
  )
}
