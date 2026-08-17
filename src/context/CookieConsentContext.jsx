import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { useSettings } from './SettingsContext'

const STORAGE_KEY = 'uv_cookie_consent'

const DEFAULT_PREFERENCES = {
  necessary: true,
  analytics: false,
  marketing: false,
  preferences: false,
}

function readStoredConsent() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    return { ...DEFAULT_PREFERENCES, ...parsed.preferences, _meta: { decidedAt: parsed.decidedAt } }
  } catch {
    return null
  }
}

const CookieConsentContext = createContext(null)

export function CookieConsentProvider({ children }) {
  const [preferences, setPreferences] = useState(() => readStoredConsent())
  const [bannerOpen, setBannerOpen] = useState(() => readStoredConsent() === null)
  const [preferencesOpen, setPreferencesOpen] = useState(false)
  const { settings } = useSettings()

  const persist = useCallback((prefs) => {
    const record = { preferences: prefs, decidedAt: new Date().toISOString() }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(record))
    setPreferences({ ...prefs, _meta: { decidedAt: record.decidedAt } })
    setBannerOpen(false)
    setPreferencesOpen(false)
  }, [])

  const acceptAll = useCallback(
    () => persist({ necessary: true, analytics: true, marketing: true, preferences: true }),
    [persist],
  )
  const rejectOptional = useCallback(
    () => persist({ necessary: true, analytics: false, marketing: false, preferences: false }),
    [persist],
  )
  const savePreferences = useCallback((prefs) => persist({ ...prefs, necessary: true }), [persist])
  const reopenPreferences = useCallback(() => setPreferencesOpen(true), [])

  // Only ever load GA4/GTM once the visitor has actively opted into analytics.
  useEffect(() => {
    if (!preferences?.analytics) return
    const gaId = settings.analytics_ga4_id
    if (!gaId || document.getElementById('uv-ga4-script')) return

    const script = document.createElement('script')
    script.id = 'uv-ga4-script'
    script.async = true
    script.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`
    document.head.appendChild(script)

    window.dataLayer = window.dataLayer || []
    function gtag() {
      window.dataLayer.push(arguments)
    }
    gtag('js', new Date())
    gtag('config', gaId, { anonymize_ip: true })
  }, [preferences?.analytics, settings.analytics_ga4_id])

  const value = {
    preferences: preferences || DEFAULT_PREFERENCES,
    hasDecided: preferences !== null,
    bannerOpen,
    preferencesOpen,
    acceptAll,
    rejectOptional,
    savePreferences,
    reopenPreferences,
    closePreferences: () => setPreferencesOpen(false),
  }

  return <CookieConsentContext.Provider value={value}>{children}</CookieConsentContext.Provider>
}

export function useCookieConsent() {
  const ctx = useContext(CookieConsentContext)
  if (!ctx) throw new Error('useCookieConsent must be used within CookieConsentProvider')
  return ctx
}
