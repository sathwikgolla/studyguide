import { useState, useCallback } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { LoaderCircle, LogIn, Mail } from 'lucide-react'
import AuthLayout from '../components/auth/AuthLayout'
import FormField from '../components/auth/FormField'
import PasswordInput from '../components/auth/PasswordInput'
import GoogleAuthButton from '../components/auth/GoogleAuthButton'
import { useAuth } from '../context/AuthContext'
import { validateEmailField, validateLoginPasswordField } from '../lib/authValidation'

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
  const { login, loginWithGoogle } = useAuth()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})
  const [apiError, setApiError] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [rememberMe, setRememberMe] = useState(true)
  const [toast, setToast] = useState(null)
  const signedUpMessage = location.state?.justSignedUp
    ? 'Account created successfully. Please sign in.'
    : null

  const runEmailValidation = useCallback(() => {
    const err = validateEmailField(email)
    setErrors((e) => ({ ...e, email: err || undefined }))
    return !err
  }, [email])

  const runPasswordValidation = useCallback(() => {
    const err = validateLoginPasswordField(password)
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
      await login(email, password, { rememberMe })
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
      const message = err instanceof Error ? err.message : 'Sign in failed'
      setApiError(message)
      setToast({ type: 'error', message })
    } finally {
      setSubmitting(false)
    }
  }

  const handleGoogleLogin = async (credential) => {
    try {
      await loginWithGoogle(credential, { rememberMe })
      navigate('/', { replace: true })
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Google sign-in failed'
      setApiError(message)
      setToast({ type: 'error', message })
    }
  }

  return (
    <AuthLayout
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
      {toast ? (
        <p className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-200">
          {toast.message}
        </p>
      ) : null}
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
          <PasswordInput
            id="password"
            label="Password"
            autoComplete="current-password"
            value={password}
            onChange={(v) => {
              setPassword(v)
              if (touched.password) runPasswordValidation()
            }}
            onBlur={handleBlurPassword}
            error={touched.password ? errors.password : undefined}
          />
        </MotionDiv>
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 text-sm text-neutral-300">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="size-4 rounded border-neutral-700 bg-neutral-900 text-indigo-500 focus:ring-indigo-500"
            />
            Remember me
          </label>
          <Link to="/forgot-password" className="text-sm text-indigo-400 transition hover:text-indigo-300">
            Forgot password?
          </Link>
        </div>

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
        {signedUpMessage && !apiError && (
          <MotionP
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-200"
            role="status"
          >
            {signedUpMessage}
          </MotionP>
        )}

        <MotionButton
          type="submit"
          disabled={submitting}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-indigo-600 to-violet-600 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 outline-none transition hover:brightness-110 focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-950 disabled:cursor-not-allowed disabled:opacity-60"
          whileHover={submitting ? undefined : { scale: 1.01 }}
          whileTap={submitting ? undefined : { scale: 0.99 }}
        >
          {submitting ? <LoaderCircle className="size-4 animate-spin" aria-hidden /> : <LogIn className="size-4" aria-hidden />}
          {submitting ? 'Signing in…' : 'Sign in'}
        </MotionButton>
        <GoogleAuthButton onCredential={handleGoogleLogin} disabled={submitting} rememberMe={rememberMe} />
      </form>
    </AuthLayout>
  )
}
