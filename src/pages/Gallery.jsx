import { useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import SEO from '../components/SEO'
import SectionHeading from '../components/SectionHeading'
import Breadcrumbs from '../components/Breadcrumbs'
import GalleryCard from '../components/GalleryCard'
import DemoNotice from '../components/DemoNotice'
import EmptyState from '../components/EmptyState'
import { useApiData } from '../hooks/useApiData'
import { getGallery } from '../services/api'
import { PLACEHOLDER_GALLERY, PLACEHOLDER_CATEGORIES } from '../data/placeholders'

const CATEGORY_TABS = [{ slug: 'all', name: 'All' }, ...PLACEHOLDER_CATEGORIES]
const SPANS = ['aspect-[4/5]', 'aspect-square', 'aspect-[3/4]', 'aspect-[4/5]']

export default function Gallery() {
  const [params, setParams] = useSearchParams()
  const activeCategory = params.get('category') || 'all'

  const galleryState = useApiData(
    () => getGallery({ category: activeCategory === 'all' ? undefined : activeCategory }),
    { fallback: PLACEHOLDER_GALLERY, deps: [activeCategory] },
  )

  const filtered = useMemo(() => {
    if (!galleryState.isFallback) return galleryState.data || []
    if (activeCategory === 'all') return PLACEHOLDER_GALLERY
    return PLACEHOLDER_GALLERY.filter((g) => g.category.toLowerCase().replace(/\s+/g, '-') === activeCategory)
  }, [galleryState, activeCategory])

  function selectCategory(slug) {
    if (slug === 'all') params.delete('category')
    else params.set('category', slug)
    setParams(params, { replace: true })
  }

  return (
    <>
      <SEO
        title="Hairstyle Gallery"
        description="Explore real hairstyle inspiration from United Vich Enterprise — braids, wigs, natural hair, weaves and more."
        path="/gallery"
      />

      <section className="border-b border-forest/10 bg-white pb-16 pt-12">
        <div className="container-edit flex flex-col gap-6">
          <Breadcrumbs items={[{ name: 'Home', path: '/' }, { name: 'Gallery', path: '/gallery' }]} />
          <SectionHeading
            eyebrow="Style Gallery"
            title="Find Your Next Look"
            description="Browse our collection of hairstyles by category, save your favourites, and book the style that speaks to you."
          />
        </div>
      </section>

      <section className="py-16">
        <div className="container-edit flex flex-col gap-10">
          <div className="flex flex-wrap gap-3" role="tablist" aria-label="Filter gallery by category">
            {CATEGORY_TABS.map((cat) => (
              <button
                key={cat.slug}
                role="tab"
                aria-selected={activeCategory === cat.slug}
                onClick={() => selectCategory(cat.slug)}
                className={`border px-5 py-2 font-body text-xs font-semibold uppercase tracking-[0.14em] transition-colors ${
                  activeCategory === cat.slug ? 'border-forest bg-forest text-ivory' : 'border-forest/20 text-forest hover:border-forest'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {galleryState.isFallback && <DemoNotice />}

          {galleryState.loading ? (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="aspect-[4/5] animate-pulse bg-forest/5" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <EmptyState title="No styles in this category yet" message="Please check back soon." />
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {filtered.map((item, index) => (
                <GalleryCard key={item.id} item={item} index={index} span={SPANS[index % SPANS.length]} />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  )
}
