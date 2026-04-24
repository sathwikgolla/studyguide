import { useState, useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { LoaderCircle, UserPlus, Mail, User } from 'lucide-react'
import AuthLayout from '../components/auth/AuthLayout'
import FormField from '../components/auth/FormField'
import PasswordInput from '../components/auth/PasswordInput'
import PasswordStrengthMeter from '../components/auth/PasswordStrengthMeter'
import GoogleAuthButton from '../components/auth/GoogleAuthButton'
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

export default function SignupPage() {
  const navigate = useNavigate()
  const { signup, loginWithGoogle } = useAuth()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})
  const [apiError, setApiError] = useState(null)
  const [successMessage, setSuccessMessage] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [toast, setToast] = useState(null)

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

  const runConfirmValidation = useCallback(() => {
    const err = !confirmPassword ? 'Confirm your password' : confirmPassword !== password ? 'Passwords do not match' : null
    setErrors((e) => ({ ...e, confirmPassword: err || undefined }))
    return !err
  }, [confirmPassword, password])

  const handleBlurConfirmPassword = () => {
    setTouched((t) => ({ ...t, confirmPassword: true }))
    runConfirmValidation()
  }

  const handleSubmit = async (ev) => {
    ev.preventDefault()
    setApiError(null)
    setSuccessMessage(null)
    setTouched({ email: true, password: true, confirmPassword: true })
    const okEmail = runEmailValidation()
    const okPass = runPasswordValidation()
    const okConfirm = runConfirmValidation()
    if (!okEmail || !okPass || !okConfirm) return

    setSubmitting(true)
    try {
      const result = await signup({ name: String(name).trim(), email, password })
      setSuccessMessage(result?.message || 'Account created. Please sign in.')
      setToast({ type: 'success', message: 'Account created successfully.' })
      setTimeout(() => {
        navigate('/login', { replace: true, state: { justSignedUp: true } })
      }, 900)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Could not create account'
      setApiError(message)
      setToast({ type: 'error', message })
    } finally {
      setSubmitting(false)
    }
  }

  const handleGoogleLogin = async (credential) => {
    try {
      await loginWithGoogle(credential, { rememberMe: true })
      navigate('/', { replace: true })
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Google sign-in failed'
      setApiError(message)
      setToast({ type: 'error', message })
    }
  }

  const canSubmit = !submitting && email && password && confirmPassword && confirmPassword === password

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Start organizing study tracks on PrepFlow."
      footer={
        <p className="mt-6 text-center text-sm text-neutral-500">
          Already registered?{' '}
          <Link
            to="/login"
            className="font-medium text-indigo-400 transition hover:text-indigo-300"
          >
            Sign in
          </Link>
        </p>
      }
    >
      {toast ? (
        <p
          className={`mb-4 rounded-lg border px-3 py-2 text-sm ${
            toast.type === 'success'
              ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-200'
              : 'border-red-500/30 bg-red-500/10 text-red-200'
          }`}
        >
          {toast.message}
        </p>
      ) : null}
      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
        <MotionDiv custom={0} variants={fieldMotion} initial="hidden" animate="visible">
          <FormField
            id="signup-name"
            label="Name"
            type="text"
            autoComplete="name"
            value={name}
            onChange={setName}
            icon={User}
            placeholder="Your name"
          />
        </MotionDiv>
        <MotionDiv custom={1} variants={fieldMotion} initial="hidden" animate="visible">
          <FormField
            id="signup-email"
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
        <MotionDiv custom={2} variants={fieldMotion} initial="hidden" animate="visible">
          <PasswordInput
            id="signup-password"
            label="Password"
            autoComplete="new-password"
            value={password}
            onChange={(v) => {
              setPassword(v)
              if (touched.password) runPasswordValidation()
              if (touched.confirmPassword) runConfirmValidation()
            }}
            onBlur={handleBlurPassword}
            error={touched.password ? errors.password : undefined}
          />
        </MotionDiv>
        <MotionDiv custom={3} variants={fieldMotion} initial="hidden" animate="visible">
          <PasswordInput
            id="signup-confirm-password"
            label="Confirm Password"
            autoComplete="new-password"
            value={confirmPassword}
            onChange={(v) => {
              setConfirmPassword(v)
              if (touched.confirmPassword) runConfirmValidation()
            }}
            onBlur={handleBlurConfirmPassword}
            error={touched.confirmPassword ? errors.confirmPassword : undefined}
          />
        </MotionDiv>
        <PasswordStrengthMeter password={password} />

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
        {successMessage && (
          <MotionP
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-200"
            role="status"
          >
            {successMessage}
          </MotionP>
        )}

        <MotionButton
          type="submit"
          disabled={!canSubmit}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-indigo-600 to-violet-600 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 outline-none transition hover:brightness-110 focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-950 disabled:cursor-not-allowed disabled:opacity-60"
          whileHover={!canSubmit ? undefined : { scale: 1.01 }}
          whileTap={!canSubmit ? undefined : { scale: 0.99 }}
        >
          {submitting ? <LoaderCircle className="size-4 animate-spin" aria-hidden /> : <UserPlus className="size-4" aria-hidden />}
          {submitting ? 'Creating account…' : 'Create account'}
        </MotionButton>
        <GoogleAuthButton onCredential={handleGoogleLogin} disabled={submitting} />
      </form>
    </AuthLayout>
  )
}
