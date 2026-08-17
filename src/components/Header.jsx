import { useEffect, useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { PiListLight, PiXLight } from 'react-icons/pi'
import Button from './Button'

const NAV_LINKS = [
  { to: '/services', label: 'Services' },
  { to: '/gallery', label: 'Gallery' },
  { to: '/about', label: 'About' },
  { to: '/reviews', label: 'Reviews' },
  { to: '/journal', label: 'Journal' },
  { to: '/contact', label: 'Contact' },
]

export default function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setMenuOpen(false)
  }, [location.pathname])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [menuOpen])

  const isHome = location.pathname === '/'
  const transparent = isHome && !scrolled && !menuOpen

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 w-full transition-colors duration-500 ${
        transparent ? 'bg-transparent' : 'bg-ivory/95 backdrop-blur-sm shadow-[0_1px_0_0_rgba(0,56,34,0.08)]'
      }`}
    >
      <div className="container-edit flex h-20 items-center justify-between">
        <NavLink to="/" className="flex items-center gap-3" aria-label="United Vich Enterprise home">
          <img src="/brand/logo.png" alt="United Vich Enterprise" className="h-11 w-11 object-contain" />
          <span
            className={`hidden font-display text-lg tracking-wide sm:block ${
              transparent ? 'text-ivory' : 'text-forest'
            }`}
          >
            United Vich <span className="text-gold-light">Enterprise</span>
          </span>
        </NavLink>

        <nav className="hidden items-center gap-8 lg:flex" aria-label="Primary">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `font-body text-xs font-semibold uppercase tracking-[0.16em] transition-colors ${
                  transparent ? 'text-ivory/90 hover:text-gold-light' : 'text-forest hover:text-gold'
                } ${isActive ? (transparent ? '!text-gold-light' : '!text-gold') : ''}`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <div className="hidden sm:block">
            <Button to="/book-appointment" variant={transparent ? 'gold' : 'primary'} size="md">
              Book Appointment
            </Button>
          </div>
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            className={`flex h-11 w-11 items-center justify-center border lg:hidden ${
              transparent ? 'border-ivory/40 text-ivory' : 'border-forest/20 text-forest'
            }`}
          >
            {menuOpen ? <PiXLight className="text-2xl" /> : <PiListLight className="text-2xl" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden bg-ivory lg:hidden"
          >
            <nav className="container-edit flex flex-col gap-1 pb-8 pt-2" aria-label="Mobile">
              {NAV_LINKS.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={({ isActive }) =>
                    `border-b border-forest/10 py-4 font-display text-2xl ${
                      isActive ? 'text-gold' : 'text-forest'
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              ))}
              <Button to="/book-appointment" variant="primary" size="lg" className="mt-6 w-full">
                Book Appointment
              </Button>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sticky mobile booking CTA */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-forest/10 bg-ivory/95 p-3 backdrop-blur-sm sm:hidden">
        <Button to="/book-appointment" variant="primary" size="md" className="w-full">
          Book Appointment
        </Button>
      </div>
    </header>
  )
}
