import { Link } from 'react-router-dom'
import SEO from '../components/SEO'
import SectionHeading from '../components/SectionHeading'
import Breadcrumbs from '../components/Breadcrumbs'
import EditorialImage from '../components/EditorialImage'
import DemoNotice from '../components/DemoNotice'
import EmptyState from '../components/EmptyState'
import { useApiData } from '../hooks/useApiData'
import { getJournalPosts } from '../services/api'
import { PLACEHOLDER_JOURNAL } from '../data/placeholders'

export default function Journal() {
  const postsState = useApiData(() => getJournalPosts(), { fallback: PLACEHOLDER_JOURNAL })

  return (
    <>
      <SEO
        title="Journal"
        description="Hair care tips, style inspiration and salon news from United Vich Enterprise."
        path="/journal"
      />

      <section className="border-b border-forest/10 bg-white pb-16 pt-12">
        <div className="container-edit flex flex-col gap-6">
          <Breadcrumbs items={[{ name: 'Home', path: '/' }, { name: 'Journal', path: '/journal' }]} />
          <SectionHeading eyebrow="From United Vich" title="Journal" description="Hair care guidance and salon updates, written to help you look after your hair between visits." />
        </div>
      </section>

      <section className="py-20">
        <div className="container-edit flex flex-col gap-10">
          {postsState.isFallback && <DemoNotice />}
          {postsState.data?.length === 0 ? (
            <EmptyState title="No articles yet" message="New journal entries will appear here soon." />
          ) : (
            <div className="grid grid-cols-1 gap-10 sm:grid-cols-2">
              {(postsState.data || []).map((post) => (
                <Link key={post.id} to={`/journal/${post.slug}`} className="group flex flex-col gap-4">
                  <div className="overflow-hidden">
                    <div className="transition-transform duration-700 group-hover:scale-105">
                      <EditorialImage src={post.image} alt={post.title} aspect="aspect-[16/10]" />
                    </div>
                  </div>
                  {post.category && (
                    <span className="font-body text-xs font-semibold uppercase tracking-[0.14em] text-gold">{post.category}</span>
                  )}
                  <h2 className="font-display text-2xl text-forest transition-colors group-hover:text-gold">{post.title}</h2>
                  <p className="font-body text-sm leading-relaxed text-dark/60">{post.excerpt}</p>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  )
}
