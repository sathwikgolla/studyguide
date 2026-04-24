import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Mail, LoaderCircle } from 'lucide-react'
import { motion } from 'framer-motion'
import AuthLayout from '../components/auth/AuthLayout'
import FormField from '../components/auth/FormField'
import { useAuth } from '../context/AuthContext'
import { validateEmailField } from '../lib/authValidation'

const MotionP = motion.p

export default function ForgotPasswordPage() {
  const { requestPasswordReset } = useAuth()
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setMessage('')
    const validationError = validateEmailField(email)
    if (validationError) {
      setError(validationError)
      return
    }
    setLoading(true)
    try {
      const data = await requestPasswordReset(email)
      setMessage(data?.message || 'Reset link generated. Check your inbox.')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not request reset')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout
      title="Forgot password"
      subtitle="Enter your email to generate a password reset link."
      footer={
        <p className="mt-6 text-center text-sm text-neutral-500">
          Back to{' '}
          <Link to="/login" className="font-medium text-indigo-400 transition hover:text-indigo-300">
            Sign in
          </Link>
        </p>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <FormField
          id="forgot-email"
          label="Email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={setEmail}
          error={error || undefined}
          icon={Mail}
          placeholder="you@example.com"
        />
        {message ? (
          <MotionP initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-200">
            {message}
          </MotionP>
        ) : null}
        <button
          type="submit"
          disabled={loading}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-indigo-600 to-violet-600 py-2.5 text-sm font-semibold text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? <LoaderCircle className="size-4 animate-spin" /> : null}
          {loading ? 'Generating...' : 'Send reset link'}
        </button>
      </form>
    </AuthLayout>
  )
}
