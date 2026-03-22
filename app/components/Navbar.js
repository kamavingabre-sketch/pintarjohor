'use client'
import { useState, useEffect } from 'react'
import { BookOpen, Search, Menu, X, ChevronDown } from 'lucide-react'
import { usePathname, useRouter } from 'next/navigation'

const NAV_LINKS = [
  { label: 'Beranda',  anchor: 'beranda' },
  { label: 'Koleksi',  anchor: 'koleksi',  sub: ['E-Book', 'Jurnal', 'Artikel', 'Video Edukasi'] },
  { label: 'Layanan',  anchor: 'layanan' },
  { label: 'Berita',   anchor: 'berita' },
  { label: 'Tentang',  anchor: 'tentang' },
]

export default function Navbar() {
  const [scrolled, setScrolled]  = useState(false)
  const [mobileOpen, setMobile]  = useState(false)
  const [searchOpen, setSearch]  = useState(false)
  const [activeDD, setActiveDD]  = useState(null)
  const [searchQuery, setQ]      = useState('')
  const pathname = usePathname()
  const router   = useRouter()
  const isHome   = pathname === '/'

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

  // Build href depending on current page
  const linkHref = (anchor) => isHome ? `#${anchor}` : `/#${anchor}`

  const handleNavClick = (e, anchor) => {
    if (isHome) {
      e.preventDefault()
      const el = document.getElementById(anchor)
      el?.scrollIntoView({ behavior: 'smooth' })
      setMobile(false)
    }
    // If not home, let normal href navigation happen (/#anchor)
  }

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/katalog?q=${encodeURIComponent(searchQuery.trim())}`)
      setSearch(false)
      setQ('')
    }
  }

  return (
    <>
      {/* Top bar */}
      <div className="hidden md:block bg-forest-700 text-parchment-100 text-xs py-1.5">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <span>📍 Jl. Karya Cipta No. 16, Kecamatan Medan Johor, Kota Medan</span>
          <div className="flex items-center gap-4">
            <span>Senin–Sabtu: 08.00–21.00 WIB &nbsp;|&nbsp; Minggu: 09.00–17.00 WIB</span>
            <a href="https://wa.me/6281367772047" target="_blank" rel="noopener noreferrer"
              className="hover:text-gold-300 transition-colors">
              📞 0813-6777-2047
            </a>
          </div>
        </div>
      </div>

      <header className={`sticky top-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-white/95 backdrop-blur-xl shadow-xl shadow-forest-700/10 border-b border-forest-100'
          : 'bg-parchment-100/95 backdrop-blur-md'
      }`}>
        <nav className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between gap-4">
          {/* Logo */}
          <a href="/" className="flex items-center gap-3 group flex-shrink-0">
            <div className="w-10 h-10 rounded-xl bg-forest-700 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-300">
              <BookOpen className="w-5 h-5 text-gold-400" strokeWidth={2} />
            </div>
            <div className="leading-tight">
              <div className="font-display font-bold text-forest-700 text-lg tracking-tight leading-none">PINTAR JOHOR</div>
              <div className="text-[10px] text-forest-600 font-body font-medium tracking-widest uppercase">Perpustakaan Digital Rakyat</div>
            </div>
          </a>

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <div key={link.label} className="relative"
                onMouseEnter={() => link.sub && setActiveDD(link.label)}
                onMouseLeave={() => setActiveDD(null)}>
                <a href={linkHref(link.anchor)}
                  onClick={(e) => handleNavClick(e, link.anchor)}
                  className="nav-link flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-medium text-forest-800 hover:text-forest-700 hover:bg-forest-50 transition-all duration-200">
                  {link.label}
                  {link.sub && <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${activeDD === link.label ? 'rotate-180' : ''}`} />}
                </a>
                {link.sub && activeDD === link.label && (
                  <div className="absolute top-full left-0 mt-2 w-44 bg-white rounded-2xl shadow-2xl shadow-forest-700/15 border border-forest-100 py-2 overflow-hidden">
                    {link.sub.map((s) => (
                      <a key={s} href="/katalog"
                        className="block px-4 py-2.5 text-sm text-forest-800 hover:bg-forest-50 hover:text-forest-700 transition-colors">
                        {s}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <a href="/katalog"
              className="nav-link flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-medium text-forest-800 hover:text-forest-700 hover:bg-forest-50 transition-all duration-200">
              Katalog
            </a>
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            {/* Search */}
            <div className={`hidden md:flex items-center transition-all duration-300 ${searchOpen ? 'w-56' : 'w-10'}`}>
              {searchOpen ? (
                <form onSubmit={handleSearch} className="flex items-center w-full bg-forest-50 border border-forest-200 rounded-xl overflow-hidden">
                  <input autoFocus value={searchQuery} onChange={(e) => setQ(e.target.value)}
                    placeholder="Cari koleksi..."
                    className="flex-1 px-3 py-2 text-sm bg-transparent outline-none text-forest-800 placeholder-forest-400" />
                  <button type="button" onClick={() => { setSearch(false); setQ('') }}
                    className="p-2 text-forest-500 hover:text-forest-700">
                    <X className="w-4 h-4" />
                  </button>
                </form>
              ) : (
                <button onClick={() => setSearch(true)}
                  className="w-10 h-10 rounded-xl bg-forest-50 hover:bg-forest-100 flex items-center justify-center text-forest-700 transition-all duration-200 hover:scale-105">
                  <Search className="w-4 h-4" />
                </button>
              )}
            </div>

            <a href="/katalog"
              className="hidden md:flex items-center gap-2 px-5 py-2.5 rounded-xl bg-forest-700 text-white text-sm font-semibold hover:bg-forest-800 transition-all duration-200 hover:scale-105 hover:shadow-lg hover:shadow-forest-700/30">
              Mulai Membaca
            </a>

            <button onClick={() => setMobile(!mobileOpen)}
              className="lg:hidden w-10 h-10 rounded-xl bg-forest-50 flex items-center justify-center text-forest-700">
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </nav>

        {/* Mobile menu */}
        <div className={`lg:hidden transition-all duration-300 overflow-hidden ${mobileOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'}`}>
          <div className="border-t border-forest-100 bg-white/98 px-6 py-4 space-y-1">
            {NAV_LINKS.map((link) => (
              <a key={link.label} href={linkHref(link.anchor)}
                onClick={(e) => handleNavClick(e, link.anchor)}
                className="block px-4 py-3 rounded-xl text-sm font-medium text-forest-800 hover:bg-forest-50 hover:text-forest-700 transition-colors">
                {link.label}
              </a>
            ))}
            <a href="/katalog" onClick={() => setMobile(false)}
              className="block px-4 py-3 rounded-xl text-sm font-medium text-forest-800 hover:bg-forest-50 hover:text-forest-700 transition-colors">
              Katalog
            </a>
            <div className="pt-2 border-t border-forest-100">
              <form onSubmit={handleSearch} className="flex gap-2">
                <input value={searchQuery} onChange={(e) => setQ(e.target.value)}
                  placeholder="Cari koleksi..."
                  className="flex-1 px-3 py-2.5 text-sm bg-forest-50 border border-forest-200 rounded-xl outline-none" />
                <button type="submit" className="px-4 py-2.5 bg-forest-700 text-white rounded-xl text-sm font-medium">
                  Cari
                </button>
              </form>
            </div>
            <a href="/katalog"
              className="block w-full text-center px-5 py-3 rounded-xl bg-forest-700 text-white text-sm font-semibold">
              Mulai Membaca
            </a>
          </div>
        </div>
      </header>
    </>
  )
}
