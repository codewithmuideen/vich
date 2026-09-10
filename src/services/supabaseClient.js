import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  // eslint-disable-next-line no-console
  console.error(
    'Missing VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY. Copy frontend/.env.example to frontend/.env.local and fill in your Supabase project credentials.',
  )
}

// Bounds every request so an unreachable/misconfigured Supabase project
// fails over to each page's fallback content in a few seconds rather than
// hanging on a slow DNS/connection timeout for a minute.
function fetchWithTimeout(url, options = {}) {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), 8000)
  return fetch(url, { ...options, signal: options.signal || controller.signal }).finally(() => clearTimeout(timer))
}

// createClient() throws synchronously on an empty/invalid URL — falling
// back to a syntactically-valid placeholder here means a misconfigured or
// not-yet-deployed environment still renders the site (every real request
// simply fails and each page's fallback/demo content takes over), instead
// of a blank white screen.
export const supabase = createClient(SUPABASE_URL || 'https://placeholder.supabase.co', SUPABASE_ANON_KEY || 'placeholder-anon-key', {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    storageKey: 'uv-admin-auth',
  },
  global: { fetch: fetchWithTimeout },
})

// A random, non-identifying id kept in localStorage so gallery likes / rate
// limiting can recognise "the same browser" without ever touching real PII.
export function getClientFingerprint() {
  const KEY = 'uv_client_fingerprint'
  let value = localStorage.getItem(KEY)
  if (!value) {
    value = crypto.randomUUID()
    localStorage.setItem(KEY, value)
  }
  return value
}
