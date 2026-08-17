import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { PiHeartLight, PiSparkleLight, PiShieldCheckLight } from 'react-icons/pi'
import Hero from '../components/Hero'
import SectionHeading from '../components/SectionHeading'
import Button from '../components/Button'
import ServiceCard from '../components/ServiceCard'
import GalleryCard from '../components/GalleryCard'
import ReviewCard from '../components/ReviewCard'
import DemoNotice from '../components/DemoNotice'
import ImageBackground from '../components/ImageBackground'
import SEO, { SITE_URL } from '../components/SEO'
import { useApiData } from '../hooks/useApiData'
import { useSettings } from '../context/SettingsContext'
import { getServices, getMostLoved, getReviews } from '../services/api'
import { PLACEHOLDER_SERVICES, PLACEHOLDER_GALLERY, PLACEHOLDER_REVIEWS } from '../data/placeholders'

const VALUES = [
  {
    icon: PiHeartLight,
    title: 'Care',
    description: 'Every appointment is treated as personal — your hair, your comfort, your time.',
  },
  {
    icon: PiSparkleLight,
    title: 'Empathy',
    description: 'We listen first. Your goals for your hair shape every recommendation we make.',
  },
  {
    icon: PiShieldCheckLight,
    title: 'Reliable',
    description: 'Clear pricing, honest timing, and appointments that start when they say they will.',
  },
]

export default function Home() {
  const { settings } = useSettings()
  const servicesState = useApiData(() => getServices({ featured: 1, limit: 6 }), {
    fallback: PLACEHOLDER_SERVICES.slice(0, 6),
  })
  const galleryState = useApiData(() => getMostLoved(8), { fallback: PLACEHOLDER_GALLERY })
  const reviewsState = useApiData(() => getReviews({ limit: 3, featured: 1 }), {
    fallback: PLACEHOLDER_REVIEWS,
  })

  const jsonLd = useMemo(() => {
    const openingHoursSpecification = (settings.opening_hours || [])
      .filter((h) => !h.closed)
      .map((h) => ({
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: h.day,
        opens: h.open,
        closes: h.close,
      }))

    return {
      '@context': 'https://schema.org',
      '@type': 'HairSalon',
      name: settings.business_name || 'United Vich Enterprise',
      url: SITE_URL,
      image: `${SITE_URL}/brand/logo.png`,
      email: settings.email || undefined,
      priceRange: '££',
      address: {
        '@type': 'PostalAddress',
        addressLocality: settings.city || 'London',
        addressCountry: 'GB',
      },
      ...(openingHoursSpecification.length ? { openingHoursSpecification } : {}),
    }
  }, [settings])

  return (
    <>
      <SEO
        title="Premium Women's Hair & Beauty Salon"
        description="United Vich Enterprise is a premium women's hair and beauty salon. Browse braids, wigs, natural hair and styling services, and book your appointment online."
        path="/"
        jsonLd={jsonLd}
      />

      <Hero />

      {/* VALUES */}
      <section className="border-b border-forest/10 bg-white py-20">
        <div className="container-edit grid grid-cols-1 gap-10 sm:grid-cols-3">
          {VALUES.map((value, index) => (
            <motion.div
              key={value.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.7, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col items-center gap-4 px-4 text-center"
            >
              <value.icon className="text-4xl text-gold" aria-hidden="true" />
              <h3 className="font-display text-2xl text-forest">{value.title}</h3>
              <p className="max-w-xs font-body text-sm leading-relaxed text-dark/60">{value.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* SERVICES */}
      <section className="py-24">
        <div className="container-edit flex flex-col gap-12">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <SectionHeading
              eyebrow="Our Services"
              title="Signature styles, expertly crafted"
              description="From protective braids to flawless wig installs, every service is delivered with precision and warmth."
            />
            <Button to="/services" variant="outline" size="md">
              View All Services
            </Button>
          </div>

          {servicesState.isFallback && <DemoNotice />}

          {servicesState.loading ? (
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="aspect-[3/4] animate-pulse bg-forest/5" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {servicesState.data.map((service, index) => (
                <ServiceCard key={service.id} service={service} index={index} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* EDITORIAL BANNER */}
      <section className="relative flex min-h-[70vh] items-center overflow-hidden bg-forest">
        <ImageBackground src="/images/hero/portrait-1.jpg" alt="" />
        <div className="container-edit relative z-10 flex flex-col items-start gap-6 py-24">
          <SectionHeading
            eyebrow="The United Vich Experience"
            title="A salon built around you"
            description="From the moment you sit down, every detail — your comfort, your time, your finished look — is considered with care."
            light
          />
          <Button to="/about" variant="outlineLight" size="lg">
            Discover Our Story
          </Button>
        </div>
      </section>

      {/* GALLERY */}
      <section className="bg-white py-24">
        <div className="container-edit flex flex-col gap-12">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <SectionHeading
              eyebrow="Most Loved Styles"
              title="Real results, chosen by our clients"
              description="Browse the styles our community can't stop loving, then book the one that speaks to you."
            />
            <Button to="/gallery" variant="outline" size="md">
              Explore Gallery
            </Button>
          </div>

          {galleryState.isFallback && <DemoNotice />}

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {galleryState.loading
              ? Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="aspect-[4/5] animate-pulse bg-forest/5" />
                ))
              : galleryState.data.map((item, index) => (
                  <GalleryCard key={item.id} item={item} index={index} />
                ))}
          </div>
        </div>
      </section>

      {/* REVIEWS */}
      <section className="py-24">
        <div className="container-edit flex flex-col gap-12">
          <SectionHeading
            eyebrow="What Our Clients Say"
            title="Trusted by women who love their hair"
            align="center"
          />

          {reviewsState.isFallback && <DemoNotice>Preview content — real, approved client reviews will appear here.</DemoNotice>}

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            {(reviewsState.loading ? Array.from({ length: 3 }) : reviewsState.data).map((review, index) =>
              review ? (
                <ReviewCard key={review.id} review={review} index={index} />
              ) : (
                <div key={index} className="aspect-[4/5] animate-pulse bg-forest/5" />
              ),
            )}
          </div>

          <div className="flex justify-center">
            <Button to="/reviews" variant="outline" size="md">
              Read All Reviews
            </Button>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-forest/10 bg-forest">
        <div className="container-edit flex flex-col items-center gap-6 py-24 text-center">
          <SectionHeading
            eyebrow="Ready When You Are"
            title="Your next look is one booking away"
            light
            align="center"
          />
          <Button to="/book-appointment" variant="gold" size="lg">
            Book an Appointment
          </Button>
        </div>
      </section>
    </>
  )
}
