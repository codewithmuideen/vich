import { motion } from 'framer-motion'
import { PiArrowDownLight, PiStarFour } from 'react-icons/pi'
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

const SERVICE_TAGS = ['Braids', 'Wigs', 'Natural Hair', 'Locs', 'Styling']

export default function Hero() {
  return (
    <section className="relative flex min-h-[100svh] w-full items-center overflow-hidden bg-forest">
      <VideoBackground src="/videos/bg2.mp4" />

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
          London&rsquo;s Premium Women&rsquo;s Hair &amp; Beauty Salon
        </motion.span>

        <motion.h1
          variants={item}
          className="max-w-3xl font-display text-6xl font-medium leading-[1.02] text-ivory sm:text-7xl lg:text-8xl"
        >
          Your Hair.
          <br />
          Your Crown.
        </motion.h1>

        <motion.p variants={item} className="max-w-lg font-body text-base leading-relaxed text-ivory/85 sm:text-lg">
          From flawless knotless braids to natural hair care that actually nourishes, every appointment at
          United Vich is crafted around you. Effortless online booking, exceptional results, every time.
        </motion.p>

        <motion.div variants={item} className="flex flex-wrap items-center gap-x-3 gap-y-2 pt-1">
          {SERVICE_TAGS.map((tag, i) => (
            <span key={tag} className="flex items-center gap-3">
              <span className="font-body text-xs font-medium uppercase tracking-[0.14em] text-ivory/70">{tag}</span>
              {i !== SERVICE_TAGS.length - 1 && <PiStarFour className="text-[6px] text-gold-light" aria-hidden="true" />}
            </span>
          ))}
        </motion.div>

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
        className="absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2 text-ivory/70"
        aria-hidden="true"
      >
        <span className="font-body text-[0.6rem] uppercase tracking-[0.3em]">Scroll</span>
        <PiArrowDownLight className="text-xl" />
      </motion.div>
    </section>
  )
}
