import { createContext, useContext, useEffect, useState } from 'react'
import api from '../api'

// Holds "who is logged in" so any component can read it with useAuth().
const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // On page load: if a token is saved, ask the backend who we are.
  useEffect(() => {
    if (!localStorage.getItem('token')) {
      setLoading(false)
      return
    }
    api.get('/api/auth/me')
      .then((res) => setUser(res.data))
      .catch(() => localStorage.removeItem('token'))
      .finally(() => setLoading(false))
  }, [])

  // Called after email login, OTP verification or Google login.
  async function loginWithToken(token) {
    localStorage.setItem('token', token)
    const res = await api.get('/api/auth/me')
    setUser(res.data)
  }

  function logout() {
    localStorage.removeItem('token')
    setUser(null)
  }

  const isAdmin = user?.role === 'ADMIN'

  return (
    <AuthContext.Provider value={{ user, isAdmin, loading, loginWithToken, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
