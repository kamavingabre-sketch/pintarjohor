'use client'
import { useEffect, useRef } from 'react'
import {
  Smartphone, Clock, MapPin, Users, FileCheck, Wifi,
  BookMarked, Calendar, ArrowRight
} from 'lucide-react'

const SERVICES = [
  {
    icon: Smartphone,
    title: 'Akses Mobile',
    desc: 'Baca dan unduh koleksi melalui aplikasi PINTAR JOHOR tersedia di Android & iOS.',
    color: '#3A86FF',
    bg: 'linear-gradient(135deg, #EFF6FF, #DBEAFE)',
  },
  {
    icon: Clock,
    title: 'Layanan 24/7',
    desc: 'Koleksi digital dapat diakses kapan saja — tidak terbatas jam operasional fisik.',
    color: '#40916C',
    bg: 'linear-gradient(135deg, #F0FAF4, #DCFCE7)',
  },
  {
    icon: BookMarked,
    title: 'Pinjam Online',
    desc: 'Pinjam buku fisik secara online dan ambil di perpustakaan tanpa antrian.',
    color: '#D4A017',
    bg: 'linear-gradient(135deg, #FFFBEB, #FEF3C7)',
  },
  {
    icon: FileCheck,
    title: 'Kartu Digital',
    desc: 'Daftar dan dapatkan kartu anggota digital dalam hitungan menit — gratis selamanya.',
    color: '#B5179E',
    bg: 'linear-gradient(135deg, #FDF4FF, #FAE8FF)',
  },
  {
    icon: Calendar,
    title: 'Reservasi Ruangan',
    desc: 'Pesan ruang diskusi, ruang belajar, atau aula perpustakaan secara online.',
    color: '#E63946',
    bg: 'linear-gradient(135deg, #FFF1F2, #FFE4E6)',
  },
  {
    icon: Users,
    title: 'Klub Membaca',
    desc: 'Bergabung dengan komunitas pembaca aktif di Kecamatan Medan Johor.',
    color: '#FB8500',
    bg: 'linear-gradient(135deg, #FFF7ED, #FFEDD5)',
  },
]

const HIGHLIGHTS = [
  { value: 'Gratis', label: 'Untuk Semua Warga',  icon: '🆓' },
  { value: '< 1 Mnt', label: 'Waktu Registrasi', icon: '⚡' },
  { value: 'HD',      label: 'Kualitas Konten',   icon: '✨' },
  { value: 'Offline', label: 'Mode Baca',          icon: '📵' },
]

export default function Services() {
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

  return (
    <section id="layanan" className="py-24 relative overflow-hidden" ref={sectionRef}
      style={{ background: 'linear-gradient(180deg, #1B4332 0%, #0D1F17 100%)' }}
    >
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: 'radial-gradient(circle, rgba(212,160,23,0.3) 1px, transparent 1px)',
            backgroundSize: '32px 32px',
          }}
        />
        <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle, #D4A017, transparent 70%)' }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative">
        {/* Header */}
        <div className="text-center mb-16 reveal">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold tracking-widest uppercase mb-4 border"
            style={{ background: 'rgba(212,160,23,0.15)', borderColor: 'rgba(212,160,23,0.3)', color: '#E8BE5A' }}
          >
            <Wifi className="w-3 h-3" /> Layanan Digital
          </div>
          <h2 className="font-display font-bold text-4xl md:text-5xl text-white mb-4 leading-tight">
            Semua Layanan{' '}
            <span className="font-display italic text-gradient-gold">Dalam Satu Platform</span>
          </h2>
          <p className="text-forest-200 text-lg max-w-xl mx-auto leading-relaxed">
            Nikmati berbagai layanan perpustakaan modern yang dirancang untuk kemudahan warga Kecamatan Medan Johor.
          </p>
        </div>

        {/* Highlights */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16 reveal">
          {HIGHLIGHTS.map((h) => (
            <div key={h.label} className="text-center p-4 rounded-2xl"
              style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}
            >
              <div className="text-3xl mb-2">{h.icon}</div>
              <div className="font-display font-bold text-2xl text-gold-400">{h.value}</div>
              <div className="text-xs text-forest-300 mt-0.5">{h.label}</div>
            </div>
          ))}
        </div>

        {/* Services grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-12">
          {SERVICES.map((svc, i) => {
            const Icon = svc.icon
            return (
              <div key={svc.title}
                className="reveal group relative rounded-2xl p-6 cursor-pointer transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-black/30"
                style={{
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  transitionDelay: `${i * 60}ms`,
                }}
              >
                {/* Hover glow */}
                <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ background: svc.bg.replace('linear-gradient', 'linear-gradient').replace('#', 'rgba(').replace('EFF6FF', '59,134,255,0.08'), boxShadow: `0 0 60px ${svc.color}20` }}
                />

                <div className="relative">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4 shadow-lg transition-transform group-hover:scale-110 duration-300"
                    style={{ background: svc.color + '20', border: `1px solid ${svc.color}30` }}
                  >
                    <Icon className="w-5 h-5" style={{ color: svc.color }} />
                  </div>
                  <h3 className="font-display font-bold text-xl text-white mb-2">{svc.title}</h3>
                  <p className="text-sm text-forest-300 leading-relaxed">{svc.desc}</p>
                  <div className="mt-4 flex items-center gap-1.5 text-xs font-semibold transition-colors"
                    style={{ color: svc.color }}
                  >
                    Pelajari lebih lanjut <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* CTA */}
        <div className="text-center reveal">
          <a
            href="#daftar"
            className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl text-base font-bold text-forest-900 transition-all hover:scale-105 hover:shadow-2xl"
            style={{ background: 'linear-gradient(135deg, #E8BE5A, #D4A017)', boxShadow: '0 8px 32px rgba(212,160,23,0.4)' }}
          >
            Daftar Sekarang — Gratis!
            <ArrowRight className="w-5 h-5" />
          </a>
          <p className="text-forest-400 text-sm mt-3">Tidak diperlukan kartu kredit · Selamanya gratis untuk warga</p>
        </div>
      </div>
    </section>
  )
}
