export function formatPrice(amount) {
  if (amount === null || amount === undefined || amount === '') return ''
  const value = Number(amount)
  if (Number.isNaN(value)) return ''
  return new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' }).format(value)
}

export function formatDateLong(dateInput) {
  const date = dateInput instanceof Date ? dateInput : new Date(dateInput)
  if (Number.isNaN(date.getTime())) return ''
  return new Intl.DateTimeFormat('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date)
}

export function formatTime(timeInput) {
  // Accepts "HH:MM" or a Date
  if (typeof timeInput === 'string' && /^\d{2}:\d{2}/.test(timeInput)) {
    const [h, m] = timeInput.split(':').map(Number)
    const d = new Date()
    d.setHours(h, m, 0, 0)
    return new Intl.DateTimeFormat('en-GB', { hour: 'numeric', minute: '2-digit' }).format(d)
  }
  const date = timeInput instanceof Date ? timeInput : new Date(timeInput)
  if (Number.isNaN(date.getTime())) return ''
  return new Intl.DateTimeFormat('en-GB', { hour: 'numeric', minute: '2-digit' }).format(date)
}

export function formatDuration(minutes) {
  const value = Number(minutes)
  if (!value) return ''
  const hours = Math.floor(value / 60)
  const mins = value % 60
  if (hours && mins) return `${hours} hr ${mins} min`
  if (hours) return `${hours} hr${hours > 1 ? 's' : ''}`
  return `${mins} min`
}
