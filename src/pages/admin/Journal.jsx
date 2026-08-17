import { useState } from 'react'
import { PiPlusLight, PiPencilSimpleLight, PiTrashLight } from 'react-icons/pi'
import PageHeader from '../../components/admin/PageHeader'
import Button from '../../components/Button'
import Modal from '../../components/Modal'
import Loader from '../../components/Loader'
import ErrorMessage from '../../components/ErrorMessage'
import EmptyState from '../../components/EmptyState'
import { useApiData } from '../../hooks/useApiData'
import { adminGetJournalPosts, adminSaveJournalPost, adminDeleteJournalPost } from '../../services/api'

const EMPTY_FORM = {
  id: null,
  title: '',
  slug: '',
  excerpt: '',
  content: '',
  category: '',
  seo_title: '',
  seo_description: '',
  imageFile: null,
}

export default function AdminJournal() {
  const { data, loading, error, refetch } = useApiData(() => adminGetJournalPosts())
  const [modalOpen, setModalOpen] = useState(false)
  const [form, setForm] = useState(EMPTY_FORM)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState('')

  function openCreate() {
    setForm(EMPTY_FORM)
    setSaveError('')
    setModalOpen(true)
  }

  function openEdit(post) {
    setForm({ ...EMPTY_FORM, ...post, imageFile: null })
    setSaveError('')
    setModalOpen(true)
  }

  async function handleSave(e) {
    e.preventDefault()
    setSaving(true)
    setSaveError('')
    try {
      await adminSaveJournalPost(form)
      setModalOpen(false)
      refetch()
    } catch (err) {
      setSaveError(err.message)
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete this journal post?')) return
    await adminDeleteJournalPost(id)
    refetch()
  }

  return (
    <>
      <PageHeader
        title="Journal"
        description="Manage blog articles for SEO and client education."
        action={
          <Button variant="primary" size="md" onClick={openCreate}>
            <PiPlusLight /> New Post
          </Button>
        }
      />

      {loading ? (
        <Loader />
      ) : error ? (
        <ErrorMessage message="Could not load journal posts." onRetry={refetch} />
      ) : !data?.length ? (
        <EmptyState title="No journal posts yet" />
      ) : (
        <div className="flex flex-col divide-y divide-forest/10 border border-forest/10 bg-white">
          {data.map((post) => (
            <div key={post.id} className="flex items-center justify-between gap-4 p-5">
              <div>
                <p className="font-body text-sm font-semibold text-forest">{post.title}</p>
                <p className="font-body text-xs text-dark/50">/{post.slug}</p>
              </div>
              <div className="flex gap-3">
                <button onClick={() => openEdit(post)} aria-label={`Edit ${post.title}`} className="text-forest hover:text-gold">
                  <PiPencilSimpleLight className="text-lg" />
                </button>
                <button onClick={() => handleDelete(post.id)} aria-label={`Delete ${post.title}`} className="text-forest hover:text-red-600">
                  <PiTrashLight className="text-lg" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={form.id ? 'Edit Post' : 'New Post'} maxWidth="max-w-2xl">
        <form onSubmit={handleSave} className="flex flex-col gap-4">
          <TextField label="Title" required value={form.title} onChange={(v) => setForm((f) => ({ ...f, title: v }))} />
          <TextField label="Slug" required value={form.slug} onChange={(v) => setForm((f) => ({ ...f, slug: v }))} />
          <TextField label="Category" value={form.category} onChange={(v) => setForm((f) => ({ ...f, category: v }))} />

          <div className="flex flex-col gap-2">
            <label className="font-body text-xs font-semibold uppercase tracking-[0.14em] text-forest">Featured Image</label>
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={(e) => setForm((f) => ({ ...f, imageFile: e.target.files?.[0] || null }))}
              className="font-body text-sm"
            />
          </div>

          <TextArea label="Excerpt" rows={2} value={form.excerpt} onChange={(v) => setForm((f) => ({ ...f, excerpt: v }))} />
          <TextArea label="Content" rows={8} value={form.content} onChange={(v) => setForm((f) => ({ ...f, content: v }))} />

          <div className="grid grid-cols-1 gap-4 border-t border-forest/10 pt-4 sm:grid-cols-2">
            <TextField label="SEO Title" value={form.seo_title} onChange={(v) => setForm((f) => ({ ...f, seo_title: v }))} />
            <TextField label="SEO Description" value={form.seo_description} onChange={(v) => setForm((f) => ({ ...f, seo_description: v }))} />
          </div>

          {saveError && <p className="font-body text-sm text-red-700">{saveError}</p>}

          <Button type="submit" variant="primary" size="lg" disabled={saving} className="w-fit">
            {saving ? 'Saving…' : 'Save Post'}
          </Button>
        </form>
      </Modal>
    </>
  )
}

function TextField({ label, required, value, onChange }) {
  return (
    <div className="flex flex-col gap-2">
      <label className="font-body text-xs font-semibold uppercase tracking-[0.14em] text-forest">{label}</label>
      <input
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="border border-forest/20 bg-white px-4 py-3 font-body text-sm outline-none focus:border-gold"
      />
    </div>
  )
}

function TextArea({ label, rows, value, onChange }) {
  return (
    <div className="flex flex-col gap-2">
      <label className="font-body text-xs font-semibold uppercase tracking-[0.14em] text-forest">{label}</label>
      <textarea
        rows={rows}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="border border-forest/20 bg-white px-4 py-3 font-body text-sm outline-none focus:border-gold"
      />
    </div>
  )
}
