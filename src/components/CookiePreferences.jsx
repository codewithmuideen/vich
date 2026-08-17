import { useState } from 'react'
import Modal from './Modal'
import Button from './Button'
import { useCookieConsent } from '../context/CookieConsentContext'

const CATEGORIES = [
  {
    key: 'necessary',
    label: 'Necessary',
    description: 'Required for core site functionality such as booking and security. Always active.',
    locked: true,
  },
  {
    key: 'analytics',
    label: 'Analytics',
    description: 'Helps us understand how visitors use the site so we can improve it (e.g. Google Analytics).',
  },
  {
    key: 'marketing',
    label: 'Marketing',
    description: 'Used to measure the effectiveness of any marketing campaigns.',
  },
  {
    key: 'preferences',
    label: 'Preferences',
    description: 'Remembers choices you make to personalise your experience.',
  },
]

export default function CookiePreferences({ open, onClose }) {
  const { preferences, savePreferences } = useCookieConsent()
  const [draft, setDraft] = useState(preferences)

  function toggle(key) {
    setDraft((d) => ({ ...d, [key]: !d[key] }))
  }

  function handleSave() {
    savePreferences(draft)
  }

  return (
    <Modal open={open} onClose={onClose} title="Cookie Preferences" maxWidth="max-w-xl">
      <div className="flex flex-col gap-6">
        <p className="font-body text-sm leading-relaxed text-dark/70">
          Choose which optional cookies you&rsquo;re happy for us to use. You can change these preferences at
          any time from the footer of the site.
        </p>

        <div className="flex flex-col divide-y divide-forest/10 border border-forest/10">
          {CATEGORIES.map((category) => (
            <div key={category.key} className="flex items-start justify-between gap-6 p-5">
              <div>
                <p className="font-body text-sm font-semibold text-forest">{category.label}</p>
                <p className="mt-1 font-body text-xs leading-relaxed text-dark/60">{category.description}</p>
              </div>
              <label className="relative inline-flex shrink-0 cursor-pointer items-center">
                <input
                  type="checkbox"
                  className="peer sr-only"
                  checked={!!draft[category.key]}
                  disabled={category.locked}
                  onChange={() => toggle(category.key)}
                />
                <span className="h-6 w-11 rounded-full bg-dark/15 transition-colors peer-checked:bg-forest peer-disabled:opacity-60" />
                <span className="absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform peer-checked:translate-x-5" />
              </label>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap justify-end gap-3">
          <Button variant="outline" size="md" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" size="md" onClick={handleSave}>
            Save Preferences
          </Button>
        </div>
      </div>
    </Modal>
  )
}
