import { useState } from 'react'
import { PiPhoneLight, PiEnvelopeSimpleLight, PiMapPinLight, PiClockLight, PiCheckCircleLight } from 'react-icons/pi'
import SEO from '../components/SEO'
import SectionHeading from '../components/SectionHeading'
import Breadcrumbs from '../components/Breadcrumbs'
import Button from '../components/Button'
import WhatsAppButton from '../components/WhatsAppButton'
import { useSettings } from '../context/SettingsContext'
import { submitContact } from '../services/api'
import { generalContactMessage } from '../lib/whatsapp'

export default function Contact() {
  const { settings } = useSettings()
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' })
  const [status, setStatus] = useState('idle')
  const [errorMsg, setErrorMsg] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    setStatus('submitting')
    try {
      await submitContact(form)
      setStatus('success')
      setForm({ name: '', email: '', phone: '', message: '' })
    } catch (err) {
      setStatus('error')
      setErrorMsg(err.message)
    }
  }

  return (
    <>
      <SEO
        title="Contact Us"
        description="Get in touch with United Vich Enterprise by phone, WhatsApp or email, or send us a message directly."
        path="/contact"
      />

      <section className="border-b border-forest/10 bg-white pb-16 pt-12">
        <div className="container-edit flex flex-col gap-6">
          <Breadcrumbs items={[{ name: 'Home', path: '/' }, { name: 'Contact', path: '/contact' }]} />
          <SectionHeading eyebrow="Get In Touch" title="Contact Us" />
        </div>
      </section>

      <section className="py-20">
        <div className="container-edit grid grid-cols-1 gap-16 lg:grid-cols-2">
          <div className="flex flex-col gap-10">
            <div className="flex flex-col gap-6">
              <ContactRow icon={PiPhoneLight} label="Phone" value={settings.phone} href={settings.phone ? `tel:${settings.phone}` : null} />
              <ContactRow icon={PiEnvelopeSimpleLight} label="General Enquiries" value={settings.email} href={settings.email ? `mailto:${settings.email}` : null} />
              <ContactRow icon={PiEnvelopeSimpleLight} label="Bookings & Enquiries" value={settings.enquiries_email} href={settings.enquiries_email ? `mailto:${settings.enquiries_email}` : null} />
              <ContactRow
                icon={PiMapPinLight}
                label="Address"
                value={
                  settings.address_line1
                    ? `${settings.address_line1}${settings.city ? `, ${settings.city}` : ''} ${settings.postcode || ''}`
                    : settings.city
                      ? `${settings.city}, ${settings.country || 'United Kingdom'}`
                      : ''
                }
              />
              {settings.opening_hours?.some((h) => !h.closed) && (
                <div className="flex items-start gap-4">
                  <PiClockLight className="mt-1 text-xl text-gold" aria-hidden="true" />
                  <div>
                    <p className="font-body text-xs font-semibold uppercase tracking-[0.14em] text-forest/50">Opening Hours</p>
                    <ul className="mt-2 flex flex-col gap-1 font-body text-sm text-dark/70">
                      {settings.opening_hours.map((h) => (
                        <li key={h.day} className="flex items-center justify-between gap-8">
                          <span>{h.day}</span>
                          <span>{h.closed ? 'Closed' : `${h.open} – ${h.close}`}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>

            <WhatsAppButton message={generalContactMessage()} className="w-fit" />

            {settings.google_maps_url ? (
              <div className="aspect-video w-full overflow-hidden border border-forest/10">
                <iframe
                  title="United Vich Enterprise location"
                  src={settings.google_maps_url}
                  className="h-full w-full"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            ) : (
              <div className="flex aspect-video w-full items-center justify-center border border-dashed border-forest/20 bg-white font-body text-sm italic text-dark/40">
                Map will appear here once the salon address is confirmed
              </div>
            )}
          </div>

          <div className="flex flex-col gap-6 border border-forest/10 bg-white p-8 sm:p-10">
            <h2 className="font-display text-2xl text-forest">Send Us a Message</h2>

            {status === 'success' ? (
              <div className="flex flex-col items-center justify-center gap-4 py-10 text-center">
                <PiCheckCircleLight className="text-4xl text-gold" aria-hidden="true" />
                <p className="font-display text-xl text-forest">Message sent</p>
                <p className="font-body text-sm text-dark/60">We&rsquo;ll get back to you as soon as possible.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                <Field id="name" label="Full Name" required value={form.name} onChange={(v) => setForm((f) => ({ ...f, name: v }))} />
                <Field id="email" type="email" label="Email Address" required value={form.email} onChange={(v) => setForm((f) => ({ ...f, email: v }))} />
                <Field id="phone" type="tel" label="Phone Number" value={form.phone} onChange={(v) => setForm((f) => ({ ...f, phone: v }))} />

                <div className="flex flex-col gap-2">
                  <label htmlFor="message" className="font-body text-xs font-semibold uppercase tracking-[0.14em] text-forest">
                    Message
                  </label>
                  <textarea
                    id="message"
                    required
                    rows={5}
                    value={form.message}
                    onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                    className="border border-forest/20 bg-white px-4 py-3 font-body text-sm outline-none focus:border-gold"
                  />
                </div>

                {status === 'error' && <p className="font-body text-sm text-red-700">{errorMsg}</p>}

                <Button type="submit" variant="primary" size="lg" disabled={status === 'submitting'} className="w-fit">
                  {status === 'submitting' ? 'Sending…' : 'Send Message'}
                </Button>
              </form>
            )}
          </div>
        </div>
      </section>
    </>
  )
}

function ContactRow({ icon: Icon, label, value, href }) {
  return (
    <div className="flex items-start gap-4">
      <Icon className="mt-1 text-xl text-gold" aria-hidden="true" />
      <div>
        <p className="font-body text-xs font-semibold uppercase tracking-[0.14em] text-forest/50">{label}</p>
        {value ? (
          href ? (
            <a href={href} className="font-body text-sm text-dark/80 hover:text-gold">
              {value}
            </a>
          ) : (
            <p className="font-body text-sm text-dark/80">{value}</p>
          )
        ) : (
          <p className="font-body text-sm italic text-dark/40">To be confirmed</p>
        )}
      </div>
    </div>
  )
}

function Field({ id, label, type = 'text', required, value, onChange }) {
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
