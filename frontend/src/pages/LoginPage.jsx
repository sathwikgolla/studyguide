import { useState, useCallback } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { LogIn, Mail, Lock } from 'lucide-react'
import AuthScreen from '../components/auth/AuthScreen'
import FormField from '../components/auth/FormField'
import { useAuth } from '../context/AuthContext'
import { validateEmailField, validatePasswordField } from '../lib/authValidation'

const MotionDiv = motion.div
const MotionButton = motion.button
const MotionP = motion.p

const fieldMotion = {
  hidden: { opacity: 0, x: -12 },
  visible: (i) => ({
    opacity: 1,
    x: 0,
    transition: { delay: 0.12 + i * 0.06, duration: 0.3, ease: [0.22, 1, 0.36, 1] },
  }),
}

export default function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login } = useAuth()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})
  const [apiError, setApiError] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  const runEmailValidation = useCallback(() => {
    const err = validateEmailField(email)
    setErrors((e) => ({ ...e, email: err || undefined }))
    return !err
  }, [email])

  const runPasswordValidation = useCallback(() => {
    const err = validatePasswordField(password)
    setErrors((e) => ({ ...e, password: err || undefined }))
    return !err
  }, [password])

  const handleBlurEmail = () => {
    setTouched((t) => ({ ...t, email: true }))
    runEmailValidation()
  }

  const handleBlurPassword = () => {
    setTouched((t) => ({ ...t, password: true }))
    runPasswordValidation()
  }

  const handleSubmit = async (ev) => {
    ev.preventDefault()
    setApiError(null)
    setTouched({ email: true, password: true })
    const okEmail = runEmailValidation()
    const okPass = runPasswordValidation()
    if (!okEmail || !okPass) return

    setSubmitting(true)
    try {
      await login(email, password)
      const raw = location.state?.from
      const dest =
        typeof raw === 'string' &&
        raw.startsWith('/') &&
        !raw.startsWith('/login') &&
        !raw.startsWith('/signup')
          ? raw
          : '/'
      navigate(dest, { replace: true })
    } catch (err) {
      setApiError(err instanceof Error ? err.message : 'Sign in failed')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AuthScreen
      title="Welcome back"
      subtitle="Sign in to continue your PrepFlow sessions."
      footer={
        <p className="mt-6 text-center text-sm text-neutral-500">
          No account?{' '}
          <Link
            to="/signup"
            className="font-medium text-indigo-400 transition hover:text-indigo-300"
          >
            Create one
          </Link>
        </p>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
        <MotionDiv custom={0} variants={fieldMotion} initial="hidden" animate="visible">
          <FormField
            id="email"
            label="Email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(v) => {
              setEmail(v)
              if (touched.email) runEmailValidation()
            }}
            onBlur={handleBlurEmail}
            error={touched.email ? errors.email : undefined}
            icon={Mail}
            placeholder="you@example.com"
          />
        </MotionDiv>
        <MotionDiv custom={1} variants={fieldMotion} initial="hidden" animate="visible">
          <FormField
            id="password"
            label="Password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(v) => {
              setPassword(v)
              if (touched.password) runPasswordValidation()
            }}
            onBlur={handleBlurPassword}
            error={touched.password ? errors.password : undefined}
            icon={Lock}
            placeholder="••••••••"
          />
        </MotionDiv>

        {apiError && (
          <MotionP
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-200"
            role="alert"
          >
            {apiError}
          </MotionP>
        )}

        <MotionButton
          type="submit"
          disabled={submitting}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-indigo-600 to-violet-600 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 outline-none transition hover:brightness-110 focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-950 disabled:cursor-not-allowed disabled:opacity-60"
          whileHover={submitting ? undefined : { scale: 1.01 }}
          whileTap={submitting ? undefined : { scale: 0.99 }}
        >
          <LogIn className="size-4" aria-hidden />
          {submitting ? 'Signing in…' : 'Sign in'}
        </MotionButton>
      </form>
    </AuthScreen>
  )
}
