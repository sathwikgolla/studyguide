import { useState } from 'react'
import { ChevronDown, ChevronRight } from 'lucide-react'
import SheetQuestionList from './SheetQuestionList'
import ProgressBar from './ProgressBar'
import { useProgress } from '../../context/ProgressContext'

export default function CategoryCard({ category, topicId, filter, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen)
  const { progressSummary } = useProgress()
  const progressKey = `${topicId}-${category.id}`
  const stats = progressSummary.perSheet[progressKey] ?? {
    done: 0,
    total: category.questions?.length ?? 0,
    pct: 0,
  }
  const completed = stats.done
  const total = stats.total
  const percentage = stats.pct

  return (
    <section
      id={`cat-${category.id}`}
      className="scroll-mt-24 overflow-hidden rounded-xl border border-neutral-800 bg-neutral-950/40"
    >
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex w-full items-center justify-between gap-3 border-b border-neutral-800/80 bg-neutral-900/40 px-4 py-3 text-left transition hover:bg-neutral-900/70"
      >
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-4">
            <div className="min-w-0">
              <h3 className="truncate text-base font-semibold text-white">{category.label}</h3>
              <p className="text-xs text-neutral-500">
                {category.questions?.length ?? 0} questions
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-sm font-medium text-white">
                  {completed}/{total}
                </p>
                <p className="text-xs text-neutral-500">{percentage}%</p>
              </div>
              {open ? (
                <ChevronDown className="size-5 shrink-0 text-neutral-500" aria-hidden />
              ) : (
                <ChevronRight className="size-5 shrink-0 text-neutral-500" aria-hidden />
              )}
            </div>
          </div>
          <div className="mt-3">
            <ProgressBar completed={completed} total={total} size="sm" showText={false} />
          </div>
        </div>
      </button>
      {open && (
        <div className="p-4">
          <SheetQuestionList
            key={category.id}
            progressKey={progressKey}
            questions={category.questions}
            filter={filter}
          />
        </div>
      )}
    </section>
  )
}
