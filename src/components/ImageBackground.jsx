import { useEffect, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'

/**
 * Full-bleed background photograph used behind hero/editorial sections, with
 * a slow Ken Burns drift and a gradient overlay for text legibility.
 */
export default function ImageBackground({ src, alt = '', overlay = true, eager = false, className = '' }) {
  const [loaded, setLoaded] = useState(false)
  const prefersReducedMotion = useReducedMotion()

  useEffect(() => {
    const img = new Image()
    img.src = src
    img.onload = () => setLoaded(true)
    if (img.complete) setLoaded(true)
  }, [src])

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
        loading={eager ? 'eager' : 'lazy'}
        fetchPriority={eager ? 'high' : 'auto'}
        decoding="async"
        initial={{ opacity: 0, scale: 1.08 }}
        animate={
          loaded
            ? prefersReducedMotion
              ? { opacity: 1, scale: 1 }
              : { opacity: 1, scale: 1.08 }
            : { opacity: 0 }
        }
        transition={
          prefersReducedMotion
            ? { duration: 1 }
            : { opacity: { duration: 1 }, scale: { duration: 18, ease: 'linear' } }
        }
        className="h-full w-full object-cover"
      />
      {overlay && (
        <div
          className="absolute inset-0 bg-gradient-to-t from-forest-dark/85 via-forest-dark/40 to-forest-dark/55"
          aria-hidden="true"
        />
      )}
    </div>
  )
}
