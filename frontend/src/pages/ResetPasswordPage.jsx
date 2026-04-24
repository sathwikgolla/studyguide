import { useMemo, useState } from 'react'
import { useSearchParams, Link, useNavigate } from 'react-router-dom'
import { LoaderCircle } from 'lucide-react'
import { motion } from 'framer-motion'
import AuthLayout from '../components/auth/AuthLayout'
import PasswordInput from '../components/auth/PasswordInput'
import PasswordStrengthMeter from '../components/auth/PasswordStrengthMeter'
import { useAuth } from '../context/AuthContext'
import { validatePasswordField } from '../lib/authValidation'

const MotionP = motion.p

export default function ResetPasswordPage() {
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const { resetPassword } = useAuth()
  const token = useMemo(() => params.get('token') || '', [params])
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setMessage('')
    if (!token) {
      setError('Missing reset token. Use the full reset URL.')
      return
    }
    const passwordError = validatePasswordField(password)
    if (passwordError) {
      setError(passwordError)
      return
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }
    setLoading(true)
    try {
      const data = await resetPassword(token, password)
      setMessage(data?.message || 'Password reset successful.')
      setTimeout(() => navigate('/login', { replace: true }), 900)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not reset password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout
      title="Reset password"
      subtitle="Create a new secure password."
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
        <PasswordInput
          id="reset-password"
          label="New Password"
          autoComplete="new-password"
          value={password}
          onChange={setPassword}
          error={undefined}
        />
        <PasswordInput
          id="reset-confirm-password"
          label="Confirm Password"
          autoComplete="new-password"
          value={confirmPassword}
          onChange={setConfirmPassword}
          error={undefined}
        />
        <PasswordStrengthMeter password={password} />
        {error ? (
          <MotionP initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-200">
            {error}
          </MotionP>
        ) : null}
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
          {loading ? 'Saving...' : 'Reset password'}
        </button>
      </form>
    </AuthLayout>
  )
}
