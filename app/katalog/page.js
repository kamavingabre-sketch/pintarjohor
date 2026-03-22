'use client'
import { useState, useEffect, useCallback, Suspense } from 'react'
import {
  Search, Download, Grid, List, SlidersHorizontal,
  X, ChevronLeft, ChevronRight, Loader2, BookMarked,
  BookOpen, Globe
} from 'lucide-react'
import { useSearchParams, useRouter } from 'next/navigation'
import BookCover from '../components/BookCover'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const CATEGORIES = [
  { id: 'Adventure',         label: 'Petualangan',       emoji: '🗺️' },
  { id: 'Fantasy',           label: 'Fantasi',            emoji: '🧙' },
  { id: 'Romance',           label: 'Roman',              emoji: '💕' },
  { id: 'Science',           label: 'Sains',              emoji: '🔬' },
  { id: 'History',           label: 'Sejarah',            emoji: '🏛️' },
  { id: 'Historic Novels',   label: 'Novel Sejarah',      emoji: '📜' },
  { id: 'Cultural',          label: 'Budaya',             emoji: '🎭' },
  { id: 'Sci-Fi-Paranormal', label: 'Sci-Fi',             emoji: '🚀' },
  { id: 'Thriller-Horror',   label: 'Thriller & Horor',   emoji: '🔪' },
  { id: 'Crime-Mystery',     label: 'Misteri & Kriminal', emoji: '🕵️' },
  { id: 'Drama',             label: 'Drama',              emoji: '🎬' },
  { id: 'General Fiction',   label: 'Fiksi Umum',         emoji: '📖' },
  { id: 'Psycology',         label: 'Psikologi',          emoji: '🧠' },
  { id: 'Self Improvement',  label: 'Pengembangan Diri',  emoji: '🌱' },
  { id: 'Business MGT',      label: 'Bisnis & Manajemen', emoji: '💼' },
  { id: 'Computer Science',  label: 'Ilmu Komputer',      emoji: '💻' },
  { id: 'Medical',           label: 'Kesehatan',          emoji: '🏥' },
  { id: 'Religion',          label: 'Agama & Spiritual',  emoji: '🕌' },
  { id: 'Poetry',            label: 'Puisi',              emoji: '✍️' },
  { id: 'Autobiography',     label: 'Biografi',           emoji: '👤' },
  { id: 'Short Stories',     label: 'Cerita Pendek',      emoji: '📋' },
  { id: 'Government',        label: 'Pemerintahan',       emoji: '🏛️' },
  { id: 'Economics',         label: 'Ekonomi',            emoji: '📈' },
  { id: 'Mathematics',       label: 'Matematika',         emoji: '🔢' },
  { id: 'Law',               label: 'Hukum',              emoji: '⚖️' },
  { id: 'Eat-Drink-Cook',    label: 'Kuliner & Masak',    emoji: '🍳' },
  { id: 'Sports',            label: 'Olahraga',           emoji: '⚽' },
  { id: 'Humor',             label: 'Humor',              emoji: '😂' },
  { id: 'Gothic-Suspense',   label: 'Gotik & Suspens',    emoji: '🦇' },
  { id: 'Environment',       label: 'Lingkungan',         emoji: '🌳' },
  { id: 'Sociology',         label: 'Sosiologi',          emoji: '👥' },
  { id: 'Anthropology',      label: 'Antropologi',        emoji: '🌏' },
  { id: 'Military-War',      label: 'Militer & Perang',   emoji: '⚔️' },
  { id: 'Textbooks',         label: 'Buku Pelajaran',     emoji: '📚' },
  { id: 'Academic Articles', label: 'Artikel Akademik',   emoji: '🎓' },
]

// Map source tab to Gutenberg topic
const GUTENBERG_TOPIC_MAP = {
  'Adventure': 'Adventure', 'Fantasy': 'Fantasy', 'Romance': 'Romance',
  'Science': 'Science', 'History': 'History', 'Drama': 'Drama',
  'Poetry': 'Poetry', 'Horror': 'Horror', 'Humor': 'Humor',
}

function SourceBadge({ source }) {
  if (source === 'gutenberg') return (
    <span className="flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-bold text-white"
      style={{ background: '#2D6A4F' }}>
      <Globe className="w-2.5 h-2.5" /> Gutenberg
    </span>
  )
  return null
}

function BookCard({ book, view }) {
  const router = useRouter()

  const handleRead = (e) => {
    e.preventDefault()
    const params = new URLSearchParams({ url: book.downloadUrl, title: book.title, author: book.author || '' })
    if (book.format === 'EPUB' || book.source === 'gutenberg' && book.epubUrl) {
      const url = book.epubUrl || book.downloadUrl
      router.push(`/baca?url=${encodeURIComponent(url)}&title=${encodeURIComponent(book.title)}&author=${encodeURIComponent(book.author||'')}`)
    } else if (book.format === 'PDF' || book.pdfUrl) {
      const url = book.pdfUrl || book.downloadUrl
      router.push(`/baca-pdf?url=${encodeURIComponent(url)}&title=${encodeURIComponent(book.title)}&author=${encodeURIComponent(book.author||'')}`)
    } else {
      window.open(book.downloadUrl, '_blank')
    }
  }

  const handleDownload = (e) => {
    e.preventDefault()
    window.open(book.downloadUrl, '_blank')
  }

  const canRead = book.format === 'EPUB' || book.format === 'PDF' || book.epubUrl || book.pdfUrl
  const coverSrc = book.coverUrl || null

  if (view === 'list') {
    return (
      <div className="flex gap-3 md:gap-4 p-3 md:p-4 bg-white rounded-2xl border border-forest-100 hover:border-forest-300 hover:shadow-md transition-all duration-200 group">
        <div className="flex-shrink-0 w-12 md:w-16">
          {coverSrc ? (
            <img src={coverSrc} alt={book.title} className="w-full h-full object-cover rounded-xl" style={{ aspectRatio: '2/3' }}
              onError={e => { e.target.style.display='none' }} />
          ) : (
            <BookCover title={book.title} author={book.author} coverQuery={book.coverQuery} size="sm" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-1.5 mb-1">
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full text-white"
                  style={{ background: book.categoryColor || '#1B4332' }}>
                  {book.categoryEmoji} {book.category}
                </span>
                <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-forest-50 text-forest-600 border border-forest-200">{book.format}</span>
                <SourceBadge source={book.source} />
              </div>
              <h3 className="font-display font-bold text-forest-800 text-sm leading-snug line-clamp-2">{book.title}</h3>
              <p className="text-xs text-forest-500 mt-0.5 line-clamp-1">{book.author}</p>
            </div>
            <div className="flex flex-col gap-1.5 flex-shrink-0">
              {canRead && (
                <button onClick={handleRead}
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all hover:scale-105"
                  style={{ background: 'linear-gradient(135deg, #D4A017, #E8BE5A)', color: '#1B4332' }}>
                  <BookMarked className="w-3 h-3" /> Baca
                </button>
              )}
              <button onClick={handleDownload}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold text-white transition-all hover:scale-105"
                style={{ background: 'linear-gradient(135deg, #1B4332, #2D6A4F)' }}>
                <Download className="w-3 h-3" /> Unduh
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-forest-100 hover:border-forest-200 shadow-sm group transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
      <div className="relative">
        {coverSrc ? (
          <div className="w-full h-44 md:h-52 overflow-hidden bg-forest-100">
            <img src={coverSrc} alt={book.title} className="w-full h-full object-cover"
              onError={e => { e.target.parentElement.innerHTML = '' }} />
          </div>
        ) : (
          <BookCover title={book.title} author={book.author} coverQuery={book.coverQuery} size="md" />
        )}
        <div className="absolute top-2 right-2 flex gap-1">
          <span className="px-1.5 py-0.5 rounded text-[9px] font-bold font-mono text-white"
            style={{ background: 'rgba(0,0,0,0.6)' }}>{book.format}</span>
        </div>
        {book.source === 'gutenberg' && (
          <div className="absolute top-2 left-2">
            <span className="flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-bold text-white"
              style={{ background: 'rgba(45,106,79,0.9)' }}>
              <Globe className="w-2.5 h-2.5" /> Gratis
            </span>
          </div>
        )}
        {/* Hover overlay */}
        <div className="absolute inset-0 bg-forest-900/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-2 px-3 rounded-t-2xl">
          {canRead && (
            <button onClick={handleRead}
              className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-xs font-bold transition-all"
              style={{ background: 'linear-gradient(135deg, #E8BE5A, #D4A017)', color: '#1B4332' }}>
              <BookMarked className="w-3.5 h-3.5" />
              {book.format === 'PDF' || book.pdfUrl ? 'Baca PDF' : 'Baca Online'}
            </button>
          )}
          <button onClick={handleDownload}
            className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-xs font-bold text-white border border-white/30 hover:bg-white/20 transition-all">
            <Download className="w-3.5 h-3.5" /> Unduh
          </button>
        </div>
      </div>
      <div className="p-3 md:p-4">
        <div className="flex items-center gap-1.5 mb-1.5 flex-wrap">
          <span className="text-[10px] px-2 py-0.5 rounded-full text-white font-semibold"
            style={{ background: book.categoryColor || '#1B4332' }}>
            {book.categoryEmoji} {book.category}
          </span>
        </div>
        <h3 className="font-display font-bold text-forest-800 text-sm leading-snug line-clamp-2 mb-1">{book.title}</h3>
        <p className="text-xs text-forest-500 line-clamp-1 mb-3">{book.author}</p>
        <div className="flex gap-1.5">
          {canRead && (
            <button onClick={handleRead}
              className="flex-1 py-1.5 rounded-lg text-xs font-bold flex items-center justify-center gap-1 transition-all hover:opacity-90"
              style={{ background: 'linear-gradient(135deg, #E8BE5A, #D4A017)', color: '#1B4332' }}>
              <BookMarked className="w-3 h-3" /> Baca
            </button>
          )}
          <button onClick={handleDownload}
            className="flex-1 py-1.5 rounded-lg text-xs font-bold text-white flex items-center justify-center gap-1 transition-all hover:opacity-90"
            style={{ background: 'linear-gradient(135deg, #1B4332, #2D6A4F)' }}>
            <Download className="w-3 h-3" /> Unduh
          </button>
        </div>
      </div>
    </div>
  )
}

const SOURCES = [
  { id: 'ebook-mecca', label: 'Koleksi Lokal',   icon: '📚' },
  { id: 'gutenberg',   label: 'Project Gutenberg (PDF/EPUB Gratis)', icon: '🌐' },
]

function KatalogContent() {
  const searchParams = useSearchParams()
  const router       = useRouter()

  const [source,        setSource]       = useState('ebook-mecca')
  const [selectedCat,   setSelectedCat]  = useState(searchParams.get('category') || '')
  const [view,          setView]         = useState('grid')
  const [books,         setBooks]        = useState([])
  const [loading,       setLoading]      = useState(false)
  const [error,         setError]        = useState(null)
  const [page,          setPage]         = useState(1)
  const [totalPages,    setTotalPages]   = useState(1)
  const [total,         setTotal]        = useState(0)
  const [search,        setSearch]       = useState(searchParams.get('q') || '')
  const [searchInput,   setSearchInput]  = useState(searchParams.get('q') || '')
  const [sidebarOpen,   setSidebarOpen]  = useState(false)
  const LIMIT = 24

  const fetchBooks = useCallback(async (src, cat, pg, q) => {
    setLoading(true)
    setError(null)
    try {
      let res, data
      if (src === 'gutenberg') {
        const topic = GUTENBERG_TOPIC_MAP[cat] || cat || ''
        const params = new URLSearchParams({ limit: LIMIT, page: pg, ...(topic && { topic }), ...(q && { search: q }) })
        res  = await fetch(`/api/gutenberg?${params}`)
        data = await res.json()
      } else {
        const params = new URLSearchParams({ limit: LIMIT, page: pg, ...(cat && { category: cat }) })
        res  = await fetch(`/api/ebooks?${params}`)
        data = await res.json()
        if (q) {
          const ql = q.toLowerCase()
          data.books = (data.books||[]).filter(b =>
            b.title.toLowerCase().includes(ql) || (b.author && b.author.toLowerCase().includes(ql))
          )
          data.total = data.books.length
          data.totalPages = Math.ceil(data.books.length / LIMIT)
        }
      }
      if (data.error) throw new Error(data.error)
      setBooks(data.books || [])
      setTotal(data.total || 0)
      setTotalPages(data.totalPages || 1)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchBooks(source, selectedCat, page, search)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [source, selectedCat, page, search, fetchBooks])

  const handleCatSelect = (id) => {
    setSelectedCat(id); setPage(1); setSearch(''); setSearchInput('')
    setSidebarOpen(false)
    router.replace(`/katalog${id ? `?category=${encodeURIComponent(id)}` : ''}`, { scroll: false })
  }

  const handleSearch = (e) => {
    e.preventDefault()
    setSearch(searchInput)
    setPage(1)
  }

  const activeCat = CATEGORIES.find(c => c.id === selectedCat)

  return (
    <div className="min-h-screen" style={{ background: '#F9F3E3' }}>
      {/* Header */}
      <div className="py-8 md:py-12 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #1B4332, #0D1F17)' }}>
        <div className="absolute inset-0 opacity-20"
          style={{ backgroundImage: 'radial-gradient(circle, rgba(212,160,23,0.4) 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
        <div className="max-w-7xl mx-auto px-4 md:px-6 relative">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 mb-3 flex-wrap">
            <a href="/" className="text-forest-400 hover:text-gold-400 transition-colors text-xs">🏠 Beranda</a>
            <span className="text-forest-600 text-xs">/</span>
            <span className="text-gold-400 text-xs font-semibold">Katalog</span>
            {activeCat && <><span className="text-forest-600 text-xs">/</span>
              <span className="text-gold-400 text-xs font-semibold">{activeCat.label}</span></>}
          </div>

          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h1 className="font-display font-bold text-2xl md:text-4xl text-white leading-tight">
                {activeCat ? `${activeCat.emoji} ${activeCat.label}` : '📚 Semua Koleksi'}
              </h1>
              <p className="text-forest-300 text-sm mt-1">
                {total > 0 ? `${total.toLocaleString('id-ID')} judul tersedia` : 'Memuat katalog...'}
              </p>
            </div>
            <form onSubmit={handleSearch} className="flex gap-2 w-full md:w-auto">
              <div className="flex-1 md:w-64 flex items-center gap-2 px-3 py-2.5 rounded-xl"
                style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)' }}>
                <Search className="w-4 h-4 text-white/50 flex-shrink-0" />
                <input value={searchInput} onChange={e => setSearchInput(e.target.value)}
                  placeholder="Cari judul atau pengarang..."
                  className="bg-transparent text-white placeholder:text-white/40 text-sm outline-none w-full" />
                {searchInput && (
                  <button type="button" onClick={() => { setSearchInput(''); setSearch('') }}>
                    <X className="w-3.5 h-3.5 text-white/50" />
                  </button>
                )}
              </div>
              <button type="submit"
                className="px-4 py-2.5 rounded-xl text-sm font-bold text-forest-900 whitespace-nowrap"
                style={{ background: 'linear-gradient(135deg, #E8BE5A, #D4A017)' }}>
                Cari
              </button>
            </form>
          </div>

          {/* Source tabs */}
          <div className="flex gap-2 mt-4 flex-wrap">
            {SOURCES.map(s => (
              <button key={s.id} onClick={() => { setSource(s.id); setPage(1) }}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                  source === s.id ? 'bg-white text-forest-800' : 'text-white/70 hover:text-white'
                }`}
                style={source !== s.id ? { background: 'rgba(255,255,255,0.1)' } : {}}>
                {s.icon} {s.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-8">
        <div className="flex gap-4 md:gap-6">
          {/* Desktop Sidebar */}
          <aside className="hidden lg:block w-56 flex-shrink-0">
            <div className="bg-white rounded-3xl shadow-sm border border-forest-100 p-3 sticky top-24">
              <h3 className="font-display font-bold text-forest-800 text-base mb-3 px-2">Kategori</h3>
              <div className="space-y-0.5 max-h-[68vh] overflow-y-auto pr-1">
                <button onClick={() => handleCatSelect('')}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium transition-all text-left ${
                    selectedCat === '' ? 'bg-forest-700 text-white' : 'text-forest-700 hover:bg-forest-50'
                  }`}>
                  <span>📚</span> <span className="truncate">Semua</span>
                </button>
                {CATEGORIES.map((cat) => (
                  <button key={cat.id} onClick={() => handleCatSelect(cat.id)}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium transition-all text-left ${
                      selectedCat === cat.id ? 'bg-forest-700 text-white' : 'text-forest-700 hover:bg-forest-50'
                    }`}>
                    <span>{cat.emoji}</span>
                    <span className="truncate">{cat.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* Mobile filter toggle */}
          <div className="lg:hidden fixed bottom-4 left-4 right-4 z-40 flex justify-center">
            <button onClick={() => setSidebarOpen(true)}
              className="flex items-center gap-2 px-5 py-3 rounded-2xl text-sm font-semibold text-white shadow-2xl"
              style={{ background: 'linear-gradient(135deg, #1B4332, #2D6A4F)', boxShadow: '0 8px 32px rgba(27,67,50,0.4)' }}>
              <SlidersHorizontal className="w-4 h-4" />
              {activeCat ? `${activeCat.emoji} ${activeCat.label}` : 'Filter Kategori'}
            </button>
          </div>

          {/* Mobile drawer */}
          {sidebarOpen && (
            <div className="lg:hidden fixed inset-0 z-50 flex">
              <div className="absolute inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
              <div className="relative ml-auto w-72 h-full bg-white shadow-2xl overflow-y-auto">
                <div className="flex items-center justify-between p-4 border-b">
                  <h3 className="font-display font-bold text-forest-800 text-xl">Kategori</h3>
                  <button onClick={() => setSidebarOpen(false)} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                    <X className="w-4 h-4 text-gray-600" />
                  </button>
                </div>
                <div className="p-3 space-y-0.5">
                  <button onClick={() => handleCatSelect('')}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all text-left ${
                      selectedCat === '' ? 'bg-forest-700 text-white' : 'text-forest-700 hover:bg-forest-50'
                    }`}>
                    <span>📚</span> Semua Kategori
                  </button>
                  {CATEGORIES.map((cat) => (
                    <button key={cat.id} onClick={() => handleCatSelect(cat.id)}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all text-left ${
                        selectedCat === cat.id ? 'bg-forest-700 text-white' : 'text-forest-700 hover:bg-forest-50'
                      }`}>
                      <span>{cat.emoji}</span> <span className="truncate">{cat.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Main */}
          <div className="flex-1 min-w-0 pb-20 lg:pb-0">
            {/* Toolbar */}
            <div className="flex items-center justify-between mb-4">
              <div className="text-sm text-forest-600">
                {search && <span className="mr-1">"{search}" — </span>}
                {!loading && <span className="font-medium">{total} judul</span>}
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => setView('grid')}
                  className={`p-2 rounded-lg transition-all ${view === 'grid' ? 'bg-forest-700 text-white' : 'bg-white text-forest-600 border border-forest-200'}`}>
                  <Grid className="w-4 h-4" />
                </button>
                <button onClick={() => setView('list')}
                  className={`p-2 rounded-lg transition-all ${view === 'list' ? 'bg-forest-700 text-white' : 'bg-white text-forest-600 border border-forest-200'}`}>
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>

            {loading && (
              <div className="flex flex-col items-center justify-center py-20 gap-4">
                <div className="relative w-14 h-14">
                  <div className="absolute inset-0 rounded-full border-4 border-forest-100" />
                  <div className="absolute inset-0 rounded-full border-4 border-t-forest-700 animate-spin" />
                </div>
                <p className="text-forest-500 text-sm">Memuat koleksi...</p>
              </div>
            )}

            {error && !loading && (
              <div className="text-center py-16 bg-white rounded-3xl border border-red-100">
                <div className="text-4xl mb-3">⚠️</div>
                <p className="text-forest-500 text-sm mb-4">{error}</p>
                <button onClick={() => fetchBooks(source, selectedCat, page, search)}
                  className="px-5 py-2.5 bg-forest-700 text-white rounded-xl text-sm font-medium">
                  Coba Lagi
                </button>
              </div>
            )}

            {!loading && !error && books.length === 0 && (
              <div className="text-center py-16 bg-white rounded-3xl border border-forest-100">
                <div className="text-4xl mb-3">📭</div>
                <h3 className="font-display font-bold text-xl text-forest-800 mb-2">Tidak ada hasil</h3>
                <p className="text-forest-500 text-sm">Coba kata kunci lain atau pilih sumber / kategori berbeda.</p>
              </div>
            )}

            {!loading && !error && books.length > 0 && view === 'grid' && (
              <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4">
                {books.map((book) => <BookCard key={book.id} book={book} view="grid" />)}
              </div>
            )}

            {!loading && !error && books.length > 0 && view === 'list' && (
              <div className="space-y-2 md:space-y-3">
                {books.map((book) => <BookCard key={book.id} book={book} view="list" />)}
              </div>
            )}

            {/* Pagination */}
            {!loading && totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-8 flex-wrap">
                <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                  className="w-9 h-9 rounded-xl border border-forest-200 flex items-center justify-center text-forest-700 hover:bg-forest-700 hover:text-white disabled:opacity-30 transition-all">
                  <ChevronLeft className="w-4 h-4" />
                </button>
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pg = i + 1
                  if (totalPages > 5) {
                    if (page <= 3) pg = i + 1
                    else if (page >= totalPages - 2) pg = totalPages - 4 + i
                    else pg = page - 2 + i
                  }
                  return (
                    <button key={pg} onClick={() => setPage(pg)}
                      className={`w-9 h-9 rounded-xl text-sm font-bold transition-all ${
                        pg === page ? 'bg-forest-700 text-white' : 'border border-forest-200 text-forest-700 hover:bg-forest-50'
                      }`}>{pg}</button>
                  )
                })}
                <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                  className="w-9 h-9 rounded-xl border border-forest-200 flex items-center justify-center text-forest-700 hover:bg-forest-700 hover:text-white disabled:opacity-30 transition-all">
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function KatalogPage() {
  return (
    <>
      <Navbar />
      <Suspense fallback={
        <div className="min-h-screen flex items-center justify-center" style={{ background: '#F9F3E3' }}>
          <Loader2 className="w-8 h-8 animate-spin text-forest-700" />
        </div>
      }>
        <KatalogContent />
      </Suspense>
      <Footer />
    </>
  )
}
