import { useState } from 'react'
import { PiPlayFill } from 'react-icons/pi'

/**
 * A single clip in the "Watch the Craft" video gallery. Shows a still
 * poster with a play button until the visitor chooses to watch it — no
 * autoplay, no ambient looping, nothing plays until asked for.
 */
export default function VideoGalleryCard({ src, poster, title, aspect = 'aspect-[3/4]' }) {
  const [playing, setPlaying] = useState(false)

  return (
    <div className={`group relative overflow-hidden bg-forest/5 ${aspect}`}>
      {playing ? (
        <video
          className="h-full w-full object-cover"
          src={src}
          poster={poster}
          controls
          autoPlay
          playsInline
        />
      ) : (
        <button
          type="button"
          onClick={() => setPlaying(true)}
          aria-label={`Play video: ${title}`}
          className="relative block h-full w-full"
        >
          <img src={poster} alt="" aria-hidden="true" loading="lazy" decoding="async" className="h-full w-full object-cover" />
          <span className="absolute inset-0 bg-black/25 transition-colors group-hover:bg-black/40" aria-hidden="true" />
          <span className="absolute inset-0 flex items-center justify-center">
            <span className="flex h-16 w-16 items-center justify-center rounded-full border border-ivory/70 bg-black/30 text-ivory backdrop-blur-sm transition-transform group-hover:scale-110">
              <PiPlayFill className="text-2xl" aria-hidden="true" />
            </span>
          </span>
          <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-4 pt-10 text-left font-body text-sm font-semibold text-ivory">
            {title}
          </span>
        </button>
      )}
    </div>
  )
}
