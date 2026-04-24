import { motion } from 'framer-motion'

const MotionDiv = motion.div

function getChecks(password) {
  return {
    minLength: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /\d/.test(password),
    special: /[^A-Za-z\d]/.test(password),
  }
}

function getStrength(password) {
  const checks = getChecks(password)
  const score = Object.values(checks).filter(Boolean).length
  if (score <= 2) return { label: 'Weak', color: 'bg-red-500', width: '33%' }
  if (score <= 4) return { label: 'Medium', color: 'bg-amber-500', width: '66%' }
  return { label: 'Strong', color: 'bg-emerald-500', width: '100%' }
}

export default function PasswordStrengthMeter({ password }) {
  const checks = getChecks(password)
  const strength = getStrength(password)

  return (
    <div className="space-y-2 rounded-lg border border-white/10 bg-white/[0.03] p-3">
      <div className="flex items-center justify-between text-xs">
        <span className="text-neutral-400">Password strength</span>
        <span className="font-medium text-neutral-200">{strength.label}</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-neutral-800">
        <MotionDiv
          className={`h-full ${strength.color}`}
          animate={{ width: strength.width }}
          transition={{ duration: 0.25 }}
        />
      </div>
      <ul className="grid gap-1 text-xs text-neutral-400">
        <li className={checks.minLength ? 'text-emerald-300' : ''}>At least 8 characters</li>
        <li className={checks.uppercase ? 'text-emerald-300' : ''}>One uppercase letter</li>
        <li className={checks.lowercase ? 'text-emerald-300' : ''}>One lowercase letter</li>
        <li className={checks.number ? 'text-emerald-300' : ''}>One number</li>
        <li className={checks.special ? 'text-emerald-300' : ''}>One special character</li>
      </ul>
    </div>
  )
}
