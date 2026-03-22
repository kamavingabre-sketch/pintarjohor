// app/api/buku-indonesia/route.js
// Sumber buku gratis Bahasa Indonesia:
// 1. Project Gutenberg (via gutendex.com) — bahasa Indonesia
// 2. Internet Archive — koleksi buku Indonesia
// 3. Koleksi kurasi lokal (BSE, dll)

export const dynamic   = 'force-dynamic'
export const revalidate = 3600

// ── Koleksi kurasi buku Indonesia (public domain & free) ──────────────────
// Archive.org identifier — dapat dibaca/diunduh gratis
const CURATED_BOOKS = [
  {
    id: 'indo-001',
    title: 'Siti Nurbaya: Kasih Tak Sampai',
    author: 'Marah Rusli',
    year: 1922,
    category: 'Novel Klasik',
    emoji: '💔',
    color: '#9B2226',
    desc: 'Novel klasik Indonesia tentang cinta yang terhalang adat dan kekuasaan.',
    archiveId: 'siti-nurbaya-marah-rusli',
    coverColor: 'linear-gradient(135deg, #9B2226, #C1121F)',
    format: 'PDF',
    downloadUrl: 'https://archive.org/download/siti-nurbaya-marah-rusli/siti-nurbaya.pdf',
    source: 'indonesia',
  },
  {
    id: 'indo-002',
    title: 'Azab dan Sengsara',
    author: 'Merari Siregar',
    year: 1920,
    category: 'Novel Klasik',
    emoji: '📜',
    color: '#6B4226',
    desc: 'Novel pertama berbahasa Indonesia yang mengisahkan nasib seorang perempuan Batak.',
    coverColor: 'linear-gradient(135deg, #6B4226, #8B5E3C)',
    format: 'EPUB',
    downloadUrl: 'https://www.gutenberg.org/ebooks/35753.epub.noimages',
    source: 'indonesia',
  },
  {
    id: 'indo-003',
    title: 'Sengsara Membawa Nikmat',
    author: 'Tulis Sutan Sati',
    year: 1929,
    category: 'Novel Klasik',
    emoji: '🌄',
    color: '#1B4332',
    desc: 'Kisah kehidupan di Minangkabau yang penuh perjuangan dan nilai adat.',
    coverColor: 'linear-gradient(135deg, #1B4332, #2D6A4F)',
    format: 'PDF',
    downloadUrl: 'https://archive.org/download/sengsaramembawan00sati/sengsaramembawan00sati.pdf',
    source: 'indonesia',
  },
  {
    id: 'indo-004',
    title: 'Salah Asuhan',
    author: 'Abdoel Moeis',
    year: 1928,
    category: 'Novel Klasik',
    emoji: '🎭',
    color: '#3A0CA3',
    desc: 'Kisah tragis tokoh yang terjebak antara budaya Barat dan adat Minangkabau.',
    coverColor: 'linear-gradient(135deg, #3A0CA3, #4361EE)',
    format: 'PDF',
    downloadUrl: 'https://archive.org/download/salah-asuhan-abdoel-moeis/salah-asuhan.pdf',
    source: 'indonesia',
  },
  {
    id: 'indo-005',
    title: 'Di Bawah Lindungan Ka\'bah',
    author: 'Hamka',
    year: 1938,
    category: 'Novel Religi',
    emoji: '🕌',
    color: '#D4A017',
    desc: 'Novel karya HAMKA tentang cinta, iman, dan pengorbatan di tanah suci.',
    coverColor: 'linear-gradient(135deg, #D4A017, #B8891A)',
    format: 'PDF',
    downloadUrl: 'https://archive.org/download/di-bawah-lindungan-kabah/di-bawah-lindungan-kabah.pdf',
    source: 'indonesia',
  },
  {
    id: 'indo-006',
    title: 'Tenggelamnya Kapal Van Der Wijck',
    author: 'Hamka',
    year: 1939,
    category: 'Novel Klasik',
    emoji: '🚢',
    color: '#264653',
    desc: 'Kisah cinta tragis Zainuddin dan Hayati yang dipisahkan oleh perbedaan adat.',
    coverColor: 'linear-gradient(135deg, #264653, #2A9D8F)',
    format: 'PDF',
    downloadUrl: 'https://archive.org/download/tenggelamnya-kapal-van-der-wijck/tenggelamnya-kapal-van-der-wijck.pdf',
    source: 'indonesia',
  },
  {
    id: 'indo-007',
    title: 'Robohnya Surau Kami',
    author: 'A.A. Navis',
    year: 1956,
    category: 'Cerita Pendek',
    emoji: '🕌',
    color: '#40916C',
    desc: 'Kumpulan cerpen terbaik A.A. Navis, kritik sosial budaya Minangkabau.',
    coverColor: 'linear-gradient(135deg, #40916C, #52B788)',
    format: 'PDF',
    downloadUrl: 'https://archive.org/download/robohnya-surau-kami/robohnya-surau-kami.pdf',
    source: 'indonesia',
  },
  {
    id: 'indo-008',
    title: 'Layar Terkembang',
    author: 'Sutan Takdir Alisjahbana',
    year: 1936,
    category: 'Novel Klasik',
    emoji: '⛵',
    color: '#3A86FF',
    desc: 'Novel penting tentang emansipasi wanita Indonesia di era pergerakan nasional.',
    coverColor: 'linear-gradient(135deg, #3A86FF, #06AED5)',
    format: 'PDF',
    downloadUrl: 'https://archive.org/download/layar-terkembang-sutan-takdir/layar-terkembang.pdf',
    source: 'indonesia',
  },
  {
    id: 'indo-009',
    title: 'Keluarga Permana',
    author: 'Ramadhan K.H.',
    year: 1978,
    category: 'Novel Modern',
    emoji: '👨‍👩‍👧‍👦',
    color: '#FB8500',
    desc: 'Kisah satu keluarga yang mencerminkan perubahan sosial masyarakat Indonesia.',
    coverColor: 'linear-gradient(135deg, #FB8500, #FFB703)',
    format: 'PDF',
    downloadUrl: 'https://archive.org/download/keluarga-permana/keluarga-permana.pdf',
    source: 'indonesia',
  },
  {
    id: 'indo-010',
    title: 'Bumi Manusia',
    author: 'Pramoedya Ananta Toer',
    year: 1980,
    category: 'Novel Sejarah',
    emoji: '🌍',
    color: '#9B2226',
    desc: 'Tetralogi Buru yang legendaris — kisah Minke dan perjuangan melawan kolonialisme.',
    coverColor: 'linear-gradient(135deg, #9B2226, #800000)',
    format: 'PDF',
    downloadUrl: 'https://archive.org/download/bumi-manusia-pramoedya/bumi-manusia.pdf',
    source: 'indonesia',
  },
  {
    id: 'indo-011',
    title: 'Atheis',
    author: 'Achdiat K. Mihardja',
    year: 1949,
    category: 'Novel Klasik',
    emoji: '🔭',
    color: '#4A4E69',
    desc: 'Novel tentang benturan nilai tradisional, agama, dan paham modern di Indonesia.',
    coverColor: 'linear-gradient(135deg, #4A4E69, #6D6875)',
    format: 'PDF',
    downloadUrl: 'https://archive.org/download/atheis-achdiat/atheis.pdf',
    source: 'indonesia',
  },
  {
    id: 'indo-012',
    title: 'Harimau! Harimau!',
    author: 'Mochtar Lubis',
    year: 1975,
    category: 'Novel Petualangan',
    emoji: '🐯',
    color: '#E76F51',
    desc: 'Tujuh pencari damar di hutan Sumatera yang dikejar harimau — alegori manusia dan alam.',
    coverColor: 'linear-gradient(135deg, #E76F51, #F4A261)',
    format: 'PDF',
    downloadUrl: 'https://archive.org/download/harimau-harimau-mochtar-lubis/harimau-harimau.pdf',
    source: 'indonesia',
  },
  // ── Buku Sekolah Elektronik (BSE) — Kemdikbud ──────────────────────────
  {
    id: 'bse-001',
    title: 'Bahasa Indonesia Kelas X',
    author: 'Kementerian Pendidikan & Kebudayaan',
    year: 2023,
    category: 'Buku Pelajaran',
    emoji: '📚',
    color: '#1B4332',
    desc: 'Buku teks Bahasa Indonesia kurikulum Merdeka untuk SMA/MA kelas X.',
    coverColor: 'linear-gradient(135deg, #1B4332, #2D6A4F)',
    format: 'PDF',
    downloadUrl: 'https://buku.kemdikbud.go.id/katalog/bahasa-indonesia-kelas-x',
    source: 'indonesia',
    isBSE: true,
  },
  {
    id: 'bse-002',
    title: 'Matematika Kelas X',
    author: 'Kementerian Pendidikan & Kebudayaan',
    year: 2023,
    category: 'Buku Pelajaran',
    emoji: '🔢',
    color: '#4361EE',
    desc: 'Buku teks Matematika kurikulum Merdeka untuk SMA/MA kelas X.',
    coverColor: 'linear-gradient(135deg, #4361EE, #3A0CA3)',
    format: 'PDF',
    downloadUrl: 'https://buku.kemdikbud.go.id/katalog/matematika-kelas-x',
    source: 'indonesia',
    isBSE: true,
  },
  {
    id: 'bse-003',
    title: 'Ilmu Pengetahuan Alam Kelas VII',
    author: 'Kementerian Pendidikan & Kebudayaan',
    year: 2023,
    category: 'Buku Pelajaran',
    emoji: '🔬',
    color: '#06D6A0',
    desc: 'Buku IPA terpadu kurikulum Merdeka untuk SMP/MTs kelas VII.',
    coverColor: 'linear-gradient(135deg, #06D6A0, #2A9D8F)',
    format: 'PDF',
    downloadUrl: 'https://buku.kemdikbud.go.id/katalog/ipa-kelas-vii',
    source: 'indonesia',
    isBSE: true,
  },
  {
    id: 'bse-004',
    title: 'Sejarah Indonesia Kelas X',
    author: 'Kementerian Pendidikan & Kebudayaan',
    year: 2023,
    category: 'Buku Pelajaran',
    emoji: '🏛️',
    color: '#8B5E3C',
    desc: 'Buku Sejarah Indonesia kurikulum Merdeka untuk SMA/MA kelas X.',
    coverColor: 'linear-gradient(135deg, #6B4226, #9B2226)',
    format: 'PDF',
    downloadUrl: 'https://buku.kemdikbud.go.id/katalog/sejarah-indonesia-kelas-x',
    source: 'indonesia',
    isBSE: true,
  },
]

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const search   = searchParams.get('search') || ''
  const category = searchParams.get('category') || ''
  const page     = parseInt(searchParams.get('page') || '1')
  const limit    = parseInt(searchParams.get('limit') || '20')
  const source   = searchParams.get('source') || 'all' // 'all' | 'gutenberg' | 'lokal'

  try {
    let books = []

    // ── 1. Gutenberg Indonesia ──────────────────────────────────────────────
    if (source === 'all' || source === 'gutenberg') {
      try {
        const params = new URLSearchParams({ languages: 'id', page: 1 })
        if (search) params.set('search', search)

        const res = await fetch(`https://gutendex.com/books?${params}`, {
          headers: { 'User-Agent': 'PINTAR-JOHOR/1.0' },
          next: { revalidate: 3600 },
        })

        if (res.ok) {
          const data = await res.json()
          const gutenbergBooks = (data.results || []).map((book) => {
            const formats  = book.formats || {}
            const epubUrl  = formats['application/epub+zip'] || ''
            const pdfKey   = Object.keys(formats).find(k => k.includes('pdf'))
            const pdfUrl   = pdfKey ? formats[pdfKey] : ''
            const coverUrl = formats['image/jpeg'] || ''

            return {
              id:          `gutenberg-id-${book.id}`,
              title:       book.title,
              author:      book.authors?.map(a => a.name).join(', ') || 'Tidak diketahui',
              year:        book.authors?.[0]?.birth_year || null,
              category:    book.subjects?.[0] || 'Umum',
              emoji:       '📖',
              color:       '#2D6A4F',
              coverUrl,
              coverColor:  'linear-gradient(135deg, #2D6A4F, #40916C)',
              format:      epubUrl ? 'EPUB' : pdfUrl ? 'PDF' : 'TXT',
              epubUrl,
              pdfUrl,
              downloadUrl: epubUrl || pdfUrl || '',
              source:      'indonesia',
              subSource:   'gutenberg',
              downloads:   book.download_count || 0,
              categoryColor: '#2D6A4F',
              categoryEmoji: '📖',
            }
          }).filter(b => b.downloadUrl)

          books = [...books, ...gutenbergBooks]
        }
      } catch (e) {
        console.error('[Gutenberg ID]', e)
      }
    }

    // ── 2. Koleksi lokal kurasi ─────────────────────────────────────────────
    if (source === 'all' || source === 'lokal') {
      let lokal = [...CURATED_BOOKS]

      if (search) {
        const q = search.toLowerCase()
        lokal = lokal.filter(b =>
          b.title.toLowerCase().includes(q) ||
          b.author.toLowerCase().includes(q) ||
          b.category.toLowerCase().includes(q)
        )
      }
      if (category) {
        lokal = lokal.filter(b => b.category.toLowerCase().includes(category.toLowerCase()))
      }

      // Normalize fields
      const normalized = lokal.map(b => ({
        ...b,
        coverQuery:    encodeURIComponent(b.title),
        categoryColor: b.color,
        categoryEmoji: b.emoji,
      }))

      books = [...books, ...normalized]
    }

    // ── Filter & paginate ───────────────────────────────────────────────────
    if (search && (source === 'all')) {
      const q = search.toLowerCase()
      books = books.filter(b =>
        b.title.toLowerCase().includes(q) ||
        (b.author && b.author.toLowerCase().includes(q))
      )
    }

    const total      = books.length
    const offset     = (page - 1) * limit
    const paginated  = books.slice(offset, offset + limit)

    return Response.json({
      books:      paginated,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      source:     'indonesia',
    })

  } catch (err) {
    console.error('[buku-indonesia API]', err)
    return Response.json({ error: err.message, books: [], total: 0, totalPages: 0 }, { status: 500 })
  }
}
