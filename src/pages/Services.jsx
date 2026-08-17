import { useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import SEO from '../components/SEO'
import SectionHeading from '../components/SectionHeading'
import Breadcrumbs from '../components/Breadcrumbs'
import ServiceCard from '../components/ServiceCard'
import DemoNotice from '../components/DemoNotice'
import EmptyState from '../components/EmptyState'
import { useApiData } from '../hooks/useApiData'
import { getServices, getServiceCategories } from '../services/api'
import { PLACEHOLDER_SERVICES, PLACEHOLDER_CATEGORIES } from '../data/placeholders'

export default function Services() {
  const [params, setParams] = useSearchParams()
  const activeCategory = params.get('category') || 'all'

  const categoriesState = useApiData(() => getServiceCategories(), { fallback: PLACEHOLDER_CATEGORIES })
  const servicesState = useApiData(
    () => getServices({ category: activeCategory === 'all' ? undefined : activeCategory }),
    { fallback: PLACEHOLDER_SERVICES, deps: [activeCategory] },
  )

  const filtered = useMemo(() => {
    if (!servicesState.isFallback) return servicesState.data || []
    if (activeCategory === 'all') return PLACEHOLDER_SERVICES
    return PLACEHOLDER_SERVICES.filter((s) => s.category.toLowerCase().replace(/\s+/g, '-') === activeCategory)
  }, [servicesState, activeCategory])

  function selectCategory(slug) {
    if (slug === 'all') {
      params.delete('category')
    } else {
      params.set('category', slug)
    }
    setParams(params, { replace: true })
  }

  return (
    <>
      <SEO
        title="Hair & Beauty Services"
        description="Browse United Vich Enterprise's full range of women's hair services — braids, wigs, natural hair, weaves and more — with transparent pricing and duration."
        path="/services"
      />

      <section className="border-b border-forest/10 bg-white pb-16 pt-12">
        <div className="container-edit flex flex-col gap-6">
          <Breadcrumbs items={[{ name: 'Home', path: '/' }, { name: 'Services', path: '/services' }]} />
          <SectionHeading
            eyebrow="What We Offer"
            title="Our Services"
            description="Every service is delivered with meticulous care, from consultation to final style. Prices shown are starting prices — your consultation will confirm the exact price for your hair."
          />
        </div>
      </section>

      <section className="py-16">
        <div className="container-edit flex flex-col gap-10">
          <div className="flex flex-wrap gap-3" role="tablist" aria-label="Filter services by category">
            <button
              role="tab"
              aria-selected={activeCategory === 'all'}
              onClick={() => selectCategory('all')}
              className={`border px-5 py-2 font-body text-xs font-semibold uppercase tracking-[0.14em] transition-colors ${
                activeCategory === 'all' ? 'border-forest bg-forest text-ivory' : 'border-forest/20 text-forest hover:border-forest'
              }`}
            >
              All
            </button>
            {(categoriesState.data || []).map((cat) => (
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

          {servicesState.isFallback && <DemoNotice />}

          {servicesState.loading ? (
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="aspect-[3/4] animate-pulse bg-forest/5" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <EmptyState title="No services in this category yet" message="Please check back soon or explore another category." />
          ) : (
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((service, index) => (
                <ServiceCard key={service.id} service={service} index={index} />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  )
}
