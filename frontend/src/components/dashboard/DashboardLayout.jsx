import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { Search, LogOut, Info, LogIn, UserPlus } from 'lucide-react'
import AppSidebar from './AppSidebar'
import { useAuth } from '../../context/AuthContext'
import { dashboardNav } from '../../config/dashboardNav'

function titleForPath(pathname) {
  if (pathname === '/') return 'Overview'
  if (pathname === '/about') return 'About'
  const hit = dashboardNav.find(
    (n) => pathname === n.path || pathname.startsWith(`${n.path}/`)
  )
  return hit?.label ?? 'PrepFlow'
}

export default function DashboardLayout() {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const { token, logout } = useAuth()
  const pageTitle = titleForPath(pathname)
  const isAuthed = Boolean(token)

  const handleLogout = () => {
    logout()
    navigate('/', { replace: true })
  }

  return (
    <div className="flex min-h-screen w-full bg-neutral-950 text-neutral-100">
      <AppSidebar />
      <div className="flex min-h-screen min-w-0 flex-1 flex-col bg-black">
        <header className="sticky top-0 z-10 border-b border-white/10 bg-black/70 px-6 py-3.5 backdrop-blur-xl">
          <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
            <div className="min-w-0">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-indigo-300/90">
                Dashboard
              </p>
              <h1 className="text-lg font-semibold tracking-tight text-white sm:text-xl">
                {pageTitle}
              </h1>
            </div>
            <div className="flex shrink-0 flex-wrap items-center justify-end gap-x-3 gap-y-1 text-xs font-medium sm:hidden">
              {isAuthed ? (
                <button
                  type="button"
                  onClick={handleLogout}
                  className="inline-flex items-center gap-1 text-neutral-400 transition hover:text-indigo-300"
                >
                  <LogOut className="size-3.5" aria-hidden />
                  Log out
                </button>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="inline-flex items-center gap-1 text-neutral-400 transition hover:text-indigo-300"
                  >
                    <LogIn className="size-3.5" aria-hidden />
                    Log in
                  </Link>
                  <Link
                    to="/signup"
                    className="inline-flex items-center gap-1 text-neutral-400 transition hover:text-indigo-300"
                  >
                    <UserPlus className="size-3.5" aria-hidden />
                    Sign up
                  </Link>
                </>
              )}
              <Link to="/about" className="inline-flex items-center gap-1 text-neutral-400 transition hover:text-indigo-300">
                <Info className="size-3.5" aria-hidden />
                About
              </Link>
            </div>
            <div className="hidden h-9 w-px bg-white/10 sm:block" />
            <div className="hidden flex-1 items-center gap-4 sm:flex">
              <div className="mx-auto flex max-w-lg flex-1 items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-neutral-300 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.03)] transition focus-within:border-indigo-400/50 focus-within:bg-indigo-500/[0.05]">
                <Search className="size-4 text-neutral-500" aria-hidden />
                <input
                  type="text"
                  placeholder="Search topics, sheets, tags..."
                  className="w-full bg-transparent text-sm text-neutral-200 outline-none placeholder:text-neutral-500"
                />
              </div>
              <div className="flex shrink-0 items-center gap-3 text-xs font-medium">
                {isAuthed ? (
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="inline-flex items-center gap-1 rounded-lg border border-white/10 bg-white/[0.03] px-2.5 py-1.5 text-neutral-300 transition hover:border-indigo-400/40 hover:text-indigo-200"
                  >
                    <LogOut className="size-3.5" aria-hidden />
                    Log out
                  </button>
                ) : (
                  <>
                    <Link
                      to="/login"
                      className="inline-flex items-center gap-1 rounded-lg border border-white/10 bg-white/[0.03] px-2.5 py-1.5 text-neutral-300 transition hover:border-indigo-400/40 hover:text-indigo-200"
                    >
                      <LogIn className="size-3.5" aria-hidden />
                      Log in
                    </Link>
                    <Link
                      to="/signup"
                      className="inline-flex items-center gap-1 rounded-lg border border-white/10 bg-white/[0.03] px-2.5 py-1.5 text-neutral-300 transition hover:border-indigo-400/40 hover:text-indigo-200"
                    >
                      <UserPlus className="size-3.5" aria-hidden />
                      Sign up
                    </Link>
                  </>
                )}
                <Link
                  to="/about"
                  className="inline-flex items-center gap-1 rounded-lg border border-white/10 bg-white/[0.03] px-2.5 py-1.5 text-neutral-300 transition hover:border-indigo-400/40 hover:text-indigo-200"
                >
                  <Info className="size-3.5" aria-hidden />
                  About
                </Link>
              </div>
            </div>
          </div>
        </header>
        <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
