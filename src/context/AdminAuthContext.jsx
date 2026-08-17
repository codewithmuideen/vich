import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { adminLogin, adminLogout, adminMe } from '../services/api'

const AdminAuthContext = createContext(null)

export function AdminAuthProvider({ children }) {
  const [admin, setAdmin] = useState(null)
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    const token = sessionStorage.getItem('uv_admin_token')
    if (!token) {
      setChecking(false)
      return
    }
    adminMe()
      .then((data) => setAdmin(data))
      .catch(() => {
        sessionStorage.removeItem('uv_admin_token')
        setAdmin(null)
      })
      .finally(() => setChecking(false))
  }, [])

  const login = useCallback(async (email, password) => {
    const data = await adminLogin({ email, password })
    if (data?.token) sessionStorage.setItem('uv_admin_token', data.token)
    setAdmin(data?.admin || null)
    return data
  }, [])

  const logout = useCallback(async () => {
    try {
      await adminLogout()
    } catch {
      // ignore — clear local session regardless
    }
    sessionStorage.removeItem('uv_admin_token')
    setAdmin(null)
  }, [])

  return (
    <AdminAuthContext.Provider value={{ admin, checking, login, logout, isAuthenticated: !!admin }}>
      {children}
    </AdminAuthContext.Provider>
  )
}

export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext)
  if (!ctx) throw new Error('useAdminAuth must be used within AdminAuthProvider')
  return ctx
}
