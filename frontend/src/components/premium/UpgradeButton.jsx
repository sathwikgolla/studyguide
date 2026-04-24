import { useState } from 'react'
import { Crown, LoaderCircle } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useSubscription } from '../../hooks/useSubscription'

export default function UpgradeButton({ className = '' }) {
  const navigate = useNavigate()
  const { isPremium } = useSubscription()
  const [loading] = useState(false)

  if (isPremium) {
    return (
      <span className={`inline-flex items-center gap-1 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1.5 text-xs font-medium text-emerald-200 ${className}`}>
        <Crown className="size-3.5" aria-hidden />
        Premium
      </span>
    )
  }

  return (
    <button
      type="button"
      onClick={() => navigate('/pricing')}
      className={`inline-flex items-center gap-1 rounded-lg bg-gradient-to-r from-indigo-600 to-violet-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:brightness-110 disabled:opacity-60 ${className}`}
      disabled={loading}
    >
      {loading ? <LoaderCircle className="size-3.5 animate-spin" /> : <Crown className="size-3.5" aria-hidden />}
      {loading ? 'Upgrading...' : 'Upgrade to Premium'}
    </button>
  )
}
