// United Vich Enterprise — service worker
// Caches the static app shell for fast repeat visits and an offline fallback
// page. Deliberately does NOT cache /api/* — booking, availability and
// payments always require a live connection, so the app never pretends to
// take a booking while offline.

const CACHE_VERSION = 'uv-shell-v1'
const OFFLINE_URL = '/offline.html'

const APP_SHELL = [
  '/',
  '/offline.html',
  '/manifest.webmanifest',
  '/brand/logo.png',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
]

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_VERSION).then((cache) => cache.addAll(APP_SHELL)).then(() => self.skipWaiting()),
  )
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== CACHE_VERSION).map((key) => caches.delete(key))))
      .then(() => self.clients.claim()),
  )
})

self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)

  if (request.method !== 'GET') return

  // Never intercept API calls — booking/availability must always hit the network.
  if (url.pathname.startsWith('/api/')) return

  // Navigations: network-first, falling back to cached shell, then offline page.
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request).catch(() => caches.match(request).then((res) => res || caches.match(OFFLINE_URL))),
    )
    return
  }

  // Static assets: cache-first, then network, updating the cache in the background.
  if (['style', 'script', 'image', 'font'].includes(request.destination)) {
    event.respondWith(
      caches.match(request).then(
        (cached) =>
          cached ||
          fetch(request).then((res) => {
            const clone = res.clone()
            caches.open(CACHE_VERSION).then((cache) => cache.put(request, clone))
            return res
          }),
      ),
    )
  }
})

// Booking updates (new booking for admin, reminders, cancellations) reach
// people this way even when the site isn't open — that's the whole point
// of push, as opposed to an in-page notification.
self.addEventListener('push', (event) => {
  let payload = { title: 'United Vich Enterprise', body: '' }
  try {
    if (event.data) payload = event.data.json()
  } catch {
    if (event.data) payload = { title: 'United Vich Enterprise', body: event.data.text() }
  }

  const { title = 'United Vich Enterprise', body = '', url = '/', tag } = payload

  event.waitUntil(
    self.registration.showNotification(title, {
      body,
      icon: '/icons/icon-192.png',
      badge: '/icons/icon-192.png',
      tag,
      data: { url },
    }),
  )
})

self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  const url = event.notification.data?.url || '/'

  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientsArr) => {
      const existing = clientsArr.find((c) => new URL(c.url).pathname === url)
      if (existing) return existing.focus()
      return self.clients.openWindow(url)
    }),
  )
})
