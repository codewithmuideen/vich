import { useState } from 'react'
import { PiPlusLight, PiTrashLight } from 'react-icons/pi'
import PageHeader from '../../components/admin/PageHeader'
import Button from '../../components/Button'
import Loader from '../../components/Loader'
import ErrorMessage from '../../components/ErrorMessage'
import EmptyState from '../../components/EmptyState'
import { useApiData } from '../../hooks/useApiData'
import { adminGetCategories, adminSaveCategory, adminDeleteCategory } from '../../services/api'

export default function AdminCategories() {
  const { data, loading, error, refetch } = useApiData(() => adminGetCategories())
  const [name, setName] = useState('')
  const [saving, setSaving] = useState(false)

  async function handleAdd(e) {
    e.preventDefault()
    if (!name.trim()) return
    setSaving(true)
    try {
      await adminSaveCategory({ name })
      setName('')
      refetch()
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete this category?')) return
    await adminDeleteCategory(id)
    refetch()
  }

  return (
    <>
      <PageHeader title="Categories" description="Manage service and gallery categories." />

      <form onSubmit={handleAdd} className="mb-8 flex max-w-md gap-3">
        <input
          type="text"
          placeholder="New category name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="flex-1 border border-forest/20 bg-white px-4 py-2.5 font-body text-sm outline-none focus:border-gold"
        />
        <Button type="submit" variant="primary" size="md" disabled={saving}>
          <PiPlusLight /> Add
        </Button>
      </form>

      {loading ? (
        <Loader />
      ) : error ? (
        <ErrorMessage message="Could not load categories." onRetry={refetch} />
      ) : !data?.length ? (
        <EmptyState title="No categories yet" message="Add your first category above." />
      ) : (
        <ul className="max-w-md divide-y divide-forest/10 border border-forest/10 bg-white">
          {data.map((cat) => (
            <li key={cat.id} className="flex items-center justify-between px-4 py-3 font-body text-sm">
              {cat.name}
              <button onClick={() => handleDelete(cat.id)} aria-label={`Delete ${cat.name}`} className="text-forest hover:text-red-600">
                <PiTrashLight />
              </button>
            </li>
          ))}
        </ul>
      )}
    </>
  )
}
