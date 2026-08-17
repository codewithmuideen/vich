import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import EditorialImage from './EditorialImage'
import LikeButton from './LikeButton'

export default function GalleryCard({ item, index = 0, span = 'aspect-[4/5]' }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.7, delay: (index % 4) * 0.06, ease: [0.16, 1, 0.3, 1] }}
      className="group relative block overflow-hidden"
    >
      <Link to={`/gallery/${item.slug}`} className="block">
        <div className="transition-transform duration-700 ease-out group-hover:scale-[1.05]">
          <EditorialImage src={item.image} alt={item.title} label={item.category} aspect={span} />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-dark/75 via-dark/0 to-dark/0 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      </Link>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-5 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
        <div>
          {item.category && (
            <span className="font-body text-[0.6rem] font-semibold uppercase tracking-[0.2em] text-gold-light">
              {item.category}
            </span>
          )}
          <p className="font-display text-lg text-ivory">{item.title}</p>
        </div>
        <div className="pointer-events-auto">
          <LikeButton id={item.id} count={item.likes} />
        </div>
      </div>
    </motion.article>
  )
}
