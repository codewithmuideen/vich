import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { PiArrowUpLight } from 'react-icons/pi'

export default function ScrollToTopButton() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 600)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          aria-label="Scroll to top"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 12 }}
          transition={{ duration: 0.3 }}
          className="fixed bottom-24 right-24 z-40 flex h-11 w-11 items-center justify-center border border-forest/15 bg-ivory text-forest shadow-md transition-colors hover:bg-forest hover:text-ivory sm:bottom-6 print:hidden"
        >
          <PiArrowUpLight className="text-lg" aria-hidden="true" />
        </motion.button>
      )}
    </AnimatePresence>
  )
}
