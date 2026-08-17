import { AnimatePresence, motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import Button from './Button'
import CookiePreferences from './CookiePreferences'
import { useCookieConsent } from '../context/CookieConsentContext'

export default function CookieBanner() {
  const { bannerOpen, preferencesOpen, acceptAll, rejectOptional, closePreferences } = useCookieConsent()

  return (
    <>
      <AnimatePresence>
        {bannerOpen && !preferencesOpen && (
          <motion.div
            role="dialog"
            aria-live="polite"
            aria-label="Cookie consent"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-x-0 bottom-0 z-[80] border-t border-gold/30 bg-forest-dark text-ivory"
          >
            <div className="container-edit flex flex-col gap-4 py-6 lg:flex-row lg:items-center lg:justify-between">
              <p className="max-w-2xl font-body text-sm leading-relaxed text-ivory/80">
                We value your privacy. We use necessary cookies to make our website work. With your permission,
                we may also use optional analytics and similar technologies to understand how visitors use our
                website and improve your experience. Read our{' '}
                <Link to="/cookie-policy" className="underline decoration-gold-light underline-offset-2 hover:text-gold-light">
                  Cookie Policy
                </Link>
                .
              </p>
              <div className="flex flex-wrap items-center gap-3">
                <CookiePreferencesTrigger />
                <Button variant="outlineLight" size="md" onClick={rejectOptional}>
                  Reject Optional
                </Button>
                <Button variant="gold" size="md" onClick={acceptAll}>
                  Accept All
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <CookiePreferences open={preferencesOpen} onClose={closePreferences} />
    </>
  )
}

function CookiePreferencesTrigger() {
  const { reopenPreferences } = useCookieConsent()
  return (
    <Button variant="ghost" size="md" onClick={reopenPreferences} className="!text-ivory hover:!border-ivory/30">
      Manage Preferences
    </Button>
  )
}
