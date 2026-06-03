/* eslint-disable react-refresh/only-export-components -- AuthProvider + useAuth pair */
import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import { postJson } from '../lib/api'
import { getUserIdFromToken } from '../lib/jwtUserId'

const TOKEN_KEY = 'prepflow:token'
const TOKEN_STORAGE_KEY = 'prepflow:token-storage'
const LEGACY_TOKEN_KEY = 'token'

const AuthContext = createContext(null)

function readStoredToken() {
  try {
    const preferred = localStorage.getItem(TOKEN_STORAGE_KEY)
    if (preferred === 'session') {
      return sessionStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(LEGACY_TOKEN_KEY)
    }
    return localStorage.getItem(TOKEN_KEY) || localStorage.getItem(LEGACY_TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(LEGACY_TOKEN_KEY)
  } catch {
    return null
  }
}

export function AuthProvider({ children }) {
  const [token, setTokenState] = useState(readStoredToken)

  const setSession = useCallback((newToken, options = {}) => {
    const storage = options.rememberMe ? 'local' : 'session'
    try {
      if (newToken) {
        if (storage === 'local') {
          localStorage.setItem(TOKEN_KEY, newToken)
          localStorage.setItem(LEGACY_TOKEN_KEY, newToken)
          sessionStorage.removeItem(TOKEN_KEY)
          sessionStorage.removeItem(LEGACY_TOKEN_KEY)
        } else {
          sessionStorage.setItem(TOKEN_KEY, newToken)
          sessionStorage.setItem(LEGACY_TOKEN_KEY, newToken)
          localStorage.removeItem(TOKEN_KEY)
          localStorage.removeItem(LEGACY_TOKEN_KEY)
        }
        localStorage.setItem(TOKEN_STORAGE_KEY, storage)
      } else {
        localStorage.removeItem(TOKEN_KEY)
        localStorage.removeItem(LEGACY_TOKEN_KEY)
        sessionStorage.removeItem(TOKEN_KEY)
        sessionStorage.removeItem(LEGACY_TOKEN_KEY)
        localStorage.removeItem(TOKEN_STORAGE_KEY)
      }
    } catch {
      /* ignore quota / private mode */
    }
    setTokenState(newToken || null)
  }, [])

  const login = useCallback(
    async (email, password, options = {}) => {
      const rememberMe = Boolean(options.rememberMe)
      const data = await postJson('/api/auth/login', { email: String(email).trim(), password, rememberMe }, { auth: false })
      if (!data?.token) throw new Error('No token in response')
      setSession(data.token, { rememberMe })
      return { token: data.token }
    },
    [setSession]
  )

  const signup = useCallback(
    async (payload) => {
      const data = await postJson(
        '/api/auth/signup',
        {
          ...payload,
          email: String(payload?.email || '').trim(),
        },
        { auth: false }
      )
      return {
        message:
          data?.message ||
          'Account created successfully. Please sign in with your credentials.',
      }
    },
    []
  )

  const loginWithGoogle = useCallback(
    async (credential, options = {}) => {
      const rememberMe = Boolean(options.rememberMe)
      const data = await postJson('/api/auth/google', { credential, rememberMe }, { auth: false })
      if (!data?.token) throw new Error('No token in response')
      setSession(data.token, { rememberMe })
      return { token: data.token }
    },
    [setSession]
  )

  const requestPasswordReset = useCallback(async (email) => {
    return postJson('/api/auth/forgot-password', { email: String(email).trim() }, { auth: false })
  }, [])

  const resetPassword = useCallback(async (tokenValue, password) => {
    return postJson('/api/auth/reset-password', { token: tokenValue, password }, { auth: false })
  }, [])

  const logout = useCallback(() => {
    setSession(null)
  }, [setSession])

  const userId = useMemo(() => getUserIdFromToken(token), [token])

  const value = useMemo(
    () => ({
      token,
      userId,
      isAuthenticated: Boolean(token),
      login,
      signup,
      loginWithGoogle,
      requestPasswordReset,
      resetPassword,
      logout,
      setSession,
    }),
    [token, userId, login, signup, loginWithGoogle, requestPasswordReset, resetPassword, logout, setSession]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return ctx
}
