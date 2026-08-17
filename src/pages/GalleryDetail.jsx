import { useParams } from 'react-router-dom'
import SEO, { buildBreadcrumbJsonLd } from '../components/SEO'
import Breadcrumbs from '../components/Breadcrumbs'
import EditorialImage from '../components/EditorialImage'
import LikeButton from '../components/LikeButton'
import Button from '../components/Button'
import Loader from '../components/Loader'
import DemoNotice from '../components/DemoNotice'
import { useApiData } from '../hooks/useApiData'
import { getGalleryItem } from '../services/api'
import { formatPrice } from '../lib/format'
import { PLACEHOLDER_GALLERY } from '../data/placeholders'
import NotFound from './NotFound'

export default function GalleryDetail() {
  const { slug } = useParams()
  const itemState = useApiData(() => getGalleryItem(slug), {
    fallback: PLACEHOLDER_GALLERY.find((g) => g.slug === slug),
    deps: [slug],
  })

  const item = itemState.data

  if (itemState.loading) return <Loader />
  if (!item) return <NotFound />

  const breadcrumbItems = [
    { name: 'Home', path: '/' },
    { name: 'Gallery', path: '/gallery' },
    { name: item.title, path: `/gallery/${slug}` },
  ]

  return (
    <>
      <SEO
        title={item.title}
        description={item.description || `${item.title} — hairstyle gallery, United Vich Enterprise.`}
        path={`/gallery/${slug}`}
        image={item.image}
        type="article"
        breadcrumbJsonLd={buildBreadcrumbJsonLd(breadcrumbItems)}
      />

      {itemState.isFallback && <DemoNotice />}

      <section className="grid grid-cols-1 lg:grid-cols-2">
        <EditorialImage src={item.image} alt={item.title} label={item.category} aspect="aspect-square lg:aspect-auto lg:h-full" eager />
        <div className="flex flex-col justify-center gap-6 px-6 py-16 sm:px-12 lg:px-16">
          <Breadcrumbs items={breadcrumbItems} />
          {item.category && (
            <span className="font-body text-xs font-semibold uppercase tracking-[0.2em] text-gold">{item.category}</span>
          )}
          <h1 className="font-display text-5xl leading-[1.05] text-forest">{item.title}</h1>
          {item.description && <p className="max-w-md font-body text-base leading-relaxed text-dark/70">{item.description}</p>}

          <div className="flex items-center gap-6 border-y border-forest/10 py-6">
            <LikeButton id={item.id} count={item.likes} className="!text-forest hover:!text-gold" />
            {item.price && (
              <span className="font-body text-sm text-dark/60">From {formatPrice(item.price)}</span>
            )}
          </div>

          <div className="flex flex-wrap gap-4">
            {item.service_slug ? (
              <Button to={`/book-appointment?service=${item.service_slug}`} variant="primary" size="lg">
                Book This Style
              </Button>
            ) : (
              <Button to="/book-appointment" variant="primary" size="lg">
                Book an Appointment
              </Button>
            )}
            <Button to="/gallery" variant="outline" size="lg">
              Back to Gallery
            </Button>
          </div>
        </div>
      </section>
    </>
  )
}
