import { useState } from 'react'

export default function GoalPlanner({ goal, onSave }) {
  const [title, setTitle] = useState(goal?.title || '')
  const [targetCategory, setTargetCategory] = useState(goal?.targetCategory || 'dsa')
  const [targetDays, setTargetDays] = useState(goal?.targetDays || 30)

  return (
    <section className="rounded-2xl border border-white/10 bg-neutral-950/65 p-4">
      <h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-neutral-300">Goal Planner</h3>
      <div className="mt-3 grid gap-2 sm:grid-cols-3">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Complete DSA in 30 days"
          className="rounded-lg border border-white/10 bg-neutral-900/60 px-3 py-2 text-xs text-neutral-200 outline-none"
        />
        <input
          value={targetCategory}
          onChange={(e) => setTargetCategory(e.target.value)}
          placeholder="dsa"
          className="rounded-lg border border-white/10 bg-neutral-900/60 px-3 py-2 text-xs text-neutral-200 outline-none"
        />
        <input
          type="number"
          min={1}
          value={targetDays}
          onChange={(e) => setTargetDays(Number(e.target.value))}
          className="rounded-lg border border-white/10 bg-neutral-900/60 px-3 py-2 text-xs text-neutral-200 outline-none"
        />
      </div>
      <button
        type="button"
        onClick={() => onSave({ title, targetCategory, targetDays })}
        className="mt-3 rounded-lg border border-indigo-400/35 bg-indigo-500/10 px-3 py-1.5 text-xs font-semibold text-indigo-100"
      >
        Save Goal
      </button>
      {goal?.roadmap?.length ? (
        <div className="mt-3 space-y-1">
          {goal.roadmap.map((step) => (
            <p key={step} className="text-xs text-neutral-400">{step}</p>
          ))}
        </div>
      ) : null}
    </section>
  )
}
