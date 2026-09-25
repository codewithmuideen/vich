// Web Push helpers — request permission, subscribe/unsubscribe the current
// browser via the Push API. The subscription itself only ever leaves the
// browser through the RPCs in services/api.js, which decide who it's tied
// to (a specific booking for a customer, the signed-in admin for staff).

const VAPID_PUBLIC_KEY = import.meta.env.VITE_VAPID_PUBLIC_KEY

export function isPushSupported() {
  return typeof window !== 'undefined' && 'serviceWorker' in navigator && 'PushManager' in window && 'Notification' in window
}

export function getNotificationPermission() {
  if (!isPushSupported()) return 'unsupported'
  return Notification.permission // 'default' | 'granted' | 'denied'
}

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')
  const rawData = atob(base64)
  return Uint8Array.from([...rawData].map((c) => c.charCodeAt(0)))
}

/** Requests permission (if needed) and returns a browser PushSubscription. */
export async function getOrCreatePushSubscription() {
  if (!isPushSupported()) throw new Error('Push notifications are not supported in this browser.')
  if (!VAPID_PUBLIC_KEY) throw new Error('Push notifications are not configured yet.')

  const permission = await Notification.requestPermission()
  if (permission !== 'granted') throw new Error('Notification permission was not granted.')

  const registration = await navigator.serviceWorker.ready
  let subscription = await registration.pushManager.getSubscription()
  if (!subscription) {
    subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
    })
  }
  return subscription
}

export function subscriptionToKeys(subscription) {
  const json = subscription.toJSON()
  return { endpoint: json.endpoint, p256dh: json.keys.p256dh, auth: json.keys.auth }
}

export async function getExistingPushSubscription() {
  if (!isPushSupported()) return null
  const registration = await navigator.serviceWorker.getRegistration()
  if (!registration) return null
  return registration.pushManager.getSubscription()
}

export async function unsubscribeLocalPush() {
  const subscription = await getExistingPushSubscription()
  if (subscription) await subscription.unsubscribe()
  return subscription
}
