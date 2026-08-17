import { PiFlowerLotusLight } from 'react-icons/pi'

export default function EmptyState({ title = 'Nothing here yet', message, action }) {
  return (
    <div className="flex flex-col items-center gap-4 border border-dashed border-forest/20 px-8 py-16 text-center">
      <PiFlowerLotusLight className="text-3xl text-forest/30" aria-hidden="true" />
      <div className="flex flex-col gap-1">
        <p className="font-display text-xl text-forest">{title}</p>
        {message && <p className="font-body text-sm text-dark/60">{message}</p>}
      </div>
      {action}
    </div>
  )
}
