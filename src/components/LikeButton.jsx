import { useState } from 'react'
import { motion } from 'framer-motion'
import { PiHeartFill, PiHeartLight } from 'react-icons/pi'
import { likeGalleryItem } from '../services/api'

function getLikedIds() {
  try {
    return new Set(JSON.parse(localStorage.getItem('uv_liked_gallery') || '[]'))
  } catch {
    return new Set()
  }
}

function persistLikedIds(ids) {
  localStorage.setItem('uv_liked_gallery', JSON.stringify([...ids]))
}

export default function LikeButton({ id, count = 0, className = '' }) {
  const [liked, setLiked] = useState(() => getLikedIds().has(id))
  const [total, setTotal] = useState(count)
  const [busy, setBusy] = useState(false)

  async function handleClick(e) {
    e.preventDefault()
    e.stopPropagation()
    if (liked || busy) return
    setBusy(true)
    setLiked(true)
    setTotal((t) => t + 1)
    try {
      const data = await likeGalleryItem(id)
      if (typeof data?.likes === 'number') setTotal(data.likes)
      const ids = getLikedIds()
      ids.add(id)
      persistLikedIds(ids)
    } catch {
      setLiked(false)
      setTotal((t) => Math.max(0, t - 1))
    } finally {
      setBusy(false)
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={liked}
      aria-pressed={liked}
      aria-label={liked ? 'You liked this style' : 'Like this style'}
      className={`flex items-center gap-1.5 font-body text-sm font-medium transition-colors ${
        liked ? 'text-gold' : 'text-ivory hover:text-gold-light'
      } ${className}`}
    >
      <motion.span whileTap={{ scale: 1.3 }} className="inline-flex">
        {liked ? <PiHeartFill aria-hidden="true" /> : <PiHeartLight aria-hidden="true" />}
      </motion.span>
      {total}
    </button>
  )
}
