import { useCallback, useEffect, useState } from 'react'
import { getJson, postJson } from '../lib/api'
import { useAuth } from '../context/AuthContext'

export function useSubscription() {
  const { token } = useAuth()
  const [status, setStatus] = useState({ plan: 'free', isPremium: false, loading: true })

  const refresh = useCallback(async () => {
    if (!token) {
      setStatus({ plan: 'free', isPremium: false, loading: false })
      return
    }
    setStatus((prev) => ({ ...prev, loading: true }))
    try {
      const data = await getJson('/api/subscription/status', { token })
      setStatus({ plan: data.plan || 'free', isPremium: Boolean(data.isPremium), loading: false })
    } catch {
      setStatus({ plan: 'free', isPremium: false, loading: false })
    }
  }, [token])

  const upgrade = useCallback(
    async (plan = 'premium') => {
      if (!token) throw new Error('Please log in first')
      const data = await postJson('/api/subscription/upgrade', { plan }, { token })
      setStatus({ plan: data.plan || 'free', isPremium: Boolean(data.isPremium), loading: false })
      return data
    },
    [token]
  )

  useEffect(() => {
    void refresh()
  }, [refresh])

  return { ...status, refresh, upgrade }
}
