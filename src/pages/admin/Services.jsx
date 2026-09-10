import { useState } from 'react'
import { PiPlusLight, PiPencilSimpleLight, PiTrashLight } from 'react-icons/pi'
import PageHeader from '../../components/admin/PageHeader'
import Button from '../../components/Button'
import Modal from '../../components/Modal'
import Loader from '../../components/Loader'
import ErrorMessage from '../../components/ErrorMessage'
import EmptyState from '../../components/EmptyState'
import { useApiData } from '../../hooks/useApiData'
import { adminGetServices, adminSaveService, adminDeleteService, getServiceCategories } from '../../services/api'
import { formatPrice, formatDuration } from '../../lib/format'

const EMPTY_FORM = {
  id: null,
  name: '',
  category_id: '',
  description: '',
  price: '',
  duration_minutes: '',
  status: 'active',
  featured: false,
}

export default function AdminServices() {
  const { data, loading, error, refetch } = useApiData(() => adminGetServices())
  const { data: categories } = useApiData(() => getServiceCategories(), { fallback: [] })
  const [modalOpen, setModalOpen] = useState(false)
  const [form, setForm] = useState(EMPTY_FORM)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState('')

  function openCreate() {
    setForm(EMPTY_FORM)
    setSaveError('')
    setModalOpen(true)
  }

  function openEdit(service) {
    setForm({
      id: service.id,
      name: service.name,
      category_id: service.category_id ?? '',
      description: service.description ?? '',
      price: service.price ?? '',
      duration_minutes: service.duration_minutes ?? '',
      status: service.status ?? 'active',
      featured: !!service.featured,
    })
    setSaveError('')
    setModalOpen(true)
  }

  async function handleSave(e) {
    e.preventDefault()
    setSaving(true)
    setSaveError('')
    try {
      await adminSaveService(form)
      setModalOpen(false)
      refetch()
    } catch (err) {
      setSaveError(err.message)
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete this service? This cannot be undone.')) return
    await adminDeleteService(id)
    refetch()
  }

  return (
    <>
      <PageHeader
        title="Services"
        description="Manage the salon's service catalogue."
        action={
          <Button variant="primary" size="md" onClick={openCreate}>
            <PiPlusLight /> New Service
          </Button>
        }
      />

      {loading ? (
        <Loader />
      ) : error ? (
        <ErrorMessage message="Could not load services." onRetry={refetch} />
      ) : !data?.length ? (
        <EmptyState title="No services yet" message="Create your first service to get started." />
      ) : (
        <div className="overflow-x-auto border border-forest/10 bg-white">
          <table className="w-full min-w-[800px] text-left font-body text-sm">
            <thead className="border-b border-forest/10 bg-forest/5 text-xs uppercase tracking-[0.08em] text-dark/50">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Price</th>
                <th className="px-4 py-3">Duration</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Featured</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-forest/10">
              {data.map((s) => (
                <tr key={s.id}>
                  <td className="px-4 py-3 font-semibold text-forest">{s.name}</td>
                  <td className="px-4 py-3">{s.category}</td>
                  <td className="px-4 py-3">{formatPrice(s.price)}</td>
                  <td className="px-4 py-3">{formatDuration(s.duration_minutes)}</td>
                  <td className="px-4 py-3 capitalize">{s.status}</td>
                  <td className="px-4 py-3">{s.featured ? 'Yes' : 'No'}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <button onClick={() => openEdit(s)} aria-label={`Edit ${s.name}`} className="text-forest hover:text-gold">
                        <PiPencilSimpleLight className="text-lg" />
                      </button>
                      <button onClick={() => handleDelete(s.id)} aria-label={`Delete ${s.name}`} className="text-forest hover:text-red-600">
                        <PiTrashLight className="text-lg" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={form.id ? 'Edit Service' : 'New Service'}>
        <form onSubmit={handleSave} className="flex flex-col gap-4">
          <TextField label="Name" required value={form.name} onChange={(v) => setForm((f) => ({ ...f, name: v }))} />

          <div className="flex flex-col gap-2">
            <label className="font-body text-xs font-semibold uppercase tracking-[0.14em] text-forest">Category</label>
            <select
              value={form.category_id}
              onChange={(e) => setForm((f) => ({ ...f, category_id: e.target.value }))}
              className="border border-forest/20 bg-white px-4 py-3 font-body text-sm outline-none focus:border-gold"
            >
              <option value="">Select category</option>
              {(categories || []).map((c) => (
                <option key={c.id ?? c.slug} value={c.id ?? c.slug}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <label className="font-body text-xs font-semibold uppercase tracking-[0.14em] text-forest">Description</label>
            <textarea
              rows={3}
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              className="border border-forest/20 bg-white px-4 py-3 font-body text-sm outline-none focus:border-gold"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <TextField label="Price (£)" type="number" required value={form.price} onChange={(v) => setForm((f) => ({ ...f, price: v }))} />
            <TextField
              label="Duration (min)"
              type="number"
              required
              value={form.duration_minutes}
              onChange={(v) => setForm((f) => ({ ...f, duration_minutes: v }))}
            />
          </div>

          <div className="flex items-center gap-6">
            <div className="flex flex-col gap-2">
              <label className="font-body text-xs font-semibold uppercase tracking-[0.14em] text-forest">Status</label>
              <select
                value={form.status}
                onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}
                className="border border-forest/20 bg-white px-4 py-2 font-body text-sm outline-none focus:border-gold"
              >
                <option value="active">Active</option>
                <option value="disabled">Disabled</option>
              </select>
            </div>
            <label className="flex items-center gap-2 font-body text-sm text-forest">
              <input
                type="checkbox"
                checked={form.featured}
                onChange={(e) => setForm((f) => ({ ...f, featured: e.target.checked }))}
              />
              Featured on homepage
            </label>
          </div>

          {saveError && <p className="font-body text-sm text-red-700">{saveError}</p>}

          <Button type="submit" variant="primary" size="lg" disabled={saving} className="w-fit">
            {saving ? 'Saving…' : 'Save Service'}
          </Button>
        </form>
      </Modal>
    </>
  )
}

function TextField({ label, type = 'text', required, value, onChange }) {
  return (
    <div className="flex flex-col gap-2">
      <label className="font-body text-xs font-semibold uppercase tracking-[0.14em] text-forest">{label}</label>
      <input
        type={type}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="border border-forest/20 bg-white px-4 py-3 font-body text-sm outline-none focus:border-gold"
      />
    </div>
  )
}
