import { motion, AnimatePresence } from 'framer-motion'

const MotionP = motion.p

export default function FormField({
  id,
  label,
  type = 'text',
  autoComplete,
  value,
  onChange,
  onBlur,
  error,
  icon: Icon,
  placeholder,
}) {
  return (
    <div className="space-y-1.5">
      <label
        htmlFor={id}
        className="block text-xs font-medium uppercase tracking-wider text-neutral-500"
      >
        {label}
      </label>
      <div className="relative">
        {Icon && (
          <Icon
            className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-neutral-500"
            strokeWidth={1.75}
            aria-hidden
          />
        )}
        <input
          id={id}
          name={id}
          type={type}
          autoComplete={autoComplete}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-error` : undefined}
          className={[
            'w-full rounded-lg border bg-neutral-950/80 py-2.5 text-sm text-white placeholder:text-neutral-600 outline-none transition',
            Icon ? 'pl-10 pr-3' : 'px-3',
            error
              ? 'border-red-500/60 ring-1 ring-red-500/20 focus:border-red-400 focus:ring-red-500/30'
              : 'border-neutral-800 focus:border-indigo-500/60 focus:ring-2 focus:ring-indigo-500/25',
          ].join(' ')}
          placeholder={placeholder ?? ''}
        />
      </div>
      <AnimatePresence mode="wait">
        {error && (
          <MotionP
            id={`${id}-error`}
            role="alert"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.18 }}
            className="text-xs text-red-400"
          >
            {error}
          </MotionP>
        )}
      </AnimatePresence>
    </div>
  )
}
