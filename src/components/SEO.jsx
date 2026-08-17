import { useEffect } from 'react'
import { useSettings } from '../context/SettingsContext'

const SITE_URL = 'https://www.unitedvich.co.uk'

function setMeta(attr, key, content) {
  if (!content) return
  let el = document.head.querySelector(`meta[${attr}="${key}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

function setLink(rel, href) {
  if (!href) return
  let el = document.head.querySelector(`link[rel="${rel}"]`)
  if (!el) {
    el = document.createElement('link')
    el.setAttribute('rel', rel)
    document.head.appendChild(el)
  }
  el.setAttribute('href', href)
}

function setJsonLd(id, data) {
  let el = document.getElementById(id)
  if (!data) {
    if (el) el.remove()
    return
  }
  if (!el) {
    el = document.createElement('script')
    el.type = 'application/ld+json'
    el.id = id
    document.head.appendChild(el)
  }
  el.textContent = JSON.stringify(data)
}

/**
 * Declarative per-page SEO. Renders nothing — writes directly to document.head.
 * noIndex must be explicitly passed; it never defaults to true so public pages
 * can't accidentally end up deindexed.
 */
export default function SEO({
  title,
  description,
  path = '',
  image,
  type = 'website',
  noIndex = false,
  jsonLd = null,
  breadcrumbJsonLd = null,
}) {
  const { settings } = useSettings()

  useEffect(() => {
    const resolvedTitle = title
      ? `${title} | United Vich Enterprise`
      : settings.seo_default_title
    const resolvedDescription = description || settings.seo_default_description
    const resolvedImage = image || settings.seo_default_og_image
    const canonical = `${SITE_URL}${path}`

    document.title = resolvedTitle
    setMeta('name', 'description', resolvedDescription)
    setMeta('name', 'robots', noIndex ? 'noindex, nofollow' : 'index, follow')
    setLink('canonical', canonical)

    setMeta('property', 'og:title', resolvedTitle)
    setMeta('property', 'og:description', resolvedDescription)
    setMeta('property', 'og:type', type)
    setMeta('property', 'og:url', canonical)
    setMeta('property', 'og:image', resolvedImage?.startsWith('http') ? resolvedImage : `${SITE_URL}${resolvedImage}`)
    setMeta('property', 'og:site_name', 'United Vich Enterprise')
    setMeta('property', 'og:locale', 'en_GB')

    setMeta('name', 'twitter:card', 'summary_large_image')
    setMeta('name', 'twitter:title', resolvedTitle)
    setMeta('name', 'twitter:description', resolvedDescription)

    setJsonLd('uv-jsonld-page', jsonLd)
    setJsonLd('uv-jsonld-breadcrumb', breadcrumbJsonLd)
  }, [title, description, path, image, type, noIndex, jsonLd, breadcrumbJsonLd, settings])

  return null
}

export function buildBreadcrumbJsonLd(items) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${SITE_URL}${item.path}`,
    })),
  }
}

export { SITE_URL }
