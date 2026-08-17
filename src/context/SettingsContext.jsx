import { createContext, useContext, useEffect, useState } from 'react'
import { getSettings } from '../services/api'

// Fallback values shown until the backend /settings/public.php endpoint
// responds — used mainly for local frontend development before the PHP
// backend is deployed. These mirror the real starter values seeded in
// backend/database/seed.sql; anything still genuinely unconfirmed (street
// address, phone, WhatsApp number) stays blank rather than invented, and the
// admin dashboard lets the business owner overwrite every field.
const FALLBACK_SETTINGS = {
  business_name: 'United Vich Enterprise',
  tagline: 'Care · Empathy · Reliable',
  phone: '',
  whatsapp_number: '',
  email: 'info@vichsaloon.co.uk',
  enquiries_email: 'enquiries@vichsaloon.co.uk',
  address_line1: '',
  address_line2: '',
  city: 'London',
  postcode: '',
  country: 'United Kingdom',
  google_maps_url: '',
  instagram_url: '',
  facebook_url: '',
  tiktok_url: '',
  google_business_url: '',
  opening_hours: [
    { day: 'Monday', open: '09:00', close: '18:00', closed: false },
    { day: 'Tuesday', open: '09:00', close: '18:00', closed: false },
    { day: 'Wednesday', open: '09:00', close: '18:00', closed: false },
    { day: 'Thursday', open: '09:00', close: '18:00', closed: false },
    { day: 'Friday', open: '09:00', close: '18:00', closed: false },
    { day: 'Saturday', open: null, close: null, closed: true },
    { day: 'Sunday', open: null, close: null, closed: true },
  ],
  seo_default_title: 'United Vich Enterprise | Premium Women’s Hair & Beauty Salon',
  seo_default_description:
    'Premium women’s hair and beauty salon in London. Browse our services and book your appointment online.',
  seo_default_og_image: '/brand/logo.png',
  analytics_ga4_id: '',
  analytics_gtm_id: '',
  isPlaceholder: true,
}

const SettingsContext = createContext({ settings: FALLBACK_SETTINGS, loading: true })

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(FALLBACK_SETTINGS)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    getSettings()
      .then((data) => {
        if (!cancelled && data) setSettings({ ...FALLBACK_SETTINGS, ...data, isPlaceholder: false })
      })
      .catch(() => {
        // Backend not reachable yet — keep clearly-marked placeholder settings.
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <SettingsContext.Provider value={{ settings, loading }}>{children}</SettingsContext.Provider>
  )
}

export function useSettings() {
  return useContext(SettingsContext)
}
