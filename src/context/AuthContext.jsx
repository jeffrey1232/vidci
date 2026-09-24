/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { authService } from '../services/auth.js'
import { getSessionUser, subscribeStore } from '../services/mockStore.js'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => getSessionUser())
  const [loading, setLoading] = useState(false)

  useEffect(() => subscribeStore(() => setUser(getSessionUser())), [])

  const value = useMemo(
    () => ({
      user,
      loading,
      isAdmin: user?.role === 'ADMIN',
      async login(payload) {
        setLoading(true)
        try {
          const result = await authService.login(payload)
          setUser(result.user)
          return result.user
        } finally {
          setLoading(false)
        }
      },
      async register(payload) {
        setLoading(true)
        try {
          const result = await authService.register(payload)
          setUser(result.user)
          return result.user
        } finally {
          setLoading(false)
        }
      },
      logout() {
        authService.logout()
        setUser(null)
      },
      async updateProfile(payload) {
        if (!user) return
        const next = await authService.updateProfile(user.id, payload)
        setUser(next)
        return next
      },
    }),
    [user, loading],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
