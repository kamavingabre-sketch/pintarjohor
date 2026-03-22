'use client'
import { useState, useEffect, useCallback, useRef, Suspense } from 'react'
import { Search, Download, BookOpen, Grid, List, SlidersHorizontal, X, ChevronLeft, ChevronRight, Loader2, ExternalLink, BookMarked } from 'lucide-react'
import { useSearchParams, useRouter } from 'next/navigation'
import BookCover from '../components/BookCover'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const CATEGORIES = [
  { id: 'Adventure',         label: 'Petualangan',          emoji: '🗺️' },
  { id: 'Fantasy',           label: 'Fantasi',               emoji: '🧙' },
  { id: 'Romance',           label: 'Roman',                 emoji: '💕' },
  { id: 'Science',           label: 'Sains',                 emoji: '🔬' },
  { id: 'History',           label: 'Sejarah',               emoji: '🏛️' },
  { id: 'Historic Novels',   label: 'Novel Sejarah',         emoji: '📜' },
  { id: 'Cultural',          label: 'Budaya',                emoji: '🎭' },
  { id: 'Sci-Fi-Paranormal', label: 'Sci-Fi',                emoji: '🚀' },
  { id: 'Thriller-Horror',   label: 'Thriller & Horor',      emoji: '🔪' },
  { id: 'Crime-Mystery',     label: 'Misteri & Kriminal',    emoji: '🕵️' },
  { id: 'Drama',             label: 'Drama',                 emoji: '🎬' },
  { id: 'General Fiction',   label: 'Fiksi Umum',            emoji: '📖' },
  { id: 'Psycology',         label: 'Psikologi',             emoji: '🧠' },
  { id: 'Self Improvement',  label: 'Pengembangan Diri',     emoji: '🌱' },
  { id: 'Business MGT',      label: 'Bisnis & Manajemen',    emoji: '💼' },
  { id: 'Computer Science',  label: 'Ilmu Komputer',         emoji: '💻' },
  { id: 'Medical',           label: 'Kesehatan',             emoji: '🏥' },
  { id: 'Religion',          label: 'Agama & Spiritual',     emoji: '🕌' },
  { id: 'Poetry',            label: 'Puisi',                 emoji: '✍️' },
  { id: 'Autobiography',     label: 'Biografi / Autobiografi', emoji: '👤' },
  { id: 'Short Stories',     label: 'Cerita Pendek',         emoji: '📋' },
  { id: 'Government',        label: 'Pemerintahan',          emoji: '🏛️' },
  { id: 'Economics',         label: 'Ekonomi',               emoji: '📈' },
  { id: 'Mathematics',       label: 'Matematika',            emoji: '🔢' },
  { id: 'Law',               label: 'Hukum',                 emoji: '⚖️' },
  { id: 'Eat-Drink-Cook',    label: 'Kuliner & Masak',       emoji: '🍳' },
  { id: 'Sports',            label: 'Olahraga',              emoji: '⚽' },
  { id: 'Humor',             label: 'Humor',                 emoji: '😂' },
  { id: 'Gothic-Suspense',   label: 'Gotik & Suspens',       emoji: '🦇' },
  { id: 'Environment',       label: 'Lingkungan',            emoji: '🌳' },
  { id: 'Sociology',         label: 'Sosiologi',             emoji: '👥' },
  { id: 'Anthropology',      label: 'Antropologi',           emoji: '🌏' },
  { id: 'Military-War',      label: 'Militer & Perang',      emoji: '⚔️' },
  { id: 'Textbooks',         label: 'Buku Pelajaran',        emoji: '📚' },
  { id: 'Academic Articles', label: 'Artikel Akademik',      emoji: '🎓' },
]

function BookCard({ book, view }) {
  const router = useRouter()
  const [downloading, setDownloading] = useState(false)

  const handleDownload = (e) => {
    e.preventDefault()
    setDownloading(true)
    window.open(book.downloadUrl, '_blank')
    setTimeout(() => setDownloading(false), 2000)
  }

  const handleRead = (e) => {
    e.preventDefault()
    // Only EPUB files can be read online
    if (book.format === 'EPUB') {
      const params = new URLSearchParams({
        url:    book.downloadUrl,
        title:  book.title,
        author: book.author || '',
      })
      router.push(`/baca?${params.toString()}`)
    } else {
      // Non-EPUB: open download
      window.open(book.downloadUrl, '_blank')
    }
  }

  const canRead = book.format === 'EPUB'

  if (view === 'list') {
    return (
      <div className="flex gap-4 p-4 bg-white rounded-2xl border border-forest-100 hover:border-forest-300 hover:shadow-md transition-all duration-200 group">
        <div className="flex-shrink-0 w-16">
          <BookCover title={book.title} author={book.author} coverQuery={book.coverQuery} size="sm" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full text-white"
                  style={{ background: book.categoryColor || '#1B4332' }}>
                  {book.categoryEmoji} {book.category}
                </span>
                <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-forest-50 text-forest-600 border border-forest-200">
                  {book.format}
                </span>
              </div>
              <h3 className="font-display font-bold text-forest-800 text-sm leading-snug line-clamp-2 group-hover:text-forest-700 transition-colors">
                {book.title}
              </h3>
              <p className="text-xs text-forest-500 mt-0.5 line-clamp-1">{book.author}</p>
            </div>
            <div className="flex flex-col gap-1.5 flex-shrink-0">
              {canRead && (
                <button onClick={handleRead}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-white transition-all hover:scale-105"
                  style={{ background: 'linear-gradient(135deg, #D4A017, #E8BE5A)', color: '#1B4332' }}>
                  <BookMarked className="w-3 h-3" /> Baca
                </button>
              )}
              <button onClick={handleDownload}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-white transition-all hover:scale-105"
                style={{ background: 'linear-gradient(135deg, #1B4332, #2D6A4F)' }}>
                {downloading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Download className="w-3 h-3" />}
                Unduh
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="book-card bg-white rounded-2xl overflow-hidden border border-forest-100 hover:border-forest-200 shadow-sm group">
      <div className="relative">
        <BookCover title={book.title} author={book.author} coverQuery={book.coverQuery} size="md" />
        <div className="absolute top-2 right-2 px-2 py-0.5 rounded-md text-[10px] font-bold font-mono text-white"
          style={{ background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(4px)' }}>
          {book.format}
        </div>
        {/* Hover overlay */}
        <div className="absolute inset-0 bg-forest-900/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-2 rounded-t-2xl px-3">
          {canRead && (
            <button onClick={handleRead}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all hover:scale-105"
              style={{ background: 'linear-gradient(135deg, #E8BE5A, #D4A017)', color: '#1B4332' }}>
              <BookMarked className="w-4 h-4" /> Baca Online
            </button>
          )}
          <button onClick={handleDownload}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold text-white border border-white/30 transition-all hover:bg-white/20">
            {downloading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
            Unduh
          </button>
        </div>
      </div>
      <div className="p-4">
        <div className="flex items-center gap-1.5 mb-2">
          <span className="text-xs px-2 py-0.5 rounded-full text-white font-semibold"
            style={{ background: book.categoryColor || '#1B4332' }}>
            {book.categoryEmoji} {book.category}
          </span>
        </div>
        <h3 className="font-display font-bold text-forest-800 text-sm leading-snug line-clamp-2 mb-1">{book.title}</h3>
        <p className="text-xs text-forest-500 line-clamp-1">{book.author}</p>
        {/* Bottom action row */}
        <div className="flex gap-2 mt-3">
          {canRead && (
            <button onClick={handleRead}
              className="flex-1 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1 transition-all hover:opacity-90"
              style={{ background: 'linear-gradient(135deg, #E8BE5A, #D4A017)', color: '#1B4332' }}>
              <BookMarked className="w-3 h-3" /> Baca
            </button>
          )}
          <button onClick={handleDownload}
            className="flex-1 py-2 rounded-xl text-xs font-bold text-white flex items-center justify-center gap-1 transition-all hover:opacity-90"
            style={{ background: 'linear-gradient(135deg, #1B4332, #2D6A4F)' }}>
            {downloading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Download className="w-3 h-3" />}
            Unduh
          </button>
        </div>
      </div>
    </div>
  )
}

function KatalogContent() {
  const searchParams    = useSearchParams()
  const router          = useRouter()
  const [selectedCat, setSelectedCat]   = useState(searchParams.get('category') || '')
  const [view, setView]                 = useState('grid')
  const [books, setBooks]               = useState([])
  const [loading, setLoading]           = useState(false)
  const [error, setError]               = useState(null)
  const [page, setPage]                 = useState(1)
  const [totalPages, setTotalPages]     = useState(1)
  const [total, setTotal]               = useState(0)
  const [search, setSearch]             = useState(searchParams.get('q') || '')
  const [searchInput, setSearchInput]   = useState(searchParams.get('q') || '')
  const [sidebarOpen, setSidebarOpen]   = useState(false)
  const LIMIT = 24

  const fetchBooks = useCallback(async (cat, pg, q) => {
    setLoading(true)
    setError(null)
    try {
      const params = new URLSearchParams({ limit: LIMIT, page: pg, ...(cat && { category: cat }) })
      const res  = await fetch(`/api/ebooks?${params}`)
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      let filtered = data.books || []
      if (q) {
        const ql = q.toLowerCase()
        filtered = filtered.filter(b =>
          b.title.toLowerCase().includes(ql) || (b.author && b.author.toLowerCase().includes(ql))
        )
      }
      setBooks(filtered)
      setTotal(q ? filtered.length : data.total)
      setTotalPages(q ? Math.ceil(filtered.length / LIMIT) : data.totalPages)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchBooks(selectedCat, page, search)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [selectedCat, page, search, fetchBooks])

  // Sync URL params on mount
  useEffect(() => {
    const cat = searchParams.get('category') || ''
    const q   = searchParams.get('q') || ''
    setSelectedCat(cat)
    setSearch(q)
    setSearchInput(q)
  }, [])

  const handleCatSelect = (id) => {
    setSelectedCat(id)
    setPage(1)
    setSearch('')
    setSearchInput('')
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
      {/* Page header */}
      <div className="py-12 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #1B4332, #0D1F17)' }}>
        <div className="absolute inset-0 opacity-20"
          style={{ backgroundImage: 'radial-gradient(circle, rgba(212,160,23,0.4) 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
        <div className="max-w-7xl mx-auto px-6 relative">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <a href="/" className="text-forest-400 hover:text-gold-400 transition-colors text-xs flex items-center gap-1">
                  🏠 Beranda
                </a>
                <span className="text-forest-600 text-xs">/</span>
                <span className="text-gold-400 text-xs font-semibold">Katalog</span>
                {activeCat && <>
                  <span className="text-forest-600 text-xs">/</span>
                  <span className="text-gold-400 text-xs font-semibold">{activeCat.label}</span>
                </>}
              </div>
              <h1 className="font-display font-bold text-3xl md:text-4xl text-white leading-tight">
                {activeCat ? `${activeCat.emoji} ${activeCat.label}` : '📚 Semua Koleksi'}
              </h1>
              <p className="text-forest-300 text-sm mt-1">
                {total > 0 ? `${total.toLocaleString('id-ID')} judul tersedia` : 'Memuat katalog...'}
              </p>
            </div>
            <form onSubmit={handleSearch} className="flex gap-2 w-full md:w-auto">
              <div className="flex-1 md:w-72 flex items-center gap-2 px-4 py-3 rounded-2xl"
                style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)' }}>
                <Search className="w-4 h-4 text-white/50 flex-shrink-0" />
                <input value={searchInput} onChange={e => setSearchInput(e.target.value)}
                  placeholder="Cari judul atau pengarang..."
                  className="bg-transparent text-white placeholder:text-white/40 text-sm outline-none w-full" />
                {searchInput && (
                  <button type="button" onClick={() => { setSearchInput(''); setSearch('') }}>
                    <X className="w-3.5 h-3.5 text-white/50 hover:text-white" />
                  </button>
                )}
              </div>
              <button type="submit"
                className="px-5 py-3 rounded-2xl text-sm font-bold text-forest-900 transition-all hover:scale-105"
                style={{ background: 'linear-gradient(135deg, #E8BE5A, #D4A017)' }}>
                Cari
              </button>
            </form>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">
        <div className="flex gap-6">
          {/* Sidebar desktop */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="bg-white rounded-3xl shadow-sm border border-forest-100 p-4 sticky top-24">
              <h3 className="font-display font-bold text-forest-800 text-lg mb-4 px-2">Kategori</h3>
              <div className="space-y-0.5 max-h-[70vh] overflow-y-auto pr-1">
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
                    <span>{cat.emoji}</span>
                    <span className="truncate">{cat.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* Mobile sidebar toggle */}
          <div className="lg:hidden w-full mb-4 flex items-center gap-3">
            <button onClick={() => setSidebarOpen(!sidebarOpen)}
              className="flex items-center gap-2 px-4 py-2.5 bg-white rounded-xl border border-forest-200 text-sm font-medium text-forest-700 shadow-sm">
              <SlidersHorizontal className="w-4 h-4" />
              {activeCat ? `${activeCat.emoji} ${activeCat.label}` : 'Semua Kategori'}
            </button>
            {selectedCat && (
              <button onClick={() => handleCatSelect('')} className="p-2 rounded-xl bg-forest-100 text-forest-700">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Mobile category drawer */}
          {sidebarOpen && (
            <div className="lg:hidden fixed inset-0 z-50 flex">
              <div className="absolute inset-0 bg-black/40" onClick={() => setSidebarOpen(false)} />
              <div className="relative ml-auto w-72 h-full bg-white shadow-2xl overflow-y-auto p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-display font-bold text-forest-800 text-xl">Kategori</h3>
                  <button onClick={() => setSidebarOpen(false)}><X className="w-5 h-5 text-forest-500" /></button>
                </div>
                <div className="space-y-0.5">
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

          {/* Main content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-5">
              <div className="text-sm text-forest-600">
                {search && <span className="mr-2">Hasil untuk "<strong>{search}</strong>"</span>}
                {!loading && <span>{total} judul</span>}
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => setView('grid')}
                  className={`p-2 rounded-lg transition-all ${view === 'grid' ? 'bg-forest-700 text-white' : 'bg-white text-forest-600 border border-forest-200 hover:bg-forest-50'}`}>
                  <Grid className="w-4 h-4" />
                </button>
                <button onClick={() => setView('list')}
                  className={`p-2 rounded-lg transition-all ${view === 'list' ? 'bg-forest-700 text-white' : 'bg-white text-forest-600 border border-forest-200 hover:bg-forest-50'}`}>
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>

            {loading && (
              <div className="flex flex-col items-center justify-center py-24 gap-4">
                <div className="relative">
                  <div className="w-16 h-16 rounded-full border-4 border-forest-100" />
                  <div className="absolute inset-0 w-16 h-16 rounded-full border-4 border-t-forest-700 animate-spin" />
                </div>
                <p className="text-forest-500 text-sm font-medium">Memuat koleksi e-book...</p>
              </div>
            )}

            {error && !loading && (
              <div className="text-center py-16 bg-white rounded-3xl border border-red-100">
                <div className="text-4xl mb-3">⚠️</div>
                <h3 className="font-display font-bold text-xl text-forest-800 mb-2">Gagal Memuat</h3>
                <p className="text-forest-500 text-sm mb-4">{error}</p>
                <button onClick={() => fetchBooks(selectedCat, page, search)}
                  className="px-5 py-2.5 bg-forest-700 text-white rounded-xl text-sm font-medium">
                  Coba Lagi
                </button>
              </div>
            )}

            {!loading && !error && books.length === 0 && (
              <div className="text-center py-16 bg-white rounded-3xl border border-forest-100">
                <div className="text-4xl mb-3">📭</div>
                <h3 className="font-display font-bold text-xl text-forest-800 mb-2">Tidak ada hasil</h3>
                <p className="text-forest-500 text-sm">Coba kata kunci lain atau pilih kategori berbeda.</p>
              </div>
            )}

            {!loading && !error && books.length > 0 && view === 'grid' && (
              <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
                {books.map((book) => <BookCard key={book.id} book={book} view="grid" />)}
              </div>
            )}

            {!loading && !error && books.length > 0 && view === 'list' && (
              <div className="space-y-3">
                {books.map((book) => <BookCard key={book.id} book={book} view="list" />)}
              </div>
            )}

            {/* Pagination */}
            {!loading && totalPages > 1 && (
              <div className="flex items-center justify-center gap-3 mt-10">
                <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                  className="w-10 h-10 rounded-xl border border-forest-200 flex items-center justify-center text-forest-700 hover:bg-forest-700 hover:text-white hover:border-forest-700 disabled:opacity-30 transition-all">
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
                      className={`w-10 h-10 rounded-xl text-sm font-bold transition-all ${
                        pg === page ? 'bg-forest-700 text-white' : 'border border-forest-200 text-forest-700 hover:bg-forest-50'
                      }`}>
                      {pg}
                    </button>
                  )
                })}
                <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                  className="w-10 h-10 rounded-xl border border-forest-200 flex items-center justify-center text-forest-700 hover:bg-forest-700 hover:text-white hover:border-forest-700 disabled:opacity-30 transition-all">
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
