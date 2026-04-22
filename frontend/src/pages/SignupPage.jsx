import { useState, useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { UserPlus, Mail, Lock } from 'lucide-react'
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

export default function SignupPage() {
  const navigate = useNavigate()
  const { signup } = useAuth()

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
      await signup(email, password)
      navigate('/', { replace: true })
    } catch (err) {
      setApiError(err instanceof Error ? err.message : 'Could not create account')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AuthScreen
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
      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
        <MotionDiv custom={0} variants={fieldMotion} initial="hidden" animate="visible">
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
        <MotionDiv custom={1} variants={fieldMotion} initial="hidden" animate="visible">
          <FormField
            id="signup-password"
            label="Password"
            type="password"
            autoComplete="new-password"
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
          <UserPlus className="size-4" aria-hidden />
          {submitting ? 'Creating account…' : 'Create account'}
        </MotionButton>
      </form>
    </AuthScreen>
  )
}
