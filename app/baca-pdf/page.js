'use client'
import { useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { ArrowLeft, Home, Download, ExternalLink, Loader2, BookOpen } from 'lucide-react'

function BacaPDFContent() {
  const searchParams = useSearchParams()
  const router       = useRouter()
  const [loaded, setLoaded] = useState(false)
  const [error, setError]   = useState(false)

  const rawUrl  = searchParams.get('url')   || ''
  const title   = searchParams.get('title') || 'Dokumen'
  const author  = searchParams.get('author')|| ''

  // For PDF: use Google Docs viewer as fallback for cross-origin PDFs
  const viewerUrl = rawUrl
    ? `https://docs.google.com/viewer?url=${encodeURIComponent(rawUrl)}&embedded=true`
    : ''

  if (!rawUrl) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#F9F3E3' }}>
        <div className="text-center px-6">
          <div className="text-5xl mb-4">📄</div>
          <h2 className="font-display font-bold text-2xl text-forest-800 mb-2">Dokumen tidak ditemukan</h2>
          <button onClick={() => router.push('/katalog')}
            className="mt-4 px-5 py-2.5 bg-forest-700 text-white rounded-xl text-sm font-medium">
            Ke Katalog
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Top bar */}
      <div className="flex items-center justify-between px-3 md:px-5 py-3 bg-white border-b border-gray-200 flex-shrink-0 gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <button onClick={() => router.back()}
            className="w-9 h-9 rounded-xl flex items-center justify-center hover:bg-forest-50 text-forest-700 flex-shrink-0">
            <ArrowLeft className="w-4 h-4" />
          </button>
          <button onClick={() => router.push('/')}
            className="w-9 h-9 rounded-xl flex items-center justify-center hover:bg-forest-50 text-forest-700 flex-shrink-0">
            <Home className="w-4 h-4" />
          </button>
          <div className="min-w-0 hidden sm:block">
            <p className="font-display font-bold text-sm text-forest-800 truncate">{title}</p>
            {author && <p className="text-xs text-forest-500 truncate">{author}</p>}
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <a href="/katalog"
            className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-white"
            style={{ background: 'linear-gradient(135deg, #1B4332, #2D6A4F)' }}>
            <BookOpen className="w-3.5 h-3.5" /> Katalog
          </a>
          <a href={rawUrl} target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-white"
            style={{ background: 'linear-gradient(135deg, #D4A017, #E8BE5A)', color: '#1B4332' }}>
            <Download className="w-3.5 h-3.5" /> Unduh PDF
          </a>
        </div>
      </div>

      {/* PDF Viewer */}
      <div className="flex-1 relative">
        {!loaded && !error && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-gray-100 z-10">
            <div className="relative">
              <div className="w-16 h-16 rounded-full border-4 border-gray-200" />
              <div className="absolute inset-0 border-4 border-t-forest-700 rounded-full animate-spin" />
            </div>
            <p className="text-gray-500 text-sm">Memuat PDF via Google Docs Viewer...</p>
            <p className="text-gray-400 text-xs">Proses ini mungkin membutuhkan beberapa detik</p>
          </div>
        )}

        {error && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-gray-50 z-10 px-6 text-center">
            <div className="text-5xl">😔</div>
            <h3 className="font-display font-bold text-xl text-forest-800">Gagal Memuat PDF</h3>
            <p className="text-gray-500 text-sm max-w-sm">
              Browser tidak dapat menampilkan PDF ini secara online. Silakan unduh file-nya.
            </p>
            <a href={rawUrl} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-bold text-forest-900"
              style={{ background: 'linear-gradient(135deg, #E8BE5A, #D4A017)' }}>
              <Download className="w-4 h-4" /> Unduh PDF
            </a>
          </div>
        )}

        <iframe
          src={viewerUrl}
          className="w-full h-full border-0"
          onLoad={() => setLoaded(true)}
          onError={() => setError(true)}
          title={title}
          allow="fullscreen"
        />
      </div>
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
