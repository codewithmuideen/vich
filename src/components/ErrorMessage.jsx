import { PiWarningCircleLight } from 'react-icons/pi'
import Button from './Button'

export default function ErrorMessage({
  title = 'Something went wrong',
  message = 'Please try again in a moment.',
  onRetry,
}) {
  return (
    <div
      role="alert"
      className="flex flex-col items-center gap-4 border border-forest/10 bg-white px-8 py-14 text-center"
    >
      <PiWarningCircleLight className="text-4xl text-gold" aria-hidden="true" />
      <div className="flex flex-col gap-1">
        <p className="font-display text-xl text-forest">{title}</p>
        <p className="font-body text-sm text-dark/60">{message}</p>
      </div>
      {onRetry && (
        <Button variant="outline" size="md" onClick={onRetry}>
          Try Again
        </Button>
      )}
    </div>
  )
}
