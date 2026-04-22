import ProgressBar from '../../dsa/ProgressBar'

export default function WeeklyChallengeCard({ challenge }) {
  const completed = challenge?.completed || 0
  const target = challenge?.target || 20
  return (
    <section className="rounded-2xl border border-white/10 bg-neutral-950/65 p-4">
      <h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-neutral-300">Weekly Challenge</h3>
      <p className="mt-1 text-xs text-neutral-400">{completed}/{target} solved this week</p>
      <div className="mt-2">
        <ProgressBar completed={completed} total={target} size="sm" />
      </div>
    </section>
  )
}
