import { useEffect, useState } from 'react'
import { PiBellLight, PiBellRingingFill } from 'react-icons/pi'
import { isPushSupported, getOrCreatePushSubscription, getExistingPushSubscription, unsubscribeLocalPush, subscriptionToKeys } from '../../lib/push'
import { subscribeAdminPush, unsubscribePush, adminHasPushSubscription } from '../../services/api'

/** Bell toggle in the admin header — enables/disables push notifications for new bookings, cancellations and reminders on this device. */
export default function PushToggle() {
  const [enabled, setEnabled] = useState(false)
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    if (!isPushSupported()) return
    getExistingPushSubscription()
      .then((sub) => sub && adminHasPushSubscription(sub.endpoint))
      .then((isRegistered) => setEnabled(!!isRegistered))
      .catch(() => {})
  }, [])

  if (!isPushSupported()) return null

  async function toggle() {
    setBusy(true)
    try {
      if (enabled) {
        const sub = await getExistingPushSubscription()
        if (sub) {
          await unsubscribePush(sub.endpoint)
          await unsubscribeLocalPush()
        }
        setEnabled(false)
      } else {
        const subscription = await getOrCreatePushSubscription()
        await subscribeAdminPush(subscriptionToKeys(subscription))
        setEnabled(true)
      }
    } catch (err) {
      // Leave state unchanged — permission denial or a network hiccup isn't worth a modal here,
      // but still log it so it's not a total mystery when someone reports "the bell doesn't work."
      // eslint-disable-next-line no-console
      console.error('[PushToggle]', err)
    } finally {
      setBusy(false)
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={busy}
      aria-pressed={enabled}
      title={enabled ? 'Notifications on for this device' : 'Enable notifications for new bookings'}
      className={`flex h-10 w-10 items-center justify-center border transition-colors ${
        enabled ? 'border-gold bg-gold/10 text-gold' : 'border-forest/15 text-forest hover:bg-forest/5'
      }`}
    >
      {enabled ? <PiBellRingingFill className="text-lg" aria-hidden="true" /> : <PiBellLight className="text-lg" aria-hidden="true" />}
    </button>
  )
}
