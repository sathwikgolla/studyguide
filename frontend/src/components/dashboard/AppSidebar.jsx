import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { motion } from 'framer-motion'
import { BookOpen } from 'lucide-react'
import { dashboardNav } from '../../config/dashboardNav'

const MotionAside = motion.aside
const MotionDiv = motion.div
const MotionSpan = motion.span
const MotionP = motion.p

const collapsed = 72
const expanded = 248

const spring = { type: 'spring', stiffness: 420, damping: 38, mass: 0.6 }

const navSections = [
  {
    id: 'core',
    label: 'Core Tracks',
    items: ['dsa', 'os', 'cn', 'dbms', 'fullstack'],
  },
  {
    id: 'extended',
    label: 'Extended Prep',
    items: [
      'aptitude',
      'logical-reasoning',
      'system-design',
      'devops-cloud',
      'hr-behavioral',
      'testing-qa',
      'design-patterns',
      'mobile-development',
      'web3-blockchain',
      'core-cs-fundamentals',
    ],
  },
  {
    id: 'smart',
    label: 'AI & Insights',
    items: ['smart-features'],
  },
]

const navMap = new Map(dashboardNav.map((item) => [item.id, item]))

export default function AppSidebar() {
  const [hovered, setHovered] = useState(false)

  return (
    <MotionAside
      className="sticky top-0 relative z-20 flex h-screen shrink-0 self-start flex-col border-r border-white/10 bg-neutral-950/95 backdrop-blur-xl"
      initial={false}
      animate={{ width: hovered ? expanded : collapsed }}
      transition={spring}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="pointer-events-none absolute inset-y-0 right-0 w-px bg-gradient-to-b from-transparent via-indigo-400/40 to-transparent" />
      <div className="pointer-events-none absolute left-0 top-0 h-44 w-full bg-[radial-gradient(ellipse_at_top,rgba(99,102,241,0.22),transparent_65%)]" />
      <div className="flex h-full min-h-0 flex-col overflow-hidden">
        <Link
          to="/"
          aria-label="PrepFlow home"
          className="group flex items-center gap-3 px-4 py-5 outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/60 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-950"
        >
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 shadow-lg shadow-indigo-500/30 transition group-hover:shadow-indigo-400/40">
            <BookOpen className="size-5 text-white" aria-hidden />
          </div>
          <MotionDiv
            className="min-w-0"
            initial={false}
            animate={{
              opacity: hovered ? 1 : 0,
              x: hovered ? 0 : -6,
            }}
            transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="truncate text-sm font-semibold tracking-tight text-white">PrepFlow</p>
            <p className="truncate text-xs text-neutral-400">Smart study cockpit</p>
          </MotionDiv>
        </Link>

        <nav className="sidebar-scrollbar flex flex-1 flex-col gap-3 overflow-y-auto px-2 pb-4" aria-label="Topics">
          {navSections.map((section) => (
            <div key={section.id} className="space-y-1.5">
              <MotionP
                className="px-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-neutral-500"
                initial={false}
                animate={{ opacity: hovered ? 1 : 0, maxHeight: hovered ? 14 : 0 }}
                transition={{ duration: 0.18 }}
              >
                {section.label}
              </MotionP>
              <div className="space-y-0.5">
                {section.items.map((itemId) => {
                  const item = navMap.get(itemId)
                  if (!item) return null
                  const Icon = item.icon
                  return (
                    <NavLink
                      key={item.id}
                      to={item.path}
                      title={item.label}
                      className={({ isActive }) =>
                        [
                          'group relative flex items-center gap-3 rounded-xl py-2.5 pl-3 pr-2 outline-none transition-all duration-200',
                          'focus-visible:ring-2 focus-visible:ring-indigo-500/60 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-950',
                          isActive
                            ? 'bg-gradient-to-r from-indigo-500/20 via-violet-500/10 to-transparent text-white shadow-[inset_0_0_0_1px_rgba(129,140,248,0.35)]'
                            : 'text-neutral-400 hover:bg-white/[0.04] hover:text-neutral-100',
                        ].join(' ')
                      }
                    >
                      {({ isActive }) => (
                        <>
                          {isActive && (
                            <MotionSpan
                              layoutId="sidebar-active"
                              className="absolute inset-y-1 left-0 w-0.5 rounded-full bg-gradient-to-b from-indigo-300 to-violet-400"
                              transition={spring}
                            />
                          )}
                          <span
                            className={[
                              'relative flex size-8 shrink-0 items-center justify-center rounded-lg border transition-all duration-200',
                              isActive
                                ? 'border-indigo-300/40 bg-indigo-500/15 text-indigo-300 shadow-[0_0_14px_rgba(99,102,241,0.35)]'
                                : 'border-white/10 bg-white/[0.02] text-neutral-500 group-hover:border-indigo-400/35 group-hover:bg-indigo-500/10 group-hover:text-indigo-300',
                            ].join(' ')}
                          >
                            <Icon className="size-4" strokeWidth={1.9} aria-hidden />
                          </span>
                          <MotionSpan
                            className="min-w-0 overflow-hidden truncate whitespace-nowrap text-sm font-medium"
                            initial={false}
                            animate={{
                              opacity: hovered ? 1 : 0,
                              x: hovered ? 0 : -6,
                              maxWidth: hovered ? 200 : 0,
                            }}
                            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                          >
                            {item.label}
                          </MotionSpan>
                        </>
                      )}
                    </NavLink>
                  )
                })}
              </div>
            </div>
          ))}
        </nav>

        <div className="mt-auto border-t border-white/10 px-3 py-3">
          <MotionP
            className="rounded-lg border border-white/10 bg-white/[0.03] px-2.5 py-2 text-[11px] leading-snug text-neutral-400"
            initial={false}
            animate={{
              opacity: hovered ? 1 : 0,
            }}
            transition={{ duration: 0.15 }}
          >
            PrepFlow Pro UI
          </MotionP>
        </div>
      </div>
    </MotionAside>
  )
}
