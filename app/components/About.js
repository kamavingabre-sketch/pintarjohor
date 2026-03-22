'use client'
import { useRef, useEffect, useState } from 'react'
import { CheckCircle, ArrowRight, MapPin, Phone, Mail, Clock } from 'lucide-react'

const FEATURES = [
  'Koleksi diperbarui setiap minggu',
  'Akses tanpa batas untuk anggota',
  'Dukungan teknis 7 hari seminggu',
  'Koleksi lokal Sumatera Utara terlengkap',
  'Terintegrasi dengan sistem layanan kelurahan',
  'Tersedia dalam Bahasa Indonesia & daerah',
]

const KELURAHAN = [
  'Pangkalan Masyhur',
  'Kwala Bekala',
  'Gedung Johor',
  'Suka Maju',
  'Titi Kuning',
  'Kedai Durian',
]

function useCountUp(target, duration = 2000, start = false) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    if (!start) return
    let startTime = null
    const step = (timestamp) => {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / duration, 1)
      setCount(Math.floor(progress * target))
      if (progress < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [start, target, duration])
  return count
}

export default function About() {
  const sectionRef = useRef(null)
  const [started, setStarted] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setStarted(true)
            entry.target.querySelectorAll('.reveal').forEach((el, i) => {
              setTimeout(() => el.classList.add('visible'), i * 120)
            })
          }
        })
      },
      { threshold: 0.1 }
    )
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  const books  = useCountUp(12500, 2000, started)
  const members = useCountUp(8200, 2000, started)
  const journals = useCountUp(350, 1500, started)

  return (
    <>
      {/* About section */}
      <section id="tentang" className="py-24 bg-white relative overflow-hidden" ref={sectionRef}>
        <div className="absolute inset-0 pattern-lines opacity-50 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left: visual */}
            <div className="reveal">
              <div className="relative">
                {/* Main card */}
                <div className="rounded-3xl overflow-hidden shadow-2xl"
                  style={{ background: 'linear-gradient(135deg, #1B4332, #0D1F17)', padding: 40, minHeight: 480 }}
                >
                  {/* Logo large */}
                  <div className="mb-8">
                    <div className="text-5xl mb-4">📖</div>
                    <h3 className="font-display font-bold text-white text-3xl mb-2">PINTAR JOHOR</h3>
                    <p className="text-forest-300 text-sm">Perpustakaan Interaktif Digital Rakyat Johor</p>
                    <div className="h-0.5 bg-gold-500/40 mt-4 w-24" />
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-4 mb-8">
                    {[
                      { value: books.toLocaleString('id-ID'), suffix: '+', label: 'Koleksi' },
                      { value: members.toLocaleString('id-ID'), suffix: '+', label: 'Anggota' },
                      { value: journals, suffix: '+', label: 'Jurnal' },
                    ].map((s) => (
                      <div key={s.label} className="text-center rounded-2xl py-3 px-2"
                        style={{ background: 'rgba(255,255,255,0.07)' }}
                      >
                        <div className="font-display font-bold text-gold-400 text-xl">
                          {s.value}{s.suffix}
                        </div>
                        <div className="text-forest-300 text-xs mt-0.5">{s.label}</div>
                      </div>
                    ))}
                  </div>

                  {/* Kelurahan pills */}
                  <div>
                    <p className="text-forest-400 text-xs font-semibold uppercase tracking-widest mb-3">Melayani 6 Kelurahan</p>
                    <div className="flex flex-wrap gap-2">
                      {KELURAHAN.map((k) => (
                        <span key={k} className="px-3 py-1.5 rounded-full text-xs font-medium text-white"
                          style={{ background: 'rgba(212,160,23,0.25)', border: '1px solid rgba(212,160,23,0.3)' }}
                        >
                          {k}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Floating badge */}
                <div className="absolute -bottom-5 -right-5 w-32 h-32 rounded-full flex flex-col items-center justify-center text-center shadow-2xl"
                  style={{ background: 'linear-gradient(135deg, #D4A017, #E8BE5A)' }}
                >
                  <div className="font-display font-bold text-forest-900 text-2xl">2023</div>
                  <div className="text-forest-900/70 text-[10px] font-semibold leading-tight">Berdiri<br/>Sejak</div>
                </div>
              </div>
            </div>

            {/* Right: text */}
            <div className="reveal space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-forest-700/10 text-forest-700 text-xs font-bold tracking-widest uppercase border border-forest-700/15">
                🏛️ Tentang Kami
              </div>
              <h2 className="font-display font-bold text-4xl md:text-5xl text-forest-800 leading-tight">
                Membangun Budaya{' '}
                <span className="font-display italic text-gradient-green">Membaca Bersama</span>
              </h2>
              <p className="text-forest-600 text-lg leading-relaxed">
                PINTAR JOHOR adalah inisiatif digital Kecamatan Medan Johor untuk mewujudkan 
                masyarakat literat yang cerdas, berdaya, dan berkarakter melalui akses pengetahuan yang merata.
              </p>
              <p className="text-forest-500 leading-relaxed">
                Hadir sebagai perpustakaan digital pertama di tingkat kecamatan di Kota Medan, 
                kami berkomitmen menyediakan sumber belajar berkualitas tinggi yang dapat diakses 
                seluruh warga tanpa terkecuali — dari anak sekolah hingga warga lansia.
              </p>

              {/* Features */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {FEATURES.map((f) => (
                  <div key={f} className="flex items-start gap-2.5">
                    <CheckCircle className="w-5 h-5 text-forest-600 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-forest-700 leading-snug">{f}</span>
                  </div>
                ))}
              </div>

              <a href="#daftar"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl text-sm font-bold text-white transition-all hover:scale-105 hover:shadow-lg hover:shadow-forest-700/30"
                style={{ background: 'linear-gradient(135deg, #1B4332, #2D6A4F)' }}
              >
                Bergabung Sekarang <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Registration CTA */}
      <section id="daftar" className="py-24 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #F4ECD8 0%, #EDD9B5 100%)' }}
      >
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 w-full h-2"
            style={{ background: 'linear-gradient(90deg, #1B4332, #D4A017, #1B4332)' }}
          />
          <div className="absolute inset-0 opacity-40"
            style={{
              backgroundImage: 'radial-gradient(circle, rgba(27,67,50,0.15) 1px, transparent 1px)',
              backgroundSize: '24px 24px',
            }}
          />
        </div>

        <div className="max-w-4xl mx-auto px-6 text-center relative">
          <div className="text-5xl mb-6">🚀</div>
          <h2 className="font-display font-bold text-4xl md:text-6xl text-forest-800 mb-4 leading-tight">
            Siap Mulai<br />
            <span className="font-display italic text-gradient-green">Perjalanan Literasi</span>
            <span className="text-forest-800"> Anda?</span>
          </h2>
          <p className="text-forest-600 text-lg max-w-xl mx-auto mb-10 leading-relaxed">
            Daftar sekarang dan dapatkan akses gratis ke seluruh koleksi PINTAR JOHOR. 
            Hanya membutuhkan KTP dan nomor WhatsApp aktif.
          </p>

          {/* Form */}
          <div className="bg-white rounded-3xl p-8 shadow-2xl shadow-forest-700/15 border border-forest-100 max-w-lg mx-auto">
            <h3 className="font-display font-semibold text-2xl text-forest-800 mb-6">Daftar Gratis</h3>
            <div className="space-y-4 text-left">
              <div>
                <label className="block text-xs font-semibold text-forest-600 uppercase tracking-wider mb-1.5">Nama Lengkap</label>
                <input type="text" placeholder="Nama sesuai KTP"
                  className="w-full px-4 py-3 rounded-xl border border-forest-200 text-sm outline-none focus:border-forest-500 transition-colors text-forest-800"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-forest-600 uppercase tracking-wider mb-1.5">Nomor WhatsApp</label>
                <input type="tel" placeholder="08xx-xxxx-xxxx"
                  className="w-full px-4 py-3 rounded-xl border border-forest-200 text-sm outline-none focus:border-forest-500 transition-colors text-forest-800"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-forest-600 uppercase tracking-wider mb-1.5">Kelurahan</label>
                <select className="w-full px-4 py-3 rounded-xl border border-forest-200 text-sm outline-none focus:border-forest-500 transition-colors text-forest-800 bg-white">
                  <option value="">Pilih kelurahan...</option>
                  {KELURAHAN.map((k) => <option key={k}>{k}</option>)}
                </select>
              </div>
              <button
                className="w-full py-4 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90 hover:scale-[1.02] hover:shadow-lg"
                style={{ background: 'linear-gradient(135deg, #1B4332, #2D6A4F)' }}
              >
                Daftar Sekarang — Gratis!
              </button>
            </div>
            <p className="text-xs text-forest-400 text-center mt-4">
              Kartu anggota digital akan dikirim via WhatsApp dalam 5 menit.
            </p>
          </div>

          {/* Contact info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-12 text-left">
            {[
              { icon: MapPin, label: 'Lokasi',   value: 'Jl. Karya Cipta No. 16, Medan Johor' },
              { icon: Phone,  label: 'Telepon',  value: '0813-6777-2047' },
              { icon: Mail,   label: 'WhatsApp', value: '0813-6777-2047' },
            ].map((c) => {
              const Icon = c.icon
              return (
                <div key={c.label} className="flex items-start gap-3 p-4 bg-white/70 rounded-2xl border border-forest-100">
                  <div className="w-9 h-9 rounded-xl bg-forest-700/10 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-4 h-4 text-forest-700" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-forest-500 uppercase tracking-wider">{c.label}</div>
                    <div className="text-sm text-forest-800 font-medium mt-0.5">{c.value}</div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>
    </>
  )
}
