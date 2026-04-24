import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { getJson } from '../lib/api'
import ProgressChart from '../components/analytics/ProgressChart'
import TopicChart from '../components/analytics/TopicChart'
import DifficultyChart from '../components/analytics/DifficultyChart'
import WeakTopicsCard from '../components/analytics/WeakTopicsCard'
import PremiumLockOverlay from '../components/premium/PremiumLockOverlay'
import { useSubscription } from '../hooks/useSubscription'

export default function AnalyticsPage() {
  const { token } = useAuth()
  const { isPremium, loading: subscriptionLoading } = useSubscription()
  const [summary, setSummary] = useState({ totalQuestions: 0, completedQuestions: 0, completionRate: 0 })
  const [timeline, setTimeline] = useState([])
  const [topics, setTopics] = useState([])
  const [weakTopics, setWeakTopics] = useState([])
  const [difficulty, setDifficulty] = useState({ Easy: 0, Medium: 0, Hard: 0 })

  useEffect(() => {
    if (!token || !isPremium) return
    void (async () => {
      try {
        const [overview, topicData, difficultyData] = await Promise.all([
          getJson('/api/analytics/overview', { token }),
          getJson('/api/analytics/topics', { token }),
          getJson('/api/analytics/difficulty', { token }),
        ])
        setSummary(overview.summary ?? { totalQuestions: 0, completedQuestions: 0, completionRate: 0 })
        setTimeline(overview.timeline ?? [])
        setTopics(topicData.topics ?? [])
        setWeakTopics(topicData.weakTopics ?? [])
        setDifficulty(difficultyData.difficulty ?? { Easy: 0, Medium: 0, Hard: 0 })
      } catch {
        setTimeline([])
      }
    })()
  }, [token, isPremium])

  return (
    <div className="relative space-y-4">
      <h2 className="text-xl font-semibold text-white">Analytics Dashboard</h2>
      <section className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-xl border border-white/10 bg-neutral-950/60 p-4">
          <p className="text-xs uppercase tracking-wide text-neutral-500">Total Questions</p>
          <p className="mt-1 text-xl font-semibold text-white">{summary.totalQuestions}</p>
        </div>
        <div className="rounded-xl border border-white/10 bg-neutral-950/60 p-4">
          <p className="text-xs uppercase tracking-wide text-neutral-500">Completed</p>
          <p className="mt-1 text-xl font-semibold text-white">{summary.completedQuestions}</p>
        </div>
        <div className="rounded-xl border border-white/10 bg-neutral-950/60 p-4">
          <p className="text-xs uppercase tracking-wide text-neutral-500">Completion Rate</p>
          <p className="mt-1 text-xl font-semibold text-white">{summary.completionRate}%</p>
        </div>
      </section>
      <ProgressChart data={timeline} />
      <div className="grid gap-4 lg:grid-cols-2">
        <TopicChart data={topics} />
        <DifficultyChart difficulty={difficulty} />
      </div>
      <WeakTopicsCard weakTopics={weakTopics} />
      {!subscriptionLoading && !isPremium ? (
        <PremiumLockOverlay
          title="Premium analytics"
          description="Upgrade to Premium to unlock deep progress insights, charts, and weak-topic intelligence."
        />
      ) : null}
    </div>
  )
}
