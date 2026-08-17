import { useState } from 'react'
import { PiCheckLight, PiXLight, PiTrashLight, PiStarFill, PiStarLight } from 'react-icons/pi'
import PageHeader from '../../components/admin/PageHeader'
import StatusBadge from '../../components/admin/StatusBadge'
import Loader from '../../components/Loader'
import ErrorMessage from '../../components/ErrorMessage'
import EmptyState from '../../components/EmptyState'
import { useApiData } from '../../hooks/useApiData'
import { adminGetReviews, adminModerateReview } from '../../services/api'

function Stars({ rating }) {
  return (
    <span className="flex items-center gap-0.5 text-gold">
      {Array.from({ length: 5 }).map((_, i) => (i < rating ? <PiStarFill key={i} /> : <PiStarLight key={i} />))}
    </span>
  )
}

export default function AdminReviews() {
  const [statusFilter, setStatusFilter] = useState('PENDING')
  const { data, loading, error, refetch } = useApiData(() => adminGetReviews({ status: statusFilter }), {
    deps: [statusFilter],
  })
  const [busyId, setBusyId] = useState(null)

  async function moderate(id, status) {
    setBusyId(id)
    try {
      await adminModerateReview(id, status)
      refetch()
    } finally {
      setBusyId(null)
    }
  }

  return (
    <>
      <PageHeader title="Reviews" description="Approve, reject or remove client reviews before they appear publicly." />

      <div className="mb-6 flex gap-3">
        {['PENDING', 'APPROVED', 'REJECTED'].map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`border px-4 py-2 font-body text-xs font-semibold uppercase tracking-[0.1em] ${
              statusFilter === s ? 'border-forest bg-forest text-ivory' : 'border-forest/20 text-forest'
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {loading ? (
        <Loader />
      ) : error ? (
        <ErrorMessage message="Could not load reviews." onRetry={refetch} />
      ) : !data?.length ? (
        <EmptyState title={`No ${statusFilter.toLowerCase()} reviews`} />
      ) : (
        <div className="flex flex-col gap-4">
          {data.map((review) => (
            <div key={review.id} className="flex flex-col gap-3 border border-forest/10 bg-white p-5 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <p className="font-body text-sm font-semibold text-forest">{review.name}</p>
                  <Stars rating={review.rating} />
                  <StatusBadge status={review.status} />
                </div>
                <p className="mt-2 font-body text-sm text-dark/70">{review.review}</p>
              </div>
              <div className="flex shrink-0 gap-2">
                {review.status !== 'APPROVED' && (
                  <button
                    disabled={busyId === review.id}
                    onClick={() => moderate(review.id, 'APPROVED')}
                    aria-label="Approve review"
                    className="flex h-9 w-9 items-center justify-center border border-forest/15 text-forest hover:bg-forest hover:text-ivory"
                  >
                    <PiCheckLight />
                  </button>
                )}
                {review.status !== 'REJECTED' && (
                  <button
                    disabled={busyId === review.id}
                    onClick={() => moderate(review.id, 'REJECTED')}
                    aria-label="Reject review"
                    className="flex h-9 w-9 items-center justify-center border border-forest/15 text-forest hover:bg-amber-600 hover:text-ivory"
                  >
                    <PiXLight />
                  </button>
                )}
                <button
                  disabled={busyId === review.id}
                  onClick={() => moderate(review.id, 'DELETED')}
                  aria-label="Delete review"
                  className="flex h-9 w-9 items-center justify-center border border-forest/15 text-forest hover:bg-red-600 hover:text-ivory"
                >
                  <PiTrashLight />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  )
}
