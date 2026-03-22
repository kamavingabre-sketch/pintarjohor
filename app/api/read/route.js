// app/api/read/route.js
// Proxies EPUB/MOBI files from ebook-mecca.com to bypass browser CORS restrictions

export const dynamic = 'force-dynamic'

const ALLOWED_HOST = 'ebook-mecca.com'

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const fileUrl = searchParams.get('url')

  if (!fileUrl) {
    return new Response('Missing url parameter', { status: 400 })
  }

  // Security: only allow ebook-mecca.com
  let parsed
  try {
    parsed = new URL(fileUrl)
  } catch {
    return new Response('Invalid URL', { status: 400 })
  }

  if (!parsed.hostname.endsWith(ALLOWED_HOST)) {
    return new Response('Domain not allowed', { status: 403 })
  }

  try {
    const upstream = await fetch(fileUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; PINTAR-JOHOR/1.0)',
        'Accept': '*/*',
      },
    })

    if (!upstream.ok) {
      return new Response(`Upstream error: ${upstream.status}`, { status: upstream.status })
    }

    const contentType = upstream.headers.get('content-type') || 'application/octet-stream'
    const buffer = await upstream.arrayBuffer()

    return new Response(buffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'public, max-age=3600',
        'Content-Disposition': 'inline',
      },
    })
  } catch (err) {
    console.error('[read proxy]', err)
    return new Response('Failed to fetch file', { status: 500 })
  }
}
