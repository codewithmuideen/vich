import { motion } from 'framer-motion'
import { PiHeartLight, PiSparkleLight, PiShieldCheckLight, PiHandHeartLight } from 'react-icons/pi'
import SEO from '../components/SEO'
import SectionHeading from '../components/SectionHeading'
import Breadcrumbs from '../components/Breadcrumbs'
import EditorialImage from '../components/EditorialImage'
import Signpost from '../components/Signpost'
import Button from '../components/Button'

const PILLARS = [
  { icon: PiHeartLight, title: 'Care', description: 'Every client is treated with genuine attention, from consultation to finished style.' },
  { icon: PiSparkleLight, title: 'Empathy', description: 'We take the time to understand what you want your hair to say about you.' },
  { icon: PiShieldCheckLight, title: 'Reliability', description: 'Transparent pricing, honest timelines, and appointments that respect your time.' },
  { icon: PiHandHeartLight, title: 'Craft', description: 'Techniques refined through practice, applied with patience and precision.' },
]

export default function About() {
  return (
    <>
      <SEO
        title="About Us"
        description="Learn about United Vich Enterprise — a premium women's hair and beauty salon built on care, empathy and reliability."
        path="/about"
      />

      <section className="border-b border-forest/10 bg-white pb-16 pt-12">
        <div className="container-edit flex flex-col gap-6">
          <Breadcrumbs items={[{ name: 'Home', path: '/' }, { name: 'About', path: '/about' }]} />
          <SectionHeading eyebrow="About United Vich" title="Our Story" />
        </div>
      </section>

      <section className="py-20">
        <div className="container-edit grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col gap-5"
          >
            <p className="font-body text-base leading-relaxed text-dark/70">
              United Vich Enterprise was founded on a simple belief: that great hair care starts with genuinely
              caring about the person in the chair. Our name carries three words that guide everything we
              do — Care, Empathy, Reliable — and they are more than a motto; they are how we work.
            </p>
            <p className="font-body text-base leading-relaxed text-dark/70">
              We are a women&rsquo;s hair and beauty salon offering braiding, natural hair care, wig
              installation and styling services. Full details of our history, team and milestones will be
              added here as they are confirmed by the business.
            </p>
          </motion.div>
          <Signpost />
        </div>
      </section>

      <section className="border-t border-forest/10 bg-white py-20">
        <div className="container-edit grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          <EditorialImage src="/images/gallery/natural-hair-2.jpg" alt="Natural hair styling at United Vich" aspect="aspect-[4/5]" className="order-last lg:order-first" />
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col gap-5"
          >
            <span className="font-body text-xs font-semibold uppercase tracking-[0.28em] text-gold">Our Approach</span>
            <h2 className="font-display text-4xl text-forest">Considered, not rushed</h2>
            <p className="font-body text-base leading-relaxed text-dark/70">
              Every appointment starts with a proper consultation — your hair&rsquo;s condition, your goals, and
              how much time you actually have. We&rsquo;d rather talk you out of a style that won&rsquo;t suit
              your hair than rush you into one.
            </p>
            <p className="font-body text-base leading-relaxed text-dark/70">
              That same care carries through to aftercare guidance, so your style looks as good in week three as
              it did on day one.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="border-t border-forest/10 bg-white py-20">
        <div className="container-edit flex flex-col gap-12">
          <SectionHeading eyebrow="Our Philosophy" title="What guides our approach" align="center" />
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {PILLARS.map((pillar, index) => (
              <motion.div
                key={pillar.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.6, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
                className="flex flex-col items-center gap-3 text-center"
              >
                <pillar.icon className="text-3xl text-gold" aria-hidden="true" />
                <h3 className="font-display text-xl text-forest">{pillar.title}</h3>
                <p className="font-body text-sm leading-relaxed text-dark/60">{pillar.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-forest">
        <div className="container-edit flex flex-col items-center gap-6 py-20 text-center">
          <SectionHeading eyebrow="Why Clients Choose Us" title="Come and see for yourself" light align="center" />
          <Button to="/book-appointment" variant="gold" size="lg">
            Book an Appointment
          </Button>
        </div>
      </section>
    </>
  )
}
