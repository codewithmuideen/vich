import { useState } from 'react'
import PageHeader from '../../components/admin/PageHeader'
import Loader from '../../components/Loader'
import ErrorMessage from '../../components/ErrorMessage'
import EmptyState from '../../components/EmptyState'
import { useApiData } from '../../hooks/useApiData'
import { adminGetCustomers } from '../../services/api'

export default function AdminCustomers() {
  const [search, setSearch] = useState('')
  const { data, loading, error, refetch } = useApiData(() => adminGetCustomers({ search }), { deps: [search] })

  return (
    <>
      <PageHeader title="Customers" description="Everyone who has booked an appointment with United Vich Enterprise." />

      <input
        type="search"
        placeholder="Search by name, email or phone…"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-6 w-full max-w-sm border border-forest/20 bg-white px-4 py-2.5 font-body text-sm outline-none focus:border-gold"
      />

      {loading ? (
        <Loader />
      ) : error ? (
        <ErrorMessage message="Could not load customers." onRetry={refetch} />
      ) : !data?.length ? (
        <EmptyState title="No customers yet" message="Customers appear here once they make a booking." />
      ) : (
        <div className="overflow-x-auto border border-forest/10 bg-white">
          <table className="w-full min-w-[700px] text-left font-body text-sm">
            <thead className="border-b border-forest/10 bg-forest/5 text-xs uppercase tracking-[0.08em] text-dark/50">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Phone</th>
                <th className="px-4 py-3">Appointments</th>
                <th className="px-4 py-3">Last Visit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-forest/10">
              {data.map((c) => (
                <tr key={c.id}>
                  <td className="px-4 py-3 font-semibold text-forest">{c.name}</td>
                  <td className="px-4 py-3">{c.email}</td>
                  <td className="px-4 py-3">{c.phone}</td>
                  <td className="px-4 py-3">{c.appointments_count}</td>
                  <td className="px-4 py-3">{c.last_visit || 'N/A'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  )
}
