import { motion } from 'framer-motion'

const SIGNS = [
  { label: 'Care', direction: 'right', top: '4%', width: '58%', rotate: -2 },
  { label: 'Empathy', direction: 'left', top: '22%', width: '68%', rotate: 1.5 },
  { label: 'Reliable', direction: 'right', top: '40%', width: '50%', rotate: -1 },
  { label: 'London', direction: 'left', top: '58%', width: '44%', rotate: 2 },
]

const pointerClip = {
  right: 'polygon(0 0, 88% 0, 100% 50%, 88% 100%, 0 100%)',
  left: 'polygon(12% 0, 100% 0, 100% 100%, 12% 100%, 0 50%)',
}

/**
 * A decorative signpost — brand-original artwork (not stock photography)
 * used on the About page to point visitors toward the values behind
 * United Vich, standing in for a literal "which way" while photography of
 * the real salon isn't available yet.
 */
export default function Signpost({ className = '' }) {
  return (
    <div className={`relative mx-auto h-[420px] w-full max-w-sm sm:h-[480px] ${className}`} aria-hidden="true">
      {/* Post */}
      <div className="absolute bottom-0 left-1/2 h-full w-3 -translate-x-1/2 rounded-full bg-gradient-to-b from-forest via-forest to-forest-dark shadow-[0_0_0_1px_rgba(168,110,13,0.25)]" />
      <div className="absolute bottom-[-12px] left-1/2 h-4 w-20 -translate-x-1/2 rounded-full bg-forest-dark/40 blur-sm" />

      {SIGNS.map((sign, index) => (
        <motion.div
          key={sign.label}
          initial={{ opacity: 0, x: sign.direction === 'right' ? -24 : 24, rotate: sign.rotate }}
          whileInView={{ opacity: 1, x: 0, rotate: sign.rotate }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.7, delay: index * 0.12, ease: [0.16, 1, 0.3, 1] }}
          style={{
            top: sign.top,
            width: sign.width,
            [sign.direction === 'right' ? 'left' : 'right']: '50%',
            clipPath: pointerClip[sign.direction],
          }}
          className={`absolute flex h-14 items-center bg-gradient-to-r from-gold to-gold-light px-6 shadow-md ${
            sign.direction === 'right' ? 'justify-start pl-7' : 'justify-end pr-7'
          }`}
        >
          <span className="font-display text-lg tracking-wide text-ivory">{sign.label}</span>
        </motion.div>
      ))}
    </div>
  )
}
