import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { PiArrowUpRightLight, PiClockLight } from 'react-icons/pi'
import EditorialImage from './EditorialImage'
import { formatPrice, formatDuration } from '../lib/format'

export default function ServiceCard({ service, index = 0 }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.7, delay: (index % 3) * 0.08, ease: [0.16, 1, 0.3, 1] }}
      className="group flex flex-col"
    >
      <Link to={`/services/${service.slug}`} className="block overflow-hidden">
        <div className="transition-transform duration-700 ease-out group-hover:scale-[1.04]">
          <EditorialImage
            src={service.image}
            alt={service.name}
            label={service.category}
            aspect="aspect-[3/4]"
          />
        </div>
      </Link>

      <div className="flex flex-1 flex-col gap-3 border border-t-0 border-forest/10 p-6">
        {service.category && (
          <span className="font-body text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-gold">
            {service.category}
          </span>
        )}
        <Link to={`/services/${service.slug}`}>
          <h3 className="font-display text-2xl text-forest transition-colors group-hover:text-gold">
            {service.name}
          </h3>
        </Link>
        {service.description && (
          <p className="line-clamp-2 font-body text-sm leading-relaxed text-dark/60">{service.description}</p>
        )}

        <div className="mt-2 flex items-center justify-between border-t border-forest/10 pt-4 font-body text-sm">
          <span className="font-semibold text-forest">From {formatPrice(service.price_from ?? service.price)}</span>
          {service.duration_minutes && (
            <span className="flex items-center gap-1 text-dark/50">
              <PiClockLight aria-hidden="true" />
              {formatDuration(service.duration_minutes)}
            </span>
          )}
        </div>

        <div className="mt-2 flex items-center gap-4">
          <Link
            to={`/services/${service.slug}`}
            className="font-body text-xs font-semibold uppercase tracking-[0.14em] text-forest hover:text-gold"
          >
            View Service
          </Link>
          <Link
            to={`/book-appointment?service=${service.slug}`}
            className="flex items-center gap-1 font-body text-xs font-semibold uppercase tracking-[0.14em] text-gold hover:text-gold-light"
          >
            Book Now <PiArrowUpRightLight aria-hidden="true" />
          </Link>
        </div>
      </div>
    </motion.article>
  )
}
