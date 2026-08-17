import { useState } from 'react'
import PageHeader from '../../components/admin/PageHeader'
import StatusBadge from '../../components/admin/StatusBadge'
import Loader from '../../components/Loader'
import ErrorMessage from '../../components/ErrorMessage'
import EmptyState from '../../components/EmptyState'
import { useApiData } from '../../hooks/useApiData'
import { adminGetAppointments, adminUpdateAppointment } from '../../services/api'
import { formatDateLong, formatTime, formatPrice } from '../../lib/format'

const STATUSES = ['PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED', 'NO_SHOW']

export default function AdminAppointments() {
  const [filters, setFilters] = useState({ search: '', status: '', date: '' })
  const [busyId, setBusyId] = useState(null)

  const { data, loading, error, refetch } = useApiData(() => adminGetAppointments(filters), {
    deps: [filters.search, filters.status, filters.date],
  })

  async function updateStatus(id, status) {
    setBusyId(id)
    try {
      await adminUpdateAppointment(id, { status })
      refetch()
    } finally {
      setBusyId(null)
    }
  }

  return (
    <>
      <PageHeader title="Appointments" description="View, search and manage all salon appointments." />

      <div className="mb-6 flex flex-wrap gap-3">
        <input
          type="search"
          placeholder="Search by name, email, reference…"
          value={filters.search}
          onChange={(e) => setFilters((f) => ({ ...f, search: e.target.value }))}
          className="min-w-[220px] flex-1 border border-forest/20 bg-white px-4 py-2.5 font-body text-sm outline-none focus:border-gold"
        />
        <select
          value={filters.status}
          onChange={(e) => setFilters((f) => ({ ...f, status: e.target.value }))}
          className="border border-forest/20 bg-white px-4 py-2.5 font-body text-sm outline-none focus:border-gold"
        >
          <option value="">All Statuses</option>
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <input
          type="date"
          value={filters.date}
          onChange={(e) => setFilters((f) => ({ ...f, date: e.target.value }))}
          className="border border-forest/20 bg-white px-4 py-2.5 font-body text-sm outline-none focus:border-gold"
        />
      </div>

      {loading ? (
        <Loader />
      ) : error ? (
        <ErrorMessage message="Could not load appointments." onRetry={refetch} />
      ) : !data?.length ? (
        <EmptyState title="No appointments found" message="Try adjusting your filters." />
      ) : (
        <div className="overflow-x-auto border border-forest/10 bg-white">
          <table className="w-full min-w-[900px] text-left font-body text-sm">
            <thead className="border-b border-forest/10 bg-forest/5 text-xs uppercase tracking-[0.08em] text-dark/50">
              <tr>
                <th className="px-4 py-3">Reference</th>
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Service</th>
                <th className="px-4 py-3">Date &amp; Time</th>
                <th className="px-4 py-3">Price</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Update</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-forest/10">
              {data.map((appt) => (
                <tr key={appt.id}>
                  <td className="px-4 py-3 font-semibold text-forest">{appt.reference}</td>
                  <td className="px-4 py-3">
                    <p className="text-forest">{appt.customer_name}</p>
                    <p className="text-xs text-dark/50">{appt.customer_email}</p>
                  </td>
                  <td className="px-4 py-3">{appt.service_name}</td>
                  <td className="px-4 py-3">
                    {formatDateLong(appt.date)}
                    <br />
                    <span className="text-xs text-dark/50">{formatTime(appt.time)}</span>
                  </td>
                  <td className="px-4 py-3">{formatPrice(appt.price)}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={appt.status} />
                  </td>
                  <td className="px-4 py-3">
                    <select
                      value={appt.status}
                      disabled={busyId === appt.id}
                      onChange={(e) => updateStatus(appt.id, e.target.value)}
                      className="border border-forest/20 bg-white px-2 py-1.5 text-xs outline-none focus:border-gold"
                    >
                      {STATUSES.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  )
}
