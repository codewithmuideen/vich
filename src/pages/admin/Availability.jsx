import { useEffect, useState } from 'react'
import PageHeader from '../../components/admin/PageHeader'
import Button from '../../components/Button'
import Loader from '../../components/Loader'
import ErrorMessage from '../../components/ErrorMessage'
import { useApiData } from '../../hooks/useApiData'
import { adminGetAvailability, adminSaveAvailability } from '../../services/api'

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

function defaultHours() {
  return DAYS.map((day) => ({ day, open: '09:00', close: '18:00', closed: day === 'Sunday' }))
}

export default function AdminAvailability() {
  const { data, loading, error, refetch } = useApiData(() => adminGetAvailability(), { fallback: defaultHours() })
  const [hours, setHours] = useState(null)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    if (data) setHours(data)
  }, [data])

  function update(index, patch) {
    setHours((h) => h.map((row, i) => (i === index ? { ...row, ...patch } : row)))
    setSaved(false)
  }

  async function handleSave() {
    setSaving(true)
    try {
      await adminSaveAvailability({ opening_hours: hours })
      setSaved(true)
      refetch()
    } finally {
      setSaving(false)
    }
  }

  if (loading || !hours) return <Loader />
  if (error) return <ErrorMessage message="Could not load availability settings." onRetry={refetch} />

  return (
    <>
      <PageHeader title="Availability" description="Set the salon's working days and opening hours. These control which appointment slots customers can book." />

      <div className="max-w-2xl divide-y divide-forest/10 border border-forest/10 bg-white">
        {hours.map((row, index) => (
          <div key={row.day} className="flex flex-wrap items-center gap-4 p-4">
            <span className="w-28 font-body text-sm font-semibold text-forest">{row.day}</span>
            <label className="flex items-center gap-2 font-body text-xs text-dark/60">
              <input type="checkbox" checked={!row.closed} onChange={(e) => update(index, { closed: !e.target.checked })} />
              Open
            </label>
            <input
              type="time"
              disabled={row.closed}
              value={row.open || ''}
              onChange={(e) => update(index, { open: e.target.value })}
              className="border border-forest/20 bg-white px-3 py-2 font-body text-sm outline-none focus:border-gold disabled:opacity-40"
            />
            <span className="text-dark/40">to</span>
            <input
              type="time"
              disabled={row.closed}
              value={row.close || ''}
              onChange={(e) => update(index, { close: e.target.value })}
              className="border border-forest/20 bg-white px-3 py-2 font-body text-sm outline-none focus:border-gold disabled:opacity-40"
            />
          </div>
        ))}
      </div>

      <div className="mt-6 flex items-center gap-4">
        <Button variant="primary" size="md" onClick={handleSave} disabled={saving}>
          {saving ? 'Saving…' : 'Save Availability'}
        </Button>
        {saved && <span className="font-body text-sm text-forest">Saved.</span>}
      </div>
    </>
  )
}
