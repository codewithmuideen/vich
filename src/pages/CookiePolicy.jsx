import { useCookieConsent } from '../context/CookieConsentContext'
import Button from '../components/Button'
import LegalPage from '../components/LegalPage'

export default function CookiePolicy() {
  const { reopenPreferences } = useCookieConsent()

  return (
    <LegalPage
      title="Cookie Policy"
      path="/cookie-policy"
      description="How and why United Vich Enterprise uses cookies on this website."
    >
      <h2 className="font-display text-xl text-forest">What Are Cookies</h2>
      <p>
        Cookies are small text files stored on your device that help websites function and, with your
        permission, help us understand how the site is used.
      </p>
      <h2 className="font-display text-xl text-forest">Cookies We Use</h2>
      <ul className="flex flex-col gap-2">
        <li><strong className="text-forest">Necessary:</strong> required for core functionality such as booking and security. Always active.</li>
        <li><strong className="text-forest">Analytics:</strong> helps us understand site usage. Only loaded with your consent.</li>
        <li><strong className="text-forest">Marketing:</strong> used to measure marketing effectiveness. Only loaded with your consent.</li>
        <li><strong className="text-forest">Preferences:</strong> remembers choices you make. Only loaded with your consent.</li>
      </ul>
      <h2 className="font-display text-xl text-forest">Managing Your Preferences</h2>
      <p>You can change your cookie preferences at any time.</p>
      <Button variant="outline" size="md" onClick={reopenPreferences} className="w-fit">
        Manage Cookie Preferences
      </Button>
    </LegalPage>
  )
}
