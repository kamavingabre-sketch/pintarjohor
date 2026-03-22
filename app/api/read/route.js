// app/api/read/route.js
// Proxies EPUB/PDF files to bypass browser CORS restrictions

export const dynamic = 'force-dynamic'

// Semua domain sumber buku yang diizinkan
const ALLOWED_DOMAINS = [
  'ebook-mecca.com',
  'archive.org',
  'ia800.us.archive.org',
  'ia801.us.archive.org',
  'ia802.us.archive.org',
  'ia803.us.archive.org',
  'ia804.us.archive.org',
  'ia900.us.archive.org',
  'ia903.us.archive.org',
  'openlibrary.org',
  'gutenberg.org',
  'www.gutenberg.org',
  'aleph.gutenberg.org',
  'gutenberg.pglaf.org',
  'buku.kemdikbud.go.id',
  'covers.openlibrary.org',
  'mozilla.github.io',
  'standardebooks.org',
  'www.standardebooks.org',
  'manybooks.net',
  'www.manybooks.net',
]

function isDomainAllowed(hostname) {
  return ALLOWED_DOMAINS.some(
    (d) => hostname === d || hostname.endsWith('.' + d)
  )
}

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const fileUrl = searchParams.get('url')

  if (!fileUrl) {
    return new Response('Missing url parameter', { status: 400 })
  }

  let parsed
  try {
    parsed = new URL(fileUrl)
  } catch {
    return new Response('Invalid URL', { status: 400 })
  }

  if (!isDomainAllowed(parsed.hostname)) {
    console.warn('[read proxy] Domain not allowed:', parsed.hostname)
    return new Response(
      JSON.stringify({ error: 'Domain not allowed', hostname: parsed.hostname }),
      { status: 403, headers: { 'Content-Type': 'application/json' } }
    )
  }

  try {
    const upstream = await fetch(fileUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'application/pdf,application/epub+zip,application/octet-stream,*/*',
        'Accept-Language': 'id-ID,id;q=0.9,en;q=0.8',
        'Referer': 'https://pintarjohor.vercel.app/',
      },
      redirect: 'follow',
    })

    if (!upstream.ok) {
      return new Response(
        `Upstream error: ${upstream.status} ${upstream.statusText}`,
        { status: upstream.status }
      )
    }

    const contentType = upstream.headers.get('content-type') || 'application/octet-stream'
    const buffer = await upstream.arrayBuffer()

    // Detect PDF by magic bytes if content-type is wrong
    const bytes = new Uint8Array(buffer.slice(0, 5))
    const isPDF = bytes[0] === 0x25 && bytes[1] === 0x50 && bytes[2] === 0x44 && bytes[3] === 0x46
    const isEPUB = bytes[0] === 0x50 && bytes[1] === 0x4B // ZIP magic = PK

    const finalContentType = isPDF
      ? 'application/pdf'
      : isEPUB
      ? 'application/epub+zip'
      : contentType

    return new Response(buffer, {
      status: 200,
      headers: {
        'Content-Type': finalContentType,
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Cache-Control': 'public, max-age=3600',
        'Content-Disposition': 'inline',
        'X-Content-Type-Options': 'nosniff',
      },
    })
  } catch (err) {
    console.error('[read proxy]', err)
    return new Response(
      JSON.stringify({ error: 'Failed to fetch file', detail: err.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
}

// Handle preflight
export async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}

