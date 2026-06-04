import { createContext, useContext, useState, useEffect } from 'react'
import { api, getTokens, setTokens, clearTokens } from '../lib/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user,    setUser]    = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const tokens = getTokens()
    if (!tokens?.access) { setLoading(false); return }
    api.profile()
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(d => setUser(d.user))
      .catch(() => clearTokens())
      .finally(() => setLoading(false))
  }, [])

  async function login(username, password) {
    const res  = await api.login(username, password)
    const data = await res.json()
    if (!res.ok) throw new Error(data.errors?.non_field_errors?.[0] || 'Login failed')
    setTokens(data.tokens)
    setUser(data.user)
    return data.user
  }

  async function logout() {
    const tokens = getTokens()
    if (tokens?.refresh) await api.logout(tokens.refresh).catch(() => {})
    clearTokens()
    setUser(null)
  }

  function loginWithData(tokens, userData) {
    setTokens(tokens)
    setUser(userData)
  }

  const isAuthenticated = !!user
  const canManage       = user?.role === 'owner' || user?.role === 'admin'

  return (
    <AuthContext.Provider value={{ user, loading, login, loginWithData, logout, isAuthenticated, canManage }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
