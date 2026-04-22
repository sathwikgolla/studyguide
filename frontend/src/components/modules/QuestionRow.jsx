import { ExternalLink, StickyNote } from 'lucide-react'

const diffStyle = {
  Easy: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300',
  Medium: 'border-amber-500/30 bg-amber-500/10 text-amber-300',
  Hard: 'border-rose-500/30 bg-rose-500/10 text-rose-300',
}

export default function QuestionRow({ item, done, notes, onToggle, onNotes, variant }) {
  return (
    <article className={`rounded-lg border p-3 transition ${done ? variant.itemDone : 'border-white/10 bg-neutral-950/55 hover:bg-neutral-900/60'}`}>
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <input
              type="checkbox"
              checked={done}
              onChange={onToggle}
              className="size-4 cursor-pointer rounded border-neutral-600 bg-neutral-900 text-indigo-500 accent-indigo-500"
            />
            <h4 className={`text-sm font-medium ${done ? 'text-neutral-400 line-through' : 'text-neutral-100'}`}>
              {item.title}
            </h4>
            <span className={`rounded-md border px-2 py-0.5 text-[11px] ${diffStyle[item.difficulty] || diffStyle.Medium}`}>
              {item.difficulty}
            </span>
          </div>
          <p className="mt-1 text-xs text-neutral-500">{item.description}</p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <a
            href={item.link}
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex items-center gap-1 rounded-md border border-white/10 bg-white/[0.03] px-2.5 py-1.5 text-xs font-medium transition ${variant.resource}`}
          >
            Open
            <ExternalLink className="size-3.5" aria-hidden />
          </a>
          <button
            type="button"
            onClick={onNotes}
            className={`inline-flex items-center gap-1 rounded-md border px-2.5 py-1.5 text-xs font-medium transition ${
              notes?.trim()
                ? 'border-violet-500/35 bg-violet-500/10 text-violet-200'
                : 'border-white/10 bg-white/[0.03] text-neutral-300 hover:border-neutral-500'
            }`}
          >
            <StickyNote className="size-3.5" aria-hidden />
            Notes
          </button>
        </div>
      </div>
    </article>
  )
}
