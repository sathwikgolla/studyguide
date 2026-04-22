import ProgressBar from '../dsa/ProgressBar'

export default function FullStackOverview({ sections, getSectionStats, onJump }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
      {sections.map((section) => {
        const stats = getSectionStats(section)
        return (
          <button
            key={section.id}
            type="button"
            onClick={() => onJump(section.id)}
            className="rounded-xl border border-neutral-800 bg-neutral-950/60 p-4 text-left transition hover:border-indigo-500/30 hover:bg-neutral-900/70"
          >
            <p className="text-sm font-semibold text-white">{section.title}</p>
            <p className="mt-1 text-xs text-neutral-500">{stats.done}/{stats.total} completed</p>
            <div className="mt-2">
              <ProgressBar completed={stats.done} total={stats.total} size="sm" showText={false} />
            </div>
          </button>
        )
      })}
    </div>
  )
}
