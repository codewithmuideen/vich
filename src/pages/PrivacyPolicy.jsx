import LegalPage from '../components/LegalPage'

export default function PrivacyPolicy() {
  return (
    <LegalPage
      title="Privacy Policy"
      path="/privacy-policy"
      description="How United Vich Enterprise collects, uses and protects your personal information."
    >
      <h2 className="font-display text-xl text-forest">Information We Collect</h2>
      <p>
        When you book an appointment, contact us, or leave a review, we may collect information such as your
        name, email address, phone number, and any notes or messages you provide. This information is used
        solely to manage your appointment and respond to your enquiries.
      </p>
      <h2 className="font-display text-xl text-forest">How We Use Your Information</h2>
      <p>
        Booking details are used to schedule and manage your appointment, and to contact you about it if
        necessary. We do not sell or share your personal information with third parties for marketing purposes.
      </p>
      <h2 className="font-display text-xl text-forest">Cookies</h2>
      <p>
        We use cookies as described in our Cookie Policy. Optional analytics cookies are only used with your
        consent.
      </p>
      <h2 className="font-display text-xl text-forest">Your Rights</h2>
      <p>
        You may request access to, correction of, or deletion of your personal data by contacting us directly.
      </p>
      <h2 className="font-display text-xl text-forest">Contact</h2>
      <p>For any privacy-related questions, please use the details on our Contact page.</p>
    </LegalPage>
  )
}
