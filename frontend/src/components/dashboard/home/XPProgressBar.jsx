import ProgressBar from '../../dsa/ProgressBar'

export default function XPProgressBar({ xp = 0, level = 1 }) {
  const currentLevelBase = (level - 1) * 100
  const inLevel = Math.max(0, xp - currentLevelBase)
  return (
    <section className="rounded-2xl border border-white/10 bg-neutral-950/65 p-4">
      <h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-neutral-300">XP / Level</h3>
      <p className="mt-1 text-sm text-neutral-100">Level {level} · {xp} XP</p>
      <div className="mt-2">
        <ProgressBar completed={inLevel} total={100} size="sm" />
      </div>
    </section>
  )
}
