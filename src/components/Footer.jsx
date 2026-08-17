import { Link } from 'react-router-dom'
import { PiInstagramLogoLight, PiFacebookLogoLight, PiTiktokLogoLight, PiXLogoLight, PiMapPinLight, PiPhoneLight, PiEnvelopeSimpleLight } from 'react-icons/pi'
import { useSettings } from '../context/SettingsContext'
import Button from './Button'

const SERVICE_LINKS = [
  { label: 'Braids', to: '/services?category=braids' },
  { label: 'Wig Installation', to: '/services?category=wigs' },
  { label: 'Natural Hair', to: '/services?category=natural-hair' },
  { label: 'Weaves', to: '/services?category=weaves' },
]

const QUICK_LINKS = [
  { label: 'About Us', to: '/about' },
  { label: 'Gallery', to: '/gallery' },
  { label: 'Reviews', to: '/reviews' },
  { label: 'Journal', to: '/journal' },
  { label: 'FAQ', to: '/faq' },
]

const LEGAL_LINKS = [
  { label: 'Privacy Policy', to: '/privacy-policy' },
  { label: 'Cookie Policy', to: '/cookie-policy' },
  { label: 'Terms & Conditions', to: '/terms' },
]

function formatHours(hours) {
  if (!hours?.length) return null
  return hours.map((h) => (
    <li key={h.day} className="flex items-center justify-between gap-6 text-ivory/70">
      <span>{h.day}</span>
      <span>{h.closed ? 'Closed' : `${h.open} – ${h.close}`}</span>
    </li>
  ))
}

export default function Footer() {
  const { settings } = useSettings()
  const year = new Date().getFullYear()

  return (
    <footer className="bg-forest-dark text-ivory">
      <div className="container-edit grid grid-cols-1 gap-12 py-16 sm:grid-cols-2 lg:grid-cols-5">
        <div className="flex flex-col gap-4 lg:col-span-2">
          <Link to="/" className="flex items-center gap-3">
            <img src="/brand/logo.png" alt="United Vich Enterprise" className="h-16 w-16 object-contain" />
            <span className="font-display text-xl text-ivory">United Vich Enterprise</span>
          </Link>
          <p className="max-w-sm font-body text-sm leading-relaxed text-ivory/65">
            A premium women&rsquo;s hair and beauty salon built on care, empathy and reliability. Browse our
            styles and book your next appointment online.
          </p>
          <div className="mt-2 flex items-center gap-3">
            {settings.instagram_url && (
              <a href={settings.instagram_url} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="flex h-10 w-10 items-center justify-center border border-ivory/20 transition-colors hover:border-gold-light hover:text-gold-light">
                <PiInstagramLogoLight className="text-lg" />
              </a>
            )}
            {settings.facebook_url && (
              <a href={settings.facebook_url} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="flex h-10 w-10 items-center justify-center border border-ivory/20 transition-colors hover:border-gold-light hover:text-gold-light">
                <PiFacebookLogoLight className="text-lg" />
              </a>
            )}
            {settings.tiktok_url && (
              <a href={settings.tiktok_url} target="_blank" rel="noopener noreferrer" aria-label="TikTok" className="flex h-10 w-10 items-center justify-center border border-ivory/20 transition-colors hover:border-gold-light hover:text-gold-light">
                <PiTiktokLogoLight className="text-lg" />
              </a>
            )}
            {settings.x_url && (
              <a href={settings.x_url} target="_blank" rel="noopener noreferrer" aria-label="X (Twitter)" className="flex h-10 w-10 items-center justify-center border border-ivory/20 transition-colors hover:border-gold-light hover:text-gold-light">
                <PiXLogoLight className="text-lg" />
              </a>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <h3 className="font-body text-xs font-semibold uppercase tracking-[0.2em] text-gold-light">Services</h3>
          <ul className="flex flex-col gap-3 font-body text-sm text-ivory/70">
            {SERVICE_LINKS.map((l) => (
              <li key={l.label}>
                <Link to={l.to} className="transition-colors hover:text-gold-light">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col gap-4">
          <h3 className="font-body text-xs font-semibold uppercase tracking-[0.2em] text-gold-light">Explore</h3>
          <ul className="flex flex-col gap-3 font-body text-sm text-ivory/70">
            {QUICK_LINKS.map((l) => (
              <li key={l.label}>
                <Link to={l.to} className="transition-colors hover:text-gold-light">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col gap-4">
          <h3 className="font-body text-xs font-semibold uppercase tracking-[0.2em] text-gold-light">Visit Us</h3>
          <ul className="flex flex-col gap-3 font-body text-sm text-ivory/70">
            {settings.address_line1 ? (
              <li className="flex items-start gap-2">
                <PiMapPinLight className="mt-0.5 shrink-0 text-gold-light" />
                <span>
                  {settings.address_line1}
                  {settings.city ? `, ${settings.city}` : ''} {settings.postcode}
                </span>
              </li>
            ) : settings.city ? (
              <li className="flex items-start gap-2">
                <PiMapPinLight className="mt-0.5 shrink-0 text-gold-light" />
                <span>{settings.city}, {settings.country || 'United Kingdom'}</span>
              </li>
            ) : (
              <li className="italic text-ivory/40">Address to be confirmed</li>
            )}
            {settings.phone ? (
              <li className="flex items-center gap-2">
                <PiPhoneLight className="text-gold-light" />
                <a href={`tel:${settings.phone}`} className="hover:text-gold-light">
                  {settings.phone}
                </a>
              </li>
            ) : (
              <li className="italic text-ivory/40">Phone to be confirmed</li>
            )}
            {settings.email ? (
              <li className="flex items-center gap-2">
                <PiEnvelopeSimpleLight className="text-gold-light" />
                <a href={`mailto:${settings.email}`} className="hover:text-gold-light">
                  {settings.email}
                </a>
              </li>
            ) : (
              <li className="italic text-ivory/40">Email to be confirmed</li>
            )}
          </ul>
          {formatHours(settings.opening_hours) && (
            <ul className="mt-2 flex flex-col gap-1 border-t border-ivory/10 pt-4 font-body text-xs">
              {formatHours(settings.opening_hours)}
            </ul>
          )}
        </div>
      </div>

      <div className="container-edit flex flex-col items-center gap-4 border-t border-ivory/10 py-8 sm:flex-row sm:justify-between">
        <Button to="/book-appointment" variant="gold" size="md">
          Book Appointment
        </Button>
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 font-body text-xs text-ivory/50">
          <span>&copy; {year} United Vich Enterprise. All rights reserved.</span>
          {LEGAL_LINKS.map((l) => (
            <Link key={l.to} to={l.to} className="hover:text-gold-light">
              {l.label}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  )
}
