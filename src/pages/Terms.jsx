import LegalPage from '../components/LegalPage'

export default function Terms() {
  return (
    <LegalPage
      title="Terms & Conditions"
      path="/terms"
      description="Terms and conditions for booking appointments and using the United Vich Enterprise website."
    >
      <h2 className="font-display text-xl text-forest">Bookings</h2>
      <p>
        Appointments booked through this website are subject to availability and confirmation. A booking
        reference will be provided upon successful booking.
      </p>
      <h2 className="font-display text-xl text-forest">Payment</h2>
      <p>
        Payment is currently arranged via WhatsApp following your booking. Online card payment is not yet
        available but may be introduced in future.
      </p>
      <h2 className="font-display text-xl text-forest">Cancellations &amp; Rescheduling</h2>
      <p>
        Please contact us as soon as possible if you need to cancel or reschedule your appointment. Specific
        cancellation terms will be confirmed by the business.
      </p>
      <h2 className="font-display text-xl text-forest">Website Use</h2>
      <p>
        This website is provided for the purpose of browsing services and booking appointments with United
        Vich Enterprise. Content may not be reproduced without permission.
      </p>
    </LegalPage>
  )
}
