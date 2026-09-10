import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { supabase } from '../services/supabaseClient'
import { adminLogin as apiAdminLogin } from '../services/api'

const AdminAuthContext = createContext(null)

export function AdminAuthProvider({ children }) {
  const [admin, setAdmin] = useState(null)
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    let cancelled = false

    async function hydrateFromSession(session) {
      if (!session) {
        if (!cancelled) {
          setAdmin(null)
          setChecking(false)
        }
        return
      }
      const { data } = await supabase.from('admin_profiles').select('*').eq('user_id', session.user.id).maybeSingle()
      if (cancelled) return
      setAdmin(data && data.status === 'active' ? { ...data, id: data.user_id, email: session.user.email } : null)
      setChecking(false)
    }

    supabase.auth.getSession().then(({ data }) => hydrateFromSession(data.session))

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => hydrateFromSession(session))

    return () => {
      cancelled = true
      subscription.unsubscribe()
    }
  }, [])

  const login = useCallback(async (email, password) => {
    const data = await apiAdminLogin({ email, password })
    setAdmin(data.admin)
    return data
  }, [])

  const logout = useCallback(async () => {
    await supabase.auth.signOut()
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
