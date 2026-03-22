'use client'
import { useEffect, useRef } from 'react'
import { BookOpen, FileText, Newspaper, Video, Headphones, Globe, GraduationCap, Archive } from 'lucide-react'

const CATEGORIES = [
  { icon: BookOpen,   catId: 'General Fiction', title: 'E-Book',           desc: 'Ribuan buku digital dari berbagai genre dan disiplin ilmu tersedia untuk dibaca kapan saja.',     count: '5.800+', color: '#1B4332', accent: '#D4A017', bg: 'linear-gradient(135deg, #1B4332, #2D6A4F)', emoji: '📖' },
  { icon: FileText,   catId: 'Academic Articles', title: 'Jurnal Ilmiah',  desc: 'Kumpulan jurnal penelitian nasional dan internasional untuk referensi akademik.',                  count: '1.200+', color: '#2D6A4F', accent: '#74C69D', bg: 'linear-gradient(135deg, #2D6A4F, #40916C)', emoji: '🔬' },
  { icon: Newspaper,  catId: 'Short Stories',   title: 'Artikel & Berita', desc: 'Artikel lokal, nasional, dan opini terkurasi seputar pendidikan dan sosial budaya.',              count: '3.400+', color: '#40916C', accent: '#D4A017', bg: 'linear-gradient(135deg, #40916C, #52B788)', emoji: '📰' },
  { icon: Video,      catId: 'Drama',           title: 'Video Edukasi',    desc: 'Konten video pembelajaran interaktif dari pengajar lokal dan nasional terpilih.',                   count: '620+',   color: '#B5179E', accent: '#F72585', bg: 'linear-gradient(135deg, #7B2D8B, #B5179E)',  emoji: '🎬' },
  { icon: Headphones, catId: 'Poetry',          title: 'Audiobook',        desc: 'Nikmati buku favorit Anda dalam format audio yang nyaman di perjalanan.',                           count: '380+',   color: '#3A86FF', accent: '#8ECAE6', bg: 'linear-gradient(135deg, #3A86FF, #06AED5)',  emoji: '🎧' },
  { icon: GraduationCap, catId: 'Textbooks',   title: 'Materi Pelajaran', desc: 'Modul, LKS, dan materi belajar untuk SD, SMP, SMA sesuai kurikulum Merdeka.',                      count: '900+',   color: '#FB8500', accent: '#FFB703', bg: 'linear-gradient(135deg, #FB8500, #FFB703)',  emoji: '🎓' },
  { icon: Globe,      catId: 'Cultural',        title: 'Budaya & Lokal',   desc: 'Arsip digital budaya, adat, dan sejarah lokal Kota Medan dan Sumatera Utara.',                      count: '480+',   color: '#9B2226', accent: '#E63946', bg: 'linear-gradient(135deg, #9B2226, #C1121F)',  emoji: '🏛️' },
  { icon: Archive,    catId: 'Government',      title: 'Arsip Dokumen',    desc: 'Dokumen resmi, peraturan daerah, dan arsip kelurahan Kecamatan Medan Johor.',                       count: '240+',   color: '#4A4E69', accent: '#9A8C98', bg: 'linear-gradient(135deg, #4A4E69, #6B6F8C)',  emoji: '📁' },
]

function CategoryCard({ cat, index }) {
  const Icon = cat.icon
  return (
    <a
      href={`/katalog?category=${encodeURIComponent(cat.catId || cat.title)}`}
      className="category-card group relative rounded-2xl overflow-hidden cursor-pointer block"
      style={{ animationDelay: `${index * 0.08}s` }}
    >
      {/* Card background */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{ background: cat.bg }}
      />
      <div
        className="relative p-6 rounded-2xl border transition-all duration-300"
        style={{
          background: 'rgba(255,255,255,0.85)',
          borderColor: 'rgba(27,67,50,0.12)',
        }}
      >
        {/* Icon container */}
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4 text-2xl shadow-lg group-hover:scale-110 transition-transform duration-300"
          style={{ background: cat.bg }}
        >
          {cat.emoji}
        </div>

        {/* Count badge */}
        <div
          className="absolute top-4 right-4 px-2.5 py-1 rounded-full text-xs font-bold"
          style={{
            background: cat.color + '12',
            color: cat.color,
            border: `1px solid ${cat.color}25`,
          }}
        >
          {cat.count}
        </div>

        <h3 className="font-display font-bold text-xl text-forest-800 mb-2 group-hover:text-white transition-colors duration-300">
          {cat.title}
        </h3>
        <p className="text-sm text-forest-600 leading-relaxed group-hover:text-white/80 transition-colors duration-300">
          {cat.desc}
        </p>

        <div className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-forest-700 group-hover:text-gold-400 transition-colors duration-300">
          Lihat koleksi
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="group-hover:translate-x-1 transition-transform">
            <path d="M2 6h8M6 2l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>
    </a>
  )
}

export default function Categories() {
  const sectionRef = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.querySelectorAll('.reveal').forEach((el, i) => {
              setTimeout(() => el.classList.add('visible'), i * 80)
            })
          }
        })
      },
      { threshold: 0.1 }
    )
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section id="kategori" className="py-24 bg-parchment-200 relative" ref={sectionRef}>
      {/* Background dots */}
      <div className="absolute inset-0 pattern-dots opacity-50 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative">
        {/* Section header */}
        <div className="text-center mb-16 reveal">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-forest-700/10 text-forest-700 text-xs font-bold tracking-widest uppercase mb-4 border border-forest-700/15">
            <span>📚</span> Kategori Koleksi
          </div>
          <h2 className="font-display font-bold text-4xl md:text-5xl text-forest-800 mb-4">
            Temukan Koleksi{' '}
            <span className="text-gradient-gold font-display italic">Terbaik Kami</span>
          </h2>
          <p className="text-forest-600 text-lg max-w-xl mx-auto leading-relaxed">
            Dari e-book hingga arsip budaya lokal — semua tersedia lengkap, gratis, dan mudah diakses.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {CATEGORIES.map((cat, i) => (
            <div key={cat.title} className="reveal" style={{ transitionDelay: `${i * 60}ms` }}>
              <CategoryCard cat={cat} index={i} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
