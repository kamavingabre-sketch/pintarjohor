'use client'
import { useEffect, useRef, useState, useCallback, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import {
  ArrowLeft, ChevronLeft, ChevronRight, BookOpen,
  Sun, Moon, Type, Minus, Plus, List, X, Loader2,
  AlignLeft, BookMarked, Home
} from 'lucide-react'

function BacaContent() {
  const searchParams  = useSearchParams()
  const router        = useRouter()
  const viewerRef     = useRef(null)
  const bookRef       = useRef(null)
  const renditionRef  = useRef(null)

  const rawUrl  = searchParams.get('url')   || ''
  const title   = searchParams.get('title') || 'Buku'
  const author  = searchParams.get('author')|| ''

  // Proxy URL to bypass CORS
  const proxyUrl = rawUrl ? `/api/read?url=${encodeURIComponent(rawUrl)}` : ''

  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState(null)
  const [dark, setDark]         = useState(false)
  const [fontSize, setFontSize] = useState(100)
  const [toc, setToc]           = useState([])
  const [tocOpen, setTocOpen]   = useState(false)
  const [progress, setProgress] = useState(0)
  const [currentChapter, setCurrentChapter] = useState('')
  const [settingsOpen, setSettingsOpen] = useState(false)

  const themes = {
    light:  { body: { background: '#F9F3E3', color: '#0D1F17' } },
    dark:   { body: { background: '#0D1F17', color: '#D4ECD8' } },
    sepia:  { body: { background: '#F4ECD8', color: '#3B2A1A' } },
  }
  const [theme, setTheme] = useState('light')

  const initReader = useCallback(async () => {
    if (!proxyUrl || !viewerRef.current) return
    setLoading(true)
    setError(null)

    try {
      // Dynamic import epubjs (client-only)
      const ePub = (await import('epubjs')).default

      // Destroy previous instance
      if (renditionRef.current) {
        renditionRef.current.destroy()
        renditionRef.current = null
      }
      if (bookRef.current) {
        bookRef.current.destroy()
        bookRef.current = null
      }
      viewerRef.current.innerHTML = ''

      const book = ePub(proxyUrl)
      bookRef.current = book

      const rendition = book.renderTo(viewerRef.current, {
        width:  '100%',
        height: '100%',
        spread: 'none',
        flow:   'paginated',
      })
      renditionRef.current = rendition

      // Apply initial theme & font size
      rendition.themes.fontSize(`${fontSize}%`)
      rendition.themes.register('custom', themes[theme])
      rendition.themes.select('custom')

      await rendition.display()
      setLoading(false)

      // TOC
      book.loaded.navigation.then((nav) => {
        setToc(nav.toc || [])
      })

      // Progress tracking
      book.ready.then(() => {
        book.locations.generate(1600).then(() => {
          rendition.on('relocated', (location) => {
            const pct = book.locations.percentageFromCfi(location.start.cfi)
            setProgress(Math.round(pct * 100))
            setCurrentChapter(location.start.href || '')
          })
        })
      })

    } catch (e) {
      console.error('[reader]', e)
      setError('Gagal memuat buku. Format mungkin tidak didukung atau file tidak tersedia.')
      setLoading(false)
    }
  }, [proxyUrl])

  useEffect(() => {
    initReader()
    return () => {
      renditionRef.current?.destroy()
      bookRef.current?.destroy()
    }
  }, [initReader])

  // Apply theme change
  useEffect(() => {
    if (!renditionRef.current) return
    renditionRef.current.themes.register('custom', themes[theme])
    renditionRef.current.themes.select('custom')
  }, [theme])

  // Apply font size change
  useEffect(() => {
    renditionRef.current?.themes.fontSize(`${fontSize}%`)
  }, [fontSize])

  const prevPage = () => renditionRef.current?.prev()
  const nextPage = () => renditionRef.current?.next()

  const goToChapter = (href) => {
    renditionRef.current?.display(href)
    setTocOpen(false)
  }

  // Keyboard navigation
  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'ArrowLeft')  prevPage()
      if (e.key === 'ArrowRight') nextPage()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  if (!proxyUrl) {
    return (
      <div className="min-h-screen flex items-center justify-center"
        style={{ background: '#F9F3E3' }}>
        <div className="text-center">
          <div className="text-5xl mb-4">📖</div>
          <h2 className="font-display font-bold text-2xl text-forest-800 mb-2">Buku tidak ditemukan</h2>
          <p className="text-forest-500 mb-4">URL buku tidak valid.</p>
          <button onClick={() => router.push('/katalog')}
            className="px-5 py-2.5 bg-forest-700 text-white rounded-xl text-sm font-medium">
            Ke Katalog
          </button>
        </div>
      </div>
    )
  }

  const bgColor = theme === 'dark' ? '#0D1F17' : theme === 'sepia' ? '#F4ECD8' : '#F9F3E3'
  const textColor = theme === 'dark' ? '#D4ECD8' : '#0D1F17'
  const barBg = theme === 'dark' ? '#0A1A11' : '#FFFFFF'
  const barBorder = theme === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(27,67,50,0.1)'

  return (
    <div className="flex flex-col h-screen overflow-hidden"
      style={{ background: bgColor, color: textColor }}>

      {/* Top bar */}
      <div className="flex items-center justify-between px-4 py-3 border-b z-40 flex-shrink-0"
        style={{ background: barBg, borderColor: barBorder }}>
        <div className="flex items-center gap-3">
          <button onClick={() => router.back()}
            className="w-9 h-9 rounded-xl flex items-center justify-center hover:bg-forest-50 transition-all"
            style={{ color: textColor }}>
            <ArrowLeft className="w-4 h-4" />
          </button>
          <button onClick={() => router.push('/')}
            className="w-9 h-9 rounded-xl flex items-center justify-center hover:bg-forest-50 transition-all"
            style={{ color: textColor }} title="Beranda">
            <Home className="w-4 h-4" />
          </button>
          <div className="hidden sm:block">
            <p className="font-display font-bold text-sm leading-tight line-clamp-1"
              style={{ color: textColor }}>{title}</p>
            {author && <p className="text-xs opacity-50">{author}</p>}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* TOC toggle */}
          <button onClick={() => { setTocOpen(!tocOpen); setSettingsOpen(false) }}
            className="w-9 h-9 rounded-xl flex items-center justify-center transition-all"
            style={{ background: tocOpen ? '#1B4332' : 'transparent', color: tocOpen ? '#fff' : textColor }}>
            <List className="w-4 h-4" />
          </button>

          {/* Settings toggle */}
          <button onClick={() => { setSettingsOpen(!settingsOpen); setTocOpen(false) }}
            className="w-9 h-9 rounded-xl flex items-center justify-center transition-all"
            style={{ background: settingsOpen ? '#1B4332' : 'transparent', color: settingsOpen ? '#fff' : textColor }}>
            <Type className="w-4 h-4" />
          </button>

          {/* Back to catalog */}
          <a href="/katalog"
            className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-white transition-all hover:opacity-90"
            style={{ background: 'linear-gradient(135deg, #1B4332, #2D6A4F)' }}>
            <BookOpen className="w-3.5 h-3.5" /> Katalog
          </a>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-0.5 flex-shrink-0" style={{ background: barBorder }}>
        <div className="h-full transition-all duration-500"
          style={{ width: `${progress}%`, background: 'linear-gradient(90deg, #1B4332, #D4A017)' }} />
      </div>

      {/* Settings panel */}
      {settingsOpen && (
        <div className="absolute top-16 right-4 z-50 rounded-2xl shadow-2xl p-5 w-64 border"
          style={{ background: barBg, borderColor: barBorder }}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-semibold text-sm" style={{ color: textColor }}>Pengaturan Tampilan</h3>
            <button onClick={() => setSettingsOpen(false)}>
              <X className="w-4 h-4 opacity-50" />
            </button>
          </div>

          {/* Font size */}
          <div className="mb-4">
            <p className="text-xs opacity-60 mb-2 uppercase tracking-wider">Ukuran Teks</p>
            <div className="flex items-center gap-3">
              <button onClick={() => setFontSize(s => Math.max(70, s - 10))}
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ background: '#1B4332', color: '#fff' }}>
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="flex-1 text-center text-sm font-bold" style={{ color: textColor }}>{fontSize}%</span>
              <button onClick={() => setFontSize(s => Math.min(160, s + 10))}
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ background: '#1B4332', color: '#fff' }}>
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Theme */}
          <div>
            <p className="text-xs opacity-60 mb-2 uppercase tracking-wider">Tema</p>
            <div className="flex gap-2">
              {[
                { id: 'light', label: 'Terang', icon: <Sun className="w-3.5 h-3.5" />, bg: '#F9F3E3', text: '#0D1F17' },
                { id: 'sepia', label: 'Sepia',  icon: <BookMarked className="w-3.5 h-3.5" />, bg: '#F4ECD8', text: '#3B2A1A' },
                { id: 'dark',  label: 'Gelap',  icon: <Moon className="w-3.5 h-3.5" />, bg: '#0D1F17', text: '#D4ECD8' },
              ].map(t => (
                <button key={t.id} onClick={() => setTheme(t.id)}
                  className="flex-1 flex flex-col items-center gap-1 py-2.5 rounded-xl text-[10px] font-semibold border-2 transition-all"
                  style={{
                    background: t.bg, color: t.text,
                    borderColor: theme === t.id ? '#D4A017' : 'transparent',
                  }}>
                  {t.icon}
                  {t.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TOC panel */}
      {tocOpen && (
        <div className="absolute top-16 right-4 z-50 rounded-2xl shadow-2xl w-72 border overflow-hidden"
          style={{ background: barBg, borderColor: barBorder }}>
          <div className="flex items-center justify-between px-4 py-3 border-b"
            style={{ borderColor: barBorder }}>
            <h3 className="font-display font-semibold text-sm" style={{ color: textColor }}>Daftar Isi</h3>
            <button onClick={() => setTocOpen(false)}>
              <X className="w-4 h-4 opacity-50" />
            </button>
          </div>
          <div className="overflow-y-auto max-h-96">
            {toc.length === 0 ? (
              <p className="px-4 py-3 text-xs opacity-50">Daftar isi tidak tersedia</p>
            ) : (
              toc.map((item, i) => (
                <button key={i} onClick={() => goToChapter(item.href)}
                  className="w-full text-left px-4 py-3 text-sm hover:bg-forest-50/20 transition-colors border-b last:border-0"
                  style={{ color: currentChapter.includes(item.href) ? '#D4A017' : textColor, borderColor: barBorder }}>
                  {item.label}
                </button>
              ))
            )}
          </div>
        </div>
      )}

      {/* Reader area */}
      <div className="flex-1 flex relative overflow-hidden">
        {/* Prev button */}
        <button onClick={prevPage}
          className="absolute left-2 top-1/2 -translate-y-1/2 z-30 w-10 h-16 rounded-xl flex items-center justify-center transition-all opacity-30 hover:opacity-100"
          style={{ background: barBg, border: `1px solid ${barBorder}` }}>
          <ChevronLeft className="w-5 h-5" style={{ color: textColor }} />
        </button>

        {/* EPUB viewer */}
        <div className="flex-1 relative">
          {loading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 z-20"
              style={{ background: bgColor }}>
              <div className="relative">
                <div className="w-16 h-16 rounded-full border-4 border-forest-100" />
                <div className="absolute inset-0 w-16 h-16 rounded-full border-4 border-t-forest-700 animate-spin" />
              </div>
              <p className="text-sm opacity-60">Memuat buku, harap tunggu...</p>
            </div>
          )}
          {error && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 px-6 text-center z-20"
              style={{ background: bgColor }}>
              <div className="text-5xl">😔</div>
              <h3 className="font-display font-bold text-xl" style={{ color: textColor }}>
                Gagal Memuat Buku
              </h3>
              <p className="text-sm opacity-60 max-w-sm">{error}</p>
              <div className="flex gap-3">
                <button onClick={initReader}
                  className="px-4 py-2.5 rounded-xl text-sm font-semibold text-white"
                  style={{ background: '#1B4332' }}>
                  Coba Lagi
                </button>
                <a href={rawUrl} target="_blank" rel="noopener noreferrer"
                  className="px-4 py-2.5 rounded-xl text-sm font-semibold"
                  style={{ background: 'rgba(27,67,50,0.1)', color: '#1B4332' }}>
                  Unduh Saja
                </a>
              </div>
            </div>
          )}
          <div ref={viewerRef} className="w-full h-full" />
        </div>

        {/* Next button */}
        <button onClick={nextPage}
          className="absolute right-2 top-1/2 -translate-y-1/2 z-30 w-10 h-16 rounded-xl flex items-center justify-center transition-all opacity-30 hover:opacity-100"
          style={{ background: barBg, border: `1px solid ${barBorder}` }}>
          <ChevronRight className="w-5 h-5" style={{ color: textColor }} />
        </button>
      </div>

      {/* Bottom bar */}
      <div className="flex items-center justify-between px-6 py-2 border-t flex-shrink-0"
        style={{ background: barBg, borderColor: barBorder }}>
        <span className="text-xs opacity-40">{progress}% selesai</span>
        <div className="flex items-center gap-1">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="w-4 h-1 rounded-full transition-all"
              style={{ background: i < Math.round(progress / 10) ? '#1B4332' : 'rgba(27,67,50,0.15)' }} />
          ))}
        </div>
        <span className="text-xs opacity-40">← → untuk navigasi</span>
      </div>
    </div>
  )
}

export default function BacaPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex flex-col items-center justify-center gap-4"
        style={{ background: '#F9F3E3' }}>
        <div className="relative">
          <div className="w-16 h-16 rounded-full border-4 border-forest-100" />
          <div className="absolute inset-0 w-16 h-16 rounded-full border-4 border-t-forest-700 animate-spin" />
        </div>
        <p className="text-forest-500 text-sm">Memuat halaman baca...</p>
      </div>
    }>
      <BacaContent />
    </Suspense>
  )
}
