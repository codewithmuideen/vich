import { PiCheckBold } from 'react-icons/pi'

export default function BookingStepper({ steps, current }) {
  return (
    <ol className="flex items-center gap-2 overflow-x-auto pb-2 sm:gap-4" aria-label="Booking progress">
      {steps.map((label, index) => {
        const stepNum = index + 1
        const done = stepNum < current
        const active = stepNum === current
        return (
          <li key={label} className="flex shrink-0 items-center gap-2 sm:gap-3">
            <span
              aria-current={active ? 'step' : undefined}
              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full font-body text-xs font-semibold transition-colors ${
                done ? 'bg-forest text-ivory' : active ? 'border-2 border-gold text-forest' : 'border border-forest/20 text-dark/30'
              }`}
            >
              {done ? <PiCheckBold /> : stepNum}
            </span>
            <span className={`hidden font-body text-xs uppercase tracking-[0.1em] sm:block ${active ? 'text-forest' : 'text-dark/40'}`}>
              {label}
            </span>
            {stepNum !== steps.length && <span className="h-px w-4 bg-forest/15 sm:w-8" aria-hidden="true" />}
          </li>
        )
      })}
    </ol>
  )
}
