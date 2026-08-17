import { useMemo } from 'react'
import { useParams } from 'react-router-dom'
import { PiCheckCircleLight, PiClockLight } from 'react-icons/pi'
import SEO, { buildBreadcrumbJsonLd } from '../components/SEO'
import Breadcrumbs from '../components/Breadcrumbs'
import EditorialImage from '../components/EditorialImage'
import Button from '../components/Button'
import ServiceCard from '../components/ServiceCard'
import ReviewCard from '../components/ReviewCard'
import Loader from '../components/Loader'
import DemoNotice from '../components/DemoNotice'
import { useApiData } from '../hooks/useApiData'
import { getService, getServices } from '../services/api'
import { formatPrice, formatDuration } from '../lib/format'
import { PLACEHOLDER_SERVICES } from '../data/placeholders'
import NotFound from './NotFound'

export default function ServiceDetail() {
  const { slug } = useParams()

  const serviceState = useApiData(() => getService(slug), {
    fallback: PLACEHOLDER_SERVICES.find((s) => s.slug === slug),
    deps: [slug],
  })
  const relatedState = useApiData(() => getServices({ limit: 3, exclude: slug }), {
    fallback: PLACEHOLDER_SERVICES.filter((s) => s.slug !== slug).slice(0, 3),
    deps: [slug],
  })

  const service = serviceState.data

  const jsonLd = useMemo(() => {
    if (!service) return null
    return {
      '@context': 'https://schema.org',
      '@type': 'Service',
      serviceType: service.name,
      provider: { '@type': 'HairSalon', name: 'United Vich Enterprise' },
      description: service.description,
      offers: service.price_from
        ? { '@type': 'Offer', priceCurrency: 'GBP', price: service.price_from }
        : undefined,
    }
  }, [service])

  const breadcrumbItems = [
    { name: 'Home', path: '/' },
    { name: 'Services', path: '/services' },
    { name: service?.name || slug, path: `/services/${slug}` },
  ]

  if (serviceState.loading) return <Loader fullScreen={false} />
  if (!service) return <NotFound />

  return (
    <>
      <SEO
        title={service.name}
        description={service.description}
        path={`/services/${slug}`}
        image={service.image}
        jsonLd={jsonLd}
        breadcrumbJsonLd={buildBreadcrumbJsonLd(breadcrumbItems)}
      />

      {serviceState.isFallback && <DemoNotice />}

      <section className="grid grid-cols-1 lg:grid-cols-2">
        <EditorialImage
          src={service.image}
          alt={service.name}
          label={service.category}
          aspect="aspect-[4/5] lg:aspect-auto lg:h-full"
          eager
        />
        <div className="flex flex-col justify-center gap-6 px-6 py-16 sm:px-12 lg:px-16">
          <Breadcrumbs items={breadcrumbItems} />
          {service.category && (
            <span className="font-body text-xs font-semibold uppercase tracking-[0.2em] text-gold">
              {service.category}
            </span>
          )}
          <h1 className="font-display text-5xl leading-[1.05] text-forest sm:text-6xl">{service.name}</h1>
          <p className="max-w-md font-body text-base leading-relaxed text-dark/70">{service.description}</p>

          <div className="flex items-center gap-8 border-y border-forest/10 py-6">
            <div>
              <p className="font-body text-xs uppercase tracking-[0.14em] text-dark/40">From</p>
              <p className="font-display text-2xl text-forest">{formatPrice(service.price_from ?? service.price)}</p>
            </div>
            {service.duration_minutes && (
              <div>
                <p className="font-body text-xs uppercase tracking-[0.14em] text-dark/40">Duration</p>
                <p className="flex items-center gap-1 font-display text-2xl text-forest">
                  <PiClockLight className="text-lg" aria-hidden="true" />
                  {formatDuration(service.duration_minutes)}
                </p>
              </div>
            )}
          </div>

          <Button to={`/book-appointment?service=${service.slug}`} variant="primary" size="lg" className="w-fit">
            Book This Service
          </Button>
        </div>
      </section>

      {(service.included || service.preparation || service.aftercare) && (
        <section className="border-t border-forest/10 bg-white py-20">
          <div className="container-edit grid grid-cols-1 gap-12 lg:grid-cols-3">
            {service.included && (
              <InfoBlock title="What's Included" items={service.included} />
            )}
            {service.preparation && (
              <InfoBlock title="Preparation Instructions" items={service.preparation} />
            )}
            {service.aftercare && (
              <InfoBlock title="Aftercare Instructions" items={service.aftercare} />
            )}
          </div>
        </section>
      )}

      {service.faqs?.length > 0 && (
        <section className="py-20">
          <div className="container-edit flex flex-col gap-8">
            <h2 className="font-display text-3xl text-forest">Frequently Asked Questions</h2>
            <div className="flex flex-col divide-y divide-forest/10 border-y border-forest/10">
              {service.faqs.map((faq) => (
                <details key={faq.question} className="group py-5">
                  <summary className="cursor-pointer list-none font-body text-sm font-semibold text-forest">
                    {faq.question}
                  </summary>
                  <p className="mt-3 font-body text-sm leading-relaxed text-dark/70">{faq.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
      )}

      {service.reviews?.length > 0 && (
        <section className="border-t border-forest/10 bg-white py-20">
          <div className="container-edit flex flex-col gap-10">
            <h2 className="font-display text-3xl text-forest">Client Reviews</h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
              {service.reviews.map((review, index) => (
                <ReviewCard key={review.id} review={review} index={index} />
              ))}
            </div>
          </div>
        </section>
      )}

      {relatedState.data?.length > 0 && (
        <section className="border-t border-forest/10 py-20">
          <div className="container-edit flex flex-col gap-10">
            <h2 className="font-display text-3xl text-forest">You May Also Like</h2>
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
              {relatedState.data.slice(0, 3).map((s, index) => (
                <ServiceCard key={s.id} service={s} index={index} />
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="bg-forest">
        <div className="container-edit flex flex-col items-center gap-6 py-16 text-center">
          <h2 className="font-display text-3xl text-ivory">Ready to book your {service.name.toLowerCase()}?</h2>
          <Button to={`/book-appointment?service=${service.slug}`} variant="gold" size="lg">
            Book This Service
          </Button>
        </div>
      </section>
    </>
  )
}

function InfoBlock({ title, items }) {
  return (
    <div className="flex flex-col gap-4">
      <h3 className="font-display text-2xl text-forest">{title}</h3>
      <ul className="flex flex-col gap-3">
        {items.map((item) => (
          <li key={item} className="flex items-start gap-2 font-body text-sm leading-relaxed text-dark/70">
            <PiCheckCircleLight className="mt-0.5 shrink-0 text-gold" aria-hidden="true" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  )
}
