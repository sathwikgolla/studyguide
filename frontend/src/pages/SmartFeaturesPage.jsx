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
import RevisionQueue from '../components/modules/RevisionQueue'

export default function SmartFeaturesPage() {
  const { token, userId } = useAuth()
  const [state, setState] = useState({
    tasks: [],
    planProgress: { completedCount: 0, totalTasks: 0, allCompleted: false },
    profile: { stars: 0, rank: 'Rookie' },
    dailyReward: null,
    weakTopics: [],
    adaptive: { preferredDifficulty: 'Medium', suggestions: [] },
    goal: null,
    mistakes: [],
    xp: { xp: 0, level: 1, achievements: [] },
    challenge: null,
    streak: { currentStreak: 0, longestStreak: 0 },
    revisionQueue: [],
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
        getJson('/api/revision/queue', { token }),
      ])
      const [plan, weak, adaptive, goal, mistakes, xp, challenge, streak, revision] = requests.map((r) =>
        r.status === 'fulfilled' ? r.value : null
      )
      setState({
        tasks: plan?.tasks ?? [],
        planProgress: plan?.progress ?? { completedCount: 0, totalTasks: plan?.tasks?.length ?? 0, allCompleted: false },
        profile: plan?.profile ?? { stars: 0, rank: 'Rookie' },
        dailyReward: plan?.reward ?? null,
        weakTopics: weak?.weakTopics ?? [],
        adaptive: adaptive ?? { preferredDifficulty: 'Medium', suggestions: [] },
        goal: goal?.goal ?? null,
        mistakes: mistakes?.insights ?? [],
        xp: { xp: xp?.xp ?? 0, level: xp?.level ?? 1, achievements: xp?.achievements ?? [] },
        challenge: challenge?.challenge ?? null,
        streak: streak?.streak ?? { currentStreak: 0, longestStreak: 0 },
        revisionQueue: revision?.queue ?? [],
      })
    })()
  }, [token, userId])

  return (
    <div className="relative space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-2">
        <div>
          <h2 className="text-xl font-semibold text-white">Smart Features</h2>
          <p className="text-sm text-neutral-500">Adaptive learning, goals, revision intelligence, and gamification.</p>
        </div>
        <div className="flex gap-2">
          <Link to="/analytics" className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs text-neutral-200">Analytics</Link>
          <Link to="/mock-interview" className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs text-neutral-200">Mock Interview</Link>
          <Link to="/pricing" className="rounded-lg border border-indigo-400/35 bg-indigo-500/10 px-3 py-1.5 text-xs text-indigo-100">Pricing</Link>
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
        <DailyPlanCard
          tasks={state.tasks}
          progress={state.planProgress}
          profile={state.profile}
          reward={state.dailyReward}
        />
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
      <div className="relative">
        <RevisionQueue
          items={state.revisionQueue}
          onMarkDone={(item) => {
            if (!token) return
            void (async () => {
              try {
                await postJson('/api/revision/update', { questionId: item.questionId, stage: 2, completed: true }, { token })
                setState((prev) => ({
                  ...prev,
                  revisionQueue: prev.revisionQueue.filter((q) => q.questionId !== item.questionId),
                }))
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
