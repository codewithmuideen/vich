import { useMemo, useState } from 'react'
import { PiCaretLeftLight, PiCaretRightLight } from 'react-icons/pi'
import { getMonthAvailability } from '../services/api'
import { useApiData } from '../hooks/useApiData'
import DemoNotice from './DemoNotice'

const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

function toKey(date) {
  return date.toISOString().slice(0, 10)
}

function startOfToday() {
  const d = new Date()
  d.setHours(0, 0, 0, 0)
  return d
}

// Only used while the real availability API is unreachable, so the calendar
// still looks and behaves like a real one in that state — not a claim about
// actual opening hours (see DemoNotice below, which discloses exactly that).
function fallbackClosedDates(year, month) {
  const closed = []
  const daysInMonth = new Date(year, month, 0).getDate()
  for (let d = 1; d <= daysInMonth; d++) {
    if (new Date(year, month - 1, d).getDay() === 0) closed.push(toKey(new Date(year, month - 1, d)))
  }
  return closed
}

export default function BookingCalendar({ serviceId, durationMinutes, value, onChange }) {
  const [cursor, setCursor] = useState(() => {
    const d = startOfToday()
    d.setDate(1)
    return d
  })
  const today = startOfToday()
  const year = cursor.getFullYear()
  const month = cursor.getMonth() + 1

  const availabilityState = useApiData(
    () => getMonthAvailability({ service: serviceId, durationMinutes, year, month }),
    { fallback: { closedDates: fallbackClosedDates(year, month) }, deps: [serviceId, durationMinutes, year, month] },
  )
  const closedDates = useMemo(() => new Set(availabilityState.data?.closedDates || []), [availabilityState.data])

  const days = useMemo(() => {
    const firstOfMonth = new Date(cursor)
    const startWeekday = (firstOfMonth.getDay() + 6) % 7 // Monday = 0
    const gridStart = new Date(firstOfMonth)
    gridStart.setDate(firstOfMonth.getDate() - startWeekday)

    return Array.from({ length: 42 }, (_, i) => {
      const date = new Date(gridStart)
      date.setDate(gridStart.getDate() + i)
      return date
    })
  }, [cursor])

  function dayState(date) {
    const inMonth = date.getMonth() === cursor.getMonth()
    if (!inMonth) return 'hidden'
    if (date < today) return 'past'
    if (closedDates.has(toKey(date))) return 'closed'
    return 'open'
  }

  return (
    <div className="border border-forest/10 bg-white p-6">
      <div className="mb-6 flex items-center justify-between">
        <button
          type="button"
          aria-label="Previous month"
          onClick={() => setCursor((c) => new Date(c.getFullYear(), c.getMonth() - 1, 1))}
          disabled={cursor.getFullYear() === today.getFullYear() && cursor.getMonth() === today.getMonth()}
          className="flex h-10 w-10 items-center justify-center border border-forest/15 text-forest transition-colors hover:border-gold hover:text-gold disabled:opacity-25 disabled:hover:border-forest/15 disabled:hover:text-forest"
        >
          <PiCaretLeftLight className="text-lg" />
        </button>
        <p className="font-display text-xl text-forest">
          {new Intl.DateTimeFormat('en-GB', { month: 'long', year: 'numeric' }).format(cursor)}
        </p>
        <button
          type="button"
          aria-label="Next month"
          onClick={() => setCursor((c) => new Date(c.getFullYear(), c.getMonth() + 1, 1))}
          className="flex h-10 w-10 items-center justify-center border border-forest/15 text-forest transition-colors hover:border-gold hover:text-gold"
        >
          <PiCaretRightLight className="text-lg" />
        </button>
      </div>

      {availabilityState.isFallback && (
        <div className="mb-4">
          <DemoNotice>Preview calendar. Connect the availability API to show real opening days.</DemoNotice>
        </div>
      )}

      <div className="grid grid-cols-7 gap-1.5 text-center sm:gap-2">
        {WEEKDAYS.map((d) => (
          <span key={d} className="py-2 font-body text-[0.65rem] font-semibold uppercase tracking-[0.12em] text-dark/35">
            {d}
          </span>
        ))}
        {days.map((date) => {
          const state = dayState(date)
          const selected = value && toKey(date) === toKey(value)
          const isToday = toKey(date) === toKey(today)

          if (state === 'hidden') return <span key={date.toISOString()} aria-hidden="true" />

          return (
            <button
              key={date.toISOString()}
              type="button"
              disabled={state !== 'open'}
              aria-pressed={selected}
              aria-current={isToday ? 'date' : undefined}
              aria-label={`${date.toDateString()}${state !== 'open' ? ', unavailable' : ''}`}
              onClick={() => onChange(date)}
              className={`relative aspect-square font-body text-sm transition-colors ${
                selected
                  ? 'bg-forest font-semibold text-ivory'
                  : state === 'open'
                    ? 'text-forest hover:bg-gold/10 hover:text-gold'
                    : state === 'past'
                      ? 'cursor-not-allowed text-dark/15'
                      : 'cursor-not-allowed bg-dark/[0.03] text-dark/25'
              }`}
            >
              {date.getDate()}
              {isToday && !selected && (
                <span className="absolute bottom-1.5 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-gold" aria-hidden="true" />
              )}
            </button>
          )
        })}
      </div>

      <div className="mt-6 flex items-center justify-center gap-6 border-t border-forest/10 pt-4">
        <span className="flex items-center gap-2 font-body text-[0.65rem] uppercase tracking-[0.1em] text-dark/50">
          <span className="h-2.5 w-2.5 border border-forest/20 bg-white" aria-hidden="true" /> Available
        </span>
        <span className="flex items-center gap-2 font-body text-[0.65rem] uppercase tracking-[0.1em] text-dark/50">
          <span className="h-2.5 w-2.5 bg-dark/[0.06]" aria-hidden="true" /> Unavailable
        </span>
        <span className="flex items-center gap-2 font-body text-[0.65rem] uppercase tracking-[0.1em] text-dark/50">
          <span className="h-2.5 w-2.5 bg-forest" aria-hidden="true" /> Selected
        </span>
      </div>
    </div>
  )
}
