import { createContext, useContext, useState } from 'react'

const AuthContext = createContext(null)

const API_BASE = 'http://localhost:8080/api/v1'

export function AuthProvider({ children }) {

  const [user, setUser] = useState(null)
  const [token, setToken] = useState(localStorage.getItem('accessToken') || null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const login = async (email, password) => {
    setLoading(true)
    setError('')

    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      const data = await res.json()
      console.log("LOGIN RESPONSE:", data)

      if (!res.ok) {
        setError(data?.message || 'Invalid email or password')
        setLoading(false)
        return false
      }

      // ✅ SIMPLE (adjust if needed)
      const accessToken =
        data?.accessToken ||
        data?.tokens?.accessToken ||
        data?.data?.attributes?.tokens?.accessToken

      const userData =
        data?.user ||
        data?.data?.attributes?.user

      if (!accessToken) {
        setError("No token received")
        setLoading(false)
        return false
      }

      setToken(accessToken)
      setUser(userData)

      localStorage.setItem('accessToken', accessToken)

      setLoading(false)
      return true

    } catch (err) {
      console.log(err)
      setError('Server not reachable (check backend)')
      setLoading(false)
      return false
    }
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem('accessToken')
  }

  const authFetch = (url, options = {}) => {
    const accessToken = token || localStorage.getItem('accessToken')

    return fetch(`${API_BASE}${url}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
        ...(options.headers || {}),
      },
    })
  }

  return (
    <AuthContext.Provider value={{
      user,
      token,
      login,
      logout,
      loading,
      error,
      authFetch,
      isAdmin: user?.role === 'admin',
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)