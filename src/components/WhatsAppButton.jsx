import { PiWhatsappLogoLight } from 'react-icons/pi'
import { useSettings } from '../context/SettingsContext'
import { whatsappLink, generalContactMessage } from '../lib/whatsapp'

export default function WhatsAppButton({ message, className = '', floating = false }) {
  const { settings } = useSettings()
  const link = whatsappLink(settings.whatsapp_number, message || generalContactMessage())

  if (!link) return null

  if (floating) {
    return (
      <a
        href={link}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with United Vich Enterprise on WhatsApp"
        className="fixed bottom-24 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-forest text-ivory shadow-lg shadow-forest/30 transition-transform duration-300 hover:scale-105 sm:bottom-6 print:hidden"
      >
        <PiWhatsappLogoLight className="text-2xl" aria-hidden="true" />
      </a>
    )
  }

  return (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center justify-center gap-2 border border-forest bg-forest px-6 py-3 font-body text-xs font-semibold uppercase tracking-[0.14em] text-ivory transition-colors hover:bg-forest-dark ${className}`}
    >
      <PiWhatsappLogoLight className="text-base" aria-hidden="true" />
      Pay via WhatsApp
    </a>
  )
}
