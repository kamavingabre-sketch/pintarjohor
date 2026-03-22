'use client'
import { useRef, useEffect } from 'react'
import { Calendar, ArrowRight, Tag, Clock } from 'lucide-react'

const NEWS = [
  {
    id: 1,
    category: 'Pengumuman',
    catColor: '#E63946',
    title: 'PINTAR JOHOR Kini Hadir di Android & iOS!',
    excerpt: 'Aplikasi mobile PINTAR JOHOR resmi diluncurkan. Warga kini dapat mengakses seluruh koleksi digital langsung dari smartphone tanpa batas.',
    date: '18 Maret 2025',
    readTime: '3 mnt',
    image: 'linear-gradient(135deg, #1B4332 0%, #40916C 100%)',
    emoji: '📱',
    featured: true,
  },
  {
    id: 2,
    category: 'Kegiatan',
    catColor: '#3A86FF',
    title: 'Festival Literasi Johor 2025: "Buku untuk Semua"',
    excerpt: 'Festival tahunan literasi kembali hadir! Hadiri pameran buku, talkshow penulis lokal, dan lomba resensi buku berhadiah menarik.',
    date: '12 Maret 2025',
    readTime: '5 mnt',
    image: 'linear-gradient(135deg, #3A86FF 0%, #06AED5 100%)',
    emoji: '🎉',
  },
  {
    id: 3,
    category: 'Koleksi Baru',
    catColor: '#40916C',
    title: '500 Judul Baru Hadir di Bulan Maret',
    excerpt: 'Perpustakaan PINTAR JOHOR menambahkan 500 judul baru meliputi buku pelajaran, novel lokal, dan jurnal ilmiah edisi terbaru.',
    date: '5 Maret 2025',
    readTime: '2 mnt',
    image: 'linear-gradient(135deg, #40916C 0%, #52B788 100%)',
    emoji: '📚',
  },
  {
    id: 4,
    category: 'Program',
    catColor: '#FB8500',
    title: 'Program "Baca Bareng" Setiap Sabtu Pagi',
    excerpt: 'Bergabunglah dalam sesi baca bersama setiap Sabtu pukul 08.00 di Aula Perpustakaan. Gratis untuk semua usia, snack disediakan!',
    date: '1 Maret 2025',
    readTime: '4 mnt',
    image: 'linear-gradient(135deg, #FB8500 0%, #FFB703 100%)',
    emoji: '☕',
  },
]

function NewsCard({ news, isFeatured }) {
  if (isFeatured) {
    return (
      <div className="relative rounded-3xl overflow-hidden group cursor-pointer h-full">
        <div className="absolute inset-0" style={{ background: news.image }} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

        {/* Emoji */}
        <div className="absolute top-6 right-6 text-4xl filter drop-shadow-lg">{news.emoji}</div>

        <div className="relative p-8 h-full flex flex-col justify-end min-h-72">
          {/* Badge */}
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold text-white mb-4 w-fit"
            style={{ background: news.catColor }}
          >
            <Tag className="w-3 h-3" /> {news.category}
          </span>

          <h3 className="font-display font-bold text-2xl text-white mb-3 leading-snug group-hover:text-gold-300 transition-colors">
            {news.title}
          </h3>
          <p className="text-white/70 text-sm leading-relaxed mb-4 line-clamp-2">{news.excerpt}</p>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 text-xs text-white/60">
              <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {news.date}</span>
              <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {news.readTime}</span>
            </div>
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center group-hover:bg-gold-500 transition-colors">
              <ArrowRight className="w-3.5 h-3.5 text-white" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="group flex gap-4 p-4 rounded-2xl hover:bg-parchment-200 transition-all duration-200 cursor-pointer">
      {/* Mini cover */}
      <div
        className="w-16 h-16 rounded-2xl flex-shrink-0 flex items-center justify-center text-2xl shadow"
        style={{ background: news.image }}
      >
        {news.emoji}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1.5">
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full text-white" style={{ background: news.catColor }}>
            {news.category}
          </span>
          <span className="text-xs text-forest-400">{news.date}</span>
        </div>
        <h4 className="font-display font-semibold text-forest-800 text-sm leading-snug line-clamp-2 group-hover:text-forest-700 transition-colors">
          {news.title}
        </h4>
        <p className="text-xs text-forest-500 mt-1 line-clamp-2">{news.excerpt}</p>
      </div>
    </div>
  )
}

export default function News() {
  const sectionRef = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.querySelectorAll('.reveal').forEach((el, i) => {
              setTimeout(() => el.classList.add('visible'), i * 100)
            })
          }
        })
      },
      { threshold: 0.1 }
    )
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  const [featured, ...rest] = NEWS

  return (
    <section id="berita" className="py-24 bg-parchment-100" ref={sectionRef}>
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-12 gap-4 reveal">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-forest-700/10 text-forest-700 text-xs font-bold tracking-widest uppercase mb-4 border border-forest-700/15">
              📰 Berita & Pengumuman
            </div>
            <h2 className="font-display font-bold text-4xl md:text-5xl text-forest-800 leading-tight">
              Kabar Terbaru{' '}
              <span className="font-display italic text-gradient-green">PINTAR JOHOR</span>
            </h2>
          </div>
          <a href="#" className="flex items-center gap-1.5 text-sm font-semibold text-forest-700 hover:text-forest-800 transition-colors whitespace-nowrap">
            Semua Berita <ArrowRight className="w-4 h-4" />
          </a>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Featured */}
          <div className="lg:col-span-2 reveal">
            <NewsCard news={featured} isFeatured />
          </div>

          {/* List */}
          <div className="lg:col-span-3 space-y-2 reveal">
            <div className="bg-white rounded-3xl p-2 shadow-sm border border-forest-100">
              {rest.map((news) => (
                <NewsCard key={news.id} news={news} />
              ))}
            </div>

            {/* Newsletter signup */}
            <div className="rounded-3xl p-6 text-white reveal"
              style={{ background: 'linear-gradient(135deg, #1B4332, #2D6A4F)' }}
            >
              <h3 className="font-display font-bold text-xl mb-1">Langganan Berita</h3>
              <p className="text-forest-200 text-sm mb-4">Dapatkan kabar terbaru langsung di WhatsApp atau email Anda.</p>
              <div className="flex gap-2">
                <input
                  placeholder="Masukkan nomor WhatsApp..."
                  className="flex-1 px-4 py-2.5 rounded-xl text-sm bg-white/10 text-white placeholder:text-white/40 border border-white/20 outline-none focus:border-gold-400"
                />
                <button className="px-4 py-2.5 rounded-xl text-sm font-bold text-forest-900"
                  style={{ background: 'linear-gradient(135deg, #E8BE5A, #D4A017)' }}
                >
                  Langganan
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
