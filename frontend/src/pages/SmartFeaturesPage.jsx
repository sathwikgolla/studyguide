import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getJson, postJson } from '../lib/api'
import DailyPlanCard from '../components/dashboard/home/DailyPlanCard'
import WeakTopicsCard from '../components/dashboard/home/WeakTopicsCard'
import AdaptiveSuggestionCard from '../components/dashboard/home/AdaptiveSuggestionCard'
import GoalPlanner from '../components/dashboard/home/GoalPlanner'
import MistakeInsights from '../components/dashboard/home/MistakeInsights'
import XPProgressBar from '../components/dashboard/home/XPProgressBar'
import WeeklyChallengeCard from '../components/dashboard/home/WeeklyChallengeCard'
import StreakBadge from '../components/dashboard/home/StreakBadge'

export default function SmartFeaturesPage() {
  const { token, userId } = useAuth()
  const [state, setState] = useState({
    tasks: [],
    weakTopics: [],
    adaptive: { preferredDifficulty: 'Medium', suggestions: [] },
    goal: null,
    mistakes: [],
    xp: { xp: 0, level: 1, achievements: [] },
    challenge: null,
    streak: { currentStreak: 0, longestStreak: 0 },
  })

  useEffect(() => {
    if (!token) return
    void (async () => {
      const requests = await Promise.allSettled([
        getJson('/api/planner/today', { token }),
        getJson('/api/analytics/weak-topics', { token }),
        getJson('/api/adaptive/suggestions', { token }),
        getJson('/api/goals', { token }),
        getJson('/api/analytics/mistakes', { token }),
        getJson('/api/xp', { token }),
        getJson('/api/weekly-challenge', { token }),
        getJson('/api/streak/me', { token }),
      ])
      const [plan, weak, adaptive, goal, mistakes, xp, challenge, streak] = requests.map((r) =>
        r.status === 'fulfilled' ? r.value : null
      )
      setState({
        tasks: plan?.tasks ?? [],
        weakTopics: weak?.weakTopics ?? [],
        adaptive: adaptive ?? { preferredDifficulty: 'Medium', suggestions: [] },
        goal: goal?.goal ?? null,
        mistakes: mistakes?.insights ?? [],
        xp: { xp: xp?.xp ?? 0, level: xp?.level ?? 1, achievements: xp?.achievements ?? [] },
        challenge: challenge?.challenge ?? null,
        streak: streak?.streak ?? { currentStreak: 0, longestStreak: 0 },
      })
    })()
  }, [token, userId])

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-2">
        <div>
          <h2 className="text-xl font-semibold text-white">Smart Features</h2>
          <p className="text-sm text-neutral-500">Adaptive learning, goals, revision intelligence, and gamification.</p>
        </div>
        <div className="flex gap-2">
          <Link to="/analytics" className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs text-neutral-200">Analytics</Link>
          <Link to="/favorites" className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs text-neutral-200">Favorites</Link>
        </div>
      </div>

      <div className="grid gap-3 lg:grid-cols-3">
        <StreakBadge current={state.streak.currentStreak} longest={state.streak.longestStreak} />
        <XPProgressBar xp={state.xp.xp} level={state.xp.level} />
        <WeeklyChallengeCard challenge={state.challenge} />
      </div>

      {!!state.xp.achievements?.length && (
        <section className="rounded-2xl border border-white/10 bg-neutral-950/65 p-4">
          <h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-neutral-300">Achievements</h3>
          <div className="mt-2 flex flex-wrap gap-2">
            {state.xp.achievements.map((a) => (
              <span key={a} className="rounded-full border border-indigo-400/35 bg-indigo-500/10 px-2.5 py-1 text-xs text-indigo-100">
                {a}
              </span>
            ))}
          </div>
        </section>
      )}

      <div className="grid gap-3 lg:grid-cols-2">
        <DailyPlanCard tasks={state.tasks} />
        <WeakTopicsCard weakTopics={state.weakTopics} />
      </div>
      <div className="grid gap-3 lg:grid-cols-2">
        <AdaptiveSuggestionCard
          preferredDifficulty={state.adaptive.preferredDifficulty}
          suggestions={state.adaptive.suggestions}
        />
        <GoalPlanner
          goal={state.goal}
          onSave={(payload) => {
            if (!token) return
            void (async () => {
              try {
                const data = await postJson('/api/goals', payload, { token })
                setState((prev) => ({ ...prev, goal: data.goal ?? prev.goal }))
              } catch {
                /* no-op */
              }
            })()
          }}
        />
      </div>
      <MistakeInsights insights={state.mistakes} />
    </div>
  )
}
