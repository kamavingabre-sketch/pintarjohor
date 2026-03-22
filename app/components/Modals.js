'use client'
import { useState } from 'react'
import { X, CheckCircle, Loader2, BookOpen, Calendar, Users, BookMarked, Phone } from 'lucide-react'

const KELURAHAN = ['Pangkalan Masyhur','Kwala Bekala','Gedung Johor','Suka Maju','Titi Kuning','Kedai Durian']

// ── Generic Modal wrapper ──────────────────────────────────────────────────
function Modal({ open, onClose, children }) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full sm:max-w-lg bg-white sm:rounded-3xl rounded-t-3xl shadow-2xl overflow-hidden max-h-[95vh] overflow-y-auto">
        <button onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors z-10">
          <X className="w-4 h-4 text-gray-600" />
        </button>
        {children}
      </div>
    </div>
  )
}

// ── Success state ──────────────────────────────────────────────────────────
function SuccessView({ title, message, onClose }) {
  return (
    <div className="p-8 text-center">
      <div className="w-16 h-16 rounded-full bg-forest-50 flex items-center justify-center mx-auto mb-4">
        <CheckCircle className="w-8 h-8 text-forest-600" />
      </div>
      <h3 className="font-display font-bold text-2xl text-forest-800 mb-2">{title}</h3>
      <p className="text-forest-500 text-sm leading-relaxed mb-6">{message}</p>
      <button onClick={onClose}
        className="w-full py-3 rounded-2xl font-bold text-white"
        style={{ background: 'linear-gradient(135deg, #1B4332, #2D6A4F)' }}>
        Tutup
      </button>
    </div>
  )
}

// ── 1. Kartu Anggota Digital ───────────────────────────────────────────────
export function KartuAnggotaModal({ open, onClose }) {
  const [form, setForm]     = useState({ nama: '', nik: '', wa: '', kelurahan: '', email: '' })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    await new Promise(r => setTimeout(r, 1500))
    setLoading(false)
    setSuccess(true)
  }

  const reset = () => { setSuccess(false); setForm({ nama:'',nik:'',wa:'',kelurahan:'',email:'' }); onClose() }

  return (
    <Modal open={open} onClose={reset}>
      {success ? (
        <SuccessView
          title="Pendaftaran Berhasil! 🎉"
          message={`Selamat, ${form.nama}! Kartu anggota digital Anda sedang diproses dan akan dikirim ke WhatsApp ${form.wa} dalam 5–10 menit. Nomor anggota Anda akan tercantum di kartu tersebut.`}
          onClose={reset}
        />
      ) : (
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #B5179E, #7B2D8B)' }}>
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-display font-bold text-xl text-forest-800">Kartu Anggota Digital</h3>
              <p className="text-xs text-forest-500">Gratis untuk warga Kecamatan Medan Johor</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-forest-600 uppercase tracking-wider mb-1.5">Nama Lengkap *</label>
              <input required value={form.nama} onChange={e => setForm({...form, nama: e.target.value})}
                placeholder="Sesuai KTP" className="w-full px-4 py-3 rounded-xl border border-forest-200 text-sm outline-none focus:border-forest-500 text-forest-800" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-forest-600 uppercase tracking-wider mb-1.5">NIK (16 digit) *</label>
              <input required value={form.nik} onChange={e => setForm({...form, nik: e.target.value})}
                placeholder="1234567890123456" maxLength={16}
                className="w-full px-4 py-3 rounded-xl border border-forest-200 text-sm outline-none focus:border-forest-500 text-forest-800" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-forest-600 uppercase tracking-wider mb-1.5">Nomor WhatsApp *</label>
              <input required type="tel" value={form.wa} onChange={e => setForm({...form, wa: e.target.value})}
                placeholder="08xx-xxxx-xxxx"
                className="w-full px-4 py-3 rounded-xl border border-forest-200 text-sm outline-none focus:border-forest-500 text-forest-800" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-forest-600 uppercase tracking-wider mb-1.5">Kelurahan *</label>
              <select required value={form.kelurahan} onChange={e => setForm({...form, kelurahan: e.target.value})}
                className="w-full px-4 py-3 rounded-xl border border-forest-200 text-sm outline-none focus:border-forest-500 text-forest-800 bg-white">
                <option value="">Pilih kelurahan...</option>
                {KELURAHAN.map(k => <option key={k}>{k}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-forest-600 uppercase tracking-wider mb-1.5">Email (opsional)</label>
              <input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})}
                placeholder="email@gmail.com"
                className="w-full px-4 py-3 rounded-xl border border-forest-200 text-sm outline-none focus:border-forest-500 text-forest-800" />
            </div>
            <button type="submit" disabled={loading}
              className="w-full py-3.5 rounded-2xl font-bold text-white flex items-center justify-center gap-2 transition-all hover:opacity-90 disabled:opacity-70"
              style={{ background: 'linear-gradient(135deg, #1B4332, #2D6A4F)' }}>
              {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Memproses...</> : 'Daftar Sekarang — Gratis!'}
            </button>
            <p className="text-xs text-forest-400 text-center">Kartu dikirim via WhatsApp dalam 5–10 menit</p>
          </form>
        </div>
      )}
    </Modal>
  )
}

// ── 2. Reservasi Ruangan ───────────────────────────────────────────────────
export function ReservasiModal({ open, onClose }) {
  const [form, setForm]       = useState({ nama:'', wa:'', ruangan:'', tanggal:'', jam:'', durasi:'', keperluan:'' })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const RUANGAN = ['Ruang Baca Umum (20 orang)','Ruang Diskusi A (10 orang)','Ruang Diskusi B (10 orang)','Ruang Belajar Anak (15 orang)','Aula Serbaguna (100 orang)','Ruang Multimedia (25 orang)']
  const DURASI  = ['1 jam','2 jam','3 jam','4 jam','Setengah hari (4+ jam)','Seharian']

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    await new Promise(r => setTimeout(r, 1500))
    setLoading(false)
    setSuccess(true)
  }

  const reset = () => { setSuccess(false); setForm({ nama:'',wa:'',ruangan:'',tanggal:'',jam:'',durasi:'',keperluan:'' }); onClose() }

  return (
    <Modal open={open} onClose={reset}>
      {success ? (
        <SuccessView
          title="Reservasi Berhasil! 📅"
          message={`Reservasi ${form.ruangan} pada ${form.tanggal} pukul ${form.jam} telah kami terima. Konfirmasi akan dikirim ke WhatsApp ${form.wa} dalam 1x24 jam. Harap tunjukkan konfirmasi saat check-in.`}
          onClose={reset}
        />
      ) : (
        <div className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #E63946, #C1121F)' }}>
              <Calendar className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-display font-bold text-xl text-forest-800">Reservasi Ruangan</h3>
              <p className="text-xs text-forest-500">Pesan ruang perpustakaan secara online</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-forest-600 uppercase tracking-wider mb-1.5">Nama Lengkap *</label>
                <input required value={form.nama} onChange={e => setForm({...form, nama: e.target.value})}
                  placeholder="Nama pemesan" className="w-full px-4 py-3 rounded-xl border border-forest-200 text-sm outline-none focus:border-forest-500 text-forest-800" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-forest-600 uppercase tracking-wider mb-1.5">WhatsApp *</label>
                <input required type="tel" value={form.wa} onChange={e => setForm({...form, wa: e.target.value})}
                  placeholder="08xx-xxxx-xxxx" className="w-full px-4 py-3 rounded-xl border border-forest-200 text-sm outline-none focus:border-forest-500 text-forest-800" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-forest-600 uppercase tracking-wider mb-1.5">Ruangan *</label>
              <select required value={form.ruangan} onChange={e => setForm({...form, ruangan: e.target.value})}
                className="w-full px-4 py-3 rounded-xl border border-forest-200 text-sm outline-none focus:border-forest-500 text-forest-800 bg-white">
                <option value="">Pilih ruangan...</option>
                {RUANGAN.map(r => <option key={r}>{r}</option>)}
              </select>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-1">
                <label className="block text-xs font-semibold text-forest-600 uppercase tracking-wider mb-1.5">Tanggal *</label>
                <input required type="date" value={form.tanggal} onChange={e => setForm({...form, tanggal: e.target.value})}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-3 rounded-xl border border-forest-200 text-sm outline-none focus:border-forest-500 text-forest-800 bg-white" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-forest-600 uppercase tracking-wider mb-1.5">Jam Mulai *</label>
                <input required type="time" value={form.jam} onChange={e => setForm({...form, jam: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl border border-forest-200 text-sm outline-none focus:border-forest-500 text-forest-800 bg-white" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-forest-600 uppercase tracking-wider mb-1.5">Durasi *</label>
                <select required value={form.durasi} onChange={e => setForm({...form, durasi: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl border border-forest-200 text-sm outline-none focus:border-forest-500 text-forest-800 bg-white">
                  <option value="">Pilih...</option>
                  {DURASI.map(d => <option key={d}>{d}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-forest-600 uppercase tracking-wider mb-1.5">Keperluan *</label>
              <textarea required value={form.keperluan} onChange={e => setForm({...form, keperluan: e.target.value})}
                placeholder="Diskusi kelompok, seminar, belajar bersama, dll."
                rows={3} className="w-full px-4 py-3 rounded-xl border border-forest-200 text-sm outline-none focus:border-forest-500 text-forest-800 resize-none" />
            </div>
            <button type="submit" disabled={loading}
              className="w-full py-3.5 rounded-2xl font-bold text-white flex items-center justify-center gap-2 transition-all hover:opacity-90 disabled:opacity-70"
              style={{ background: 'linear-gradient(135deg, #E63946, #C1121F)' }}>
              {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Memproses...</> : 'Kirim Reservasi'}
            </button>
          </form>
        </div>
      )}
    </Modal>
  )
}

// ── 3. Klub Membaca ────────────────────────────────────────────────────────
export function KlubMembacaModal({ open, onClose }) {
  const [form, setForm]       = useState({ nama:'', wa:'', kelurahan:'', usia:'', minat:[] })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const MINAT = ['Fiksi','Non-Fiksi','Sejarah','Sains','Budaya Lokal','Anak-anak','Bisnis','Teknologi']
  const toggleMinat = (m) => setForm(f => ({
    ...f, minat: f.minat.includes(m) ? f.minat.filter(x => x!==m) : [...f.minat, m]
  }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    await new Promise(r => setTimeout(r, 1500))
    setLoading(false)
    setSuccess(true)
  }

  const reset = () => { setSuccess(false); setForm({ nama:'',wa:'',kelurahan:'',usia:'',minat:[] }); onClose() }

  return (
    <Modal open={open} onClose={reset}>
      {success ? (
        <SuccessView
          title="Selamat Bergabung! 📚"
          message={`Halo ${form.nama}! Anda telah terdaftar sebagai anggota Klub Membaca PINTAR JOHOR. Info jadwal pertemuan akan dikirim ke WhatsApp ${form.wa}. Pertemuan rutin setiap Sabtu pukul 08.00 di Aula Perpustakaan.`}
          onClose={reset}
        />
      ) : (
        <div className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #FB8500, #FFB703)' }}>
              <Users className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-display font-bold text-xl text-forest-800">Klub Membaca</h3>
              <p className="text-xs text-forest-500">Pertemuan setiap Sabtu 08.00 WIB</p>
            </div>
          </div>

          {/* Info boxes */}
          <div className="grid grid-cols-3 gap-3 mb-5">
            {[
              { icon:'📅', label:'Setiap Sabtu', sub:'08.00–10.00' },
              { icon:'📍', label:'Aula Perpus', sub:'Lt. 2' },
              { icon:'🆓', label:'Gratis', sub:'Snack disediakan' },
            ].map(i => (
              <div key={i.label} className="text-center p-3 rounded-2xl bg-forest-50 border border-forest-100">
                <div className="text-xl mb-1">{i.icon}</div>
                <div className="text-xs font-bold text-forest-800">{i.label}</div>
                <div className="text-[10px] text-forest-500">{i.sub}</div>
              </div>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-forest-600 uppercase tracking-wider mb-1.5">Nama *</label>
                <input required value={form.nama} onChange={e => setForm({...form, nama: e.target.value})}
                  placeholder="Nama lengkap" className="w-full px-4 py-3 rounded-xl border border-forest-200 text-sm outline-none focus:border-forest-500 text-forest-800" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-forest-600 uppercase tracking-wider mb-1.5">WhatsApp *</label>
                <input required type="tel" value={form.wa} onChange={e => setForm({...form, wa: e.target.value})}
                  placeholder="08xx-xxxx-xxxx" className="w-full px-4 py-3 rounded-xl border border-forest-200 text-sm outline-none focus:border-forest-500 text-forest-800" />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-forest-600 uppercase tracking-wider mb-1.5">Kelurahan *</label>
                <select required value={form.kelurahan} onChange={e => setForm({...form, kelurahan: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl border border-forest-200 text-sm outline-none focus:border-forest-500 text-forest-800 bg-white">
                  <option value="">Pilih...</option>
                  {KELURAHAN.map(k => <option key={k}>{k}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-forest-600 uppercase tracking-wider mb-1.5">Usia *</label>
                <select required value={form.usia} onChange={e => setForm({...form, usia: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl border border-forest-200 text-sm outline-none focus:border-forest-500 text-forest-800 bg-white">
                  <option value="">Pilih...</option>
                  {['< 12 tahun','13–17 tahun','18–25 tahun','26–40 tahun','41–60 tahun','> 60 tahun'].map(u => <option key={u}>{u}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-forest-600 uppercase tracking-wider mb-2">Minat Baca (pilih beberapa)</label>
              <div className="flex flex-wrap gap-2">
                {MINAT.map(m => (
                  <button type="button" key={m} onClick={() => toggleMinat(m)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                      form.minat.includes(m) ? 'bg-forest-700 text-white border-forest-700' : 'text-forest-700 border-forest-200 hover:border-forest-400'
                    }`}>
                    {m}
                  </button>
                ))}
              </div>
            </div>
            <button type="submit" disabled={loading}
              className="w-full py-3.5 rounded-2xl font-bold text-forest-900 flex items-center justify-center gap-2 transition-all hover:opacity-90 disabled:opacity-70"
              style={{ background: 'linear-gradient(135deg, #E8BE5A, #D4A017)' }}>
              {loading ? <><Loader2 className="w-4 h-4 animate-spin text-forest-900" /> Mendaftar...</> : '🎉 Gabung Klub Membaca'}
            </button>
          </form>
        </div>
      )}
    </Modal>
  )
}

// ── 4. Pinjam Buku Fisik ───────────────────────────────────────────────────
export function PinjamOnlineModal({ open, onClose }) {
  const [form, setForm]       = useState({ nama:'', wa:'', noAnggota:'', judul:'', tanggal:'' })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    await new Promise(r => setTimeout(r, 1500))
    setLoading(false)
    setSuccess(true)
  }

  const reset = () => { setSuccess(false); setForm({ nama:'',wa:'',noAnggota:'',judul:'',tanggal:'' }); onClose() }

  return (
    <Modal open={open} onClose={reset}>
      {success ? (
        <SuccessView
          title="Peminjaman Diproses! 📖"
          message={`Permintaan peminjaman "${form.judul}" telah kami terima. Buku akan disiapkan pada ${form.tanggal}. Konfirmasi dan cara pengambilan dikirim ke WhatsApp ${form.wa}.`}
          onClose={reset}
        />
      ) : (
        <div className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #D4A017, #E8BE5A)' }}>
              <BookMarked className="w-5 h-5 text-forest-900" />
            </div>
            <div>
              <h3 className="font-display font-bold text-xl text-forest-800">Pinjam Buku Online</h3>
              <p className="text-xs text-forest-500">Pesan dulu, ambil tanpa antrian</p>
            </div>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-forest-600 uppercase tracking-wider mb-1.5">Nama Lengkap *</label>
              <input required value={form.nama} onChange={e => setForm({...form, nama: e.target.value})}
                placeholder="Nama sesuai kartu anggota" className="w-full px-4 py-3 rounded-xl border border-forest-200 text-sm outline-none focus:border-forest-500 text-forest-800" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-forest-600 uppercase tracking-wider mb-1.5">No. Anggota *</label>
                <input required value={form.noAnggota} onChange={e => setForm({...form, noAnggota: e.target.value})}
                  placeholder="PJ-XXXXX" className="w-full px-4 py-3 rounded-xl border border-forest-200 text-sm outline-none focus:border-forest-500 text-forest-800" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-forest-600 uppercase tracking-wider mb-1.5">WhatsApp *</label>
                <input required type="tel" value={form.wa} onChange={e => setForm({...form, wa: e.target.value})}
                  placeholder="08xx-xxxx-xxxx" className="w-full px-4 py-3 rounded-xl border border-forest-200 text-sm outline-none focus:border-forest-500 text-forest-800" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-forest-600 uppercase tracking-wider mb-1.5">Judul Buku yang Ingin Dipinjam *</label>
              <input required value={form.judul} onChange={e => setForm({...form, judul: e.target.value})}
                placeholder="Judul buku / pengarang" className="w-full px-4 py-3 rounded-xl border border-forest-200 text-sm outline-none focus:border-forest-500 text-forest-800" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-forest-600 uppercase tracking-wider mb-1.5">Tanggal Pengambilan *</label>
              <input required type="date" value={form.tanggal} onChange={e => setForm({...form, tanggal: e.target.value})}
                min={new Date().toISOString().split('T')[0]}
                className="w-full px-4 py-3 rounded-xl border border-forest-200 text-sm outline-none focus:border-forest-500 text-forest-800 bg-white" />
            </div>
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200">
              <p className="text-xs text-amber-700 leading-relaxed">
                ⚠️ Belum punya kartu anggota? <a href="#" className="font-bold underline" onClick={(e) => { e.preventDefault(); onClose() }}>Daftar gratis di sini</a> terlebih dahulu. Masa pinjam 14 hari, dapat diperpanjang 1x.
              </p>
            </div>
            <button type="submit" disabled={loading}
              className="w-full py-3.5 rounded-2xl font-bold text-forest-900 flex items-center justify-center gap-2 transition-all hover:opacity-90 disabled:opacity-70"
              style={{ background: 'linear-gradient(135deg, #E8BE5A, #D4A017)' }}>
              {loading ? <><Loader2 className="w-4 h-4 animate-spin text-forest-900" /> Memproses...</> : 'Ajukan Peminjaman'}
            </button>
          </form>
        </div>
      )}
    </Modal>
  )
}

// ── 5. Konsultasi Referensi ────────────────────────────────────────────────
export function KonsultasiModal({ open, onClose }) {
  return (
    <Modal open={open} onClose={onClose}>
      <div className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #3A86FF, #06AED5)' }}>
            <Phone className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-display font-bold text-xl text-forest-800">Konsultasi Referensi</h3>
            <p className="text-xs text-forest-500">Bantu temukan buku & sumber belajar</p>
          </div>
        </div>
        <div className="space-y-4">
          <a href="https://wa.me/6281367772047?text=Halo%20PINTAR%20JOHOR%2C%20saya%20membutuhkan%20bantuan%20konsultasi%20referensi."
            target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-4 p-4 rounded-2xl border border-green-200 bg-green-50 hover:bg-green-100 transition-colors">
            <div className="w-12 h-12 rounded-2xl bg-green-500 flex items-center justify-center flex-shrink-0">
              <svg viewBox="0 0 24 24" className="w-6 h-6 fill-white">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
              </svg>
            </div>
            <div>
              <p className="font-bold text-green-800 text-sm">Chat WhatsApp</p>
              <p className="text-green-600 text-xs">0813-6777-2047 · Respons cepat</p>
            </div>
          </a>
          <a href="tel:+6281367772047"
            className="flex items-center gap-4 p-4 rounded-2xl border border-blue-200 bg-blue-50 hover:bg-blue-100 transition-colors">
            <div className="w-12 h-12 rounded-2xl bg-blue-500 flex items-center justify-center flex-shrink-0">
              <Phone className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="font-bold text-blue-800 text-sm">Telepon Langsung</p>
              <p className="text-blue-600 text-xs">0813-6777-2047 · Sen–Sab 08–21</p>
            </div>
          </a>
          <div className="p-4 rounded-2xl bg-forest-50 border border-forest-100">
            <p className="text-xs font-bold text-forest-700 mb-2">📍 Kunjungi Langsung</p>
            <p className="text-xs text-forest-600">Jl. Karya Cipta No. 16, Kecamatan Medan Johor</p>
            <p className="text-xs text-forest-500 mt-1">Senin–Sabtu: 08.00–21.00 · Minggu: 09.00–17.00</p>
          </div>
        </div>
        <button onClick={onClose} className="w-full mt-4 py-3 rounded-2xl font-bold text-white"
          style={{ background: 'linear-gradient(135deg, #1B4332, #2D6A4F)' }}>
          Tutup
        </button>
      </div>
    </Modal>
  )
}
