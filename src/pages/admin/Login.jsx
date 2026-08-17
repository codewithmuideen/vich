import { useState } from 'react'
import { useNavigate, useLocation, Navigate } from 'react-router-dom'
import SEO from '../../components/SEO'
import Button from '../../components/Button'
import { useAdminAuth } from '../../context/AdminAuthContext'

export default function AdminLogin() {
  const { login, isAuthenticated } = useAdminAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [form, setForm] = useState({ email: '', password: '' })
  const [status, setStatus] = useState('idle')
  const [error, setError] = useState('')

  if (isAuthenticated) {
    return <Navigate to={location.state?.from?.pathname || '/admin'} replace />
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setStatus('submitting')
    setError('')
    try {
      await login(form.email, form.password)
      navigate(location.state?.from?.pathname || '/admin', { replace: true })
    } catch (err) {
      setStatus('idle')
      setError(err.message || 'Invalid email or password.')
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-forest px-4">
      <SEO title="Admin Login" description="United Vich Enterprise admin login." path="/admin/login" noIndex />
      <div className="w-full max-w-sm border border-ivory/10 bg-ivory p-10">
        <div className="mb-8 flex flex-col items-center gap-3 text-center">
          <img src="/brand/logo.png" alt="United Vich Enterprise" className="h-14 w-14 object-contain" />
          <h1 className="font-display text-2xl text-forest">Admin Login</h1>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <label htmlFor="email" className="font-body text-xs font-semibold uppercase tracking-[0.14em] text-forest">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              autoComplete="username"
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              className="border border-forest/20 bg-white px-4 py-3 font-body text-sm outline-none focus:border-gold"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="password" className="font-body text-xs font-semibold uppercase tracking-[0.14em] text-forest">
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              autoComplete="current-password"
              value={form.password}
              onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
              className="border border-forest/20 bg-white px-4 py-3 font-body text-sm outline-none focus:border-gold"
            />
          </div>

          {error && <p className="font-body text-sm text-red-700">{error}</p>}

          <Button type="submit" variant="primary" size="lg" disabled={status === 'submitting'} className="w-full">
            {status === 'submitting' ? 'Signing In…' : 'Sign In'}
          </Button>
        </form>
      </div>
    </div>
  )
}
