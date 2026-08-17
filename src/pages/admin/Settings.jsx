import { useEffect, useState } from 'react'
import PageHeader from '../../components/admin/PageHeader'
import Button from '../../components/Button'
import Loader from '../../components/Loader'
import ErrorMessage from '../../components/ErrorMessage'
import { useApiData } from '../../hooks/useApiData'
import { adminGetSettings, adminSaveSettings } from '../../services/api'

const SECTIONS = [
  {
    title: 'Business Details',
    fields: [
      ['business_name', 'Business Name'],
      ['phone', 'Phone Number'],
      ['whatsapp_number', 'WhatsApp Number (with country code)'],
      ['email', 'Email Address'],
    ],
  },
  {
    title: 'Address',
    fields: [
      ['address_line1', 'Address Line 1'],
      ['address_line2', 'Address Line 2'],
      ['city', 'City'],
      ['postcode', 'Postcode'],
      ['google_maps_url', 'Google Maps Embed URL'],
    ],
  },
  {
    title: 'Social Links',
    fields: [
      ['instagram_url', 'Instagram URL'],
      ['facebook_url', 'Facebook URL'],
      ['tiktok_url', 'TikTok URL'],
      ['google_business_url', 'Google Business Profile URL'],
    ],
  },
  {
    title: 'SEO Defaults',
    fields: [
      ['seo_default_title', 'Default SEO Title'],
      ['seo_default_description', 'Default SEO Description'],
      ['seo_default_og_image', 'Default OG Image URL'],
    ],
  },
  {
    title: 'Analytics',
    fields: [
      ['analytics_ga4_id', 'Google Analytics 4 ID'],
      ['analytics_gtm_id', 'Google Tag Manager ID'],
    ],
  },
]

export default function AdminSettings() {
  const { data, loading, error, refetch } = useApiData(() => adminGetSettings())
  const [form, setForm] = useState(null)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    if (data) setForm(data)
  }, [data])

  function update(key, value) {
    setForm((f) => ({ ...f, [key]: value }))
    setSaved(false)
  }

  async function handleSave(e) {
    e.preventDefault()
    setSaving(true)
    try {
      await adminSaveSettings(form)
      setSaved(true)
      refetch()
    } finally {
      setSaving(false)
    }
  }

  if (loading || !form) return <Loader />
  if (error) return <ErrorMessage message="Could not load settings." onRetry={refetch} />

  return (
    <>
      <PageHeader title="Settings" description="Business details that power the whole site — header, footer, SEO tags and booking flow." />

      <form onSubmit={handleSave} className="flex max-w-3xl flex-col gap-10">
        {SECTIONS.map((section) => (
          <div key={section.title} className="flex flex-col gap-4">
            <h2 className="font-display text-xl text-forest">{section.title}</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {section.fields.map(([key, label]) => (
                <div key={key} className="flex flex-col gap-2">
                  <label className="font-body text-xs font-semibold uppercase tracking-[0.14em] text-forest">{label}</label>
                  <input
                    value={form[key] || ''}
                    onChange={(e) => update(key, e.target.value)}
                    className="border border-forest/20 bg-white px-4 py-3 font-body text-sm outline-none focus:border-gold"
                  />
                </div>
              ))}
            </div>
          </div>
        ))}

        <div className="flex items-center gap-4">
          <Button type="submit" variant="primary" size="lg" disabled={saving}>
            {saving ? 'Saving…' : 'Save Settings'}
          </Button>
          {saved && <span className="font-body text-sm text-forest">Saved.</span>}
        </div>
      </form>
    </>
  )
}
