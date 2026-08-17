import { createContext, useContext, useEffect, useState } from 'react'
import { getSettings } from '../services/api'

// Placeholder values shown until the backend /settings/public.php endpoint
// responds. These are clearly labelled placeholders, never invented facts —
// the admin dashboard will let the business owner overwrite every field.
const FALLBACK_SETTINGS = {
  business_name: 'United Vich Enterprise',
  tagline: 'Care · Empathy · Reliable',
  phone: '',
  whatsapp_number: '',
  email: '',
  address_line1: '',
  address_line2: '',
  city: '',
  postcode: '',
  country: 'United Kingdom',
  google_maps_url: '',
  instagram_url: '',
  facebook_url: '',
  tiktok_url: '',
  google_business_url: '',
  opening_hours: [
    { day: 'Monday', open: null, close: null, closed: true },
    { day: 'Tuesday', open: null, close: null, closed: true },
    { day: 'Wednesday', open: null, close: null, closed: true },
    { day: 'Thursday', open: null, close: null, closed: true },
    { day: 'Friday', open: null, close: null, closed: true },
    { day: 'Saturday', open: null, close: null, closed: true },
    { day: 'Sunday', open: null, close: null, closed: true },
  ],
  seo_default_title: 'United Vich Enterprise | Premium Women’s Hair & Beauty Salon',
  seo_default_description:
    'Premium women’s hair and beauty salon. Browse our services and book your appointment online.',
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
