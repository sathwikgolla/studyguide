import { StickyNote } from 'lucide-react'
import ResourceButton from './ResourceButton'

const difficultyBadge = {
  Easy: 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300',
  Medium: 'border-amber-500/40 bg-amber-500/10 text-amber-300',
  Hard: 'border-rose-500/40 bg-rose-500/10 text-rose-300',
}

export default function LearningItemRow({ item, done, notes, onToggle, onOpenNotes }) {
  return (
    <article
      className={[
        'rounded-xl border p-4 transition-all duration-300',
        done
          ? 'border-emerald-500/30 bg-emerald-500/[0.05] shadow-[inset_0_0_0_1px_rgba(16,185,129,0.2)]'
          : 'border-neutral-800 bg-neutral-950/50 hover:border-neutral-700 hover:bg-neutral-900/50',
      ].join(' ')}
    >
      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <input
              type="checkbox"
              checked={done}
              onChange={onToggle}
              className="size-4 cursor-pointer rounded border-neutral-600 bg-neutral-900 text-indigo-500 accent-indigo-500 transition-all duration-200 hover:scale-105 focus:ring-2 focus:ring-indigo-500/40"
              aria-label={`Mark complete: ${item.title}`}
            />
            <h4
              className={[
                'text-sm font-semibold transition-all',
                done ? 'text-neutral-500 line-through decoration-emerald-400/70' : 'text-neutral-100',
              ].join(' ')}
            >
              {item.order}. {item.title}
            </h4>
            <span className="rounded-md border border-neutral-700 bg-neutral-900 px-2 py-0.5 text-[11px] text-neutral-400">
              {item.resourceType}
            </span>
            <span
              className={[
                'rounded-md border px-2 py-0.5 text-[11px] font-medium',
                difficultyBadge[item.difficulty] ?? 'border-neutral-700 bg-neutral-900 text-neutral-300',
              ].join(' ')}
            >
              {item.difficulty}
            </span>
          </div>
          <p className="mt-2 text-xs leading-relaxed text-neutral-400">{item.description}</p>
          <p className="mt-1 text-[11px] text-neutral-600">
            {item.subcategory} · {item.topicGroup}
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <ResourceButton href={item.youtubeLink} />
          <button
            type="button"
            onClick={onOpenNotes}
            className={[
              'inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold transition',
              notes?.trim()
                ? 'border-violet-500/40 bg-violet-500/10 text-violet-200 hover:bg-violet-500/15'
                : 'border-neutral-700 bg-neutral-900 text-neutral-300 hover:border-neutral-600 hover:bg-neutral-800',
            ].join(' ')}
          >
            <StickyNote className="size-3.5" aria-hidden />
            Notes
          </button>
        </div>
      </div>
    </article>
  )
}
