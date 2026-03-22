'use client'
import { useEffect, useRef, useState } from 'react'
import { Smartphone, Clock, BookMarked, FileCheck, Calendar, Users, ArrowRight, Wifi } from 'lucide-react'
import {
  KartuAnggotaModal, ReservasiModal, KlubMembacaModal,
  PinjamOnlineModal, KonsultasiModal
} from './Modals'

const SERVICES = [
  {
    icon: Smartphone, title: 'Akses Mobile', color: '#3A86FF',
    desc: 'Baca dan unduh koleksi langsung dari smartphone kapan saja, di mana saja.',
    action: 'Jelajahi Koleksi', href: '/katalog',
  },
  {
    icon: Clock, title: 'Layanan 24/7', color: '#40916C',
    desc: 'Koleksi digital dapat diakses kapan saja — tidak terbatas jam operasional fisik.',
    action: 'Buka Katalog', href: '/katalog',
  },
  {
    icon: BookMarked, title: 'Pinjam Online', color: '#D4A017',
    desc: 'Pesan buku fisik secara online dan ambil di perpustakaan tanpa antrian.',
    action: 'Pinjam Sekarang', modal: 'pinjam',
  },
  {
    icon: FileCheck, title: 'Kartu Digital', color: '#B5179E',
    desc: 'Daftar dan dapatkan kartu anggota digital dalam hitungan menit — gratis selamanya.',
    action: 'Daftar Gratis', modal: 'kartu',
  },
  {
    icon: Calendar, title: 'Reservasi Ruangan', color: '#E63946',
    desc: 'Pesan ruang diskusi, ruang belajar, atau aula perpustakaan secara online.',
    action: 'Reservasi', modal: 'reservasi',
  },
  {
    icon: Users, title: 'Klub Membaca', color: '#FB8500',
    desc: 'Bergabung dengan komunitas pembaca aktif setiap Sabtu pukul 08.00 WIB.',
    action: 'Gabung Klub', modal: 'klub',
  },
]

const HIGHLIGHTS = [
  { value: 'Gratis',  label: 'Untuk Semua Warga', icon: '🆓' },
  { value: '< 1 Mnt', label: 'Waktu Registrasi',  icon: '⚡' },
  { value: 'HD',      label: 'Kualitas Konten',    icon: '✨' },
  { value: 'Offline', label: 'Mode Baca',          icon: '📵' },
]

export default function Services() {
  const sectionRef            = useRef(null)
  const [openModal, setModal] = useState(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
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
    <>
      <section id="layanan" className="py-16 md:py-24 relative overflow-hidden" ref={sectionRef}
        style={{ background: 'linear-gradient(180deg, #1B4332 0%, #0D1F17 100%)' }}>
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 opacity-30"
            style={{ backgroundImage: 'radial-gradient(circle, rgba(212,160,23,0.3) 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
          <div className="absolute top-0 right-0 w-72 h-72 rounded-full opacity-10"
            style={{ background: 'radial-gradient(circle, #D4A017, transparent 70%)' }} />
        </div>

        <div className="max-w-7xl mx-auto px-4 md:px-6 relative">
          <div className="text-center mb-10 md:mb-16 reveal">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold tracking-widest uppercase mb-4 border"
              style={{ background: 'rgba(212,160,23,0.15)', borderColor: 'rgba(212,160,23,0.3)', color: '#E8BE5A' }}>
              <Wifi className="w-3 h-3" /> Layanan Digital
            </div>
            <h2 className="font-display font-bold text-3xl md:text-5xl text-white mb-4 leading-tight">
              Semua Layanan{' '}
              <span className="font-display italic text-gradient-gold">Dalam Satu Platform</span>
            </h2>
            <p className="text-forest-200 text-base md:text-lg max-w-xl mx-auto leading-relaxed">
              Nikmati berbagai layanan perpustakaan modern yang dirancang untuk kemudahan warga Kecamatan Medan Johor.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-10 md:mb-16 reveal">
            {HIGHLIGHTS.map((h) => (
              <div key={h.label} className="text-center p-3 md:p-5 rounded-2xl"
                style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}>
                <div className="text-2xl md:text-3xl mb-1">{h.icon}</div>
                <div className="font-display font-bold text-lg md:text-2xl text-gold-400">{h.value}</div>
                <div className="text-[10px] md:text-xs text-forest-300 mt-0.5">{h.label}</div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
            {SERVICES.map((svc, i) => {
              const Icon = svc.icon
              return (
                <div key={svc.title}
                  className="reveal group relative rounded-2xl p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
                  style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', transitionDelay: `${i * 60}ms` }}>
                  <div className="w-11 h-11 rounded-2xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform"
                    style={{ background: svc.color + '20', border: `1px solid ${svc.color}30` }}>
                    <Icon className="w-5 h-5" style={{ color: svc.color }} />
                  </div>
                  <h3 className="font-display font-bold text-lg text-white mb-1.5">{svc.title}</h3>
                  <p className="text-sm text-forest-300 leading-relaxed mb-4">{svc.desc}</p>
                  {svc.modal ? (
                    <button onClick={() => setModal(svc.modal)}
                      className="flex items-center gap-1.5 text-xs font-semibold hover:gap-2.5 transition-all"
                      style={{ color: svc.color }}>
                      {svc.action} <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  ) : (
                    <a href={svc.href}
                      className="flex items-center gap-1.5 text-xs font-semibold hover:gap-2.5 transition-all"
                      style={{ color: svc.color }}>
                      {svc.action} <ArrowRight className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              )
            })}
          </div>

          <div className="text-center reveal">
            <button onClick={() => setModal('kartu')}
              className="inline-flex items-center gap-3 px-6 md:px-8 py-3.5 md:py-4 rounded-2xl text-sm md:text-base font-bold text-forest-900 transition-all hover:scale-105 hover:shadow-2xl"
              style={{ background: 'linear-gradient(135deg, #E8BE5A, #D4A017)', boxShadow: '0 8px 32px rgba(212,160,23,0.4)' }}>
              Daftar Sekarang — Gratis! <ArrowRight className="w-5 h-5" />
            </button>
            <p className="text-forest-400 text-sm mt-3">Tidak diperlukan kartu kredit · Selamanya gratis untuk warga</p>
          </div>
        </div>
      </section>

      <KartuAnggotaModal  open={openModal === 'kartu'}     onClose={() => setModal(null)} />
      <ReservasiModal     open={openModal === 'reservasi'} onClose={() => setModal(null)} />
      <KlubMembacaModal   open={openModal === 'klub'}      onClose={() => setModal(null)} />
      <PinjamOnlineModal  open={openModal === 'pinjam'}    onClose={() => setModal(null)} />
      <KonsultasiModal    open={openModal === 'konsultasi'} onClose={() => setModal(null)} />
    </>
  )
}
