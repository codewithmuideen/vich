import { useState } from 'react'
import { motion } from 'framer-motion'

/**
 * Full-bleed background photo used behind hero/editorial sections — the
 * still-image counterpart to VideoBackground. No autoplay, no video weight,
 * just a real photo with the same dark gradient overlay treatment so text
 * stays legible on top of it.
 */
export default function ImageBackground({ src, alt = '', overlay = true, className = '' }) {
  const [loaded, setLoaded] = useState(false)

  return (
    <div className={`absolute inset-0 overflow-hidden bg-forest ${className}`}>
      <div
        className="absolute inset-0 bg-gradient-to-br from-forest via-forest-dark to-forest transition-opacity duration-700"
        style={{ opacity: loaded ? 0 : 1 }}
        aria-hidden="true"
      />
      <motion.img
        src={src}
        alt={alt}
        loading="eager"
        decoding="async"
        onLoad={() => setLoaded(true)}
        initial={{ opacity: 0, scale: 1.05 }}
        animate={loaded ? { opacity: 1, scale: 1 } : false}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        className="h-full w-full object-cover"
      />
      {overlay && (
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/35 to-black/55" aria-hidden="true" />
      )}
    </div>
  )
}
