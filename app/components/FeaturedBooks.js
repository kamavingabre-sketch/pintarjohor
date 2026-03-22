'use client'
import { useState, useEffect, useRef } from 'react'
import { ChevronLeft, ChevronRight, Download, ExternalLink, Loader2, Heart, RefreshCw } from 'lucide-react'
import BookCover from './BookCover'

const FEATURED_CATS = [
  { id: 'Adventure',        label: 'Petualangan',     emoji: '🗺️' },
  { id: 'Fantasy',          label: 'Fantasi',          emoji: '🧙' },
  { id: 'Science',          label: 'Sains',            emoji: '🔬' },
  { id: 'Historic Novels',  label: 'Novel Sejarah',    emoji: '📜' },
  { id: 'Self Improvement', label: 'Pengembangan Diri',emoji: '🌱' },
  { id: 'Cultural',         label: 'Budaya',           emoji: '🎭' },
]

function BookCard({ book, isActive }) {
  const [liked, setLiked]           = useState(false)
  const [downloading, setDownloading] = useState(false)

  const handleDownload = (e) => {
    e.stopPropagation()
    setDownloading(true)
    window.open(book.downloadUrl, '_blank')
    setTimeout(() => setDownloading(false), 2000)
  }

  return (
    <div className={`book-card relative flex-shrink-0 w-52 rounded-3xl overflow-hidden cursor-pointer border transition-all duration-300 ${
      isActive ? 'scale-105 shadow-2xl shadow-forest-700/25 border-forest-200' : 'scale-95 opacity-70 border-transparent'
    }`}>
      <div className="relative">
        <BookCover title={book.title} author={book.author} coverQuery={book.coverQuery} size="md" />
        <button onClick={(e) => { e.stopPropagation(); setLiked(!liked) }}
          className="absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center"
          style={{ background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(8px)' }}>
          <Heart className={`w-3.5 h-3.5 ${liked ? 'fill-red-400 text-red-400' : 'text-white'}`} />
        </button>
        <div className="absolute top-2 left-2 px-1.5 py-0.5 rounded text-[9px] font-bold font-mono text-white"
          style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}>
          {book.format}
        </div>
      </div>
      <div className="p-4 bg-white">
        <div className="text-[10px] font-bold text-forest-600 uppercase tracking-wider mb-1.5">
          {book.categoryEmoji} {book.category}
        </div>
        <h3 className="font-display font-bold text-forest-800 text-sm leading-snug mb-1 line-clamp-2">{book.title}</h3>
        <p className="text-xs text-forest-500 mb-3 line-clamp-1">{book.author}</p>
        <button onClick={handleDownload}
          className="w-full py-2 rounded-xl text-xs font-bold text-white flex items-center justify-center gap-1.5 transition-all hover:opacity-90"
          style={{ background: 'linear-gradient(135deg, #1B4332, #2D6A4F)' }}>
          {downloading ? <><Loader2 className="w-3 h-3 animate-spin" /> Membuka...</> : <><Download className="w-3 h-3" /> Unduh</>}
        </button>
      </div>
    </div>
  )
}

export default function FeaturedBooks() {
  const [activeCategory, setActiveCategory] = useState(FEATURED_CATS[0])
  const [books, setBooks]                   = useState([])
  const [loading, setLoading]               = useState(false)
  const [activeIdx, setActiveIdx]           = useState(2)
  const scrollRef = useRef(null)

  const fetchBooks = async (catId) => {
    setLoading(true)
    setBooks([])
    try {
      const res  = await fetch(`/api/ebooks?category=${encodeURIComponent(catId)}&limit=12&page=1`)
      const data = await res.json()
      setBooks(data.books || [])
      setActiveIdx(2)
    } catch (e) { console.error(e) }
    finally { setLoading(false) }
  }

  useEffect(() => { fetchBooks(activeCategory.id) }, [activeCategory.id])

  const scroll = (dir) => {
    const next = activeIdx + dir
    if (next < 0 || next >= books.length) return
    setActiveIdx(next)
    const cards = scrollRef.current?.querySelectorAll('.book-card-wrap')
    cards?.[next]?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' })
  }

  return (
    <section id="koleksi" className="py-24 relative overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #F9F3E3 0%, #F4ECD8 100%)' }}>
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-forest-700 via-gold-500 to-forest-700 opacity-40" />

      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold-500/15 text-gold-700 text-xs font-bold tracking-widest uppercase mb-4 border border-gold-500/25">
              ⭐ Koleksi Unggulan
            </div>
            <h2 className="font-display font-bold text-4xl md:text-5xl text-forest-800 leading-tight">
              E-Book <span className="font-display italic text-gradient-green">dari Koleksi Kami</span>
            </h2>
            <p className="text-forest-500 text-sm mt-2">Data langsung dari indeks perpustakaan · Cover dari Open Library</p>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => fetchBooks(activeCategory.id)}
              className="w-10 h-10 rounded-xl border border-forest-200 flex items-center justify-center text-forest-600 hover:bg-forest-50 transition-all">
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button onClick={() => scroll(-1)} disabled={activeIdx === 0 || loading}
              className="w-10 h-10 rounded-xl border border-forest-200 flex items-center justify-center text-forest-700 hover:bg-forest-700 hover:text-white hover:border-forest-700 disabled:opacity-30 transition-all">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button onClick={() => scroll(1)} disabled={activeIdx >= books.length - 1 || loading}
              className="w-10 h-10 rounded-xl border border-forest-200 flex items-center justify-center text-forest-700 hover:bg-forest-700 hover:text-white hover:border-forest-700 disabled:opacity-30 transition-all">
              <ChevronRight className="w-5 h-5" />
            </button>
            <a href="/katalog" className="hidden md:flex items-center gap-1.5 text-sm font-semibold text-forest-700 hover:text-forest-800 transition-colors">
              Lihat Semua <ChevronRight className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Category tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-8" style={{ scrollbarWidth: 'none' }}>
          {FEATURED_CATS.map((cat) => (
            <button key={cat.id} onClick={() => setActiveCategory(cat)}
              className={`flex-shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-2xl text-sm font-semibold transition-all ${
                activeCategory.id === cat.id
                  ? 'bg-forest-700 text-white shadow-lg shadow-forest-700/25'
                  : 'bg-white text-forest-700 border border-forest-200 hover:bg-forest-50'
              }`}>
              {cat.emoji} {cat.label}
            </button>
          ))}
        </div>

        {/* Skeleton loader */}
        {loading && (
          <div className="flex gap-5 pb-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex-shrink-0 w-52 rounded-3xl overflow-hidden bg-white border border-forest-100 animate-pulse">
                <div className="h-56 bg-gradient-to-br from-forest-100 to-forest-200" />
                <div className="p-4 space-y-2">
                  <div className="h-3 bg-forest-100 rounded w-1/2" />
                  <div className="h-4 bg-forest-100 rounded w-full" />
                  <div className="h-4 bg-forest-100 rounded w-3/4" />
                  <div className="h-8 bg-forest-100 rounded-xl mt-3" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Carousel */}
        {!loading && books.length > 0 && (
          <>
            <div ref={scrollRef}
              className="flex gap-5 overflow-x-auto pb-4 snap-x snap-mandatory"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
              {books.map((book, i) => (
                <div key={book.id} className="book-card-wrap snap-center" onClick={() => setActiveIdx(i)}>
                  <BookCard book={book} isActive={i === activeIdx} />
                </div>
              ))}
            </div>
            <div className="flex justify-center gap-2 mt-4">
              {books.map((_, i) => (
                <button key={i} onClick={() => setActiveIdx(i)}
                  className="transition-all duration-300 rounded-full"
                  style={{ width: i === activeIdx ? 24 : 7, height: 7, background: i === activeIdx ? '#1B4332' : '#1B433230' }} />
              ))}
            </div>
          </>
        )}

        {!loading && books.length === 0 && (
          <div className="text-center py-12 text-forest-400">Tidak ada buku di kategori ini.</div>
        )}

        <div className="text-center mt-10">
          <a href="/katalog"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl text-sm font-bold text-white transition-all hover:scale-105 hover:shadow-lg hover:shadow-forest-700/30"
            style={{ background: 'linear-gradient(135deg, #1B4332, #2D6A4F)' }}>
            Jelajahi Seluruh Katalog <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>
    </section>
  )
}
