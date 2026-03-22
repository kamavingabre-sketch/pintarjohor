'use client'
import { useEffect, useRef, useState, useCallback, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import {
  ArrowLeft, ChevronLeft, ChevronRight, BookOpen,
  Sun, Moon, Type, Minus, Plus, List, X, Loader2,
  BookMarked, Home, AlignJustify
} from 'lucide-react'

// ─── Theme definitions (outside component — stable reference) ───────────────
const THEMES = {
  light: { bg: '#F9F3E3', fg: '#1a1a1a', barBg: '#ffffff', link: '#1B4332' },
  sepia: { bg: '#F4ECD8', fg: '#3B2A1A', barBg: '#fdf6e3', link: '#6B4226' },
  dark:  { bg: '#111827', fg: '#e5e7eb', barBg: '#0f172a', link: '#74C69D' },
}

// ─── CSS injected into iframe content — NO iframe reload ────────────────────
function buildBodyCSS(themeKey, fontSize) {
  const t = THEMES[themeKey]
  return `
    html, body {
      background: ${t.bg} !important;
      color: ${t.fg} !important;
      font-size: ${fontSize}% !important;
      line-height: 1.8 !important;
      font-family: 'Georgia', 'Palatino', serif !important;
      padding: 0 !important;
      margin: 0 !important;
    }
    p, div, span, li, td, th {
      color: ${t.fg} !important;
    }
    a { color: ${t.link} !important; }
    h1, h2, h3, h4, h5, h6 {
      color: ${t.fg} !important;
      line-height: 1.3 !important;
    }
    img { max-width: 100% !important; height: auto !important; }
    * { box-sizing: border-box !important; }
  `
}

// ─── Main reader component ───────────────────────────────────────────────────
function BacaContent() {
  const searchParams = useSearchParams()
  const router       = useRouter()

  const rawUrl  = searchParams.get('url')    || ''
  const title   = searchParams.get('title')  || 'Buku'
  const author  = searchParams.get('author') || ''

  const proxyUrl = rawUrl ? `/api/read?url=${encodeURIComponent(rawUrl)}` : ''

  // Refs — never trigger re-render
  const viewerRef    = useRef(null)
  const bookRef      = useRef(null)
  const renditionRef = useRef(null)
  const themeRef     = useRef('light')
  const fontRef      = useRef(100)
  const initialised  = useRef(false)

  // UI state
  const [loading,       setLoading]      = useState(true)
  const [error,         setError]        = useState(null)
  const [theme,         setThemeState]   = useState('light')
  const [fontSize,      setFontState]    = useState(100)
  const [toc,           setToc]          = useState([])
  const [tocOpen,       setTocOpen]      = useState(false)
  const [settingsOpen,  setSettings]     = useState(false)
  const [progress,      setProgress]     = useState(0)
  const [currentHref,   setCurrentHref]  = useState('')
  const [pageInfo,      setPageInfo]     = useState({ current: 0, total: 0 })

  // ── Apply theme/font WITHOUT reloading iframe ──────────────────────────────
  const applyStyles = useCallback((themeKey, fs) => {
    const r = renditionRef.current
    if (!r) return
    // override() injects a <style> tag into the existing iframe — no reload
    r.themes.override('body', {
      'background': `${THEMES[themeKey].bg} !important`,
      'color':      `${THEMES[themeKey].fg} !important`,
      'font-size':  `${fs}% !important`,
      'line-height':'1.8 !important',
    })
    r.themes.override('p, div, span, li, td, th', {
      'color': `${THEMES[themeKey].fg} !important`,
    })
    r.themes.override('h1,h2,h3,h4,h5,h6', {
      'color': `${THEMES[themeKey].fg} !important`,
    })
    r.themes.override('a', {
      'color': `${THEMES[themeKey].link} !important`,
    })
  }, [])

  // ── Init reader — runs once per URL ────────────────────────────────────────
  const initReader = useCallback(async () => {
    if (!proxyUrl || !viewerRef.current || initialised.current) return
    initialised.current = true
    setLoading(true)
    setError(null)

    try {
      const ePub = (await import('epubjs')).default

      // Clean up any previous instance
      try { renditionRef.current?.destroy() } catch (_) {}
      try { bookRef.current?.destroy() }      catch (_) {}
      if (viewerRef.current) viewerRef.current.innerHTML = ''

      const book = ePub(proxyUrl, { openAs: 'epub' })
      bookRef.current = book

      const rendition = book.renderTo(viewerRef.current, {
        width:    '100%',
        height:   '100%',
        spread:   'none',
        flow:     'paginated',
        minSpreadWidth: 9999, // force single column
      })
      renditionRef.current = rendition

      // ── Inject CSS hook — fires on every new chapter iframe ──────────────
      // This is the KEY fix: inject styles at the content level, not via
      // register/select which destroy and recreate the iframe
      rendition.hooks.content.register((contents) => {
        const css = buildBodyCSS(themeRef.current, fontRef.current)
        contents.addStylesheetRules({
          'body': {
            'background': `${THEMES[themeRef.current].bg} !important`,
            'color':      `${THEMES[themeRef.current].fg} !important`,
            'font-size':  `${fontRef.current}% !important`,
            'line-height':'1.8 !important',
            'font-family':"'Georgia','Palatino',serif !important",
          },
          'p,div,span,li,td,th': { 'color': `${THEMES[themeRef.current].fg} !important` },
          'h1,h2,h3,h4,h5,h6':  { 'color': `${THEMES[themeRef.current].fg} !important` },
          'a':                   { 'color': `${THEMES[themeRef.current].link} !important` },
          'img':                 { 'max-width': '100% !important', 'height': 'auto !important' },
        })
      })

      // ── Display first page ────────────────────────────────────────────────
      await rendition.display()
      setLoading(false)

      // ── TOC ───────────────────────────────────────────────────────────────
      book.loaded.navigation.then((nav) => {
        setToc(nav.toc || [])
      })

      // ── Page count (non-blocking) ─────────────────────────────────────────
      book.ready.then(() => {
        book.locations.generate(800).then(() => {
          rendition.on('relocated', (location) => {
            if (location?.start?.cfi) {
              const pct = book.locations.percentageFromCfi(location.start.cfi)
              setProgress(Math.round((pct || 0) * 100))
            }
            if (location?.start?.href) {
              setCurrentHref(location.start.href)
            }
            if (location?.start?.displayed) {
              setPageInfo({
                current: location.start.displayed.page || 1,
                total:   location.start.displayed.total || 1,
              })
            }
          })
        }).catch(() => {
          // locations generation failed silently — progress just won't show
        })
      }).catch(() => {})

    } catch (e) {
      console.error('[EPUB reader]', e)
      setError('Gagal memuat buku. Format tidak didukung atau file tidak dapat diakses.')
      setLoading(false)
      initialised.current = false
    }
  }, [proxyUrl]) // only re-init if URL changes

  useEffect(() => {
    initialised.current = false
    initReader()
    return () => {
      try { renditionRef.current?.destroy() } catch (_) {}
      try { bookRef.current?.destroy() }      catch (_) {}
    }
  }, [initReader])

  // ── Theme change — update ref + apply via override (NO iframe reload) ──────
  const setTheme = useCallback((t) => {
    themeRef.current = t
    setThemeState(t)
    applyStyles(t, fontRef.current)
  }, [applyStyles])

  // ── Font size change — update ref + apply via override ─────────────────────
  const setFontSize = useCallback((fs) => {
    fontRef.current = fs
    setFontState(fs)
    applyStyles(themeRef.current, fs)
  }, [applyStyles])

  // ── Navigation ─────────────────────────────────────────────────────────────
  const prevPage = useCallback(() => renditionRef.current?.prev(), [])
  const nextPage = useCallback(() => renditionRef.current?.next(), [])
  const goToChapter = useCallback((href) => {
    renditionRef.current?.display(href)
    setTocOpen(false)
  }, [])

  // ── Keyboard nav ───────────────────────────────────────────────────────────
  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'ArrowLeft')  prevPage()
      if (e.key === 'ArrowRight') nextPage()
      if (e.key === 'Escape')     { setTocOpen(false); setSettings(false) }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [prevPage, nextPage])

  // ── Touch swipe support ────────────────────────────────────────────────────
  useEffect(() => {
    const el = viewerRef.current
    if (!el) return
    let startX = 0
    const onTouchStart = (e) => { startX = e.touches[0].clientX }
    const onTouchEnd   = (e) => {
      const dx = e.changedTouches[0].clientX - startX
      if (Math.abs(dx) > 50) { dx > 0 ? prevPage() : nextPage() }
    }
    el.addEventListener('touchstart', onTouchStart, { passive: true })
    el.addEventListener('touchend',   onTouchEnd,   { passive: true })
    return () => {
      el.removeEventListener('touchstart', onTouchStart)
      el.removeEventListener('touchend',   onTouchEnd)
    }
  }, [prevPage, nextPage])

  if (!proxyUrl) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#F9F3E3' }}>
        <div className="text-center px-6">
          <div className="text-5xl mb-4">📖</div>
          <h2 className="font-display font-bold text-2xl text-forest-800 mb-2">Buku tidak ditemukan</h2>
          <p className="text-forest-500 mb-5 text-sm">URL buku tidak valid atau tidak tersedia.</p>
          <a href="/katalog" className="px-6 py-3 bg-forest-700 text-white rounded-xl text-sm font-bold">
            Ke Katalog
          </a>
        </div>
      </div>
    )
  }

  const t       = THEMES[theme]
  const barBorder = theme === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'

  return (
    <div className="flex flex-col overflow-hidden"
      style={{ height: '100dvh', background: t.bg, color: t.fg }}>

      {/* ── Top bar ── */}
      <div className="flex items-center justify-between px-3 md:px-5 py-2.5 border-b flex-shrink-0 gap-2 z-40"
        style={{ background: t.barBg, borderColor: barBorder }}>
        {/* Left: back + home + title */}
        <div className="flex items-center gap-2 min-w-0">
          <button onClick={() => router.back()}
            className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors"
            style={{ color: t.fg }}>
            <ArrowLeft className="w-4 h-4" />
          </button>
          <button onClick={() => router.push('/')}
            className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors"
            style={{ color: t.fg }}>
            <Home className="w-4 h-4" />
          </button>
          <div className="min-w-0 hidden sm:block">
            <p className="font-display font-bold text-sm truncate" style={{ color: t.fg }}>{title}</p>
            {author && <p className="text-xs truncate opacity-50" style={{ color: t.fg }}>{author}</p>}
          </div>
        </div>

        {/* Right: actions */}
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <button onClick={() => { setTocOpen(v => !v); setSettings(false) }}
            className="w-9 h-9 rounded-xl flex items-center justify-center transition-all"
            style={{ background: tocOpen ? '#1B4332' : 'transparent', color: tocOpen ? '#fff' : t.fg }}>
            <AlignJustify className="w-4 h-4" />
          </button>
          <button onClick={() => { setSettings(v => !v); setTocOpen(false) }}
            className="w-9 h-9 rounded-xl flex items-center justify-center transition-all"
            style={{ background: settingsOpen ? '#1B4332' : 'transparent', color: settingsOpen ? '#fff' : t.fg }}>
            <Type className="w-4 h-4" />
          </button>
          <a href="/katalog"
            className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-white"
            style={{ background: 'linear-gradient(135deg, #1B4332, #2D6A4F)' }}>
            <BookOpen className="w-3.5 h-3.5" /> Katalog
          </a>
        </div>
      </div>

      {/* ── Progress bar ── */}
      <div className="h-0.5 flex-shrink-0" style={{ background: barBorder }}>
        <div className="h-full transition-all duration-700 ease-out"
          style={{ width: `${progress}%`, background: 'linear-gradient(90deg, #1B4332, #D4A017)' }} />
      </div>

      {/* ── Settings panel ── */}
      {settingsOpen && (
        <div className="absolute top-14 right-3 z-50 rounded-2xl shadow-2xl p-5 w-64 border"
          style={{ background: t.barBg, borderColor: barBorder }}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-semibold text-sm" style={{ color: t.fg }}>Pengaturan</h3>
            <button onClick={() => setSettings(false)} style={{ color: t.fg, opacity: 0.5 }}>
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Font size */}
          <div className="mb-5">
            <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: t.fg, opacity: 0.5 }}>
              Ukuran Teks
            </p>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setFontSize(Math.max(70, fontRef.current - 10))}
                className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-bold"
                style={{ background: '#1B4332' }}>
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="flex-1 text-center text-sm font-bold" style={{ color: t.fg }}>
                {fontSize}%
              </span>
              <button
                onClick={() => setFontSize(Math.min(160, fontRef.current + 10))}
                className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-bold"
                style={{ background: '#1B4332' }}>
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Theme */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: t.fg, opacity: 0.5 }}>
              Tema Warna
            </p>
            <div className="flex gap-2">
              {[
                { id: 'light', label: 'Terang', icon: <Sun className="w-3.5 h-3.5" />,      bg: '#F9F3E3', fg: '#1a1a1a' },
                { id: 'sepia', label: 'Sepia',  icon: <BookMarked className="w-3.5 h-3.5" />, bg: '#F4ECD8', fg: '#3B2A1A' },
                { id: 'dark',  label: 'Gelap',  icon: <Moon className="w-3.5 h-3.5" />,     bg: '#111827', fg: '#e5e7eb' },
              ].map(opt => (
                <button key={opt.id}
                  onClick={() => setTheme(opt.id)}
                  className="flex-1 flex flex-col items-center gap-1 py-2.5 rounded-xl text-[10px] font-semibold border-2 transition-all"
                  style={{
                    background: opt.bg, color: opt.fg,
                    borderColor: theme === opt.id ? '#D4A017' : 'transparent',
                    boxShadow: theme === opt.id ? '0 0 0 3px rgba(212,160,23,0.2)' : 'none',
                  }}>
                  {opt.icon}
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── TOC panel ── */}
      {tocOpen && (
        <div className="absolute top-14 right-3 z-50 rounded-2xl shadow-2xl w-72 border overflow-hidden"
          style={{ background: t.barBg, borderColor: barBorder }}>
          <div className="flex items-center justify-between px-4 py-3 border-b" style={{ borderColor: barBorder }}>
            <h3 className="font-display font-semibold text-sm" style={{ color: t.fg }}>Daftar Isi</h3>
            <button onClick={() => setTocOpen(false)} style={{ color: t.fg, opacity: 0.5 }}>
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="overflow-y-auto max-h-80">
            {toc.length === 0 ? (
              <p className="px-4 py-4 text-xs opacity-40" style={{ color: t.fg }}>
                Daftar isi tidak tersedia
              </p>
            ) : toc.map((item, i) => (
              <button key={i} onClick={() => goToChapter(item.href)}
                className="w-full text-left px-4 py-3 text-sm border-b last:border-0 transition-colors"
                style={{
                  color: currentHref.includes(item.href) ? '#D4A017' : t.fg,
                  borderColor: barBorder,
                  background: currentHref.includes(item.href) ? (theme === 'dark' ? 'rgba(212,160,23,0.1)' : 'rgba(27,67,50,0.05)') : 'transparent',
                }}>
                {item.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── Reader area ── */}
      <div className="flex-1 relative overflow-hidden flex items-stretch">
        {/* Prev button */}
        <button onClick={prevPage}
          className="absolute left-1 md:left-3 top-1/2 -translate-y-1/2 z-30 w-9 h-16 md:w-11 md:h-20 rounded-xl flex items-center justify-center opacity-20 hover:opacity-80 transition-opacity"
          style={{ background: t.barBg, border: `1px solid ${barBorder}` }}>
          <ChevronLeft className="w-4 h-4 md:w-5 md:h-5" style={{ color: t.fg }} />
        </button>

        {/* Loading overlay */}
        {loading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 z-20"
            style={{ background: t.bg }}>
            <div className="relative w-16 h-16">
              <div className="absolute inset-0 rounded-full border-4 border-forest-100" />
              <div className="absolute inset-0 rounded-full border-4 border-t-forest-700 animate-spin" />
            </div>
            <div className="text-center">
              <p className="text-sm font-medium opacity-70" style={{ color: t.fg }}>Memuat buku...</p>
              <p className="text-xs opacity-40 mt-1" style={{ color: t.fg }}>Harap tunggu sebentar</p>
            </div>
          </div>
        )}

        {/* Error overlay */}
        {error && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 px-6 text-center z-20"
            style={{ background: t.bg }}>
            <div className="text-5xl">😔</div>
            <h3 className="font-display font-bold text-xl" style={{ color: t.fg }}>Gagal Memuat Buku</h3>
            <p className="text-sm opacity-60 max-w-sm" style={{ color: t.fg }}>{error}</p>
            <div className="flex gap-3 flex-wrap justify-center">
              <button onClick={() => { initialised.current = false; initReader() }}
                className="px-5 py-2.5 rounded-xl text-sm font-bold text-white"
                style={{ background: '#1B4332' }}>
                Coba Lagi
              </button>
              <a href={rawUrl} target="_blank" rel="noopener noreferrer"
                className="px-5 py-2.5 rounded-xl text-sm font-bold"
                style={{ background: 'rgba(27,67,50,0.1)', color: '#1B4332' }}>
                Unduh File
              </a>
            </div>
          </div>
        )}

        {/* EPUB viewer — stable div, never unmounted */}
        <div
          ref={viewerRef}
          className="flex-1 w-full"
          style={{ minHeight: 0 }}
        />

        {/* Next button */}
        <button onClick={nextPage}
          className="absolute right-1 md:right-3 top-1/2 -translate-y-1/2 z-30 w-9 h-16 md:w-11 md:h-20 rounded-xl flex items-center justify-center opacity-20 hover:opacity-80 transition-opacity"
          style={{ background: t.barBg, border: `1px solid ${barBorder}` }}>
          <ChevronRight className="w-4 h-4 md:w-5 md:h-5" style={{ color: t.fg }} />
        </button>
      </div>

      {/* ── Bottom bar ── */}
      <div className="flex items-center justify-between px-4 md:px-6 py-2 border-t flex-shrink-0"
        style={{ background: t.barBg, borderColor: barBorder }}>
        <span className="text-xs opacity-40" style={{ color: t.fg }}>
          {progress > 0 ? `${progress}%` : '—'}
        </span>
        <div className="flex items-center gap-1">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="rounded-full transition-all duration-500"
              style={{
                width: i < Math.round(progress / 10) ? 16 : 6,
                height: 5,
                background: i < Math.round(progress / 10) ? '#1B4332' : (theme === 'dark' ? 'rgba(255,255,255,0.15)' : 'rgba(27,67,50,0.15)'),
              }} />
          ))}
        </div>
        <span className="text-xs opacity-30 hidden sm:block" style={{ color: t.fg }}>
          ← →
        </span>
      </div>
    </div>
  )
}

export default function BacaPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#F9F3E3' }}>
        <div className="relative w-14 h-14">
          <div className="absolute inset-0 rounded-full border-4 border-forest-100" />
          <div className="absolute inset-0 rounded-full border-4 border-t-forest-700 animate-spin" />
        </div>
      </div>
    }>
      <BacaContent />
    </Suspense>
  )
}
