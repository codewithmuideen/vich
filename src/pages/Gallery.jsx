import { useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import SEO from '../components/SEO'
import SectionHeading from '../components/SectionHeading'
import Breadcrumbs from '../components/Breadcrumbs'
import GalleryCard from '../components/GalleryCard'
import VideoGalleryCard from '../components/VideoGalleryCard'
import DemoNotice from '../components/DemoNotice'
import EmptyState from '../components/EmptyState'
import { useApiData } from '../hooks/useApiData'
import { getGallery } from '../services/api'
import { PLACEHOLDER_GALLERY, PLACEHOLDER_CATEGORIES } from '../data/placeholders'

const CATEGORY_TABS = [{ slug: 'all', name: 'All' }, ...PLACEHOLDER_CATEGORIES]
const SPANS = ['aspect-[4/5]', 'aspect-square', 'aspect-[3/4]', 'aspect-[4/5]']

const CRAFT_VIDEOS = [
  { title: 'Braiding, Up Close', src: '/videos/salon-braiding-close-up.mp4', poster: '/images/gallery/poster-salon-braiding-close-up.jpg' },
  { title: 'Parting & Sectioning', src: '/videos/salon-braid-parting.mp4', poster: '/images/gallery/poster-salon-braid-parting.jpg' },
  { title: 'A Locs Session', src: '/videos/salon-locs-session.mp4', poster: '/images/gallery/poster-salon-locs-session.jpg' },
  { title: 'Long Braids, Finished', src: '/videos/salon-braids-portrait.mp4', poster: '/images/gallery/poster-salon-braids-portrait.jpg' },
  { title: 'Twist Detail', src: '/videos/salon-twist-detail-portrait.mp4', poster: '/images/gallery/poster-salon-twist-detail-portrait.jpg' },
]

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
        description="Explore real hairstyle inspiration from United Vich Enterprise, including braids, wigs, natural hair and weaves."
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

      <section className="border-t border-forest/10 bg-white py-16">
        <div className="container-edit flex flex-col gap-10">
          <SectionHeading
            eyebrow="Watch the Craft"
            title="See the styles come together"
            description="A few real clips from behind the chair. Tap any clip to watch."
          />
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {CRAFT_VIDEOS.map((video) => (
              <VideoGalleryCard key={video.src} {...video} />
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
