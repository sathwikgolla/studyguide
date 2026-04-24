import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Globe } from 'lucide-react'

const MotionButton = motion.button

function loadGoogleScript() {
  return new Promise((resolve, reject) => {
    if (window.google?.accounts?.id) return resolve()
    const script = document.createElement('script')
    script.src = 'https://accounts.google.com/gsi/client'
    script.async = true
    script.defer = true
    script.onload = () => resolve()
    script.onerror = () => reject(new Error('Failed to load Google Identity Services'))
    document.head.appendChild(script)
  })
}

export default function GoogleAuthButton({ onCredential, disabled = false, rememberMe = true }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const readyRef = useRef(false)

  useEffect(() => {
    let mounted = true
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID
    if (!clientId) return undefined
    loadGoogleScript()
      .then(() => {
        if (!mounted) return
        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: (response) => {
            if (!response?.credential) return
            onCredential(response.credential, { rememberMe })
          },
        })
        readyRef.current = true
      })
      .catch(() => {
        if (mounted) setError('Google login is unavailable right now.')
      })
    return () => {
      mounted = false
    }
  }, [onCredential, rememberMe])

  const handleClick = () => {
    setError('')
    if (!readyRef.current) {
      setError('Google login is not configured.')
      return
    }
    setLoading(true)
    try {
      window.google.accounts.id.prompt()
    } catch {
      setError('Could not start Google login.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-2">
      <MotionButton
        type="button"
        onClick={handleClick}
        disabled={disabled || loading}
        className="flex w-full items-center justify-center gap-2 rounded-lg border border-white/15 bg-white/[0.03] px-3 py-2.5 text-sm text-neutral-100 transition hover:bg-white/[0.08] disabled:cursor-not-allowed disabled:opacity-60"
        whileHover={disabled || loading ? undefined : { scale: 1.01 }}
        whileTap={disabled || loading ? undefined : { scale: 0.99 }}
      >
        <Globe className="size-4" aria-hidden />
        {loading ? 'Opening Google...' : 'Continue with Google'}
      </MotionButton>
      {error ? <p className="text-xs text-red-400">{error}</p> : null}
    </div>
  )
}
