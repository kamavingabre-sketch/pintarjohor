'use client'
import { useState, useEffect, useRef, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { ArrowLeft, Home, Download, BookOpen, Loader2, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Maximize2 } from 'lucide-react'

function BacaPDFContent() {
  const searchParams = useSearchParams()
  const router       = useRouter()

  const rawUrl = searchParams.get('url')   || ''
  const title  = searchParams.get('title') || 'Dokumen'
  const author = searchParams.get('author')|| ''

  const [method,    setMethod]    = useState('loading') // 'loading' | 'proxy' | 'pdfjs' | 'embed' | 'failed'
  const [proxyUrl,  setProxyUrl]  = useState('')
  const [pdfLoaded, setPdfLoaded] = useState(false)
  const [zoom,      setZoom]      = useState(1.0)
  const containerRef = useRef(null)

  // ── Build proxy URL (our own /api/read endpoint) ─────────────────────────
  useEffect(() => {
    if (!rawUrl) return
    const px = `/api/read?url=${encodeURIComponent(rawUrl)}`
    setProxyUrl(px)
    setMethod('proxy')
    setPdfLoaded(false)
  }, [rawUrl])

  const handleProxyLoad = () => setPdfLoaded(true)
  const handleProxyError = () => {
    // Proxy failed → try PDF.js CDN viewer
    setMethod('pdfjs')
    setPdfLoaded(false)
  }

  const handlePdfjsLoad = () => setPdfLoaded(true)
  const handlePdfjsError = () => {
    // PDF.js also failed → embed
    setMethod('embed')
    setPdfLoaded(false)
  }

  const handleEmbedLoad = () => setPdfLoaded(true)
  const handleEmbedError = () => setMethod('failed')

  // Build PDF.js viewer URL (Mozilla's public CDN)
  const pdfjsUrl = rawUrl
    ? `https://mozilla.github.io/pdf.js/web/viewer.html?file=${encodeURIComponent(rawUrl)}`
    : ''

  if (!rawUrl) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#F9F3E3' }}>
        <div className="text-center px-6">
          <div className="text-5xl mb-4">📄</div>
          <h2 className="font-display font-bold text-2xl text-forest-800 mb-2">Dokumen tidak ditemukan</h2>
          <p className="text-forest-500 text-sm mb-5">URL buku tidak valid.</p>
          <a href="/katalog" className="px-6 py-3 bg-forest-700 text-white rounded-xl text-sm font-bold">
            Ke Katalog
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col overflow-hidden bg-gray-200" style={{ height: '100dvh' }}>

      {/* ── Top bar ── */}
      <div className="flex items-center justify-between px-3 md:px-5 py-2.5 bg-white border-b border-gray-200 flex-shrink-0 gap-2 z-10">
        <div className="flex items-center gap-2 min-w-0">
          <button onClick={() => router.back()}
            className="w-9 h-9 rounded-xl flex items-center justify-center hover:bg-gray-100 text-gray-700 flex-shrink-0">
            <ArrowLeft className="w-4 h-4" />
          </button>
          <button onClick={() => router.push('/')}
            className="w-9 h-9 rounded-xl flex items-center justify-center hover:bg-gray-100 text-gray-700 flex-shrink-0">
            <Home className="w-4 h-4" />
          </button>
          <div className="min-w-0 hidden sm:block">
            <p className="font-display font-bold text-sm text-forest-800 truncate">{title}</p>
            {author && <p className="text-xs text-forest-500 truncate">{author}</p>}
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          {/* Zoom controls — only show for proxy/embed methods */}
          {(method === 'proxy' || method === 'embed') && pdfLoaded && (
            <div className="hidden sm:flex items-center gap-1 bg-gray-100 rounded-xl p-1">
              <button onClick={() => setZoom(z => Math.max(0.5, +(z - 0.1).toFixed(1)))}
                className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-white text-gray-600 text-sm font-bold transition-all">
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <span className="text-xs font-bold text-gray-600 w-10 text-center">{Math.round(zoom * 100)}%</span>
              <button onClick={() => setZoom(z => Math.min(2, +(z + 0.1).toFixed(1)))}
                className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-white text-gray-600 transition-all">
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          <a href="/katalog"
            className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-white"
            style={{ background: 'linear-gradient(135deg, #1B4332, #2D6A4F)' }}>
            <BookOpen className="w-3.5 h-3.5" /> Katalog
          </a>
          <a href={rawUrl} target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold font-bold"
            style={{ background: 'linear-gradient(135deg, #E8BE5A, #D4A017)', color: '#1B4332' }}>
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Unduh PDF</span>
            <span className="sm:hidden">Unduh</span>
          </a>
        </div>
      </div>

      {/* ── Viewer area ── */}
      <div className="flex-1 relative overflow-hidden" ref={containerRef}>

        {/* Loading overlay */}
        {!pdfLoaded && method !== 'failed' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-gray-100 z-20">
            <div className="relative w-14 h-14">
              <div className="absolute inset-0 rounded-full border-4 border-gray-200" />
              <div className="absolute inset-0 rounded-full border-4 border-t-forest-700 animate-spin" />
            </div>
            <div className="text-center">
              <p className="text-gray-600 text-sm font-medium">Memuat PDF...</p>
              <p className="text-gray-400 text-xs mt-1">
                {method === 'proxy'  && 'Mengambil file dari server'}
                {method === 'pdfjs'  && 'Mencoba PDF.js viewer'}
                {method === 'embed'  && 'Mencoba embed langsung'}
              </p>
            </div>
          </div>
        )}

        {/* Failed state */}
        {method === 'failed' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-5 bg-gray-50 px-6 text-center z-20">
            <div className="w-20 h-20 rounded-3xl bg-amber-50 border-2 border-amber-200 flex items-center justify-center">
              <span className="text-4xl">📄</span>
            </div>
            <div>
              <h3 className="font-display font-bold text-xl text-forest-800 mb-2">
                Tidak dapat pratinjau online
              </h3>
              <p className="text-gray-500 text-sm max-w-sm leading-relaxed">
                File PDF ini tidak dapat ditampilkan di browser karena pembatasan CORS dari server sumber.
                Silakan unduh file untuk membacanya di aplikasi PDF Anda.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <a href={rawUrl} target="_blank" rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 px-6 py-3 rounded-2xl text-sm font-bold text-forest-900"
                style={{ background: 'linear-gradient(135deg, #E8BE5A, #D4A017)' }}>
                <Download className="w-4 h-4" /> Unduh PDF
              </a>
              <button
                onClick={() => { setMethod('pdfjs'); setPdfLoaded(false) }}
                className="flex items-center justify-center gap-2 px-6 py-3 rounded-2xl text-sm font-bold text-white"
                style={{ background: 'linear-gradient(135deg, #1B4332, #2D6A4F)' }}>
                Coba PDF.js Viewer
              </button>
              <button
                onClick={() => router.back()}
                className="flex items-center justify-center gap-2 px-6 py-3 rounded-2xl text-sm font-semibold text-gray-600 bg-gray-200 hover:bg-gray-300">
                ← Kembali
              </button>
            </div>
            <p className="text-xs text-gray-400 max-w-xs">
              💡 Tip: Buku berformat EPUB dapat dibaca langsung online tanpa unduh.
            </p>
          </div>
        )}

        {/* ── Method 1: Proxy via /api/read → embed native ── */}
        {method === 'proxy' && (
          <iframe
            key="proxy"
            src={proxyUrl}
            className="w-full h-full border-0"
            style={{ transform: `scale(${zoom})`, transformOrigin: 'top center', height: `${100 / zoom}%` }}
            onLoad={handleProxyLoad}
            onError={handleProxyError}
            title={title}
            allow="fullscreen"
          />
        )}

        {/* ── Method 2: PDF.js CDN viewer ── */}
        {method === 'pdfjs' && (
          <iframe
            key="pdfjs"
            src={pdfjsUrl}
            className="w-full h-full border-0"
            onLoad={handlePdfjsLoad}
            onError={handlePdfjsError}
            title={title}
            allow="fullscreen"
          />
        )}

        {/* ── Method 3: Native embed ── */}
        {method === 'embed' && (
          <embed
            key="embed"
            src={rawUrl}
            type="application/pdf"
            className="w-full h-full"
            onLoad={handleEmbedLoad}
            onError={handleEmbedError}
          />
        )}
      </div>

      {/* ── Bottom hint bar ── */}
      {pdfLoaded && (
        <div className="flex items-center justify-between px-4 py-2 bg-white border-t border-gray-200 flex-shrink-0">
          <span className="text-xs text-gray-400 truncate max-w-xs">{title}</span>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400 hidden sm:block">Gunakan scroll untuk berpindah halaman</span>
            <a href={rawUrl} target="_blank" rel="noopener noreferrer"
              className="text-xs text-forest-600 hover:text-forest-800 font-medium flex items-center gap-1">
              <Download className="w-3 h-3" /> Unduh
            </a>
          </div>
        </div>
      )}
    </div>
  )
}

export default function BacaPDFPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#F9F3E3' }}>
        <Loader2 className="w-8 h-8 animate-spin text-forest-700" />
      </div>
    }>
      <BacaPDFContent />
    </Suspense>
  )
}
