/** Read `userId` from a PrepFlow JWT (no signature verification — server validates on API calls). */
export function getUserIdFromToken(token) {
  if (!token || typeof token !== 'string') return null
  try {
    const parts = token.split('.')
    if (parts.length < 2) return null
    const json = atob(parts[1].replace(/-/g, '+').replace(/_/g, '/'))
    const payload = JSON.parse(json)
    return typeof payload.userId === 'string' ? payload.userId : null
  } catch {
    return null
  }
}
