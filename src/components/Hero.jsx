import { motion } from 'framer-motion'
import { PiArrowDownLight } from 'react-icons/pi'
import Button from './Button'
import VideoBackground from './VideoBackground'

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.14, delayChildren: 0.15 } },
}

const item = {
  hidden: { opacity: 0, y: 26 },
  show: { opacity: 1, y: 0, transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] } },
}

export default function Hero() {
  return (
    <section className="relative flex min-h-[92vh] w-full items-center overflow-hidden bg-forest">
      <VideoBackground src="/videos/bg1.mp4" />

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="container-edit relative z-10 flex flex-col gap-8 py-32"
      >
        <motion.span
          variants={item}
          className="flex items-center gap-3 font-body text-xs font-semibold uppercase tracking-[0.3em] text-gold-light"
        >
          <span className="h-px w-10 bg-gold-light" />
          Premium Women&rsquo;s Hair &amp; Beauty Salon
        </motion.span>

        <motion.h1
          variants={item}
          className="max-w-3xl font-display text-6xl font-medium leading-[1.02] text-ivory sm:text-7xl lg:text-8xl"
        >
          Your Hair.
          <br />
          Your Crown.
        </motion.h1>

        <motion.p variants={item} className="max-w-md font-body text-base leading-relaxed text-ivory/80 sm:text-lg">
          Beautiful styles. Exceptional care.
        </motion.p>

        <motion.div variants={item} className="flex flex-wrap items-center gap-4 pt-2">
          <Button to="/book-appointment" variant="gold" size="lg">
            Book an Appointment
          </Button>
          <Button to="/services" variant="outlineLight" size="lg">
            Explore Our Services
          </Button>
        </motion.div>
      </motion.div>

      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 text-ivory/70"
        aria-hidden="true"
      >
        <PiArrowDownLight className="text-2xl" />
      </motion.div>
    </section>
  )
}
