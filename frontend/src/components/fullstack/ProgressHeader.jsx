import ProgressBar from '../dsa/ProgressBar'

export default function ProgressHeader({ title, subtitle, completed, total }) {
  return (
    <header className="rounded-2xl border border-indigo-500/25 bg-gradient-to-br from-indigo-500/10 via-neutral-950/80 to-violet-500/10 p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-white">{title}</h2>
          <p className="mt-1 text-sm text-neutral-400">{subtitle}</p>
        </div>
        <p className="text-sm font-semibold text-indigo-200">
          {completed}/{total} completed
        </p>
      </div>
      <div className="mt-4">
        <ProgressBar completed={completed} total={total} size="md" />
      </div>
    </header>
  )
}
