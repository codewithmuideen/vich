import { useEffect, useMemo, useState } from 'react'
import { PiCaretLeftLight, PiCaretRightLight } from 'react-icons/pi'
import { getMonthAvailability } from '../services/api'

const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

function toKey(date) {
  return date.toISOString().slice(0, 10)
}

function startOfToday() {
  const d = new Date()
  d.setHours(0, 0, 0, 0)
  return d
}

export default function BookingCalendar({ serviceId, value, onChange }) {
  const [cursor, setCursor] = useState(() => {
    const d = startOfToday()
    d.setDate(1)
    return d
  })
  const [closedDates, setClosedDates] = useState(null) // null = unknown (backend not reachable yet)

  useEffect(() => {
    let cancelled = false
    getMonthAvailability({ service: serviceId, year: cursor.getFullYear(), month: cursor.getMonth() + 1 })
      .then((data) => {
        if (!cancelled) setClosedDates(new Set(data?.closedDates || []))
      })
      .catch(() => {
        if (!cancelled) setClosedDates(null)
      })
    return () => {
      cancelled = true
    }
  }, [serviceId, cursor])

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

  const today = startOfToday()

  function isDisabled(date) {
    if (date < today) return true
    if (date.getMonth() !== cursor.getMonth()) return true
    const key = toKey(date)
    if (closedDates && closedDates.has(key)) return true
    // Fallback assumption only while backend availability is unreachable —
    // not a claim about real opening hours, purely so the demo stays usable.
    if (closedDates === null && date.getDay() === 0) return true
    return false
  }

  return (
    <div className="border border-forest/10 bg-white p-6">
      <div className="mb-4 flex items-center justify-between">
        <button
          type="button"
          aria-label="Previous month"
          onClick={() => setCursor((c) => new Date(c.getFullYear(), c.getMonth() - 1, 1))}
          disabled={cursor.getFullYear() === today.getFullYear() && cursor.getMonth() === today.getMonth()}
          className="flex h-9 w-9 items-center justify-center border border-forest/15 text-forest disabled:opacity-30"
        >
          <PiCaretLeftLight />
        </button>
        <p className="font-display text-lg text-forest">
          {new Intl.DateTimeFormat('en-GB', { month: 'long', year: 'numeric' }).format(cursor)}
        </p>
        <button
          type="button"
          aria-label="Next month"
          onClick={() => setCursor((c) => new Date(c.getFullYear(), c.getMonth() + 1, 1))}
          className="flex h-9 w-9 items-center justify-center border border-forest/15 text-forest"
        >
          <PiCaretRightLight />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center">
        {WEEKDAYS.map((d) => (
          <span key={d} className="py-2 font-body text-[0.65rem] font-semibold uppercase tracking-[0.1em] text-dark/40">
            {d}
          </span>
        ))}
        {days.map((date) => {
          const disabled = isDisabled(date)
          const selected = value && toKey(date) === toKey(value)
          const inMonth = date.getMonth() === cursor.getMonth()
          return (
            <button
              key={date.toISOString()}
              type="button"
              disabled={disabled}
              aria-pressed={selected}
              aria-label={date.toDateString()}
              onClick={() => onChange(date)}
              className={`aspect-square font-body text-sm transition-colors ${
                !inMonth ? 'invisible' : ''
              } ${
                selected
                  ? 'bg-forest text-ivory'
                  : disabled
                    ? 'text-dark/20 line-through'
                    : 'text-forest hover:bg-forest/10'
              }`}
            >
              {date.getDate()}
            </button>
          )
        })}
      </div>
    </div>
  )
}
