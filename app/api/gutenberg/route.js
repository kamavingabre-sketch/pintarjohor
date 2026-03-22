// app/api/gutenberg/route.js
// Fetches free public domain books from Project Gutenberg via gutendex.com API

export const dynamic = 'force-dynamic'

const GUTENDEX = 'https://gutendex.com/books'

// Map topics to Gutenberg search terms
const TOPIC_MAP = {
  'Adventure':        'adventure',
  'Fantasy':          'fantasy',
  'Romance':          'romance',
  'Science':          'science',
  'History':          'history',
  'Mystery':          'mystery detective',
  'Drama':            'drama',
  'Poetry':           'poetry',
  'Philosophy':       'philosophy',
  'Psychology':       'psychology',
  'Children':         'children',
  'Religion':         'religion',
  'Politics':         'politics government',
  'Economics':        'economics',
  'Nature':           'nature animals',
  'Travel':           'travel',
  'Horror':           'horror',
  'Humor':            'humor comedy',
  'War':              'war military',
  'Fiction':          'fiction',
}

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const topic    = searchParams.get('topic') || ''
  const search   = searchParams.get('search') || ''
  const page     = parseInt(searchParams.get('page') || '1')
  const limit    = parseInt(searchParams.get('limit') || '20')

  try {
    const params = new URLSearchParams()

    if (search) {
      params.set('search', search)
    } else if (topic && TOPIC_MAP[topic]) {
      params.set('topic', TOPIC_MAP[topic])
    }

    // Languages: en + id where possible
    params.set('languages', 'en')
    params.set('page', page)

    const url = `${GUTENDEX}?${params}`
    const res = await fetch(url, {
      headers: { 'User-Agent': 'PINTAR-JOHOR/1.0' },
      next: { revalidate: 3600 },
    })

    if (!res.ok) throw new Error(`Gutendex error: ${res.status}`)
    const data = await res.json()

    const books = (data.results || []).map((book) => {
      // Find best format: prefer epub, then pdf, then txt
      const formats = book.formats || {}
      const epubUrl = formats['application/epub+zip'] || ''
      const pdfUrl  = Object.keys(formats).find(k => k.includes('pdf'))
        ? formats[Object.keys(formats).find(k => k.includes('pdf'))]
        : ''
      const coverUrl = formats['image/jpeg'] || ''
      const readUrl  = epubUrl || pdfUrl || ''
      const format   = epubUrl ? 'EPUB' : pdfUrl ? 'PDF' : 'TXT'

      const authors = book.authors?.map(a => a.name).join(', ') || 'Unknown'
      const subjects = book.subjects?.slice(0, 3).join(', ') || topic || 'General'

      return {
        id:            `gutenberg-${book.id}`,
        gutenbergId:   book.id,
        title:         book.title,
        author:        authors,
        format,
        downloadUrl:   readUrl,
        epubUrl,
        pdfUrl,
        coverUrl,
        category:      topic || 'Umum',
        categoryEmoji: '📚',
        categoryColor: '#1B4332',
        coverQuery:    encodeURIComponent(book.title),
        source:        'gutenberg',
        downloads:     book.download_count || 0,
        subjects:      book.subjects?.slice(0, 5) || [],
      }
    })

    // Filter out books with no readable format
    const readable = books.filter(b => b.downloadUrl)

    return Response.json({
      books:      readable.slice(0, limit),
      total:      data.count || readable.length,
      page,
      limit,
      totalPages: Math.ceil((data.count || readable.length) / limit),
      next:       data.next,
      source:     'gutenberg',
    })
  } catch (err) {
    console.error('[gutenberg API]', err)
    return Response.json({ error: err.message, books: [], total: 0, totalPages: 0 }, { status: 500 })
  }
}
