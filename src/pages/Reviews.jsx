import { useState } from 'react'
import { PiStarFill, PiStarLight, PiCheckCircleLight } from 'react-icons/pi'
import SEO from '../components/SEO'
import SectionHeading from '../components/SectionHeading'
import Breadcrumbs from '../components/Breadcrumbs'
import ReviewCard from '../components/ReviewCard'
import Button from '../components/Button'
import DemoNotice from '../components/DemoNotice'
import EmptyState from '../components/EmptyState'
import { useApiData } from '../hooks/useApiData'
import { getReviews, submitReview } from '../services/api'
import { PLACEHOLDER_REVIEWS } from '../data/placeholders'

function RatingInput({ value, onChange }) {
  return (
    <div className="flex items-center gap-1" role="radiogroup" aria-label="Rating">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          role="radio"
          aria-checked={value === n}
          aria-label={`${n} star${n > 1 ? 's' : ''}`}
          onClick={() => onChange(n)}
          className="text-2xl text-gold"
        >
          {n <= value ? <PiStarFill /> : <PiStarLight />}
        </button>
      ))}
    </div>
  )
}

export default function Reviews() {
  const reviewsState = useApiData(() => getReviews({ limit: 24 }), { fallback: PLACEHOLDER_REVIEWS })

  const [form, setForm] = useState({ name: '', rating: 5, review: '' })
  const [status, setStatus] = useState('idle') // idle | submitting | success | error
  const [errorMsg, setErrorMsg] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.name.trim() || !form.review.trim()) return
    setStatus('submitting')
    try {
      await submitReview(form)
      setStatus('success')
      setForm({ name: '', rating: 5, review: '' })
    } catch (err) {
      setStatus('error')
      setErrorMsg(err.message)
    }
  }

  return (
    <>
      <SEO
        title="Client Reviews"
        description="Read genuine client reviews for United Vich Enterprise, and share your own experience."
        path="/reviews"
      />

      <section className="border-b border-forest/10 bg-white pb-16 pt-12">
        <div className="container-edit flex flex-col gap-6">
          <Breadcrumbs items={[{ name: 'Home', path: '/' }, { name: 'Reviews', path: '/reviews' }]} />
          <SectionHeading eyebrow="Client Reviews" title="What Our Clients Say" />
        </div>
      </section>

      <section className="py-20">
        <div className="container-edit flex flex-col gap-10">
          {reviewsState.isFallback && <DemoNotice>Preview content — real, approved client reviews will appear here.</DemoNotice>}

          {reviewsState.loading ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="aspect-[4/5] animate-pulse bg-forest/5" />
              ))}
            </div>
          ) : reviewsState.data.length === 0 ? (
            <EmptyState title="No reviews yet" message="Be the first to share your experience with United Vich Enterprise." />
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {reviewsState.data.map((review, index) => (
                <ReviewCard key={review.id} review={review} index={index} />
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="border-t border-forest/10 bg-white py-20">
        <div className="container-edit grid grid-cols-1 gap-12 lg:grid-cols-2">
          <SectionHeading
            eyebrow="Share Your Experience"
            title="Leave a Review"
            description="Your review is sent for approval before it appears publicly, so please allow a short delay."
          />

          {status === 'success' ? (
            <div className="flex flex-col items-center justify-center gap-4 border border-forest/10 bg-ivory p-10 text-center">
              <PiCheckCircleLight className="text-4xl text-gold" aria-hidden="true" />
              <p className="font-display text-xl text-forest">Thank you for your review</p>
              <p className="font-body text-sm text-dark/60">
                It has been submitted for approval and will appear on this page once reviewed by our team.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div className="flex flex-col gap-2">
                <label htmlFor="review-name" className="font-body text-xs font-semibold uppercase tracking-[0.14em] text-forest">
                  Your Name
                </label>
                <input
                  id="review-name"
                  required
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  className="border border-forest/20 bg-white px-4 py-3 font-body text-sm outline-none focus:border-gold"
                />
              </div>

              <div className="flex flex-col gap-2">
                <span className="font-body text-xs font-semibold uppercase tracking-[0.14em] text-forest">Rating</span>
                <RatingInput value={form.rating} onChange={(rating) => setForm((f) => ({ ...f, rating }))} />
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="review-text" className="font-body text-xs font-semibold uppercase tracking-[0.14em] text-forest">
                  Your Review
                </label>
                <textarea
                  id="review-text"
                  required
                  rows={5}
                  value={form.review}
                  onChange={(e) => setForm((f) => ({ ...f, review: e.target.value }))}
                  className="border border-forest/20 bg-white px-4 py-3 font-body text-sm outline-none focus:border-gold"
                />
              </div>

              {status === 'error' && <p className="font-body text-sm text-red-700">{errorMsg}</p>}

              <Button type="submit" variant="primary" size="lg" disabled={status === 'submitting'} className="w-fit">
                {status === 'submitting' ? 'Submitting…' : 'Submit Review'}
              </Button>
            </form>
          )}
        </div>
      </section>
    </>
  )
}
