import { useMemo } from 'react'
import SEO from '../components/SEO'
import SectionHeading from '../components/SectionHeading'
import Breadcrumbs from '../components/Breadcrumbs'
import DemoNotice from '../components/DemoNotice'
import { useApiData } from '../hooks/useApiData'
import { getFaqs } from '../services/api'
import { PLACEHOLDER_FAQS } from '../data/placeholders'

export default function FAQ() {
  const faqState = useApiData(() => getFaqs(), { fallback: PLACEHOLDER_FAQS })

  const jsonLd = useMemo(() => {
    if (!faqState.data?.length) return null
    return {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqState.data.map((f) => ({
        '@type': 'Question',
        name: f.question,
        acceptedAnswer: { '@type': 'Answer', text: f.answer },
      })),
    }
  }, [faqState.data])

  return (
    <>
      <SEO
        title="Frequently Asked Questions"
        description="Answers to common questions about booking, pricing, preparation and appointments at United Vich Enterprise."
        path="/faq"
        jsonLd={jsonLd}
      />

      <section className="border-b border-forest/10 bg-white pb-16 pt-12">
        <div className="container-edit flex flex-col gap-6">
          <Breadcrumbs items={[{ name: 'Home', path: '/' }, { name: 'FAQ', path: '/faq' }]} />
          <SectionHeading eyebrow="Good to Know" title="Frequently Asked Questions" />
        </div>
      </section>

      <section className="py-20">
        <div className="container-edit max-w-3xl">
          {faqState.isFallback && <DemoNotice />}
          <div className="flex flex-col divide-y divide-forest/10 border-y border-forest/10">
            {(faqState.data || []).map((faq) => (
              <details key={faq.question} className="group py-6">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-display text-lg text-forest">
                  {faq.question}
                  <span className="text-gold transition-transform group-open:rotate-45">+</span>
                </summary>
                <p className="mt-3 font-body text-sm leading-relaxed text-dark/70">{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
