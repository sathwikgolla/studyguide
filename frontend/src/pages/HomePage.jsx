import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowUpRight, Sparkles } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useProgress } from '../context/ProgressContext'
import { dashboardNav } from '../config/dashboardNav'
import AnimatedSection from '../components/dashboard/home/AnimatedSection'
import AmbientBackground from '../components/dashboard/home/AmbientBackground'
import OverviewHeroCard from '../components/dashboard/home/OverviewHeroCard'
import ProgressStatCard from '../components/dashboard/home/ProgressStatCard'
import TrackCard from '../components/dashboard/home/TrackCard'
import DashboardHeader from '../components/dashboard/home/DashboardHeader'

const topicLabels = {
  dsa: 'DSA',
  os: 'OS',
  cn: 'CN',
  dbms: 'DBMS',
  fullstack: 'Full Stack',
}

const topicPaths = {
  dsa: '/dsa',
  os: '/os',
  cn: '/cn',
  dbms: '/dbms',
  fullstack: '/full-stack',
}

const MotionDiv = motion.div

export default function HomePage() {
  const { isAuthenticated } = useAuth()
  const { progressSummary } = useProgress()
  const totalProblems = progressSummary.totalQuestions

  return (
    <div className="relative space-y-7">
      <AmbientBackground />

      <AnimatedSection delay={0.02}>
        <DashboardHeader isAuthenticated={isAuthenticated} />
      </AnimatedSection>

      <AnimatedSection delay={0.08}>
        {isAuthenticated ? (
          <OverviewHeroCard summary={progressSummary} />
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

      <AnimatedSection delay={0.14} className="space-y-3">
        <div className="flex items-end justify-between">
          <h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-neutral-400">Category Progress</h3>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
          {Object.entries(topicLabels).map(([id, label]) => {
            const s = progressSummary.perCategory[id]
            if (!s) return null
            return <ProgressStatCard key={id} id={id} label={label} stats={s} to={topicPaths[id]} />
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
            const categoryKey = item.id === 'fullstack' ? 'fullstack' : item.id
            const s = progressSummary.perCategory[categoryKey]
            const progressText = s ? `${s.done}/${s.total} completed` : 'Start module'
            return <TrackCard key={item.id} item={item} progressText={progressText} />
          })}
        </div>
      </AnimatedSection>
    </div>
  )
}
