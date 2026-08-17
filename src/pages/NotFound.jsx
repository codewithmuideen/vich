import SEO from '../components/SEO'
import Button from '../components/Button'

export default function NotFound() {
  return (
    <>
      <SEO title="Page Not Found" description="The page you're looking for could not be found." path="/404" noIndex />
      <section className="flex min-h-[70vh] flex-col items-center justify-center gap-6 px-6 text-center">
        <span className="font-display text-8xl text-gold/30">404</span>
        <h1 className="font-display text-3xl text-forest">This page has gone for a trim</h1>
        <p className="max-w-sm font-body text-sm text-dark/60">
          The page you&rsquo;re looking for doesn&rsquo;t exist or may have moved. Let&rsquo;s get you back on track.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Button to="/" variant="primary" size="md">
            Return Home
          </Button>
          <Button to="/services" variant="outline" size="md">
            Browse Services
          </Button>
        </div>
      </section>
    </>
  )
}
