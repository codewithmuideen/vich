const STYLES = {
  PENDING: 'bg-amber-100 text-amber-800',
  CONFIRMED: 'bg-emerald-100 text-emerald-800',
  COMPLETED: 'bg-forest/10 text-forest',
  CANCELLED: 'bg-red-100 text-red-700',
  NO_SHOW: 'bg-dark/10 text-dark/60',
  APPROVED: 'bg-emerald-100 text-emerald-800',
  REJECTED: 'bg-red-100 text-red-700',
}

export default function StatusBadge({ status }) {
  return (
    <span className={`inline-block px-2.5 py-1 font-body text-[0.65rem] font-semibold uppercase tracking-[0.08em] ${STYLES[status] || 'bg-dark/10 text-dark/60'}`}>
      {status?.replace('_', ' ')}
    </span>
  )
}
