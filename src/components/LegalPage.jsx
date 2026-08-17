import SEO from './SEO'
import Breadcrumbs from './Breadcrumbs'
import SectionHeading from './SectionHeading'

export default function LegalPage({ title, path, description, updated, children }) {
  return (
    <>
      <SEO title={title} description={description} path={path} />
      <section className="border-b border-forest/10 bg-white pb-16 pt-12">
        <div className="container-edit flex flex-col gap-6">
          <Breadcrumbs items={[{ name: 'Home', path: '/' }, { name: title, path }]} />
          <SectionHeading eyebrow="Legal" title={title} />
        </div>
      </section>
      <section className="py-16">
        <div className="container-edit flex max-w-3xl flex-col gap-6 font-body text-sm leading-relaxed text-dark/75">
          {updated && <p className="text-xs uppercase tracking-[0.14em] text-dark/40">Last updated: {updated}</p>}
          <div className="border border-dashed border-gold/40 bg-gold/5 px-4 py-3 text-xs text-forest/70">
            This page provides a structural placeholder for {title.toLowerCase()}. Final legal wording should be
            reviewed and approved by United Vich Enterprise and, where appropriate, a qualified legal advisor
            before this site goes live.
          </div>
          {children}
        </div>
      </section>
    </>
  )
}
