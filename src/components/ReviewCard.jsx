import { motion } from 'framer-motion'
import { PiStarFill, PiStarLight } from 'react-icons/pi'

function Stars({ rating }) {
  return (
    <div className="flex items-center gap-0.5 text-gold" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) =>
        i < rating ? <PiStarFill key={i} aria-hidden="true" /> : <PiStarLight key={i} aria-hidden="true" />,
      )}
    </div>
  )
}

export default function ReviewCard({ review, index = 0 }) {
  const date = review.created_at
    ? new Intl.DateTimeFormat('en-GB', { month: 'long', year: 'numeric' }).format(new Date(review.created_at))
    : null

  return (
    <motion.figure
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.7, delay: (index % 3) * 0.08, ease: [0.16, 1, 0.3, 1] }}
      className="flex h-full flex-col gap-4 border border-forest/10 bg-white p-8"
    >
      <Stars rating={review.rating} />
      <blockquote className="flex-1 font-display text-lg italic leading-relaxed text-dark/80">
        &ldquo;{review.review}&rdquo;
      </blockquote>
      <figcaption className="flex items-center justify-between border-t border-forest/10 pt-4">
        <span className="font-body text-sm font-semibold text-forest">{review.name}</span>
        {date && <span className="font-body text-xs text-dark/40">{date}</span>}
      </figcaption>
    </motion.figure>
  )
}
