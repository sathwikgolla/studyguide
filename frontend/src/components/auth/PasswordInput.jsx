import { useState } from 'react'
import { Eye, EyeOff, Lock } from 'lucide-react'
import FormField from './FormField'

export default function PasswordInput({
  id,
  label,
  autoComplete,
  value,
  onChange,
  onBlur,
  error,
  placeholder = '••••••••',
}) {
  const [visible, setVisible] = useState(false)

  return (
    <div className="relative">
      <FormField
        id={id}
        label={label}
        type={visible ? 'text' : 'password'}
        autoComplete={autoComplete}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        error={error}
        icon={Lock}
        placeholder={placeholder}
      />
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        className="absolute right-3 top-[2.12rem] rounded-md p-1 text-neutral-400 transition hover:text-neutral-200"
        aria-label={visible ? 'Hide password' : 'Show password'}
      >
        {visible ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
      </button>
    </div>
  )
}
