import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { PiCheckCircleLight, PiClockLight, PiCalendarLight, PiCopyLight } from 'react-icons/pi'
import SEO from '../components/SEO'
import SectionHeading from '../components/SectionHeading'
import Breadcrumbs from '../components/Breadcrumbs'
import Button from '../components/Button'
import BookingStepper from '../components/BookingStepper'
import BookingCalendar from '../components/BookingCalendar'
import DemoNotice from '../components/DemoNotice'
import WhatsAppButton from '../components/WhatsAppButton'
import { useApiData } from '../hooks/useApiData'
import { getServices, getAvailability, createBooking } from '../services/api'
import { formatPrice, formatDuration, formatDateLong, formatTime } from '../lib/format'
import { bookingPaymentMessage } from '../lib/whatsapp'
import { PLACEHOLDER_SERVICES } from '../data/placeholders'

const STEPS = ['Service', 'Date', 'Time', 'Details', 'Review']
const FALLBACK_SLOTS = ['09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00']

function toKey(date) {
  return date.toISOString().slice(0, 10)
}

export default function BookAppointment() {
  const [params, setParams] = useSearchParams()
  const [step, setStep] = useState(1)
  const [service, setService] = useState(null)
  const [date, setDate] = useState(null)
  const [time, setTime] = useState(null)
  const [details, setDetails] = useState({ name: '', email: '', phone: '', notes: '' })
  const [submitStatus, setSubmitStatus] = useState('idle')
  const [submitError, setSubmitError] = useState('')
  const [booking, setBooking] = useState(null)

  const servicesState = useApiData(() => getServices(), { fallback: PLACEHOLDER_SERVICES })

  useEffect(() => {
    const preselect = params.get('service')
    if (preselect && servicesState.data && !service) {
      const found = servicesState.data.find((s) => s.slug === preselect)
      if (found) {
        setService(found)
        setStep(2)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [servicesState.data])

  const slotsState = useApiData(
    () => (date && service ? getAvailability({ service: service.id, date: toKey(date) }) : Promise.resolve(null)),
    { fallback: date ? { slots: FALLBACK_SLOTS.map((t) => ({ time: t, available: true })) } : null, deps: [date?.toDateString(), service?.id] },
  )

  function selectService(s) {
    setService(s)
    setDate(null)
    setTime(null)
    params.set('service', s.slug)
    setParams(params, { replace: true })
    setStep(2)
  }

  function goToStep(n) {
    setStep(n)
    window.scrollTo({ top: window.scrollY, behavior: 'auto' })
  }

  async function handleConfirm() {
    setSubmitStatus('submitting')
    setSubmitError('')
    try {
      const payload = {
        service_id: service.id,
        date: toKey(date),
        time,
        name: details.name,
        email: details.email,
        phone: details.phone,
        notes: details.notes,
      }
      const result = await createBooking(payload)
      setBooking(result)
      setSubmitStatus('success')
    } catch (err) {
      setSubmitStatus('error')
      setSubmitError(err.message || 'This slot may no longer be available. Please choose another time.')
    }
  }

  const canGoStep2 = !!service
  const canGoStep3 = !!date
  const canGoStep4 = !!time
  const canGoStep5 = details.name.trim() && details.email.trim() && details.phone.trim()

  if (submitStatus === 'success' && booking) {
    return <BookingSuccess booking={booking} />
  }

  return (
    <>
      <SEO
        title="Book an Appointment"
        description="Book your appointment with United Vich Enterprise online in a few simple steps."
        path="/book-appointment"
      />

      <section className="border-b border-forest/10 bg-white pb-10 pt-12">
        <div className="container-edit flex flex-col gap-6">
          <Breadcrumbs items={[{ name: 'Home', path: '/' }, { name: 'Book Appointment', path: '/book-appointment' }]} />
          <SectionHeading eyebrow="Booking" title="Book Your Appointment" />
          <BookingStepper steps={STEPS} current={step} />
        </div>
      </section>

      <section className="py-16">
        <div className="container-edit max-w-3xl">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <StepWrap key="step1">
                {servicesState.isFallback && <DemoNotice />}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {(servicesState.data || []).map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => selectService(s)}
                      className={`flex flex-col gap-2 border p-5 text-left transition-colors ${
                        service?.id === s.id ? 'border-forest bg-forest/5' : 'border-forest/15 hover:border-forest'
                      }`}
                    >
                      <span className="font-display text-xl text-forest">{s.name}</span>
                      <span className="font-body text-xs text-dark/50">{s.category}</span>
                      <span className="mt-1 font-body text-sm font-semibold text-gold">
                        From {formatPrice(s.price_from ?? s.price)}
                      </span>
                    </button>
                  ))}
                </div>
              </StepWrap>
            )}

            {step === 2 && (
              <StepWrap key="step2">
                <SelectedServiceBanner service={service} onChange={() => goToStep(1)} />
                <BookingCalendar serviceId={service?.id} value={date} onChange={setDate} />
                <StepNav onBack={() => goToStep(1)} onNext={() => goToStep(3)} nextDisabled={!canGoStep3} />
              </StepWrap>
            )}

            {step === 3 && (
              <StepWrap key="step3">
                <SelectedServiceBanner service={service} onChange={() => goToStep(1)} />
                <p className="font-body text-sm text-dark/60">
                  <PiCalendarLight className="mr-1 inline" /> {formatDateLong(date)}
                </p>
                {slotsState.isFallback && <DemoNotice>Preview time slots — connect the availability API for real-time slots.</DemoNotice>}
                {slotsState.loading ? (
                  <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
                    {Array.from({ length: 8 }).map((_, i) => (
                      <div key={i} className="h-12 animate-pulse bg-forest/5" />
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
                    {(slotsState.data?.slots || []).map((slot) => (
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
                <StepNav onBack={() => goToStep(2)} onNext={() => goToStep(4)} nextDisabled={!canGoStep4} />
              </StepWrap>
            )}

            {step === 4 && (
              <StepWrap key="step4">
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <Field label="Full Name" required value={details.name} onChange={(v) => setDetails((d) => ({ ...d, name: v }))} />
                  <Field label="Email Address" type="email" required value={details.email} onChange={(v) => setDetails((d) => ({ ...d, email: v }))} />
                  <Field label="Phone Number" type="tel" required value={details.phone} onChange={(v) => setDetails((d) => ({ ...d, phone: v }))} />
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="notes" className="font-body text-xs font-semibold uppercase tracking-[0.14em] text-forest">
                    Notes / Special Requests (optional)
                  </label>
                  <textarea
                    id="notes"
                    rows={4}
                    value={details.notes}
                    onChange={(e) => setDetails((d) => ({ ...d, notes: e.target.value }))}
                    className="border border-forest/20 bg-white px-4 py-3 font-body text-sm outline-none focus:border-gold"
                  />
                </div>
                <StepNav onBack={() => goToStep(3)} onNext={() => goToStep(5)} nextDisabled={!canGoStep5} />
              </StepWrap>
            )}

            {step === 5 && (
              <StepWrap key="step5">
                <div className="flex flex-col divide-y divide-forest/10 border border-forest/10 bg-white">
                  <SummaryRow label="Service" value={service?.name} />
                  <SummaryRow label="Date" value={formatDateLong(date)} />
                  <SummaryRow label="Time" value={formatTime(time)} />
                  <SummaryRow label="Duration" value={formatDuration(service?.duration_minutes)} />
                  <SummaryRow label="Price" value={`From ${formatPrice(service?.price_from ?? service?.price)}`} />
                  <SummaryRow label="Name" value={details.name} />
                  <SummaryRow label="Email" value={details.email} />
                  <SummaryRow label="Phone" value={details.phone} />
                  {details.notes && <SummaryRow label="Notes" value={details.notes} />}
                </div>

                {submitStatus === 'error' && (
                  <p className="border border-red-200 bg-red-50 px-4 py-3 font-body text-sm text-red-700">{submitError}</p>
                )}

                <div className="flex flex-wrap gap-4">
                  <Button variant="outline" size="lg" onClick={() => goToStep(4)} disabled={submitStatus === 'submitting'}>
                    Back
                  </Button>
                  <Button variant="primary" size="lg" onClick={handleConfirm} disabled={submitStatus === 'submitting'}>
                    {submitStatus === 'submitting' ? 'Confirming…' : 'Confirm Booking'}
                  </Button>
                </div>
              </StepWrap>
            )}
          </AnimatePresence>
        </div>
      </section>
    </>
  )
}

function StepWrap({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 16 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -16 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="flex flex-col gap-6"
    >
      {children}
    </motion.div>
  )
}

function SelectedServiceBanner({ service, onChange }) {
  if (!service) return null
  return (
    <div className="flex items-center justify-between border border-forest/10 bg-forest/5 px-5 py-4">
      <div>
        <p className="font-body text-xs uppercase tracking-[0.14em] text-dark/40">Selected Service</p>
        <p className="font-display text-lg text-forest">{service.name}</p>
      </div>
      <button type="button" onClick={onChange} className="font-body text-xs font-semibold uppercase tracking-[0.14em] text-gold hover:text-gold-light">
        Change
      </button>
    </div>
  )
}

function StepNav({ onBack, onNext, nextDisabled }) {
  return (
    <div className="flex gap-4">
      <Button variant="outline" size="lg" onClick={onBack}>
        Back
      </Button>
      <Button variant="primary" size="lg" onClick={onNext} disabled={nextDisabled}>
        Continue
      </Button>
    </div>
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

function Field({ label, type = 'text', required, value, onChange }) {
  const id = label.toLowerCase().replace(/\s+/g, '-')
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="font-body text-xs font-semibold uppercase tracking-[0.14em] text-forest">
        {label}
      </label>
      <input
        id={id}
        type={type}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="border border-forest/20 bg-white px-4 py-3 font-body text-sm outline-none focus:border-gold"
      />
    </div>
  )
}

function BookingSuccess({ booking }) {
  const [copied, setCopied] = useState(false)
  const message = useMemo(
    () =>
      bookingPaymentMessage({
        reference: booking.reference,
        serviceName: booking.service_name,
        dateLabel: formatDateLong(booking.date),
        timeLabel: formatTime(booking.time),
      }),
    [booking],
  )

  function copyReference() {
    navigator.clipboard?.writeText(booking.reference)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <>
      <SEO title="Booking Confirmed" path="/book-appointment" noIndex />
      <section className="py-24">
        <div className="container-edit flex max-w-xl flex-col items-center gap-8 text-center">
          <PiCheckCircleLight className="text-6xl text-gold" aria-hidden="true" />
          <div className="flex flex-col gap-2">
            <h1 className="font-display text-4xl text-forest">Booking Confirmed</h1>
            <p className="font-body text-sm text-dark/60">
              A confirmation has been recorded for your appointment. Please complete payment via WhatsApp below.
            </p>
          </div>

          <button
            type="button"
            onClick={copyReference}
            className="flex items-center gap-2 border border-gold/40 bg-gold/5 px-6 py-3 font-body text-sm font-semibold text-forest"
          >
            Booking reference: <span className="text-gold">{booking.reference}</span>
            <PiCopyLight aria-hidden="true" />
            {copied && <span className="text-xs text-gold">Copied</span>}
          </button>

          <div className="flex w-full flex-col divide-y divide-forest/10 border border-forest/10 bg-white text-left">
            <SummaryRow label="Service" value={booking.service_name} />
            <SummaryRow label="Date" value={formatDateLong(booking.date)} />
            <SummaryRow label="Time" value={formatTime(booking.time)} />
            {booking.duration_minutes && <SummaryRow label="Duration" value={formatDuration(booking.duration_minutes)} />}
            {booking.price && <SummaryRow label="Price" value={formatPrice(booking.price)} />}
          </div>

          <div className="flex w-full flex-col gap-4 border border-forest/10 bg-forest/5 p-6">
            <p className="flex items-center justify-center gap-2 font-display text-xl text-forest">
              <PiClockLight aria-hidden="true" /> Complete Payment via WhatsApp
            </p>
            <p className="font-body text-sm text-dark/60">
              Tap below to open WhatsApp with your booking details pre-filled — just hit send.
            </p>
            <WhatsAppButton message={message} className="mx-auto" />
          </div>

          <Button to="/" variant="outline" size="md">
            Return to Homepage
          </Button>
        </div>
      </section>
    </>
  )
}
