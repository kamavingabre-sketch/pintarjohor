'use client'
import { useState } from 'react'
import { BookOpen } from 'lucide-react'

const COVER_COLORS = [
  'linear-gradient(135deg, #1B4332, #2D6A4F)',
  'linear-gradient(135deg, #7B2D8B, #B5179E)',
  'linear-gradient(135deg, #3A86FF, #06AED5)',
  'linear-gradient(135deg, #FB8500, #FFB703)',
  'linear-gradient(135deg, #E63946, #C1121F)',
  'linear-gradient(135deg, #40916C, #52B788)',
  'linear-gradient(135deg, #3A0CA3, #4361EE)',
  'linear-gradient(135deg, #9B2226, #C1121F)',
  'linear-gradient(135deg, #264653, #2A9D8F)',
  'linear-gradient(135deg, #6D6875, #B5838D)',
]

function hashColor(str) {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i)
    hash |= 0
  }
  return COVER_COLORS[Math.abs(hash) % COVER_COLORS.length]
}

export default function BookCover({ title, author, coverQuery, className = '', size = 'md' }) {
  const [imgLoaded, setImgLoaded] = useState(false)
  const [imgError, setImgError] = useState(false)
  const [triedIsbn, setTriedIsbn] = useState(false)

  const gradient = hashColor(title || 'book')

  // Try Open Library cover by title
  const olCoverUrl = `https://covers.openlibrary.org/b/title/${encodeURIComponent(title)}-M.jpg`

  const handleError = () => {
    if (!triedIsbn) {
      // Try author search fallback via Google Books thumbnail
      setTriedIsbn(true)
    } else {
      setImgError(true)
    }
  }

  const sizeClasses = {
    sm:  'w-full h-44',
    md:  'w-full h-56',
    lg:  'w-full h-72',
    xl:  'w-full h-80',
  }

  return (
    <div
      className={`relative overflow-hidden rounded-t-2xl ${sizeClasses[size]} ${className}`}
      style={{ background: gradient }}
    >
      {/* Open Library cover image */}
      {!imgError && (
        <img
          src={triedIsbn
            ? `https://covers.openlibrary.org/b/title/${coverQuery}-S.jpg`
            : olCoverUrl
          }
          alt={title}
          onLoad={() => setImgLoaded(true)}
          onError={handleError}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${imgLoaded ? 'opacity-100' : 'opacity-0'}`}
        />
      )}

      {/* Fallback art */}
      {(!imgLoaded || imgError) && (
        <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
          {/* Spine */}
          <div className="absolute left-0 top-0 bottom-0 w-3 opacity-30"
            style={{ background: 'rgba(0,0,0,0.4)', borderRight: '1px solid rgba(255,255,255,0.15)' }}
          />
          {/* Decorative lines */}
          <div className="space-y-1.5 w-3/4 mb-4">
            {[100, 80, 65, 80, 55].map((w, i) => (
              <div key={i} className="h-1 rounded-full opacity-30"
                style={{ width: `${w}%`, background: 'rgba(255,255,255,0.7)' }}
              />
            ))}
          </div>
          <BookOpen className="w-8 h-8 opacity-40 text-white mb-3" />
          {/* Title on fallback */}
          <div className="text-center px-2">
            <p className="text-white text-xs font-bold leading-snug line-clamp-3 opacity-80">{title}</p>
            {author && <p className="text-white/50 text-[10px] mt-1 line-clamp-1">{author}</p>}
          </div>
        </div>
      )}
    </div>
  )
}
