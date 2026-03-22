'use client'
import { useEffect, useRef, useState } from 'react'
import { Search, ArrowRight, BookOpen, Users, Star, ChevronDown } from 'lucide-react'

const ROTATING_WORDS = ['Belajar', 'Membaca', 'Berkembang', 'Berkarya', 'Berinovasi']

const FLOATING_BOOKS = [
  { title: 'Sejarah Medan',   color: '#1B4332', accent: '#D4A017', rotation: '-8deg',  top: '12%', left: '6%',  size: 'sm', delay: '0s' },
  { title: 'Budaya Nusantara', color: '#2D6A4F', accent: '#74C69D', rotation: '6deg',   top: '20%', right: '8%', size: 'md', delay: '1s' },
  { title: 'Sains & Teknologi', color: '#40916C', accent: '#D4A017', rotation: '-5deg',  bottom: '28%', left: '4%', size: 'sm', delay: '2s' },
  { title: 'Sastra Indonesia', color: '#1B4332', accent: '#B7E4C7', rotation: '10deg',  bottom: '18%', right: '6%', size: 'md', delay: '0.5s' },
]

function FloatingBook({ book }) {
  const sizeMap = {
    sm: { w: 64,  h: 85  },
    md: { w: 80,  h: 108 },
    lg: { w: 96,  h: 130 },
  }
  const { w, h } = sizeMap[book.size]

  return (
    <div
      className="absolute hidden xl:block animate-float pointer-events-none select-none"
      style={{
        top: book.top, bottom: book.bottom,
        left: book.left, right: book.right,
        animationDelay: book.delay,
        filter: 'drop-shadow(0 12px 24px rgba(0,0,0,0.25))',
      }}
    >
      <div
        style={{
          width: w, height: h,
          background: `linear-gradient(135deg, ${book.color}, #0D1F17)`,
          borderRadius: 6,
          transform: `rotate(${book.rotation})`,
          border: `3px solid ${book.accent}30`,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 10,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Spine */}
        <div style={{
          position: 'absolute', left: 0, top: 0, bottom: 0, width: 10,
          background: book.accent + '40', borderRight: `1px solid ${book.accent}30`,
        }} />
        {/* Lines */}
        {[...Array(4)].map((_, i) => (
          <div key={i} style={{
            width: '70%', height: 2, marginBottom: 5,
            background: book.accent + '60', borderRadius: 1,
          }} />
        ))}
        <BookOpen size={16} color={book.accent} style={{ marginTop: 6, opacity: 0.8 }} />
      </div>
    </div>
  )
}

export default function Hero() {
  const [wordIdx, setWordIdx]   = useState(0)
  const [fade, setFade]         = useState(true)
  const [query, setQuery]       = useState('')

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false)
      setTimeout(() => {
        setWordIdx((i) => (i + 1) % ROTATING_WORDS.length)
        setFade(true)
      }, 300)
    }, 2800)
    return () => clearInterval(interval)
  }, [])

  return (
    <section
      id="beranda"
      className="relative min-h-screen flex flex-col justify-center overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #0D1F17 0%, #1B4332 40%, #2D6A4F 70%, #1B4332 100%)',
      }}
    >
      {/* Background decorations */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Radial glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(64,145,108,0.15) 0%, transparent 70%)' }}
        />
        {/* Dot pattern */}
        <div className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: 'radial-gradient(circle, rgba(212,160,23,0.4) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />
        {/* Diagonal line */}
        <div className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: 'repeating-linear-gradient(-45deg, transparent, transparent 30px, rgba(255,255,255,0.5) 30px, rgba(255,255,255,0.5) 31px)',
          }}
        />
        {/* Gold accent top-right */}
        <div className="absolute top-0 right-0 w-96 h-96 opacity-10"
          style={{ background: 'radial-gradient(circle at 80% 20%, #D4A017, transparent 60%)' }}
        />
        {/* Parchment glow bottom-left */}
        <div className="absolute bottom-0 left-0 w-80 h-80 opacity-8"
          style={{ background: 'radial-gradient(circle at 20% 80%, #F4ECD8, transparent 60%)' }}
        />
      </div>

      {/* Floating books */}
      {FLOATING_BOOKS.map((b, i) => <FloatingBook key={i} book={b} />)}

      {/* Main content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-24 md:py-32 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full mb-8 text-xs font-semibold tracking-widest uppercase"
          style={{ background: 'rgba(212,160,23,0.15)', border: '1px solid rgba(212,160,23,0.35)', color: '#E8BE5A' }}
        >
          <div className="w-1.5 h-1.5 rounded-full bg-gold-400 animate-pulse" />
          Kecamatan Medan Johor · Kota Medan
          <div className="w-1.5 h-1.5 rounded-full bg-gold-400 animate-pulse" />
        </div>

        {/* Headline */}
        <h1 className="font-display font-bold text-white leading-tight mb-6">
          <span className="block text-4xl md:text-6xl lg:text-7xl xl:text-8xl tracking-tight">
            Tempat Rakyat Johor
          </span>
          <span className="block text-4xl md:text-6xl lg:text-7xl xl:text-8xl tracking-tight mt-2">
            Senang{' '}
            <span
              className="inline-block font-display italic"
              style={{
                color: '#D4A017',
                opacity: fade ? 1 : 0,
                transform: fade ? 'translateY(0)' : 'translateY(8px)',
                transition: 'opacity 0.3s ease, transform 0.3s ease',
              }}
            >
              {ROTATING_WORDS[wordIdx]}
            </span>
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-lg md:text-xl max-w-2xl mx-auto mb-12 leading-relaxed"
          style={{ color: 'rgba(212,232,220,0.8)' }}
        >
          Perpustakaan Interaktif Digital Rakyat Johor — akses ribuan koleksi buku, jurnal, 
          artikel, dan konten edukatif secara gratis untuk seluruh warga.
        </p>

        {/* Search bar */}
        <div className="max-w-xl mx-auto mb-10">
          <form onSubmit={(e) => { e.preventDefault(); if (query.trim()) window.location.href = `/katalog?q=${encodeURIComponent(query.trim())}` }}>
            <div className="relative flex items-center"
              style={{
                background: 'rgba(255,255,255,0.1)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: 16,
                boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
              }}
            >
              <Search className="absolute left-4 w-5 h-5" style={{ color: 'rgba(212,232,220,0.6)' }} />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Cari judul, pengarang, atau topik..."
                className="flex-1 bg-transparent pl-12 pr-4 py-4 text-white placeholder:text-white/40 text-sm outline-none"
              />
              <button type="submit"
                className="m-1.5 px-5 py-3 rounded-xl text-sm font-bold text-forest-900 transition-all hover:scale-105"
                style={{ background: 'linear-gradient(135deg, #E8BE5A, #D4A017)' }}
              >
                Cari
              </button>
            </div>
          </form>
          <div className="flex flex-wrap gap-2 justify-center mt-3">
            {['History', 'Science', 'Cultural', 'Adventure'].map((tag) => (
              <a key={tag} href={`/katalog?category=${encodeURIComponent(tag)}`}
                className="px-3 py-1 rounded-full text-xs transition-all hover:bg-white/20"
                style={{ color: 'rgba(212,232,220,0.7)', border: '1px solid rgba(255,255,255,0.15)' }}
              >
                {tag === 'History' ? 'Sejarah' : tag === 'Science' ? 'Sains' : tag === 'Cultural' ? 'Budaya' : 'Petualangan'}
              </a>
            ))}
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-20">
          <a
            href="/katalog"
            className="group flex items-center justify-center gap-2 px-8 py-4 rounded-2xl text-base font-bold text-forest-900 transition-all hover:scale-105 hover:shadow-2xl"
            style={{ background: 'linear-gradient(135deg, #E8BE5A, #D4A017)', boxShadow: '0 8px 32px rgba(212,160,23,0.4)' }}
          >
            Jelajahi Koleksi
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </a>
          <a
            href="#layanan"
            className="flex items-center justify-center gap-2 px-8 py-4 rounded-2xl text-base font-semibold text-white transition-all hover:scale-105"
            style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.25)', backdropFilter: 'blur(10px)' }}
          >
            Lihat Layanan
          </a>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-6 max-w-2xl mx-auto">
          {[
            { value: '12.500+', label: 'Koleksi Digital',  icon: '📚' },
            { value: '350+',    label: 'Jurnal & Artikel', icon: '📰' },
            { value: '3 Sumber',label: 'Perpustakaan',     icon: '🌐' },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl py-4 px-5 text-center"
              style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)' }}
            >
              <div className="text-2xl mb-1">{stat.icon}</div>
              <div className="font-display font-bold text-white text-xl md:text-2xl">{stat.value}</div>
              <div className="text-xs mt-0.5" style={{ color: 'rgba(212,232,220,0.6)' }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <a
        href="#kategori"
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-xs animate-bounce"
        style={{ color: 'rgba(212,232,220,0.5)' }}
      >
        <span>Gulir ke bawah</span>
        <ChevronDown className="w-4 h-4" />
      </a>
    </section>
  )
}
