import { useState } from 'react'
import { motion } from 'framer-motion'
import { PiFlowerLotusLight } from 'react-icons/pi'

/**
 * Renders real photography when `src` is supplied. Until the business
 * provides actual salon/hairstyle photography, falls back to an elegant,
 * clearly-labelled placeholder — never a stock photo pretending to be a
 * United Vich client result (see brand rule: no fabricated imagery).
 */
export default function EditorialImage({
  src,
  alt,
  label,
  aspect = 'aspect-[4/5]',
  className = '',
  reveal = true,
  eager = false,
}) {
  const [loaded, setLoaded] = useState(false)

  if (!src) {
    return (
      <div
        className={`relative overflow-hidden border border-forest/15 bg-gradient-to-br from-forest/[0.06] via-ivory to-gold/10 ${aspect} ${className}`}
        role="img"
        aria-label={alt || 'Photography placeholder — awaiting salon imagery'}
      >
        <div className="absolute inset-4 border border-gold-light/40" />
        <div className="flex h-full w-full flex-col items-center justify-center gap-3 px-6 text-center">
          <PiFlowerLotusLight className="text-3xl text-forest/30" aria-hidden="true" />
          <p className="font-display text-sm italic text-forest/40">{label || 'Salon photography coming soon'}</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`relative overflow-hidden ${aspect} ${className}`}>
      <motion.img
        src={src}
        alt={alt}
        loading={eager ? 'eager' : 'lazy'}
        decoding="async"
        onLoad={() => setLoaded(true)}
        initial={reveal ? { scale: 1.06, opacity: 0 } : false}
        animate={reveal && loaded ? { scale: 1, opacity: 1 } : false}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        className="h-full w-full object-cover"
      />
    </div>
  )
}
