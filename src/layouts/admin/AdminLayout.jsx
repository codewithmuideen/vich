import { useState } from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import {
  PiSquaresFourLight,
  PiCalendarCheckLight,
  PiScissorsLight,
  PiTagLight,
  PiClockLight,
  PiProhibitLight,
  PiImagesLight,
  PiStarLight,
  PiUsersLight,
  PiNewspaperLight,
  PiGearLight,
  PiListLight,
  PiXLight,
  PiSignOutLight,
} from 'react-icons/pi'
import { useAdminAuth } from '../../context/AdminAuthContext'

const NAV = [
  { to: '/admin', label: 'Dashboard', icon: PiSquaresFourLight, end: true },
  { to: '/admin/appointments', label: 'Appointments', icon: PiCalendarCheckLight },
  { to: '/admin/services', label: 'Services', icon: PiScissorsLight },
  { to: '/admin/categories', label: 'Categories', icon: PiTagLight },
  { to: '/admin/availability', label: 'Availability', icon: PiClockLight },
  { to: '/admin/blocked-dates', label: 'Blocked Dates', icon: PiProhibitLight },
  { to: '/admin/gallery', label: 'Gallery', icon: PiImagesLight },
  { to: '/admin/reviews', label: 'Reviews', icon: PiStarLight },
  { to: '/admin/customers', label: 'Customers', icon: PiUsersLight },
  { to: '/admin/journal', label: 'Journal', icon: PiNewspaperLight },
  { to: '/admin/settings', label: 'Settings', icon: PiGearLight },
]

export default function AdminLayout() {
  const { admin, logout } = useAdminAuth()
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="flex min-h-screen bg-ivory font-body text-dark">
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 shrink-0 transform bg-forest-dark text-ivory transition-transform lg:static lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-20 items-center gap-3 border-b border-ivory/10 px-6">
          <img src="/brand/logo-light.png" alt="United Vich Enterprise" className="h-9 w-9 object-contain" />
          <span className="font-display text-lg">Admin</span>
          <button className="ml-auto lg:hidden" onClick={() => setMobileOpen(false)} aria-label="Close menu">
            <PiXLight className="text-xl" />
          </button>
        </div>
        <nav className="flex flex-col gap-1 p-4" aria-label="Admin navigation">
          {NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
                  isActive ? 'bg-gold text-ivory' : 'text-ivory/70 hover:bg-ivory/5 hover:text-ivory'
                }`
              }
            >
              <item.icon className="text-lg" aria-hidden="true" />
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      {mobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-dark/50 lg:hidden"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      <div className="flex flex-1 flex-col">
        <header className="flex h-20 items-center justify-between border-b border-forest/10 bg-white px-6">
          <button className="lg:hidden" onClick={() => setMobileOpen(true)} aria-label="Open menu">
            <PiListLight className="text-2xl text-forest" />
          </button>
          <span className="hidden font-display text-lg text-forest lg:block">United Vich Admin</span>
          <div className="flex items-center gap-4">
            <span className="font-body text-sm text-dark/60">{admin?.name || admin?.email}</span>
            <button
              onClick={logout}
              className="flex items-center gap-2 border border-forest/15 px-4 py-2 text-xs font-semibold uppercase tracking-[0.1em] text-forest hover:bg-forest hover:text-ivory"
            >
              <PiSignOutLight /> Log Out
            </button>
          </div>
        </header>
        <main className="flex-1 p-6 lg:p-10">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
