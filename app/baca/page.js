'use client'
import { useState, useEffect, useRef, useCallback, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import {
  ArrowLeft, Home, Download, BookOpen, Loader2,
  ChevronLeft, ChevronRight, ZoomIn, ZoomOut, RefreshCw
} from 'lucide-react'

const PDFJS_CDN    = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js'
const PDFJS_WORKER = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js'
const CMAP_URL     = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/cmaps/'

// Domains that block server-side fetch — load directly in browser
const DIRECT_DOMAINS = [
  'archive.org', 'ia800', 'ia801', 'ia802', 'ia803', 'ia804',
  'ia900', 'ia903', 'gutenberg.org', 'mozilla.github.io',
  'standardebooks.org', 'manybooks.net',
]

function needsDirect(url) {
  try {
    const h = new URL(url).hostname
    return DIRECT_DOMAINS.some(d => h.includes(d))
  } catch { return false }
}

function BacaPDFContent() {
  const searchParams = useSearchParams()
  const router       = useRouter()

  const rawUrl = searchParams.get('url')   || ''
  const title  = searchParams.get('title') || 'Dokumen'
  const author = searchParams.get('author')|| ''

  const canvasRef    = useRef(null)
  const pdfRef       = useRef(null)
  const renderingRef = useRef(false)

  const [status,     setStatus]     = useState('idle')
  const [errorMsg,   setErrorMsg]   = useState('')
  const [page,       setPage]       = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const [scale,      setScale]      = useState(1.3)
  const [ready,      setReady]      = useState(false)
  const [info,       setInfo]       = useState('')

  // ── Load PDF.js CDN once ───────────────────────────────────────────────
  useEffect(() => {
    if (window.pdfjsLib) { setReady(true); return }
    const s = document.createElement('script')
    s.src = PDFJS_CDN
    s.onload = () => {
      window.pdfjsLib.GlobalWorkerOptions.workerSrc = PDFJS_WORKER
      setReady(true)
    }
    s.onerror = () => {
      setStatus('error')
      setErrorMsg('Gagal memuat PDF.js. Periksa koneksi internet Anda.')
    }
    document.head.appendChild(s)
  }, [])

  // ── Render page to canvas ──────────────────────────────────────────────
  const renderPage = useCallback(async (pdf, pageNum, sc) => {
    if (!canvasRef.current || renderingRef.current) return
    renderingRef.current = true
    try {
      const pg       = await pdf.getPage(pageNum)
      const viewport = pg.getViewport({ scale: sc })
      const canvas   = canvasRef.current
      const ctx      = canvas.getContext('2d')
      canvas.width   = viewport.width
      canvas.height  = viewport.height
      await pg.render({ canvasContext: ctx, viewport }).promise
    } finally {
      renderingRef.current = false
    }
  }, [])

  // ── Try loading PDF from a URL ─────────────────────────────────────────
  const tryLoad = useCallback(async (url, label) => {
    setInfo(label)
    const pdf = await window.pdfjsLib.getDocument({
      url,
      withCredentials: false,
      cMapUrl: CMAP_URL,
      cMapPacked: true,
      disableAutoFetch: false,
      disableStream: false,
    }).promise
    return pdf
  }, [])

  // ── Main loader ────────────────────────────────────────────────────────
  const loadPDF = useCallback(async () => {
    if (!rawUrl || !ready) return

    setStatus('loading')
    setErrorMsg('')
    setPage(1)
    setTotalPages(0)
    pdfRef.current = null

    const useProxy = !needsDirect(rawUrl)
    const proxyUrl = `/api/read?url=${encodeURIComponent(rawUrl)}`

    let pdf = null

    // Attempt 1: proxy (only for domains that allow server-side fetch)
    if (useProxy) {
      try {
        pdf = await tryLoad(proxyUrl, 'Mengambil via server...')
      } catch (e) {
        console.warn('[PDF] Proxy failed:', e.message)
      }
    }

    // Attempt 2: direct browser fetch (no proxy)
    if (!pdf) {
      try {
        pdf = await tryLoad(rawUrl, 'Mengambil langsung dari sumber...')
      } catch (e) {
        console.warn('[PDF] Direct failed:', e.message)
      }
    }

    // Attempt 3: CORS proxy fallback (allOrigins)
    if (!pdf) {
      try {
        const corsProxy = `https://api.allorigins.win/raw?url=${encodeURIComponent(rawUrl)}`
        pdf = await tryLoad(corsProxy, 'Mencoba proxy alternatif...')
      } catch (e) {
        console.warn('[PDF] CORS proxy failed:', e.message)
      }
    }

    if (!pdf) {
      setStatus('error')
      setErrorMsg(
        'File PDF tidak dapat dibuka secara online. ' +
        'Server sumber membatasi akses browser. ' +
        'Silakan unduh file untuk membacanya secara offline.'
      )
      return
    }

    pdfRef.current = pdf
    setTotalPages(pdf.numPages)

    try {
      await renderPage(pdf, 1, scale)
      setStatus('done')
      setInfo('')
    } catch (e) {
      setStatus('error')
      setErrorMsg('Gagal menggambar halaman PDF: ' + e.message)
    }
  }, [rawUrl, ready, tryLoad, renderPage, scale])

  useEffect(() => {
    if (ready && rawUrl) loadPDF()
  }, [ready, rawUrl, loadPDF])

  // ── Navigate pages ─────────────────────────────────────────────────────
  const goToPage = useCallback(async (n) => {
    if (!pdfRef.current || n < 1 || n > totalPages) return
    setPage(n)
    await renderPage(pdfRef.current, n, scale)
  }, [totalPages, scale, renderPage])

  // ── Zoom ───────────────────────────────────────────────────────────────
  const zoom = useCallback(async (delta) => {
    if (!pdfRef.current) return
    const ns = Math.min(3, Math.max(0.5, +(scale + delta).toFixed(1)))
    setScale(ns)
    await renderPage(pdfRef.current, page, ns)
  }, [scale, page, renderPage])

  // ── Keyboard ───────────────────────────────────────────────────────────
  useEffect(() => {
    const h = (e) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') goToPage(page + 1)
      if (e.key === 'ArrowLeft'  || e.key === 'ArrowUp')   goToPage(page - 1)
      if (e.key === '+') zoom(+0.2)
      if (e.key === '-') zoom(-0.2)
    }
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [goToPage, zoom, page])

  if (!rawUrl) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#F9F3E3' }}>
        <div className="text-center px-6">
          <div className="text-5xl mb-4">📄</div>
          <h2 className="font-display font-bold text-2xl text-forest-800 mb-2">Dokumen tidak ditemukan</h2>
          <a href="/katalog" className="mt-4 inline-block px-6 py-3 bg-forest-700 text-white rounded-xl text-sm font-bold">
            Ke Katalog
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col overflow-hidden" style={{ height: '100dvh', background: '#323639' }}>

      {/* ── Top bar ── */}
      <div className="flex items-center justify-between px-3 md:px-5 py-2.5 bg-white border-b border-gray-200 flex-shrink-0 gap-2 z-10">
        <div className="flex items-center gap-2 min-w-0">
          <button onClick={() => router.back()}
            className="w-9 h-9 rounded-xl flex items-center justify-center hover:bg-gray-100 text-gray-700">
            <ArrowLeft className="w-4 h-4" />
          </button>
          <button onClick={() => router.push('/')}
            className="w-9 h-9 rounded-xl flex items-center justify-center hover:bg-gray-100 text-gray-700">
            <Home className="w-4 h-4" />
          </button>
          <div className="min-w-0 hidden sm:block">
            <p className="font-display font-bold text-sm text-forest-800 truncate">{title}</p>
            {author && <p className="text-xs text-forest-500 truncate">{author}</p>}
          </div>
        </div>

        <div className="flex items-center gap-1.5 flex-shrink-0">
          {status === 'done' && (
            <div className="hidden sm:flex items-center gap-1 bg-gray-100 rounded-xl p-1">
              <button onClick={() => zoom(-0.2)}
                className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-white text-gray-600 transition-all">
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <span className="text-xs font-bold text-gray-600 w-10 text-center">
                {Math.round(scale * 100)}%
              </span>
              <button onClick={() => zoom(+0.2)}
                className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-white text-gray-600 transition-all">
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          <button onClick={loadPDF}
            title="Muat ulang"
            className="w-9 h-9 rounded-xl flex items-center justify-center hover:bg-gray-100 text-gray-600">
            <RefreshCw className={`w-4 h-4 ${status === 'loading' ? 'animate-spin' : ''}`} />
          </button>

          <a href="/katalog"
            className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-white"
            style={{ background: 'linear-gradient(135deg, #1B4332, #2D6A4F)' }}>
            <BookOpen className="w-3.5 h-3.5" /> Katalog
          </a>

          <a href={rawUrl} target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold"
            style={{ background: 'linear-gradient(135deg, #E8BE5A, #D4A017)', color: '#1B4332' }}>
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Unduh</span>
          </a>
        </div>
      </div>

      {/* ── Viewer ── */}
      <div className="flex-1 overflow-auto">

        {/* Loading */}
        {status === 'loading' && (
          <div className="flex flex-col items-center justify-center h-full gap-5">
            <div className="relative w-16 h-16">
              <div className="absolute inset-0 rounded-full border-4 border-gray-600" />
              <div className="absolute inset-0 rounded-full border-4 border-t-yellow-400 animate-spin" />
            </div>
            <div className="text-center">
              <p className="text-white text-sm font-medium">
                {!ready ? 'Memuat PDF.js...' : info || 'Membuka PDF...'}
              </p>
              <p className="text-gray-400 text-xs mt-1">Harap tunggu</p>
            </div>
          </div>
        )}

        {/* Error */}
        {status === 'error' && (
          <div className="flex flex-col items-center justify-center h-full gap-5 px-6 text-center">
            <div className="w-20 h-20 rounded-3xl flex items-center justify-center"
              style={{ background: 'rgba(251,191,36,0.15)', border: '2px solid rgba(251,191,36,0.3)' }}>
              <span className="text-4xl">📄</span>
            </div>
            <div>
              <h3 className="font-display font-bold text-xl text-white mb-2">
                PDF Tidak Dapat Dibuka Online
              </h3>
              <p className="text-gray-400 text-sm max-w-sm leading-relaxed">{errorMsg}</p>
              <p className="text-gray-500 text-xs mt-3 max-w-xs">
                💡 Tip: Buku berformat <strong className="text-yellow-400">EPUB</strong> dapat
                dibaca langsung online tanpa masalah ini.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <a href={rawUrl} target="_blank" rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 px-6 py-3 rounded-2xl text-sm font-bold text-forest-900"
                style={{ background: 'linear-gradient(135deg, #E8BE5A, #D4A017)' }}>
                <Download className="w-4 h-4" /> Unduh PDF
              </a>
              <button onClick={loadPDF}
                className="flex items-center justify-center gap-2 px-6 py-3 rounded-2xl text-sm font-bold text-white"
                style={{ background: 'linear-gradient(135deg, #1B4332, #2D6A4F)' }}>
                <RefreshCw className="w-4 h-4" /> Coba Lagi
              </button>
              <button onClick={() => router.back()}
                className="flex items-center justify-center gap-2 px-6 py-3 rounded-2xl text-sm font-semibold text-gray-300 bg-gray-700 hover:bg-gray-600">
                ← Kembali
              </button>
            </div>
          </div>
        )}

        {/* Canvas */}
        <div
          className="flex justify-center py-6 px-4 min-h-full"
          style={{ display: status === 'done' ? 'flex' : 'none' }}
        >
          <canvas
            ref={canvasRef}
            className="shadow-2xl max-w-full h-auto"
            style={{ background: 'white', borderRadius: 2 }}
          />
        </div>
      </div>

      {/* ── Bottom nav ── */}
      {status === 'done' && totalPages > 1 && (
        <div className="flex items-center justify-between px-4 py-2 flex-shrink-0 border-t"
          style={{ background: '#2a2a2a', borderColor: '#444' }}>
          <button onClick={() => goToPage(page - 1)} disabled={page <= 1}
            className="flex items-center gap-1 px-3 py-2 rounded-xl text-sm font-medium text-white disabled:opacity-30 hover:bg-white/10 transition-all">
            <ChevronLeft className="w-4 h-4" /> Prev
          </button>

          <div className="flex items-center gap-2 text-sm text-gray-300">
            <input
              type="number" value={page} min={1} max={totalPages}
              onChange={(e) => { const v = parseInt(e.target.value); if (v >= 1 && v <= totalPages) goToPage(v) }}
              className="w-12 text-center font-bold bg-gray-700 text-white rounded-lg py-1 outline-none border border-gray-600 focus:border-yellow-400"
            />
            <span className="opacity-50">/ {totalPages}</span>
          </div>

          <button onClick={() => goToPage(page + 1)} disabled={page >= totalPages}
            className="flex items-center gap-1 px-3 py-2 rounded-xl text-sm font-medium text-white disabled:opacity-30 hover:bg-white/10 transition-all">
            Next <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  )
}

export default function BacaPDFPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#323639' }}>
        <Loader2 className="w-8 h-8 animate-spin text-yellow-400" />
      </div>
    }>
      <BacaPDFContent />
    </Suspense>
  )
}
