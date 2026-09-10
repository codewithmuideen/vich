import { useState } from 'react'
import { PiPlusLight, PiPencilSimpleLight, PiTrashLight, PiHeartLight } from 'react-icons/pi'
import PageHeader from '../../components/admin/PageHeader'
import Button from '../../components/Button'
import Modal from '../../components/Modal'
import Loader from '../../components/Loader'
import ErrorMessage from '../../components/ErrorMessage'
import EmptyState from '../../components/EmptyState'
import EditorialImage from '../../components/EditorialImage'
import { useApiData } from '../../hooks/useApiData'
import { adminGetGallery, adminSaveGalleryItem, adminDeleteGalleryItem, getServiceCategories } from '../../services/api'

const EMPTY_FORM = { id: null, title: '', category_id: '', description: '', featured: false, imageFile: null }

export default function AdminGallery() {
  const { data, loading, error, refetch } = useApiData(() => adminGetGallery())
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

  function openEdit(item) {
    setForm({
      id: item.id,
      title: item.title,
      category_id: item.category_id ?? '',
      description: item.description ?? '',
      featured: !!item.featured,
      imageFile: null,
    })
    setSaveError('')
    setModalOpen(true)
  }

  async function handleSave(e) {
    e.preventDefault()
    setSaving(true)
    setSaveError('')
    try {
      // Image files are uploaded straight to the Supabase Storage "media"
      // bucket (see uploadImage() in services/api.js) before the row is saved.
      await adminSaveGalleryItem(form)
      setModalOpen(false)
      refetch()
    } catch (err) {
      setSaveError(err.message)
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete this gallery image?')) return
    await adminDeleteGalleryItem(id)
    refetch()
  }

  return (
    <>
      <PageHeader
        title="Gallery"
        description="Manage hairstyle gallery images."
        action={
          <Button variant="primary" size="md" onClick={openCreate}>
            <PiPlusLight /> New Image
          </Button>
        }
      />

      {loading ? (
        <Loader />
      ) : error ? (
        <ErrorMessage message="Could not load gallery." onRetry={refetch} />
      ) : !data?.length ? (
        <EmptyState title="No gallery images yet" message="Upload your first image to get started." />
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {data.map((item) => (
            <div key={item.id} className="group relative border border-forest/10 bg-white">
              <EditorialImage src={item.image} alt={item.title} aspect="aspect-square" reveal={false} />
              <div className="flex items-center justify-between gap-2 p-3">
                <div className="min-w-0">
                  <p className="truncate font-body text-sm font-semibold text-forest">{item.title}</p>
                  <p className="flex items-center gap-1 font-body text-xs text-dark/50">
                    <PiHeartLight /> {item.likes ?? 0}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <button onClick={() => openEdit(item)} aria-label={`Edit ${item.title}`} className="text-forest hover:text-gold">
                    <PiPencilSimpleLight />
                  </button>
                  <button onClick={() => handleDelete(item.id)} aria-label={`Delete ${item.title}`} className="text-forest hover:text-red-600">
                    <PiTrashLight />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={form.id ? 'Edit Image' : 'New Image'}>
        <form onSubmit={handleSave} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label className="font-body text-xs font-semibold uppercase tracking-[0.14em] text-forest">Image</label>
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={(e) => setForm((f) => ({ ...f, imageFile: e.target.files?.[0] || null }))}
              className="font-body text-sm"
            />
            <p className="font-body text-xs text-dark/40">JPG, PNG or WEBP. Validated server-side for type, size and dimensions.</p>
          </div>

          <div className="flex flex-col gap-2">
            <label className="font-body text-xs font-semibold uppercase tracking-[0.14em] text-forest">Title</label>
            <input
              required
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              className="border border-forest/20 bg-white px-4 py-3 font-body text-sm outline-none focus:border-gold"
            />
          </div>

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

          <label className="flex items-center gap-2 font-body text-sm text-forest">
            <input type="checkbox" checked={form.featured} onChange={(e) => setForm((f) => ({ ...f, featured: e.target.checked }))} />
            Feature this image
          </label>

          {saveError && <p className="font-body text-sm text-red-700">{saveError}</p>}

          <Button type="submit" variant="primary" size="lg" disabled={saving} className="w-fit">
            {saving ? 'Saving…' : 'Save Image'}
          </Button>
        </form>
      </Modal>
    </>
  )
}
