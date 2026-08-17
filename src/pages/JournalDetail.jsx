import { useParams } from 'react-router-dom'
import SEO, { buildBreadcrumbJsonLd } from '../components/SEO'
import Breadcrumbs from '../components/Breadcrumbs'
import EditorialImage from '../components/EditorialImage'
import Loader from '../components/Loader'
import DemoNotice from '../components/DemoNotice'
import Button from '../components/Button'
import { useApiData } from '../hooks/useApiData'
import { getJournalPost } from '../services/api'
import { PLACEHOLDER_JOURNAL } from '../data/placeholders'
import NotFound from './NotFound'

export default function JournalDetail() {
  const { slug } = useParams()
  const postState = useApiData(() => getJournalPost(slug), {
    fallback: PLACEHOLDER_JOURNAL.find((p) => p.slug === slug),
    deps: [slug],
  })

  const post = postState.data

  if (postState.loading) return <Loader />
  if (!post) return <NotFound />

  const breadcrumbItems = [
    { name: 'Home', path: '/' },
    { name: 'Journal', path: '/journal' },
    { name: post.title, path: `/journal/${slug}` },
  ]

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt,
    datePublished: post.published_at,
    dateModified: post.updated_at || post.published_at,
    author: { '@type': 'Organization', name: post.author || 'United Vich Enterprise' },
  }

  return (
    <>
      <SEO
        title={post.seo_title || post.title}
        description={post.seo_description || post.excerpt}
        path={`/journal/${slug}`}
        image={post.image}
        type="article"
        jsonLd={jsonLd}
        breadcrumbJsonLd={buildBreadcrumbJsonLd(breadcrumbItems)}
      />

      {postState.isFallback && <DemoNotice />}

      <article>
        <EditorialImage src={post.image} alt={post.title} aspect="aspect-[21/9]" eager />
        <div className="container-edit max-w-3xl py-16">
          <Breadcrumbs items={breadcrumbItems} />
          {post.category && (
            <span className="mt-6 block font-body text-xs font-semibold uppercase tracking-[0.14em] text-gold">{post.category}</span>
          )}
          <h1 className="mt-3 font-display text-4xl leading-tight text-forest sm:text-5xl">{post.title}</h1>
          {post.published_at && (
            <p className="mt-3 font-body text-xs uppercase tracking-[0.14em] text-dark/40">
              {new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(post.published_at))}
            </p>
          )}

          <div className="prose-uv mt-10 flex flex-col gap-5 font-body text-base leading-relaxed text-dark/75">
            {post.content ? (
              post.content.split('\n\n').map((para, i) => <p key={i}>{para}</p>)
            ) : (
              <p>{post.excerpt}</p>
            )}
          </div>

          <div className="mt-14 border-t border-forest/10 pt-10 text-center">
            <Button to="/book-appointment" variant="primary" size="lg">
              Book an Appointment
            </Button>
          </div>
        </div>
      </article>
    </>
  )
}
