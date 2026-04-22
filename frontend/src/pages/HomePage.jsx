import { Link, useNavigate } from 'react-router-dom'
import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Sparkles } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useProgress } from '../context/ProgressContext'
import { dashboardNav } from '../config/dashboardNav'
import { getJson, postJson } from '../lib/api'
import AnimatedSection from '../components/dashboard/home/AnimatedSection'
import AmbientBackground from '../components/dashboard/home/AmbientBackground'
import OverviewHeroCard from '../components/dashboard/home/OverviewHeroCard'
import ProgressStatCard from '../components/dashboard/home/ProgressStatCard'
import TrackCard from '../components/dashboard/home/TrackCard'
import DashboardHeader from '../components/dashboard/home/DashboardHeader'
import DailyPlanCard from '../components/dashboard/home/DailyPlanCard'
import WeakTopicsCard from '../components/dashboard/home/WeakTopicsCard'
import StreakBadge from '../components/dashboard/home/StreakBadge'
import NotificationCard from '../components/dashboard/home/NotificationCard'
import QuickSolveButton from '../components/dashboard/home/QuickSolveButton'
import AdaptiveSuggestionCard from '../components/dashboard/home/AdaptiveSuggestionCard'
import GoalPlanner from '../components/dashboard/home/GoalPlanner'
import MistakeInsights from '../components/dashboard/home/MistakeInsights'
import XPProgressBar from '../components/dashboard/home/XPProgressBar'
import WeeklyChallengeCard from '../components/dashboard/home/WeeklyChallengeCard'

const MotionDiv = motion.div

export default function HomePage() {
  const navigate = useNavigate()
  const { isAuthenticated, token, userId } = useAuth()
  const { progressSummary } = useProgress()
  const totalProblems = progressSummary.totalQuestions
  const [todayPlan, setTodayPlan] = useState([])
  const [weakTopics, setWeakTopics] = useState([])
  const [streak, setStreak] = useState({ currentStreak: 0, longestStreak: 0, lastActivityAt: null })
  const [resume, setResume] = useState({ suggestedCategoryId: 'dsa' })
  const [adaptive, setAdaptive] = useState({ preferredDifficulty: 'Medium', suggestions: [] })
  const [goal, setGoal] = useState(null)
  const [mistakes, setMistakes] = useState([])
  const [xp, setXp] = useState({ xp: 0, level: 1 })
  const [weeklyChallenge, setWeeklyChallenge] = useState(null)

  useEffect(() => {
    if (!isAuthenticated || !token) return
    void (async () => {
      const requests = await Promise.allSettled([
        getJson('/api/planner/today', { token }),
        getJson('/api/analytics/weak-topics', { token }),
        getJson('/api/streak/me', { token }),
        getJson('/api/resume', { token }),
        getJson('/api/adaptive/suggestions', { token }),
        getJson('/api/goals', { token }),
        getJson('/api/analytics/mistakes', { token }),
        getJson('/api/xp', { token }),
        getJson('/api/weekly-challenge', { token }),
      ])

      const [planRes, weakRes, streakRes, resumeRes, adaptiveRes, goalRes, mistakesRes, xpRes, challengeRes] =
        requests.map((r) => (r.status === 'fulfilled' ? r.value : null))

      setTodayPlan(planRes?.tasks ?? [])
      setWeakTopics(weakRes?.weakTopics ?? [])
      setStreak(streakRes?.streak ?? { currentStreak: 0, longestStreak: 0, lastActivityAt: null })
      setResume(resumeRes?.resume ?? { suggestedCategoryId: 'dsa' })
      setAdaptive(adaptiveRes ?? { preferredDifficulty: 'Medium', suggestions: [] })
      setGoal(goalRes?.goal ?? null)
      setMistakes(mistakesRes?.insights ?? [])
      setXp({ xp: xpRes?.xp ?? 0, level: xpRes?.level ?? 1 })
      setWeeklyChallenge(challengeRes?.challenge ?? null)
    })()
  }, [isAuthenticated, token])

  const continuePath = useMemo(() => {
    const categoryId = resume.suggestedCategoryId || 'dsa'
    const nav = dashboardNav.find((n) => n.id === categoryId)
    return nav?.path || '/dsa'
  }, [resume])

  const continueLabel = useMemo(() => {
    const categoryId = resume.suggestedCategoryId || 'dsa'
    const nav = dashboardNav.find((n) => n.id === categoryId)
    return nav ? `Continue ${nav.label}` : 'Continue DSA'
  }, [resume])

  const notificationMessage = useMemo(() => {
    if (!isAuthenticated) return ''
    if (!streak.lastActivityAt) return 'Start today to build your first streak.'
    const last = new Date(streak.lastActivityAt)
    const now = new Date()
    const hours = (now - last) / 3600000
    if (hours >= 24) return "You haven't studied today. Continue your streak."
    return ''
  }, [isAuthenticated, streak])

  return (
    <div className="relative space-y-7">
      <AmbientBackground />

      <AnimatedSection delay={0.02}>
        <DashboardHeader isAuthenticated={isAuthenticated} />
      </AnimatedSection>

      <AnimatedSection delay={0.08}>
        {isAuthenticated ? (
          <OverviewHeroCard
            summary={progressSummary}
            continuePath={continuePath}
            continueLabel={continueLabel}
          />
        ) : (
          <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-neutral-900/95 via-neutral-950 to-indigo-950/40 p-6">
            <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-indigo-500/20 blur-3xl" />
            <div className="relative z-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-3">
                <span className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] text-indigo-300">
                  <Sparkles className="size-5" aria-hidden />
                </span>
                <div>
                  <h3 className="text-lg font-semibold text-white">Track your prep with live progress</h3>
                  <p className="mt-1 max-w-md text-sm text-neutral-400">
                    Create an account to save completions and notes across {totalProblems}+ curated items.
                  </p>
                </div>
              </div>
              <div className="flex shrink-0 flex-wrap gap-2">
                <Link
                  to="/login"
                  className="inline-flex items-center justify-center rounded-xl border border-white/15 bg-white/[0.03] px-4 py-2.5 text-sm font-medium text-white transition hover:border-white/30 hover:bg-white/[0.07]"
                >
                  Log in
                </Link>
                <Link
                  to="/signup"
                  className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-4 py-2.5 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(99,102,241,0.35)] transition hover:brightness-110"
                >
                  Sign up
                </Link>
              </div>
            </div>
          </div>
        )}
      </AnimatedSection>

      {isAuthenticated && (
        <AnimatedSection delay={0.11} className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <QuickSolveButton onClick={() => navigate(continuePath)} />
            <StreakBadge current={streak.currentStreak} longest={streak.longestStreak} />
          </div>
          <NotificationCard message={notificationMessage} />
          <div className="grid gap-3 lg:grid-cols-2">
            <DailyPlanCard tasks={todayPlan} />
            <WeakTopicsCard weakTopics={weakTopics} />
          </div>
          <div className="grid gap-3 lg:grid-cols-2">
            <AdaptiveSuggestionCard preferredDifficulty={adaptive.preferredDifficulty} suggestions={adaptive.suggestions} />
            <GoalPlanner
              goal={goal}
              onSave={(payload) => {
                if (!token) return
                void (async () => {
                  try {
                    const data = await postJson('/api/goals', payload, { token })
                    setGoal(data.goal ?? null)
                  } catch {
                    /* no-op */
                  }
                })()
              }}
            />
          </div>
          <div className="grid gap-3 lg:grid-cols-3">
            <MistakeInsights insights={mistakes} />
            <XPProgressBar xp={xp.xp} level={xp.level} />
            <WeeklyChallengeCard challenge={weeklyChallenge} />
          </div>
          <div className="flex gap-2">
            <Link to="/smart-features" className="rounded-lg border border-indigo-400/35 bg-indigo-500/10 px-3 py-1.5 text-xs text-indigo-100 hover:bg-indigo-500/15">
              Open Smart Features
            </Link>
            <Link to="/analytics" className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs text-neutral-200 hover:border-indigo-400/40">
              Open Analytics
            </Link>
            <Link to="/favorites" className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs text-neutral-200 hover:border-indigo-400/40">
              Open Favorites
            </Link>
          </div>
        </AnimatedSection>
      )}

      <AnimatedSection delay={0.14} className="space-y-3">
        <div className="flex items-end justify-between">
          <h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-neutral-400">Category Progress</h3>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
          {dashboardNav.map((item) => {
            const s = progressSummary.perCategory[item.id]
            if (!s) return null
            return (
              <ProgressStatCard
                key={item.id}
                id={item.id}
                label={item.label}
                stats={s}
                to={item.path}
              />
            )
          })}
        </div>
      </AnimatedSection>

      <AnimatedSection delay={0.2} className="space-y-3">
        <div className="flex items-end justify-between">
          <h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-neutral-400">Modules</h3>
          <MotionDiv
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.35 }}
            className="hidden text-xs text-neutral-500 sm:block"
          >
            Open module with notes and progress
          </MotionDiv>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {dashboardNav.map((item) => {
            const s = progressSummary.perCategory[item.id]
            const progressText = s ? `${s.done}/${s.total} completed` : 'Start module'
            return <TrackCard key={item.id} item={item} progressText={progressText} />
          })}
        </div>
      </AnimatedSection>
    </div>
  )
}
