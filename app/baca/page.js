'use client'
import { useState, useEffect, useRef, useCallback, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import {
  ArrowLeft, Home, Download, BookOpen, Loader2,
  ChevronLeft, ChevronRight, ZoomIn, ZoomOut, RefreshCw
} from 'lucide-react'

// PDF.js loaded from CDN — renders PDF to <canvas> directly in page
// No iframe, no Google Docs viewer → no "no preview" / 503 issues
const PDFJS_CDN = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js'
const PDFJS_WORKER = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js'

function BacaPDFContent() {
  const searchParams = useSearchParams()
  const router       = useRouter()

  const rawUrl = searchParams.get('url')   || ''
  const title  = searchParams.get('title') || 'Dokumen'
  const author = searchParams.get('author')|| ''

  const canvasRef    = useRef(null)
  const pdfRef       = useRef(null)
  const renderingRef = useRef(false)

  const [status,      setStatus]      = useState('idle')   // idle|checking|rendering|done|error
  const [errorMsg,    setErrorMsg]    = useState('')
  const [page,        setPage]        = useState(1)
  const [totalPages,  setTotalPages]  = useState(0)
  const [scale,       setScale]       = useState(1.2)
  const [pdfjsReady,  setPdfjsReady]  = useState(false)
  const [sourceLabel, setSourceLabel] = useState('')

  // ── Load PDF.js from CDN once ──────────────────────────────────────────
  useEffect(() => {
    if (window.pdfjsLib) { setPdfjsReady(true); return }
    const script = document.createElement('script')
    script.src = PDFJS_CDN
    script.onload = () => {
      window.pdfjsLib.GlobalWorkerOptions.workerSrc = PDFJS_WORKER
      setPdfjsReady(true)
    }
    script.onerror = () => setErrorMsg('Gagal memuat PDF.js dari CDN')
    document.head.appendChild(script)
  }, [])

  // ── Determine best URL to load ─────────────────────────────────────────
  // Strategy: try proxy first (handles CORS), fallback to direct URL
  const resolveUrl = useCallback(async (original) => {
    const proxyUrl = `/api/read?url=${encodeURIComponent(original)}`

    try {
      setSourceLabel('Memeriksa sumber...')
      const res = await fetch(proxyUrl, { method: 'HEAD' })
      if (res.ok) {
        setSourceLabel('Membaca via proxy')
        return proxyUrl
      }
      // Proxy returned error (503, 404, etc.) — try direct URL
      setSourceLabel('Membaca langsung...')
      const directRes = await fetch(original, { method: 'HEAD', mode: 'no-cors' })
      // no-cors always "succeeds" — just use direct URL optimistically
      setSourceLabel('Membaca dari sumber')
      return original
    } catch {
      // Network error on proxy — try direct
      setSourceLabel('Membaca dari sumber')
      return original
    }
  }, [])

  // ── Render a single page to canvas ────────────────────────────────────
  const renderPage = useCallback(async (pdf, pageNum, sc) => {
    if (!canvasRef.current || renderingRef.current) return
    renderingRef.current = true
    try {
      const pdfPage   = await pdf.getPage(pageNum)
      const viewport  = pdfPage.getViewport({ scale: sc })
      const canvas    = canvasRef.current
      const ctx       = canvas.getContext('2d')

      canvas.width  = viewport.width
      canvas.height = viewport.height

      await pdfPage.render({ canvasContext: ctx, viewport }).promise
    } finally {
      renderingRef.current = false
    }
  }, [])

  // ── Main load function ─────────────────────────────────────────────────
  const loadPDF = useCallback(async () => {
    if (!rawUrl || !pdfjsReady || !window.pdfjsLib) return

    setStatus('checking')
    setErrorMsg('')
    setPage(1)
    setTotalPages(0)
    pdfRef.current = null

    try {
      const url = await resolveUrl(rawUrl)

      setStatus('rendering')
      const loadingTask = window.pdfjsLib.getDocument({
        url,
        withCredentials: false,
        cMapUrl: 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/cmaps/',
        cMapPacked: true,
      })

      const pdf = await loadingTask.promise
      pdfRef.current  = pdf
      setTotalPages(pdf.numPages)

      await renderPage(pdf, 1, scale)
      setStatus('done')
    } catch (e) {
      console.error('[PDF reader]', e)
      // Try with direct URL as last resort
      if (!e.message?.includes('direct')) {
        try {
          setSourceLabel('Mencoba URL langsung...')
          const pdf = await window.pdfjsLib.getDocument({
            url: rawUrl,
            withCredentials: false,
          }).promise
          pdfRef.current = pdf
          setTotalPages(pdf.numPages)
          await renderPage(pdf, 1, scale)
          setStatus('done')
          setSourceLabel('Berhasil dari sumber langsung')
          return
        } catch (e2) {
          console.error('[PDF reader direct]', e2)
        }
      }
      setStatus('error')
      setErrorMsg(
        e.name === 'InvalidPDFException'
          ? 'File bukan PDF yang valid.'
          : e.message?.includes('fetch') || e.message?.includes('network')
          ? 'Tidak dapat mengambil file. Server mungkin membatasi akses.'
          : `Gagal memuat PDF: ${e.message || 'Error tidak diketahui'}`
      )
    }
  }, [rawUrl, pdfjsReady, resolveUrl, renderPage, scale])

  useEffect(() => {
    loadPDF()
  }, [loadPDF])

  // ── Page navigation ────────────────────────────────────────────────────
  const goToPage = useCallback(async (newPage) => {
    if (!pdfRef.current || newPage < 1 || newPage > totalPages) return
    setPage(newPage)
    await renderPage(pdfRef.current, newPage, scale)
  }, [totalPages, scale, renderPage])

  // ── Zoom ───────────────────────────────────────────────────────────────
  const changeZoom = useCallback(async (newScale) => {
    if (!pdfRef.current) return
    setScale(newScale)
    await renderPage(pdfRef.current, page, newScale)
  }, [page, renderPage])

  // ── Keyboard navigation ────────────────────────────────────────────────
  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown')  goToPage(page + 1)
      if (e.key === 'ArrowLeft'  || e.key === 'ArrowUp')    goToPage(page - 1)
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [goToPage, page])

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

  const isLoading = status === 'idle' || status === 'checking' || status === 'rendering'

  return (
    <div className="flex flex-col overflow-hidden" style={{ height: '100dvh', background: '#404040' }}>

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
          {/* Zoom controls */}
          {status === 'done' && (
            <div className="hidden sm:flex items-center gap-1 bg-gray-100 rounded-xl p-1">
              <button onClick={() => changeZoom(Math.max(0.5, +(scale - 0.2).toFixed(1)))}
                className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-white text-gray-600 transition-all">
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <span className="text-xs font-bold text-gray-600 w-10 text-center">{Math.round(scale * 100)}%</span>
              <button onClick={() => changeZoom(Math.min(3, +(scale + 0.2).toFixed(1)))}
                className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-white text-gray-600 transition-all">
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          <button onClick={loadPDF}
            className="w-9 h-9 rounded-xl flex items-center justify-center hover:bg-gray-100 text-gray-600"
            title="Muat ulang">
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
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
            <span className="hidden sm:inline">Unduh PDF</span>
          </a>
        </div>
      </div>

      {/* ── Main viewer ── */}
      <div className="flex-1 overflow-auto relative">

        {/* Loading state */}
        {isLoading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 z-10"
            style={{ background: '#404040' }}>
            <div className="relative w-16 h-16">
              <div className="absolute inset-0 rounded-full border-4 border-gray-600" />
              <div className="absolute inset-0 rounded-full border-4 border-t-gold-400 animate-spin" />
            </div>
            <div className="text-center">
              <p className="text-white text-sm font-medium">
                {!pdfjsReady ? 'Memuat PDF.js...' : sourceLabel || 'Memuat PDF...'}
              </p>
              <p className="text-gray-400 text-xs mt-1">Harap tunggu sebentar</p>
            </div>
          </div>
        )}

        {/* Error state */}
        {status === 'error' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-5 px-6 text-center z-10"
            style={{ background: '#2a2a2a' }}>
            <div className="w-20 h-20 rounded-3xl bg-amber-900/30 border-2 border-amber-700 flex items-center justify-center">
              <span className="text-4xl">📄</span>
            </div>
            <div>
              <h3 className="font-display font-bold text-xl text-white mb-2">
                Tidak Dapat Membuka PDF
              </h3>
              <p className="text-gray-400 text-sm max-w-sm leading-relaxed">{errorMsg}</p>
              <p className="text-gray-500 text-xs mt-2 max-w-xs">
                Server sumber membatasi akses langsung. Silakan unduh file untuk dibaca secara offline.
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
            <p className="text-xs text-gray-500">
              💡 Buku EPUB dapat dibaca langsung online tanpa masalah ini.
            </p>
          </div>
        )}

        {/* Canvas PDF renderer */}
        <div className="flex justify-center py-4 px-2 min-h-full">
          <canvas
            ref={canvasRef}
            className="shadow-2xl max-w-full"
            style={{
              display: status === 'done' ? 'block' : 'none',
              background: 'white',
              borderRadius: 4,
            }}
          />
        </div>
      </div>

      {/* ── Bottom navigation bar ── */}
      {status === 'done' && totalPages > 0 && (
        <div className="flex items-center justify-between px-4 py-2.5 flex-shrink-0 bg-gray-800 border-t border-gray-700">
          <button
            onClick={() => goToPage(page - 1)}
            disabled={page <= 1}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium text-white disabled:opacity-30 transition-all hover:bg-gray-700"
          >
            <ChevronLeft className="w-4 h-4" /> Sebelumnya
          </button>

          <div className="flex items-center gap-2">
            <input
              type="number"
              value={page}
              min={1}
              max={totalPages}
              onChange={(e) => {
                const v = parseInt(e.target.value)
                if (v >= 1 && v <= totalPages) goToPage(v)
              }}
              className="w-12 text-center text-sm font-bold bg-gray-700 text-white rounded-lg py-1.5 outline-none border border-gray-600 focus:border-gold-400"
            />
            <span className="text-gray-400 text-sm">/ {totalPages}</span>
          </div>

          <button
            onClick={() => goToPage(page + 1)}
            disabled={page >= totalPages}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium text-white disabled:opacity-30 transition-all hover:bg-gray-700"
          >
            Berikutnya <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  )
}

export default function BacaPDFPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#404040' }}>
        <Loader2 className="w-8 h-8 animate-spin text-gold-400" />
      </div>
    }>
      <BacaPDFContent />
    </Suspense>
  )
}
