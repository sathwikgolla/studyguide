const TOKEN_KEY = 'prepflow:token'
const LEGACY_TOKEN_KEY = 'token'

function normalizeBaseUrl() {
  let base = (import.meta.env.VITE_API_URL || '').replace(/\/+$/, '')
  if (base.endsWith('/api')) base = base.slice(0, -4)
  return base
}

/** Base URL for API (empty = same origin; Vite dev server proxies /auth and /api). */
export function apiUrl(path) {
  const p = path.startsWith('/') ? path : `/${path}`
  return `${normalizeBaseUrl()}${p}`
}

function readStoredToken() {
  try {
    return (
      localStorage.getItem(TOKEN_KEY) ||
      localStorage.getItem(LEGACY_TOKEN_KEY) ||
      sessionStorage.getItem(TOKEN_KEY) ||
      sessionStorage.getItem(LEGACY_TOKEN_KEY)
    )
  } catch {
    return null
  }
}

function wait(ms) {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms)
  })
}

function shouldRetry(res, attempt, retries) {
  if (attempt >= retries) return false
  if (!res) return true
  return [408, 429, 500, 502, 503, 504].includes(res.status)
}

async function parseJsonResponse(res) {
  const raw = await res.text()
  if (!raw) return {}
  try {
    return JSON.parse(raw)
  } catch {
    return {}
  }
}

function errorMessage(res, data) {
  if (typeof data.error === 'string' && data.error) return data.error
  if (typeof data.message === 'string' && data.message) return data.message
  if (res.status === 502 || res.status === 504) {
    return 'Bad gateway - the API server is not responding. Check the backend service and MongoDB connection.'
  }
  return `Request failed (${res.status})`
}

export async function requestJson(path, options = {}) {
  const {
    method = 'GET',
    body,
    token,
    auth = true,
    headers = {},
    retries = method === 'GET' ? 1 : 0,
    retryDelayMs = 350,
  } = options

  let lastNetworkError = null
  for (let attempt = 0; attempt <= retries; attempt += 1) {
    let res = null
    try {
      const authToken = auth ? token || readStoredToken() : null
      res = await fetch(apiUrl(path), {
        method,
        headers: {
          ...(body === undefined ? {} : { 'Content-Type': 'application/json' }),
          ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
          ...headers,
        },
        body: body === undefined ? undefined : JSON.stringify(body),
      })
    } catch (err) {
      lastNetworkError = err
      if (shouldRetry(null, attempt, retries)) {
        await wait(retryDelayMs * (attempt + 1))
        continue
      }
      throw new Error(
        "Network error - cannot reach the API. Check VITE_API_URL, Render availability, and Vite's dev proxy."
      )
    }

    const data = await parseJsonResponse(res)
    if (res.ok) return data
    if (shouldRetry(res, attempt, retries)) {
      await wait(retryDelayMs * (attempt + 1))
      continue
    }
    const err = new Error(errorMessage(res, data))
    err.status = res.status
    err.data = data
    throw err
  }

  throw lastNetworkError || new Error('Request failed')
}

export function getJson(path, options = {}) {
  return requestJson(path, { ...options, method: 'GET' })
}

export function postJson(path, body, options = {}) {
  return requestJson(path, { ...options, method: 'POST', body })
}

export function putJson(path, body, options = {}) {
  return requestJson(path, { ...options, method: 'PUT', body })
}

export function deleteJson(path, options = {}) {
  return requestJson(path, { ...options, method: 'DELETE' })
}

export const api = {
  get: getJson,
  post: postJson,
  put: putJson,
  delete: deleteJson,
  request: requestJson,
  url: apiUrl,
}
