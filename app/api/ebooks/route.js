// app/api/ebooks/route.js
// Fetches directory listing from ebook-mecca.com and returns structured book data

export const dynamic = 'force-dynamic'
export const revalidate = 3600 // Cache 1 hour

const BASE_URL = 'https://ebook-mecca.com/ebooks'

// Map category folder names to display names & colors
const CATEGORY_MAP = {
  'Adventure':          { label: 'Petualangan',       emoji: '🗺️',  color: '#FB8500' },
  'Fantasy':            { label: 'Fantasi',            emoji: '🧙',  color: '#7B2D8B' },
  'Romance':            { label: 'Roman',              emoji: '💕',  color: '#E63946' },
  'Science':            { label: 'Sains',              emoji: '🔬',  color: '#3A86FF' },
  'History':            { label: 'Sejarah',            emoji: '🏛️',  color: '#9B2226' },
  'Historic Novels':    { label: 'Novel Sejarah',      emoji: '📜',  color: '#8C6514' },
  'Cultural':           { label: 'Budaya',             emoji: '🎭',  color: '#40916C' },
  'Sci-Fi-Paranormal':  { label: 'Sci-Fi',             emoji: '🚀',  color: '#06AED5' },
  'Thriller-Horror':    { label: 'Thriller & Horor',   emoji: '🔪',  color: '#4A4E69' },
  'Crime-Mystery':      { label: 'Misteri & Kriminal', emoji: '🕵️',  color: '#2D3047' },
  'Drama':              { label: 'Drama',              emoji: '🎬',  color: '#B5179E' },
  'General Fiction':    { label: 'Fiksi Umum',         emoji: '📖',  color: '#2D6A4F' },
  'Psychology':         { label: 'Psikologi',          emoji: '🧠',  color: '#3A0CA3' },
  'Psycology':          { label: 'Psikologi',          emoji: '🧠',  color: '#3A0CA3' },
  'Self Improvement':   { label: 'Pengembangan Diri',  emoji: '🌱',  color: '#52B788' },
  'Business MGT':       { label: 'Bisnis & Manajemen', emoji: '💼',  color: '#D4A017' },
  'Economics':          { label: 'Ekonomi',            emoji: '📈',  color: '#1B4332' },
  'Mathematics':        { label: 'Matematika',         emoji: '🔢',  color: '#4361EE' },
  'Computer Science':   { label: 'Ilmu Komputer',      emoji: '💻',  color: '#06D6A0' },
  'Medical':            { label: 'Medis & Kesehatan',  emoji: '🏥',  color: '#EF233C' },
  'Mental Health':      { label: 'Kesehatan Mental',   emoji: '🌿',  color: '#80B918' },
  'Religion':           { label: 'Agama & Spiritual',  emoji: '🕌',  color: '#E9C46A' },
  'Poetry':             { label: 'Puisi',              emoji: '✍️',  color: '#F4A261' },
  'Biography':          { label: 'Biografi',           emoji: '👤',  color: '#457B9D' },
  'Autobiography':      { label: 'Autobiografi',       emoji: '📝',  color: '#2A9D8F' },
  'Short Stories':      { label: 'Cerita Pendek',      emoji: '📋',  color: '#E76F51' },
  'Government':         { label: 'Pemerintahan',       emoji: '🏛️',  color: '#264653' },
  'Law':                { label: 'Hukum',              emoji: '⚖️',  color: '#6D6875' },
  'Sociology':          { label: 'Sosiologi',          emoji: '👥',  color: '#B5838D' },
  'Anthropology':       { label: 'Antropologi',        emoji: '🌏',  color: '#6B4226' },
  'Geography':          { label: 'Geografi',           emoji: '🗾',  color: '#2D6A4F' },
  'Environment':        { label: 'Lingkungan',         emoji: '🌳',  color: '#40916C' },
  'Eat-Drink-Cook':     { label: 'Kuliner & Masak',    emoji: '🍳',  color: '#E9C46A' },
  'Sports':             { label: 'Olahraga',           emoji: '⚽',  color: '#4361EE' },
  'Humor':              { label: 'Humor',              emoji: '😂',  color: '#FFB703' },
  'Gothic-Suspense':    { label: 'Gotik & Suspens',    emoji: '🦇',  color: '#370617' },
  'Military-War':       { label: 'Militer & Perang',   emoji: '⚔️',  color: '#6C757D' },
  'Animals':            { label: 'Hewan & Alam',       emoji: '🦁',  color: '#52B788' },
  'Career Guides':      { label: 'Panduan Karier',     emoji: '🎯',  color: '#F77F00' },
  'Engineering':        { label: 'Teknik',             emoji: '⚙️',  color: '#495057' },
  'Academic Articles':  { label: 'Artikel Akademik',   emoji: '🎓',  color: '#003049' },
  'Textbooks':          { label: 'Buku Pelajaran',     emoji: '📚',  color: '#D62828' },
  '3-5 years':          { label: 'Anak 3–5 Tahun',     emoji: '🧒',  color: '#F4A261' },
  '6-9 years':          { label: 'Anak 6–9 Tahun',     emoji: '👦',  color: '#06D6A0' },
  '10-12 years':        { label: 'Anak 10–12 Tahun',   emoji: '🧑',  color: '#4CC9F0' },
  '12-Over':            { label: 'Remaja 12+',         emoji: '👩',  color: '#7209B7' },
  'Pre-Teens':          { label: 'Pra-Remaja',         emoji: '🧒',  color: '#4361EE' },
  'Boys':               { label: 'Anak Laki-laki',     emoji: '👦',  color: '#3A86FF' },
  'Girls':              { label: 'Anak Perempuan',     emoji: '👧',  color: '#FF69B4' },
  'Spiritual':          { label: 'Spiritual',          emoji: '🌟',  color: '#9D4EDD' },
  'Geology':            { label: 'Geologi',            emoji: '🪨',  color: '#795548' },
  'Home Business':      { label: 'Bisnis Rumahan',     emoji: '🏠',  color: '#FF9E00' },
  'Online Business':    { label: 'Bisnis Online',      emoji: '🌐',  color: '#2196F3' },
  'Holidays':           { label: 'Liburan',            emoji: '🏖️',  color: '#FFB300' },
  'Kids History':       { label: 'Sejarah Anak',       emoji: '🏰',  color: '#8D6E63' },
  'W':                  { label: 'Lainnya',            emoji: '📘',  color: '#607D8B' },
}

/**
 * Parse a directory HTML listing and return file/folder entries
 */
function parseDirectoryListing(html) {
  const books = []
  
  // Match table rows with file links
  const rowRegex = /href="([^"]+\.(?:epub|mobi|EPUB|MOBI|azw3|AZW3|pdf|PDF))"/gi
  let match
  while ((match = rowRegex.exec(html)) !== null) {
    const href = match[1]
    // Decode URL encoding to get filename
    const filename = decodeURIComponent(href.split('/').pop())
    // Strip extension
    const nameNoExt = filename.replace(/\.(epub|mobi|azw3|pdf)$/i, '')
    books.push({
      filename,
      title: cleanTitle(nameNoExt),
      rawTitle: nameNoExt,
      downloadUrl: href.startsWith('http') ? href : `${BASE_URL}/${encodeURIComponent(href.replace(/^\/ebooks\//, ''))}`,
      format: filename.split('.').pop().toLowerCase(),
    })
  }
  return books
}

/**
 * Clean up book title from filename
 */
function cleanTitle(raw) {
  return raw
    .replace(/[-_]/g, ' ')
    .replace(/\s+by\s+.*/i, '')       // remove "by Author"
    .replace(/\s+\(.*\)/, '')          // remove parentheses
    .replace(/\s+\[.*\]/, '')          // remove brackets
    .replace(/\s{2,}/g, ' ')
    .trim()
}

/**
 * Extract author from filename if present
 */
function extractAuthor(raw) {
  const byMatch = raw.match(/by\s+(.+)$/i)
  if (byMatch) return byMatch[1].replace(/[-_]/g, ' ').trim()
  // Try "Author - Title" pattern
  const dashMatch = raw.match(/^(.+?)\s+-\s+/)
  if (dashMatch) return dashMatch[1].replace(/[-_]/g, ' ').trim()
  return null
}

/**
 * GET /api/ebooks?category=Adventure&limit=20&page=1
 */
export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const category = searchParams.get('category') || ''
  const limit = parseInt(searchParams.get('limit') || '20')
  const page = parseInt(searchParams.get('page') || '1')
  const listOnly = searchParams.get('list') === 'true'

  try {
    if (listOnly) {
      // Return list of all categories
      const res = await fetch(BASE_URL + '/', { 
        next: { revalidate: 3600 },
        headers: { 'User-Agent': 'Mozilla/5.0 (compatible; PINTAR-JOHOR/1.0)' }
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const html = await res.text()
      
      // Parse folder links
      const folderRegex = /href="\/ebooks\/([^/"]+)\/"[^>]*>.*?<\/a>/gi
      const categories = []
      let m
      while ((m = folderRegex.exec(html)) !== null) {
        const raw = decodeURIComponent(m[1])
        const meta = CATEGORY_MAP[raw] || { label: raw, emoji: '📁', color: '#607D8B' }
        categories.push({ id: raw, ...meta })
      }

      return Response.json({ categories })
    }

    // Fetch category directory
    const dir = category 
      ? `${BASE_URL}/${encodeURIComponent(category)}/`
      : `${BASE_URL}/`
    
    const res = await fetch(dir, {
      next: { revalidate: 3600 },
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; PINTAR-JOHOR/1.0)' }
    })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const html = await res.text()
    const allBooks = parseDirectoryListing(html)

    // Deduplicate: keep epub > mobi > azw3 per title
    const seen = new Map()
    for (const b of allBooks) {
      const key = b.rawTitle.toLowerCase().slice(0, 40)
      if (!seen.has(key)) {
        seen.set(key, b)
      } else {
        const existing = seen.get(key)
        const prefer = ['epub', 'azw3', 'mobi', 'pdf']
        if (prefer.indexOf(b.format) < prefer.indexOf(existing.format)) {
          seen.set(key, b)
        }
      }
    }

    const unique = Array.from(seen.values())
    const total = unique.length
    const offset = (page - 1) * limit
    const books = unique.slice(offset, offset + limit)

    // Enrich with author & category meta
    const catMeta = CATEGORY_MAP[category] || { label: category || 'Semua', emoji: '📚', color: '#1B4332' }
    const enriched = books.map((b, i) => ({
      id: `${category}-${offset + i}`,
      title: b.title,
      author: extractAuthor(b.rawTitle) || 'Unknown Author',
      format: b.format.toUpperCase(),
      downloadUrl: `${BASE_URL}/${category ? encodeURIComponent(category) + '/' : ''}${encodeURIComponent(b.filename)}`,
      category: catMeta.label,
      categoryId: category,
      categoryEmoji: catMeta.emoji,
      categoryColor: catMeta.color,
      // Cover from Open Library by title (client will render)
      coverQuery: encodeURIComponent(b.title),
    }))

    return Response.json({
      books: enriched,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      category: catMeta,
    })
  } catch (err) {
    console.error('[ebooks API]', err)
    return Response.json({ error: err.message, books: [], total: 0, totalPages: 0 }, { status: 500 })
  }
}
