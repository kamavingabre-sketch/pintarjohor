# PINTAR JOHOR
## Perpustakaan Interaktif Digital Rakyat Johor

Platform perpustakaan digital resmi **Kecamatan Medan Johor**, Kota Medan, Sumatera Utara.

---

## 🚀 Cara Deploy ke Vercel

### Metode 1: Via Vercel CLI (Direkomendasikan)

```bash
# 1. Install dependencies
npm install

# 2. Install Vercel CLI (jika belum)
npm i -g vercel

# 3. Login ke Vercel
vercel login

# 4. Deploy
vercel

# 5. Deploy ke production
vercel --prod
```

### Metode 2: Via GitHub + Vercel Dashboard

1. **Push ke GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit: PINTAR JOHOR"
   git branch -M main
   git remote add origin https://github.com/USERNAME/pintar-johor.git
   git push -u origin main
   ```

2. **Import di Vercel:**
   - Buka [vercel.com/new](https://vercel.com/new)
   - Pilih repository `pintar-johor`
   - Framework: **Next.js** (auto-detect)
   - Klik **Deploy**

---

## 🛠 Development Lokal

```bash
# Install dependencies
npm install

# Jalankan dev server
npm run dev

# Build production
npm run build
npm start
```

Buka [http://localhost:3000](http://localhost:3000) di browser.

---

## 📂 Struktur Proyek

```
pintar-johor/
├── app/
│   ├── components/
│   │   ├── Navbar.js          # Header & navigasi
│   │   ├── Hero.js            # Halaman utama / hero
│   │   ├── Categories.js      # Kategori koleksi (8 kategori)
│   │   ├── FeaturedBooks.js   # Koleksi buku unggulan carousel
│   │   ├── Services.js        # Layanan digital
│   │   ├── News.js            # Berita & pengumuman
│   │   ├── About.js           # Tentang + form registrasi
│   │   └── Footer.js          # Footer lengkap
│   ├── globals.css            # Global styles & design tokens
│   ├── layout.js              # Root layout + metadata SEO
│   └── page.js                # Main page
├── public/                    # Aset statis
├── next.config.js
├── tailwind.config.js
├── vercel.json
└── package.json
```

---

## ✨ Fitur

- **Hero Section** — Animated rotating words, floating book 3D, search bar, stats
- **8 Kategori Koleksi** — E-Book, Jurnal, Artikel, Video, Audiobook, dst.
- **Carousel Buku Unggulan** — 6 buku pilihan dengan rating, like, dan info lengkap
- **Layanan Digital** — 6 layanan dengan animasi hover
- **Berita & Pengumuman** — Featured news + list + newsletter signup
- **Tentang & Registrasi** — Animasi count-up stats + form pendaftaran
- **Footer Lengkap** — Link navigasi, sosial media, info pemerintah
- **Fully Responsive** — Mobile, tablet, desktop
- **SEO Optimized** — Meta tags, Open Graph

---

## 🎨 Design System

- **Palet Warna:** Hijau hutan (#1B4332) + Krem perkamen (#F4ECD8) + Emas (#D4A017)
- **Tipografi:** Playfair Display (display) + DM Sans (body)
- **Animasi:** CSS keyframes + Intersection Observer reveals

---

## 📍 Informasi

**Kecamatan Medan Johor**  
Jl. Karya Jaya No. 7, Kota Medan  
Sumatera Utara, Indonesia

---

*#MEDANUNTUKSEMUA #AWAKANAKJOHOR*
