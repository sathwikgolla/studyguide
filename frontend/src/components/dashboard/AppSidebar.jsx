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
const expanded = 236

const spring = { type: 'spring', stiffness: 420, damping: 38, mass: 0.6 }

export default function AppSidebar() {
  const [hovered, setHovered] = useState(false)

  return (
    <MotionAside
      className="relative z-20 flex h-screen shrink-0 flex-col border-r border-neutral-800/80 bg-neutral-950"
      initial={false}
      animate={{ width: hovered ? expanded : collapsed }}
      transition={spring}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="flex h-full min-h-0 flex-col overflow-hidden">
        <Link
          to="/"
          aria-label="PrepFlow home"
          className="flex items-center gap-3 px-4 py-5 outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/60 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-950"
        >
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 shadow-lg shadow-indigo-500/20">
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
            <p className="truncate text-sm font-semibold tracking-tight text-white">
              PrepFlow
            </p>
            <p className="truncate text-xs text-neutral-500">Study dashboard</p>
          </MotionDiv>
        </Link>

        <nav className="flex flex-1 flex-col gap-0.5 px-2 pb-4" aria-label="Topics">
          {dashboardNav.map((item) => {
            const Icon = item.icon
            return (
              <NavLink
                key={item.id}
                to={item.path}
                title={item.label}
                className={({ isActive }) =>
                  [
                    'group relative flex items-center gap-3 rounded-lg py-2.5 pl-3 pr-2 outline-none transition-colors',
                    'focus-visible:ring-2 focus-visible:ring-indigo-500/60 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-950',
                    isActive
                      ? 'bg-neutral-800/90 text-white'
                      : 'text-neutral-400 hover:bg-neutral-900 hover:text-neutral-100',
                  ].join(' ')
                }
              >
                {({ isActive }) => (
                  <>
                    {isActive && (
                      <MotionSpan
                        layoutId="sidebar-active"
                        className="absolute inset-y-1 left-0 w-0.5 rounded-full bg-gradient-to-b from-indigo-400 to-violet-500"
                        transition={spring}
                      />
                    )}
                    <Icon
                      className={[
                        'size-5 shrink-0 transition-colors',
                        isActive
                          ? 'text-indigo-400'
                          : 'text-neutral-500 group-hover:text-indigo-300',
                      ].join(' ')}
                      strokeWidth={1.75}
                      aria-hidden
                    />
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
        </nav>

        <div className="mt-auto border-t border-neutral-800/80 px-3 py-3">
          <MotionP
            className="px-1 text-[11px] leading-snug text-neutral-600"
            initial={false}
            animate={{
              opacity: hovered ? 1 : 0,
            }}
            transition={{ duration: 0.15 }}
          >
            PrepFlow · Track topics and sessions
          </MotionP>
        </div>
      </div>
    </MotionAside>
  )
}
