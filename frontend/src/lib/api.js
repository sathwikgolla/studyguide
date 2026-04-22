/** Base URL for API (empty = same origin; Vite dev server proxies /auth and /api). */
export function apiUrl(path) {
  const base = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '')
  const p = path.startsWith('/') ? path : `/${path}`
  return `${base}${p}`
}

function authHeaders(token) {
  const headers = {}
  if (token) headers.Authorization = `Bearer ${token}`
  return headers
}

async function parseJsonResponse(res) {
  const raw = await res.text()
  let data = {}
  try {
    data = raw ? JSON.parse(raw) : {}
  } catch {
    data = {}
  }
  return data
}

function throwIfNotOk(res, data) {
  if (res.ok) return
  let message = typeof data.error === 'string' ? data.error : ''
  if (!message) {
    if (res.status === 502 || res.status === 504) {
      message =
        'Bad gateway — the API server is not responding on port 5000. Run `npm run dev` in the backend folder and ensure MongoDB is running.'
    } else {
      message = `Request failed (${res.status})`
    }
  }
  throw new Error(message)
}

export async function getJson(path, options = {}) {
  const { token } = options
  let res
  try {
    res = await fetch(apiUrl(path), {
      method: 'GET',
      headers: { ...authHeaders(token) },
    })
  } catch {
    throw new Error(
      'Network error — cannot reach the API. Start the backend (port 5000) and, in dev, keep Vite’s proxy pointing at it.'
    )
  }
  const data = await parseJsonResponse(res)
  throwIfNotOk(res, data)
  return data
}

export async function postJson(path, body, options = {}) {
  const { token } = options
  let res
  try {
    res = await fetch(apiUrl(path), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...authHeaders(token),
      },
      body: JSON.stringify(body),
    })
  } catch {
    throw new Error(
      'Network error — cannot reach the API. Start the backend (port 5000) and, in dev, keep Vite’s proxy pointing at it.'
    )
  }

  const data = await parseJsonResponse(res)
  throwIfNotOk(res, data)
  return data
}
