import './globals.css'

export const metadata = {
  title: 'PINTAR JOHOR — Perpustakaan Interaktif Digital Rakyat Johor',
  description:
    'Platform perpustakaan digital untuk warga Kecamatan Medan Johor. Akses ribuan koleksi buku, artikel, jurnal, dan konten edukatif secara gratis.',
  keywords: 'perpustakaan digital, Medan Johor, PINTAR JOHOR, e-book, edukasi, Kecamatan Medan Johor',
  openGraph: {
    title: 'PINTAR JOHOR — Perpustakaan Interaktif Digital Rakyat Johor',
    description: 'Platform perpustakaan digital untuk warga Kecamatan Medan Johor.',
    type: 'website',
    locale: 'id_ID',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="id" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <meta name="theme-color" content="#1B4332" />
        <link
          rel="preconnect"
          href="https://fonts.googleapis.com"
        />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
      </head>
      <body className="font-body antialiased">
        {children}
      </body>
    </html>
  )
}
