export function isValidEmail(email) {
  const trimmed = String(email).trim()
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)
}

export function validateEmailField(email) {
  const trimmed = String(email).trim()
  if (!trimmed) return 'Email is required'
  if (!isValidEmail(trimmed)) return 'Enter a valid email address'
  return null
}

export function validatePasswordField(password) {
  if (!password) return 'Password is required'
  if (password.length < 8) return 'Use at least 8 characters'
  if (!/[A-Za-z]/.test(password)) return 'Include at least one letter'
  if (!/\d/.test(password)) return 'Include at least one number'
  return null
}
