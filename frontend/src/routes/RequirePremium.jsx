import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useSubscription } from '../hooks/useSubscription'

export default function RequirePremium() {
  const location = useLocation()
  const { isPremium, loading } = useSubscription()

  if (loading) {
    return <div className="px-4 py-6 text-sm text-neutral-400">Checking subscription...</div>
  }

  if (!isPremium) {
    return <Navigate to="/pricing" replace state={{ from: location.pathname }} />
  }

  return <Outlet />
}
