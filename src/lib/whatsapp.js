function digitsOnly(value) {
  return (value || '').replace(/[^\d]/g, '')
}

function buildWhatsAppUrl(number, message) {
  const phone = digitsOnly(number)
  const text = encodeURIComponent(message)
  if (!phone) return null
  return `https://wa.me/${phone}?text=${text}`
}

export function bookingPaymentMessage({ reference, serviceName, dateLabel, timeLabel }) {
  return [
    'Hello United Vich Enterprise, I have just made a booking.',
    '',
    `Booking reference: ${reference}`,
    `Service: ${serviceName}`,
    `Date: ${dateLabel}`,
    `Time: ${timeLabel}`,
    '',
    'I would like to arrange payment for my appointment.',
  ].join('\n')
}

export function enquiryMessage(serviceName) {
  return serviceName
    ? `Hello United Vich Enterprise, I would like to make an enquiry about ${serviceName}.`
    : 'Hello United Vich Enterprise, I would like to make an enquiry.'
}

export function generalContactMessage() {
  return 'Hello United Vich Enterprise, I have a question and would like to get in touch.'
}

export function whatsappLink(number, message) {
  return buildWhatsAppUrl(number, message)
}
