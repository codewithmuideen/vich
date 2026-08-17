import { useEffect, useRef, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'

/**
 * Full-bleed background video used behind hero/editorial sections.
 * - Only starts loading once the section is near the viewport (IntersectionObserver).
 * - Skipped entirely on prefers-reduced-motion or Save-Data / slow connections,
 *   falling back to the brand gradient so the section still looks intentional.
 * - Muted/looped/playsInline so mobile Safari & Chrome autoplay it without gestures.
 */
export default function VideoBackground({ src, overlay = true, className = '' }) {
  const containerRef = useRef(null)
  const [shouldLoad, setShouldLoad] = useState(false)
  const [ready, setReady] = useState(false)
  const prefersReducedMotion = useReducedMotion()

  useEffect(() => {
    if (prefersReducedMotion) return
    const connection = navigator.connection || navigator.webkitConnection
    if (connection?.saveData || /^(slow-2g|2g)$/.test(connection?.effectiveType || '')) return

    const node = containerRef.current
    if (!node) return
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setShouldLoad(true)
          observer.disconnect()
        }
      },
      { rootMargin: '200px' },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [prefersReducedMotion])

  return (
    <div ref={containerRef} className={`absolute inset-0 overflow-hidden bg-forest ${className}`}>
      <div
        className="absolute inset-0 bg-gradient-to-br from-forest via-forest-dark to-forest transition-opacity duration-700"
        style={{ opacity: ready ? 0 : 1 }}
        aria-hidden="true"
      />
      {shouldLoad && (
        <motion.video
          initial={{ opacity: 0 }}
          animate={{ opacity: ready ? 1 : 0 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="h-full w-full object-cover"
          src={src}
          autoPlay
          muted
          loop
          playsInline
          preload="none"
          onCanPlay={() => setReady(true)}
          aria-hidden="true"
        />
      )}
      {overlay && (
        <div className="absolute inset-0 bg-gradient-to-t from-forest-dark/80 via-forest-dark/35 to-forest-dark/50" aria-hidden="true" />
      )}
    </div>
  )
}
