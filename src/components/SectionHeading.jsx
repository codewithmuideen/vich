import { motion } from 'framer-motion'

export default function SectionHeading({
  eyebrow,
  title,
  description,
  align = 'left',
  light = false,
  as: Heading = 'h2',
}) {
  const alignClass = align === 'center' ? 'items-center text-center mx-auto' : 'items-start text-left'

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className={`flex max-w-2xl flex-col gap-4 ${alignClass}`}
    >
      {eyebrow && (
        <div className="flex items-center gap-3">
          {align === 'center' && <span className="gold-rule" />}
          <span
            className={`font-body text-xs font-semibold uppercase tracking-[0.28em] ${
              light ? 'text-gold-light' : 'text-gold'
            }`}
          >
            {eyebrow}
          </span>
          <span className="gold-rule" />
        </div>
      )}
      <Heading
        className={`font-display text-balance text-4xl font-medium leading-[1.1] sm:text-5xl ${
          light ? 'text-ivory' : 'text-forest'
        }`}
      >
        {title}
      </Heading>
      {description && (
        <p className={`text-balance font-body text-base leading-relaxed ${light ? 'text-ivory/75' : 'text-dark/70'}`}>
          {description}
        </p>
      )}
    </motion.div>
  )
}
