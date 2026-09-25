import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { PiMagnifyingGlassLight, PiBellLight, PiArrowClockwiseLight, PiXCircleLight, PiCheckCircleLight } from 'react-icons/pi'
import SEO from '../components/SEO'
import SectionHeading from '../components/SectionHeading'
import Breadcrumbs from '../components/Breadcrumbs'
import Button from '../components/Button'
import BookingCalendar from '../components/BookingCalendar'
import StatusBadge from '../components/admin/StatusBadge'
import { findBooking, cancelBooking, rescheduleBooking, getAvailability, subscribeCustomerPush } from '../services/api'
import { formatPrice, formatDuration, formatDateLong, formatTime } from '../lib/format'
import { isPushSupported, getOrCreatePushSubscription, subscriptionToKeys } from '../lib/push'

function toKey(date) {
  return date.toISOString().slice(0, 10)
}

export default function ManageBooking() {
  const [lookup, setLookup] = useState({ reference: '', email: '' })
  const [lookupError, setLookupError] = useState('')
  const [loading, setLoading] = useState(false)
  const [booking, setBooking] = useState(null)
  const [mode, setMode] = useState('view') // view | cancel | reschedule
  const [pushStatus, setPushStatus] = useState('idle')
  const [pushError, setPushError] = useState('')

  async function handleLookup(e) {
    e.preventDefault()
    setLoading(true)
    setLookupError('')
    try {
      const result = await findBooking(lookup)
      setBooking(result)
      setMode('view')
    } catch (err) {
      setLookupError(err.message || 'We could not find a booking with that reference and email.')
      setBooking(null)
    } finally {
      setLoading(false)
    }
  }

  async function enablePush() {
    setPushStatus('requesting')
    setPushError('')
    try {
      const subscription = await getOrCreatePushSubscription()
      await subscribeCustomerPush({ reference: booking.reference, email: lookup.email, subscription: subscriptionToKeys(subscription) })
      setPushStatus('enabled')
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('[enablePush]', err)
      setPushError(err.message || 'Something went wrong.')
      setPushStatus('error')
    }
  }

  return (
    <>
      <SEO title="Manage Your Booking" description="Look up your United Vich Enterprise booking to cancel or reschedule." path="/manage-booking" noIndex />

      <section className="border-b border-forest/10 bg-white pb-10 pt-12">
        <div className="container-edit flex flex-col gap-6">
          <Breadcrumbs items={[{ name: 'Home', path: '/' }, { name: 'Manage Booking', path: '/manage-booking' }]} />
          <SectionHeading eyebrow="Your Booking" title="Manage Your Booking" description="Look up your appointment to view, cancel or reschedule it." />
        </div>
      </section>

      <section className="py-16">
        <div className="container-edit max-w-2xl">
          {!booking ? (
            <form onSubmit={handleLookup} className="flex flex-col gap-5 border border-forest/10 bg-white p-6 sm:p-8">
              <div className="flex flex-col gap-2">
                <label htmlFor="lookup-reference" className="font-body text-xs font-semibold uppercase tracking-[0.14em] text-forest">
                  Booking Reference
                </label>
                <input
                  id="lookup-reference"
                  required
                  placeholder="UV-2026-000123"
                  value={lookup.reference}
                  onChange={(e) => setLookup((l) => ({ ...l, reference: e.target.value }))}
                  className="border border-forest/20 bg-white px-4 py-3 font-body text-sm outline-none focus:border-gold"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="lookup-email" className="font-body text-xs font-semibold uppercase tracking-[0.14em] text-forest">
                  Email Address
                </label>
                <input
                  id="lookup-email"
                  type="email"
                  required
                  value={lookup.email}
                  onChange={(e) => setLookup((l) => ({ ...l, email: e.target.value }))}
                  className="border border-forest/20 bg-white px-4 py-3 font-body text-sm outline-none focus:border-gold"
                />
              </div>
              {lookupError && <p className="font-body text-sm text-red-700">{lookupError}</p>}
              <Button type="submit" variant="primary" size="lg" disabled={loading} className="self-start">
                <PiMagnifyingGlassLight className="mr-2 inline" aria-hidden="true" />
                {loading ? 'Looking up…' : 'Find My Booking'}
              </Button>
            </form>
          ) : mode === 'cancel' ? (
            <CancelPanel
              booking={booking}
              email={lookup.email}
              onCancelled={(updated) => {
                setBooking(updated)
                setMode('view')
              }}
              onBack={() => setMode('view')}
            />
          ) : mode === 'reschedule' ? (
            <ReschedulePanel
              booking={booking}
              email={lookup.email}
              onRescheduled={(updated) => {
                setBooking(updated)
                setMode('view')
              }}
              onBack={() => setMode('view')}
            />
          ) : (
            <div className="flex flex-col gap-6">
              <div className="flex flex-col divide-y divide-forest/10 border border-forest/10 bg-white">
                <div className="flex items-center justify-between gap-6 px-6 py-4">
                  <span className="font-body text-xs font-semibold uppercase tracking-[0.14em] text-dark/40">Status</span>
                  <StatusBadge status={booking.status} />
                </div>
                <SummaryRow label="Reference" value={booking.reference} />
                <SummaryRow label="Service" value={booking.service_name} />
                <SummaryRow label="Date" value={formatDateLong(booking.date)} />
                <SummaryRow label="Time" value={formatTime(booking.time)} />
                <SummaryRow label="Duration" value={formatDuration(booking.duration_minutes)} />
                <SummaryRow label="Price" value={formatPrice(booking.price)} />
              </div>

              {booking.can_manage ? (
                <div className="flex flex-wrap gap-4">
                  <Button variant="outline" size="lg" onClick={() => setMode('reschedule')}>
                    <PiArrowClockwiseLight className="mr-2 inline" aria-hidden="true" />
                    Reschedule
                  </Button>
                  <Button variant="outline" size="lg" onClick={() => setMode('cancel')}>
                    <PiXCircleLight className="mr-2 inline" aria-hidden="true" />
                    Cancel Booking
                  </Button>
                </div>
              ) : (
                <p className="border border-forest/10 bg-forest/5 px-4 py-3 font-body text-sm text-dark/60">
                  This booking can no longer be changed here. If you need help, please contact us directly.
                </p>
              )}

              {isPushSupported() && pushStatus !== 'enabled' && (
                <div className="flex flex-col items-start gap-3 border border-forest/10 bg-white p-6">
                  <PiBellLight className="text-2xl text-gold" aria-hidden="true" />
                  <p className="font-body text-sm text-dark/60">Get notified about this booking on this device, even when the site isn&rsquo;t open.</p>
                  <Button variant="outline" size="md" onClick={enablePush} disabled={pushStatus === 'requesting'}>
                    {pushStatus === 'requesting' ? 'Enabling…' : 'Enable Notifications'}
                  </Button>
                  {pushStatus === 'error' && <p className="font-body text-xs text-red-700">Could not enable notifications ({pushError}).</p>}
                </div>
              )}
              {pushStatus === 'enabled' && (
                <p className="flex items-center gap-2 font-body text-sm text-gold">
                  <PiCheckCircleLight aria-hidden="true" /> You&rsquo;ll be notified about this booking on this device.
                </p>
              )}

              <button
                type="button"
                onClick={() => {
                  setBooking(null)
                  setLookup({ reference: '', email: '' })
                }}
                className="self-start font-body text-xs font-semibold uppercase tracking-[0.14em] text-gold hover:text-gold-light"
              >
                Look Up a Different Booking
              </button>
            </div>
          )}
        </div>
      </section>
    </>
  )
}

function SummaryRow({ label, value }) {
  return (
    <div className="flex items-center justify-between gap-6 px-6 py-4">
      <span className="font-body text-xs font-semibold uppercase tracking-[0.14em] text-dark/40">{label}</span>
      <span className="text-right font-body text-sm text-forest">{value}</span>
    </div>
  )
}

function CancelPanel({ booking, email, onCancelled, onBack }) {
  const [reason, setReason] = useState('')
  const [status, setStatus] = useState('idle')
  const [error, setError] = useState('')

  async function handleCancel() {
    setStatus('submitting')
    setError('')
    try {
      const updated = await cancelBooking({ reference: booking.reference, email, reason })
      onCancelled({ ...booking, status: 'CANCELLED', can_manage: false, ...updated })
    } catch (err) {
      setStatus('idle')
      setError(err.message || 'Could not cancel this booking. Please try again.')
    }
  }

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-6 border border-red-200 bg-red-50/40 p-6 sm:p-8">
      <div>
        <h2 className="font-display text-2xl text-forest">Cancel This Booking?</h2>
        <p className="mt-1 font-body text-sm text-dark/60">
          {booking.service_name} on {formatDateLong(booking.date)} at {formatTime(booking.time)}. This can&rsquo;t be undone.
        </p>
      </div>
      <div className="flex flex-col gap-2">
        <label htmlFor="cancel-reason" className="font-body text-xs font-semibold uppercase tracking-[0.14em] text-forest">
          Reason (optional)
        </label>
        <textarea
          id="cancel-reason"
          rows={3}
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          className="border border-forest/20 bg-white px-4 py-3 font-body text-sm outline-none focus:border-gold"
        />
      </div>
      {error && <p className="font-body text-sm text-red-700">{error}</p>}
      <div className="flex flex-wrap gap-4">
        <Button variant="outline" size="lg" onClick={onBack} disabled={status === 'submitting'}>
          Keep Booking
        </Button>
        <Button variant="primary" size="lg" onClick={handleCancel} disabled={status === 'submitting'}>
          {status === 'submitting' ? 'Cancelling…' : 'Yes, Cancel Booking'}
        </Button>
      </div>
    </motion.div>
  )
}

function ReschedulePanel({ booking, email, onRescheduled, onBack }) {
  const [date, setDate] = useState(null)
  const [time, setTime] = useState(null)
  const [slots, setSlots] = useState([])
  const [slotsLoading, setSlotsLoading] = useState(false)
  const [status, setStatus] = useState('idle')
  const [error, setError] = useState('')

  async function handleSelectDate(d) {
    setDate(d)
    setTime(null)
    setSlotsLoading(true)
    try {
      const { slots: result } = await getAvailability({ durationMinutes: booking.duration_minutes, date: toKey(d) })
      setSlots(result)
    } finally {
      setSlotsLoading(false)
    }
  }

  async function handleConfirm() {
    setStatus('submitting')
    setError('')
    try {
      const updated = await rescheduleBooking({ reference: booking.reference, email, date: toKey(date), time })
      onRescheduled({ ...booking, status: 'PENDING', date: updated.date, time: updated.time, can_manage: true })
    } catch (err) {
      setStatus('idle')
      setError(err.message || 'This slot may no longer be available. Please choose another time.')
    }
  }

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-6">
      <div>
        <h2 className="font-display text-2xl text-forest">Reschedule Your Booking</h2>
        <p className="mt-1 font-body text-sm text-dark/60">
          Currently {formatDateLong(booking.date)} at {formatTime(booking.time)}. Choose a new date and time below.
        </p>
      </div>

      <BookingCalendar durationMinutes={booking.duration_minutes} value={date} onChange={handleSelectDate} />

      {date && (
        <AnimatePresence>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-4">
            {slotsLoading ? (
              <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="h-12 animate-pulse bg-forest/5" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
                {slots.map((slot) => (
                  <button
                    key={slot.time}
                    type="button"
                    disabled={!slot.available}
                    onClick={() => setTime(slot.time)}
                    className={`border py-3 font-body text-sm transition-colors ${
                      time === slot.time
                        ? 'border-forest bg-forest text-ivory'
                        : slot.available
                          ? 'border-forest/15 text-forest hover:border-forest'
                          : 'cursor-not-allowed border-forest/5 text-dark/20 line-through'
                    }`}
                  >
                    {formatTime(slot.time)}
                  </button>
                ))}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      )}

      {error && <p className="font-body text-sm text-red-700">{error}</p>}

      <div className="flex flex-wrap gap-4">
        <Button variant="outline" size="lg" onClick={onBack} disabled={status === 'submitting'}>
          Back
        </Button>
        <Button variant="primary" size="lg" onClick={handleConfirm} disabled={!time || status === 'submitting'}>
          {status === 'submitting' ? 'Saving…' : 'Confirm New Time'}
        </Button>
      </div>
    </motion.div>
  )
}
