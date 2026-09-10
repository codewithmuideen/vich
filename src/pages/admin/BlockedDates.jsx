import { useState } from 'react'
import { PiPlusLight, PiTrashLight } from 'react-icons/pi'
import PageHeader from '../../components/admin/PageHeader'
import Button from '../../components/Button'
import Loader from '../../components/Loader'
import ErrorMessage from '../../components/ErrorMessage'
import EmptyState from '../../components/EmptyState'
import { useApiData } from '../../hooks/useApiData'
import { adminGetBlockedDates, adminSaveBlockedDate, adminDeleteBlockedDate } from '../../services/api'
import { formatDateLong } from '../../lib/format'

export default function AdminBlockedDates() {
  const { data, loading, error, refetch } = useApiData(() => adminGetBlockedDates())
  const [form, setForm] = useState({ date: '', reason: '' })
  const [saving, setSaving] = useState(false)

  async function handleAdd(e) {
    e.preventDefault()
    if (!form.date) return
    setSaving(true)
    try {
      await adminSaveBlockedDate(form)
      setForm({ date: '', reason: '' })
      refetch()
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('Remove this blocked date?')) return
    await adminDeleteBlockedDate(id)
    refetch()
  }

  return (
    <>
      <PageHeader title="Blocked Dates" description="Block specific dates for holidays or closures. No appointments can be booked on these dates." />

      <form onSubmit={handleAdd} className="mb-8 flex flex-wrap items-end gap-3">
        <div className="flex flex-col gap-2">
          <label className="font-body text-xs font-semibold uppercase tracking-[0.14em] text-forest">Date</label>
          <input
            type="date"
            required
            value={form.date}
            onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
            className="border border-forest/20 bg-white px-4 py-2.5 font-body text-sm outline-none focus:border-gold"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="font-body text-xs font-semibold uppercase tracking-[0.14em] text-forest">Reason (optional)</label>
          <input
            type="text"
            value={form.reason}
            onChange={(e) => setForm((f) => ({ ...f, reason: e.target.value }))}
            placeholder="e.g. Bank Holiday"
            className="border border-forest/20 bg-white px-4 py-2.5 font-body text-sm outline-none focus:border-gold"
          />
        </div>
        <Button type="submit" variant="primary" size="md" disabled={saving}>
          <PiPlusLight /> Block Date
        </Button>
      </form>

      {loading ? (
        <Loader />
      ) : error ? (
        <ErrorMessage message="Could not load blocked dates." onRetry={refetch} />
      ) : !data?.length ? (
        <EmptyState title="No blocked dates" message="Dates you block will appear here." />
      ) : (
        <ul className="max-w-xl divide-y divide-forest/10 border border-forest/10 bg-white">
          {data.map((bd) => (
            <li key={bd.id} className="flex items-center justify-between px-4 py-3 font-body text-sm">
              <div>
                <p className="text-forest">{formatDateLong(bd.date)}</p>
                {bd.reason && <p className="text-xs text-dark/50">{bd.reason}</p>}
              </div>
              <button onClick={() => handleDelete(bd.id)} aria-label="Remove blocked date" className="text-forest hover:text-red-600">
                <PiTrashLight />
              </button>
            </li>
          ))}
        </ul>
      )}
    </>
  )
}
