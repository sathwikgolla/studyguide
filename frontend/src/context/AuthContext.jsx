/* eslint-disable react-refresh/only-export-components -- AuthProvider + useAuth pair */
import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import { postJson } from '../lib/api'
import { getUserIdFromToken } from '../lib/jwtUserId'

const TOKEN_KEY = 'prepflow:token'

const AuthContext = createContext(null)

function readStoredToken() {
  try {
    return localStorage.getItem(TOKEN_KEY)
  } catch {
    return null
  }
}

export function AuthProvider({ children }) {
  const [token, setTokenState] = useState(readStoredToken)

  const setSession = useCallback((newToken) => {
    try {
      if (newToken) localStorage.setItem(TOKEN_KEY, newToken)
      else localStorage.removeItem(TOKEN_KEY)
    } catch {
      /* ignore quota / private mode */
    }
    setTokenState(newToken || null)
  }, [])

  const login = useCallback(
    async (email, password) => {
      const data = await postJson('/auth/login', { email, password })
      if (!data?.token) throw new Error('No token in response')
      setSession(data.token)
      return { token: data.token }
    },
    [setSession]
  )

  const signup = useCallback(
    async (email, password) => {
      const data = await postJson('/auth/signup', { email, password })
      if (!data?.token) throw new Error('No token in response')
      setSession(data.token)
      return { token: data.token }
    },
    [setSession]
  )

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
      logout,
      setSession,
    }),
    [token, userId, login, signup, logout, setSession]
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
