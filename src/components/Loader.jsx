import { motion } from 'framer-motion'

export default function Loader({ fullScreen = false, label = 'Loading' }) {
  const content = (
    <div className="flex flex-col items-center gap-4">
      <motion.img
        src="/brand/logo.png"
        alt="United Vich Enterprise"
        className="h-14 w-14 object-contain"
        animate={{ opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
      />
      <span className="font-body text-[0.65rem] font-semibold uppercase tracking-[0.3em] text-forest/60">
        {label}
      </span>
    </div>
  )

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-ivory">{content}</div>
    )
  }

  return <div className="flex w-full items-center justify-center py-20">{content}</div>
}
