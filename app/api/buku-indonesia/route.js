// app/api/buku-indonesia/route.js
// Koleksi buku gratis Bahasa Indonesia dari berbagai sumber publik

export const dynamic   = 'force-dynamic'
export const revalidate = 3600

const CURATED_BOOKS = [
  // ════════════════════════════════════════════════════════
  // NOVEL KLASIK ANGKATAN BALAI PUSTAKA (1920–1940)
  // ════════════════════════════════════════════════════════
  {
    id: 'bp-001', title: 'Siti Nurbaya: Kasih Tak Sampai', author: 'Marah Rusli', year: 1922,
    category: 'Novel Klasik', emoji: '💔', color: '#9B2226',
    coverColor: 'linear-gradient(135deg, #9B2226, #C1121F)',
    desc: 'Novel paling populer sastra Indonesia, kisah cinta Samsulbahri dan Siti Nurbaya yang dipisahkan adat dan kekuasaan Datuk Meringgih.',
    format: 'PDF', downloadUrl: 'https://archive.org/download/siti-nurbaya-marah-rusli/siti-nurbaya.pdf',
  },
  {
    id: 'bp-002', title: 'Azab dan Sengsara', author: 'Merari Siregar', year: 1920,
    category: 'Novel Klasik', emoji: '😢', color: '#6B4226',
    coverColor: 'linear-gradient(135deg, #6B4226, #8B5E3C)',
    desc: 'Novel pertama berbahasa Indonesia, mengisahkan nasib Mariamin yang dipaksa kawin dengan lelaki pilihan orang tua.',
    format: 'PDF', downloadUrl: 'https://archive.org/download/azab-dan-sengsara/azab-dan-sengsara.pdf',
  },
  {
    id: 'bp-003', title: 'Sengsara Membawa Nikmat', author: 'Tulis Sutan Sati', year: 1929,
    category: 'Novel Klasik', emoji: '🌄', color: '#2D6A4F',
    coverColor: 'linear-gradient(135deg, #2D6A4F, #40916C)',
    desc: 'Kisah Midun, pemuda Minangkabau yang sabar menghadapi penderitaan hingga meraih kebahagiaan.',
    format: 'PDF', downloadUrl: 'https://archive.org/download/sengsaramembawan00sati/sengsaramembawan00sati.pdf',
  },
  {
    id: 'bp-004', title: 'Salah Asuhan', author: 'Abdoel Moeis', year: 1928,
    category: 'Novel Klasik', emoji: '🎭', color: '#3A0CA3',
    coverColor: 'linear-gradient(135deg, #3A0CA3, #4361EE)',
    desc: 'Hanafi, pemuda Minangkabau terdidik barat yang meninggalkan adat dan agama, kisah tragis akibat salah didikan.',
    format: 'PDF', downloadUrl: 'https://archive.org/download/salah-asuhan/salah-asuhan.pdf',
  },
  {
    id: 'bp-005', title: 'Layar Terkembang', author: 'Sutan Takdir Alisjahbana', year: 1936,
    category: 'Novel Klasik', emoji: '⛵', color: '#3A86FF',
    coverColor: 'linear-gradient(135deg, #3A86FF, #06AED5)',
    desc: 'Novel tentang emansipasi wanita, perjuangan Tuti dan Maria dalam menghadapi tradisi dan modernitas.',
    format: 'PDF', downloadUrl: 'https://archive.org/download/layar-terkembang/layar-terkembang.pdf',
  },
  {
    id: 'bp-006', title: 'Kalau Tak Untung', author: 'Selasih', year: 1933,
    category: 'Novel Klasik', emoji: '🌸', color: '#B5179E',
    coverColor: 'linear-gradient(135deg, #B5179E, #7B2D8B)',
    desc: 'Novel karya pengarang wanita pertama Indonesia, kisah Rahmah dan perjuangannya melawan nasib.',
    format: 'PDF', downloadUrl: 'https://archive.org/download/kalau-tak-untung/kalau-tak-untung.pdf',
  },
  {
    id: 'bp-007', title: 'Kehilangan Mestika', author: 'Hamidah', year: 1935,
    category: 'Novel Klasik', emoji: '💎', color: '#4A4E69',
    coverColor: 'linear-gradient(135deg, #4A4E69, #6D6875)',
    desc: 'Novel tentang seorang perempuan yang mencari jati dirinya di tengah perubahan zaman.',
    format: 'PDF', downloadUrl: 'https://archive.org/download/kehilangan-mestika/kehilangan-mestika.pdf',
  },
  {
    id: 'bp-008', title: 'Darah Muda', author: 'Adinegoro', year: 1927,
    category: 'Novel Klasik', emoji: '🔥', color: '#E63946',
    coverColor: 'linear-gradient(135deg, #E63946, #C1121F)',
    desc: 'Kisah pemuda Indonesia yang berjuang antara cinta, idealisme, dan tuntutan tradisi.',
    format: 'PDF', downloadUrl: 'https://archive.org/download/darah-muda/darah-muda.pdf',
  },

  // ════════════════════════════════════════════════════════
  // HAMKA — KARYA LENGKAP
  // ════════════════════════════════════════════════════════
  {
    id: 'hm-001', title: 'Di Bawah Lindungan Ka\'bah', author: 'Hamka', year: 1938,
    category: 'Novel Religi', emoji: '🕌', color: '#D4A017',
    coverColor: 'linear-gradient(135deg, #D4A017, #B8891A)',
    desc: 'Kisah cinta Hamid dan Zainab yang kandas, perjalanan spiritual di tanah suci Mekkah.',
    format: 'PDF', downloadUrl: 'https://archive.org/download/di-bawah-lindungan-kabah/di-bawah-lindungan-kabah.pdf',
  },
  {
    id: 'hm-002', title: 'Tenggelamnya Kapal Van Der Wijck', author: 'Hamka', year: 1939,
    category: 'Novel Klasik', emoji: '🚢', color: '#264653',
    coverColor: 'linear-gradient(135deg, #264653, #2A9D8F)',
    desc: 'Kisah cinta tragis Zainuddin dan Hayati yang dipisahkan oleh perbedaan suku dan adat.',
    format: 'PDF', downloadUrl: 'https://archive.org/download/tenggelamnya-kapal/tenggelamnya-kapal-van-der-wijck.pdf',
  },
  {
    id: 'hm-003', title: 'Merantau ke Deli', author: 'Hamka', year: 1940,
    category: 'Novel Klasik', emoji: '🌴', color: '#40916C',
    coverColor: 'linear-gradient(135deg, #40916C, #52B788)',
    desc: 'Kisah Leman yang merantau ke Deli (Sumatera Timur) mengikuti program transmigrasi kolonial.',
    format: 'PDF', downloadUrl: 'https://archive.org/download/merantau-ke-deli-hamka/merantau-ke-deli.pdf',
  },
  {
    id: 'hm-004', title: 'Tuan Direktur', author: 'Hamka', year: 1950,
    category: 'Novel Modern', emoji: '🏢', color: '#1B4332',
    coverColor: 'linear-gradient(135deg, #1B4332, #2D6A4F)',
    desc: 'Novel tentang kehidupan seorang direktur perusahaan yang kaya raya namun kehilangan nilai kemanusiaan.',
    format: 'PDF', downloadUrl: 'https://archive.org/download/tuan-direktur-hamka/tuan-direktur.pdf',
  },
  {
    id: 'hm-005', title: 'Falsafah Hidup', author: 'Hamka', year: 1950,
    category: 'Filsafat & Agama', emoji: '📿', color: '#9D4EDD',
    coverColor: 'linear-gradient(135deg, #9D4EDD, #7B2D8B)',
    desc: 'Karya non-fiksi HAMKA tentang filsafat kehidupan berdasarkan ajaran Islam.',
    format: 'PDF', downloadUrl: 'https://archive.org/download/falsafah-hidup-hamka/falsafah-hidup.pdf',
  },

  // ════════════════════════════════════════════════════════
  // PRAMOEDYA ANANTA TOER
  // ════════════════════════════════════════════════════════
  {
    id: 'pra-001', title: 'Bumi Manusia', author: 'Pramoedya Ananta Toer', year: 1980,
    category: 'Novel Sejarah', emoji: '🌍', color: '#800000',
    coverColor: 'linear-gradient(135deg, #800000, #9B2226)',
    desc: 'Tetralogi Buru buku pertama — kisah Minke, pribumi terdidik yang melawan kolonialisme Belanda.',
    format: 'PDF', downloadUrl: 'https://archive.org/download/bumi-manusia-pramoedya/bumi-manusia.pdf',
  },
  {
    id: 'pra-002', title: 'Anak Semua Bangsa', author: 'Pramoedya Ananta Toer', year: 1981,
    category: 'Novel Sejarah', emoji: '🌏', color: '#9B2226',
    coverColor: 'linear-gradient(135deg, #9B2226, #C1121F)',
    desc: 'Tetralogi Buru buku kedua — Minke mengenal dunia lebih luas dan mulai terlibat pergerakan.',
    format: 'PDF', downloadUrl: 'https://archive.org/download/anak-semua-bangsa/anak-semua-bangsa.pdf',
  },
  {
    id: 'pra-003', title: 'Jejak Langkah', author: 'Pramoedya Ananta Toer', year: 1985,
    category: 'Novel Sejarah', emoji: '👣', color: '#6B4226',
    coverColor: 'linear-gradient(135deg, #6B4226, #8B5E3C)',
    desc: 'Tetralogi Buru buku ketiga — Minke mendirikan organisasi pergerakan nasional pertama.',
    format: 'PDF', downloadUrl: 'https://archive.org/download/jejak-langkah-pramoedya/jejak-langkah.pdf',
  },
  {
    id: 'pra-004', title: 'Rumah Kaca', author: 'Pramoedya Ananta Toer', year: 1988,
    category: 'Novel Sejarah', emoji: '🔍', color: '#264653',
    coverColor: 'linear-gradient(135deg, #264653, #2A9D8F)',
    desc: 'Tetralogi Buru buku keempat — kisah dari sudut pandang Panoptes, polisi rahasia Belanda.',
    format: 'PDF', downloadUrl: 'https://archive.org/download/rumah-kaca-pramoedya/rumah-kaca.pdf',
  },
  {
    id: 'pra-005', title: 'Keluarga Gerilya', author: 'Pramoedya Ananta Toer', year: 1950,
    category: 'Novel Sejarah', emoji: '⚔️', color: '#495057',
    coverColor: 'linear-gradient(135deg, #495057, #6C757D)',
    desc: 'Kisah tragis sebuah keluarga yang terpecah oleh perang kemerdekaan Indonesia.',
    format: 'PDF', downloadUrl: 'https://archive.org/download/keluarga-gerilya/keluarga-gerilya.pdf',
  },

  // ════════════════════════════════════════════════════════
  // ANGKATAN 45 & 66
  // ════════════════════════════════════════════════════════
  {
    id: 'a45-001', title: 'Atheis', author: 'Achdiat K. Mihardja', year: 1949,
    category: 'Novel Klasik', emoji: '🔭', color: '#4A4E69',
    coverColor: 'linear-gradient(135deg, #4A4E69, #6D6875)',
    desc: 'Benturan nilai tradisional, agama, dan paham modern lewat persahabatan Hasan dan Rusli.',
    format: 'PDF', downloadUrl: 'https://archive.org/download/atheis-achdiat/atheis.pdf',
  },
  {
    id: 'a45-002', title: 'Harimau! Harimau!', author: 'Mochtar Lubis', year: 1975,
    category: 'Novel Petualangan', emoji: '🐯', color: '#E76F51',
    coverColor: 'linear-gradient(135deg, #E76F51, #F4A261)',
    desc: 'Tujuh pencari damar di hutan Sumatera dikejar harimau — alegori tentang ketakutan dan kemanusiaan.',
    format: 'PDF', downloadUrl: 'https://archive.org/download/harimau-harimau-mochtar-lubis/harimau-harimau.pdf',
  },
  {
    id: 'a45-003', title: 'Senja di Jakarta', author: 'Mochtar Lubis', year: 1970,
    category: 'Novel Modern', emoji: '🌆', color: '#FB8500',
    coverColor: 'linear-gradient(135deg, #FB8500, #FFB703)',
    desc: 'Novel tentang korupsi, kemiskinan, dan kemerosotan moral di Jakarta pasca-kemerdekaan.',
    format: 'PDF', downloadUrl: 'https://archive.org/download/senja-di-jakarta/senja-di-jakarta.pdf',
  },
  {
    id: 'a45-004', title: 'Robohnya Surau Kami', author: 'A.A. Navis', year: 1956,
    category: 'Cerita Pendek', emoji: '🕌', color: '#40916C',
    coverColor: 'linear-gradient(135deg, #40916C, #52B788)',
    desc: 'Kumpulan cerpen terbaik A.A. Navis — satire sosial kehidupan di Minangkabau.',
    format: 'PDF', downloadUrl: 'https://archive.org/download/robohnya-surau-kami/robohnya-surau-kami.pdf',
  },
  {
    id: 'a45-005', title: 'Jalan Tak Ada Ujung', author: 'Mochtar Lubis', year: 1952,
    category: 'Novel Sejarah', emoji: '🛤️', color: '#495057',
    coverColor: 'linear-gradient(135deg, #495057, #6C757D)',
    desc: 'Kisah perjuangan kemerdekaan Indonesia melalui pengalaman Guru Isa yang pengecut namun terpaksa berjuang.',
    format: 'PDF', downloadUrl: 'https://archive.org/download/jalan-tak-ada-ujung/jalan-tak-ada-ujung.pdf',
  },
  {
    id: 'a45-006', title: 'Hujan Kepagian', author: 'Nugroho Notosusanto', year: 1958,
    category: 'Cerita Pendek', emoji: '🌧️', color: '#3A86FF',
    coverColor: 'linear-gradient(135deg, #3A86FF, #06AED5)',
    desc: 'Kumpulan cerpen tentang perang kemerdekaan dari sudut pandang pejuang muda.',
    format: 'PDF', downloadUrl: 'https://archive.org/download/hujan-kepagian/hujan-kepagian.pdf',
  },
  {
    id: 'a45-007', title: 'Ziarah', author: 'Iwan Simatupang', year: 1969,
    category: 'Novel Modern', emoji: '🪦', color: '#4A4E69',
    coverColor: 'linear-gradient(135deg, #4A4E69, #6B6F8C)',
    desc: 'Novel eksistensialis Indonesia yang paling kontroversial, kisah seorang yang merenungi kematian.',
    format: 'PDF', downloadUrl: 'https://archive.org/download/ziarah-iwan-simatupang/ziarah.pdf',
  },
  {
    id: 'a45-008', title: 'Kemarau', author: 'A.A. Navis', year: 1967,
    category: 'Novel Modern', emoji: '☀️', color: '#FFB703',
    coverColor: 'linear-gradient(135deg, #FB8500, #FFB703)',
    desc: 'Kisah Sutan Duano yang berjuang melawan kemarau panjang sendirian sementara warga desa menyerah.',
    format: 'PDF', downloadUrl: 'https://archive.org/download/kemarau-aa-navis/kemarau.pdf',
  },

  // ════════════════════════════════════════════════════════
  // NOVEL MODERN & KONTEMPORER
  // ════════════════════════════════════════════════════════
  {
    id: 'mod-001', title: 'Laskar Pelangi', author: 'Andrea Hirata', year: 2005,
    category: 'Novel Modern', emoji: '🌈', color: '#3A86FF',
    coverColor: 'linear-gradient(135deg, #3A86FF, #4CC9F0)',
    desc: 'Kisah inspiratif 10 anak Belitung berjuang mendapat pendidikan dalam keterbatasan — novel terlaris Indonesia.',
    format: 'PDF', downloadUrl: 'https://archive.org/download/laskar-pelangi-andrea-hirata/laskar-pelangi.pdf',
  },
  {
    id: 'mod-002', title: 'Sang Pemimpi', author: 'Andrea Hirata', year: 2006,
    category: 'Novel Modern', emoji: '💭', color: '#06AED5',
    coverColor: 'linear-gradient(135deg, #06AED5, #0096C7)',
    desc: 'Sekuel Laskar Pelangi — Ikal dan Arai bermimpi merantau ke Paris, belajar tentang tekad dan persahabatan.',
    format: 'PDF', downloadUrl: 'https://archive.org/download/sang-pemimpi-andrea-hirata/sang-pemimpi.pdf',
  },
  {
    id: 'mod-003', title: 'Edensor', author: 'Andrea Hirata', year: 2007,
    category: 'Novel Modern', emoji: '🏔️', color: '#2D6A4F',
    coverColor: 'linear-gradient(135deg, #2D6A4F, #40916C)',
    desc: 'Ikal dan Arai akhirnya berkuliah di Sorbonne, Paris — petualangan mengitari Eropa demi menemukan jati diri.',
    format: 'PDF', downloadUrl: 'https://archive.org/download/edensor-andrea-hirata/edensor.pdf',
  },
  {
    id: 'mod-004', title: 'Negeri 5 Menara', author: 'Ahmad Fuadi', year: 2009,
    category: 'Novel Modern', emoji: '🕌', color: '#9B2226',
    coverColor: 'linear-gradient(135deg, #9B2226, #C1121F)',
    desc: 'Alif dan sahabatnya di pesantren Gontor bermimpi menggapai dunia dengan "man jadda wajada".',
    format: 'PDF', downloadUrl: 'https://archive.org/download/negeri-5-menara/negeri-5-menara.pdf',
  },
  {
    id: 'mod-005', title: 'Ranah 3 Warna', author: 'Ahmad Fuadi', year: 2011,
    category: 'Novel Modern', emoji: '🌏', color: '#D4A017',
    coverColor: 'linear-gradient(135deg, #D4A017, #B8891A)',
    desc: 'Sekuel Negeri 5 Menara — Alif kuliah di Bandung dan berjuang meraih beasiswa ke luar negeri.',
    format: 'PDF', downloadUrl: 'https://archive.org/download/ranah-3-warna/ranah-3-warna.pdf',
  },
  {
    id: 'mod-006', title: 'Pulang', author: 'Leila S. Chudori', year: 2012,
    category: 'Novel Modern', emoji: '🏠', color: '#E63946',
    coverColor: 'linear-gradient(135deg, #E63946, #9B2226)',
    desc: 'Saga keluarga Indonesia di antara tragedi 1965 dan 1998 — tentang identitas, pengasingan, dan rindu tanah air.',
    format: 'PDF', downloadUrl: 'https://archive.org/download/pulang-leila-chudori/pulang.pdf',
  },
  {
    id: 'mod-007', title: 'Cantik Itu Luka', author: 'Eka Kurniawan', year: 2002,
    category: 'Novel Modern', emoji: '💄', color: '#7B2D8B',
    coverColor: 'linear-gradient(135deg, #7B2D8B, #B5179E)',
    desc: 'Saga keluarga berlatar sejarah Indonesia — perempuan cantik, perselingkuhan, dan luka yang melampaui generasi.',
    format: 'PDF', downloadUrl: 'https://archive.org/download/cantik-itu-luka/cantik-itu-luka.pdf',
  },
  {
    id: 'mod-008', title: 'Lelaki Harimau', author: 'Eka Kurniawan', year: 2004,
    category: 'Novel Modern', emoji: '🐯', color: '#E76F51',
    coverColor: 'linear-gradient(135deg, #E76F51, #F4A261)',
    desc: 'Kisah mistis tentang seorang anak yang mampu berubah menjadi harimau untuk membalas dendam ayahnya.',
    format: 'PDF', downloadUrl: 'https://archive.org/download/lelaki-harimau/lelaki-harimau.pdf',
  },
  {
    id: 'mod-009', title: 'Keluarga Permana', author: 'Ramadhan K.H.', year: 1978,
    category: 'Novel Modern', emoji: '👨‍👩‍👧‍👦', color: '#FB8500',
    coverColor: 'linear-gradient(135deg, #FB8500, #FFB703)',
    desc: 'Konflik keluarga modern Indonesia yang mencerminkan perubahan sosial pasca-kemerdekaan.',
    format: 'PDF', downloadUrl: 'https://archive.org/download/keluarga-permana/keluarga-permana.pdf',
  },
  {
    id: 'mod-010', title: 'Para Priyayi', author: 'Umar Kayam', year: 1992,
    category: 'Novel Sejarah', emoji: '👒', color: '#6B4226',
    coverColor: 'linear-gradient(135deg, #6B4226, #8B5E3C)',
    desc: 'Kronik keluarga Jawa priyayi melewati pergantian zaman dari kolonial hingga kemerdekaan.',
    format: 'PDF', downloadUrl: 'https://archive.org/download/para-priyayi/para-priyayi.pdf',
  },
  {
    id: 'mod-011', title: 'Ronggeng Dukuh Paruk', author: 'Ahmad Tohari', year: 1982,
    category: 'Novel Sejarah', emoji: '💃', color: '#9D4EDD',
    coverColor: 'linear-gradient(135deg, #9D4EDD, #7B2D8B)',
    desc: 'Kisah Srintil, ronggeng (penari sakral) di desa terpencil yang terjebak tragedi 1965.',
    format: 'PDF', downloadUrl: 'https://archive.org/download/ronggeng-dukuh-paruk/ronggeng-dukuh-paruk.pdf',
  },
  {
    id: 'mod-012', title: 'Belenggu', author: 'Armijn Pane', year: 1940,
    category: 'Novel Klasik', emoji: '⛓️', color: '#4A4E69',
    coverColor: 'linear-gradient(135deg, #4A4E69, #6D6875)',
    desc: 'Novel pertama bercorak psikologi di Indonesia — kisah cinta segitiga dokter Sukartono, Tini, dan Eni.',
    format: 'PDF', downloadUrl: 'https://archive.org/download/belenggu-armijn-pane/belenggu.pdf',
  },
  {
    id: 'mod-013', title: 'Max Havelaar', author: 'Multatuli (terj. Indonesia)', year: 1860,
    category: 'Novel Sejarah', emoji: '⚖️', color: '#264653',
    coverColor: 'linear-gradient(135deg, #264653, #2A9D8F)',
    desc: 'Kritik keras terhadap sistem tanam paksa kolonial Belanda di Jawa — karya yang mengguncang Eropa.',
    format: 'PDF', downloadUrl: 'https://archive.org/download/max-havelaar-indonesia/max-havelaar-indo.pdf',
  },
  {
    id: 'mod-014', title: 'Burung-Burung Manyar', author: 'Y.B. Mangunwijaya', year: 1981,
    category: 'Novel Sejarah', emoji: '🐦', color: '#2D6A4F',
    coverColor: 'linear-gradient(135deg, #2D6A4F, #40916C)',
    desc: 'Novel berlatar revolusi kemerdekaan Indonesia, dilema seorang Indo-Belanda antara dua identitas.',
    format: 'PDF', downloadUrl: 'https://archive.org/download/burung-burung-manyar/burung-burung-manyar.pdf',
  },
  {
    id: 'mod-015', title: 'Telegram', author: 'Putu Wijaya', year: 1973,
    category: 'Novel Modern', emoji: '📨', color: '#E63946',
    coverColor: 'linear-gradient(135deg, #E63946, #C1121F)',
    desc: 'Novel absurdis Indonesia, kisah orang-orang yang menunggu telegram yang tidak pernah datang.',
    format: 'PDF', downloadUrl: 'https://archive.org/download/telegram-putu-wijaya/telegram.pdf',
  },
  {
    id: 'mod-016', title: 'Cala Ibi', author: 'Nukila Amal', year: 2003,
    category: 'Novel Modern', emoji: '🌊', color: '#0096C7',
    coverColor: 'linear-gradient(135deg, #0096C7, #023E8A)',
    desc: 'Novel eksperimental tentang perempuan dari Maluku Utara yang mencari identitas antara dua dunia.',
    format: 'PDF', downloadUrl: 'https://archive.org/download/cala-ibi-nukila/cala-ibi.pdf',
  },
  {
    id: 'mod-017', title: 'Supernova: Ksatria, Puteri, dan Bintang Jatuh', author: 'Dee Lestari', year: 2001,
    category: 'Novel Modern', emoji: '⭐', color: '#3A0CA3',
    coverColor: 'linear-gradient(135deg, #3A0CA3, #4361EE)',
    desc: 'Novel fiksi ilmiah pertama Indonesia yang memadukan sains, filsafat, dan roman.',
    format: 'PDF', downloadUrl: 'https://archive.org/download/supernova-dee-lestari/supernova-1.pdf',
  },

  // ════════════════════════════════════════════════════════
  // PUISI & SASTRA
  // ════════════════════════════════════════════════════════
  {
    id: 'pui-001', title: 'Aku Ini Binatang Jalang: Kumpulan Puisi', author: 'Chairil Anwar', year: 1949,
    category: 'Puisi', emoji: '✍️', color: '#B5179E',
    coverColor: 'linear-gradient(135deg, #B5179E, #7B2D8B)',
    desc: 'Kumpulan puisi terbaik Chairil Anwar — "Si Binatang Jalang" yang mendobrak sastra Indonesia.',
    format: 'PDF', downloadUrl: 'https://archive.org/download/aku-ini-binatang-jalang/chairil-anwar-puisi.pdf',
  },
  {
    id: 'pui-002', title: 'Tirani dan Benteng', author: 'Taufiq Ismail', year: 1966,
    category: 'Puisi', emoji: '🗡️', color: '#E63946',
    coverColor: 'linear-gradient(135deg, #E63946, #9B2226)',
    desc: 'Puisi-puisi perlawanan terhadap tirani dan kezaliman, karya terkuat Taufiq Ismail.',
    format: 'PDF', downloadUrl: 'https://archive.org/download/tirani-dan-benteng/tirani-dan-benteng.pdf',
  },
  {
    id: 'pui-003', title: 'Ballada Orang-Orang Tercinta', author: 'W.S. Rendra', year: 1957,
    category: 'Puisi', emoji: '🎭', color: '#FB8500',
    coverColor: 'linear-gradient(135deg, #FB8500, #FFB703)',
    desc: 'Kumpulan puisi pertama W.S. Rendra yang memperkenalkan gaya balada lirik dalam sastra Indonesia.',
    format: 'PDF', downloadUrl: 'https://archive.org/download/ballada-orang-tercinta/ws-rendra-ballada.pdf',
  },
  {
    id: 'pui-004', title: 'Blues untuk Bonnie', author: 'W.S. Rendra', year: 1971,
    category: 'Puisi', emoji: '🎸', color: '#264653',
    coverColor: 'linear-gradient(135deg, #264653, #2A9D8F)',
    desc: 'Puisi-puisi W.S. Rendra dengan pengaruh blues Amerika yang kental, protes sosial yang kuat.',
    format: 'PDF', downloadUrl: 'https://archive.org/download/blues-untuk-bonnie/blues-untuk-bonnie.pdf',
  },
  {
    id: 'pui-005', title: 'Horison Sastra Indonesia', author: 'Berbagai Pengarang', year: 2002,
    category: 'Antologi', emoji: '📔', color: '#9D4EDD',
    coverColor: 'linear-gradient(135deg, #9D4EDD, #4361EE)',
    desc: 'Antologi komprehensif sastra Indonesia terbaik dari berbagai era dan genre.',
    format: 'PDF', downloadUrl: 'https://archive.org/download/horison-sastra-indonesia/horison-sastra.pdf',
  },

  // ════════════════════════════════════════════════════════
  // CERITA RAKYAT & FOLKLOR
  // ════════════════════════════════════════════════════════
  {
    id: 'folk-001', title: 'Kumpulan Cerita Rakyat Nusantara', author: 'Berbagai Daerah', year: 2010,
    category: 'Cerita Rakyat', emoji: '🏺', color: '#E76F51',
    coverColor: 'linear-gradient(135deg, #E76F51, #F4A261)',
    desc: '100 cerita rakyat dari 34 provinsi di Indonesia — legenda, mitos, dan dongeng tradisional.',
    format: 'PDF', downloadUrl: 'https://archive.org/download/cerita-rakyat-nusantara/cerita-rakyat-nusantara.pdf',
  },
  {
    id: 'folk-002', title: 'Malin Kundang dan Cerita Rakyat Sumatera', author: 'Cerita Rakyat', year: 2008,
    category: 'Cerita Rakyat', emoji: '⛵', color: '#0096C7',
    coverColor: 'linear-gradient(135deg, #0096C7, #023E8A)',
    desc: 'Kumpulan cerita rakyat dari Sumatera termasuk Malin Kundang, Bawang Merah Bawang Putih, dll.',
    format: 'PDF', downloadUrl: 'https://archive.org/download/malin-kundang-cerita-rakyat/cerita-rakyat-sumatera.pdf',
  },
  {
    id: 'folk-003', title: 'Si Kancil dan Fabel Nusantara', author: 'Folklor Indonesia', year: 2010,
    category: 'Cerita Anak', emoji: '🦌', color: '#40916C',
    coverColor: 'linear-gradient(135deg, #40916C, #52B788)',
    desc: 'Kisah si Kancil yang cerdik dan kumpulan fabel binatang dari seluruh Nusantara untuk anak-anak.',
    format: 'PDF', downloadUrl: 'https://archive.org/download/si-kancil-fabel/si-kancil-fabel-nusantara.pdf',
  },
  {
    id: 'folk-004', title: 'Hang Tuah', author: 'Cerita Melayu Klasik', year: 2005,
    category: 'Sastra Melayu', emoji: '⚔️', color: '#D4A017',
    coverColor: 'linear-gradient(135deg, #D4A017, #B8891A)',
    desc: 'Hikayat pahlawan Melayu legendaris Hang Tuah dan persahabatannya dengan Hang Jebat.',
    format: 'PDF', downloadUrl: 'https://archive.org/download/hikayat-hang-tuah/hikayat-hang-tuah.pdf',
  },
  {
    id: 'folk-005', title: 'Cerita-Cerita dari Tanah Batak', author: 'T.M. Sihombing', year: 1986,
    category: 'Cerita Rakyat', emoji: '🏔️', color: '#9B2226',
    coverColor: 'linear-gradient(135deg, #9B2226, #C1121F)',
    desc: 'Kumpulan legenda, mitos, dan cerita rakyat suku Batak dari Sumatera Utara.',
    format: 'PDF', downloadUrl: 'https://archive.org/download/cerita-tanah-batak/cerita-tanah-batak.pdf',
  },

  // ════════════════════════════════════════════════════════
  // SEJARAH & NON-FIKSI INDONESIA
  // ════════════════════════════════════════════════════════
  {
    id: 'sej-001', title: 'Indonesia dalam Arus Sejarah Jilid 1', author: 'Kemendikbud', year: 2013,
    category: 'Sejarah', emoji: '📜', color: '#6B4226',
    coverColor: 'linear-gradient(135deg, #6B4226, #8B5E3C)',
    desc: 'Sejarah Indonesia dari masa prasejarah hingga kerajaan Hindu-Buddha — ensiklopedia resmi pemerintah.',
    format: 'PDF', downloadUrl: 'https://archive.org/download/indonesia-arus-sejarah-1/indonesia-arus-sejarah-1.pdf',
  },
  {
    id: 'sej-002', title: 'Sejarah Pergerakan Nasional Indonesia', author: 'Sartono Kartodirdjo', year: 1992,
    category: 'Sejarah', emoji: '🇮🇩', color: '#E63946',
    coverColor: 'linear-gradient(135deg, #E63946, #9B2226)',
    desc: 'Analisis mendalam tentang gerakan nasionalisme Indonesia dari Budi Utomo hingga Proklamasi 1945.',
    format: 'PDF', downloadUrl: 'https://archive.org/download/sejarah-pergerakan-nasional/sejarah-pergerakan-nasional.pdf',
  },
  {
    id: 'sej-003', title: 'Di Bawah Bendera Revolusi', author: 'Ir. Soekarno', year: 1964,
    category: 'Sejarah', emoji: '✊', color: '#E63946',
    coverColor: 'linear-gradient(135deg, #9B2226, #E63946)',
    desc: 'Kumpulan pidato dan tulisan Proklamator Indonesia — pemikiran Bung Karno tentang revolusi dan bangsa.',
    format: 'PDF', downloadUrl: 'https://archive.org/download/di-bawah-bendera-revolusi/di-bawah-bendera-revolusi.pdf',
  },
  {
    id: 'sej-004', title: 'Indonesia Merdeka', author: 'Hatta', year: 1932,
    category: 'Sejarah', emoji: '🦅', color: '#D4A017',
    coverColor: 'linear-gradient(135deg, #D4A017, #B8891A)',
    desc: 'Pemikiran Mohammad Hatta tentang kemerdekaan Indonesia dan visi negara merdeka.',
    format: 'PDF', downloadUrl: 'https://archive.org/download/indonesia-merdeka-hatta/indonesia-merdeka.pdf',
  },
  {
    id: 'sej-005', title: 'Dari Rimba ke Medan Laga', author: 'Jenderal AH Nasution', year: 1956,
    category: 'Sejarah', emoji: '⚔️', color: '#495057',
    coverColor: 'linear-gradient(135deg, #495057, #6C757D)',
    desc: 'Memoar perjuangan militer Indonesia dalam revolusi kemerdekaan 1945-1949.',
    format: 'PDF', downloadUrl: 'https://archive.org/download/dari-rimba-ke-medan/dari-rimba-ke-medan-laga.pdf',
  },
  {
    id: 'sej-006', title: 'Sejarah Kebudayaan Islam Indonesia', author: 'Kemendikbud', year: 2015,
    category: 'Sejarah', emoji: '🕌', color: '#1B4332',
    coverColor: 'linear-gradient(135deg, #1B4332, #2D6A4F)',
    desc: 'Perjalanan panjang Islam di Nusantara dari abad ke-7 hingga era modern.',
    format: 'PDF', downloadUrl: 'https://archive.org/download/sejarah-kebudayaan-islam/sejarah-kebudayaan-islam-indonesia.pdf',
  },

  // ════════════════════════════════════════════════════════
  // BUKU PELAJARAN (BSE KEMDIKBUD)
  // ════════════════════════════════════════════════════════
  {
    id: 'bse-001', title: 'Bahasa Indonesia Kelas VII SMP', author: 'Kemdikbud', year: 2023,
    category: 'Buku Pelajaran', emoji: '📗', color: '#1B4332', isBSE: true,
    coverColor: 'linear-gradient(135deg, #1B4332, #2D6A4F)',
    desc: 'Buku teks Bahasa Indonesia untuk SMP/MTs kelas VII — Kurikulum Merdeka 2023.',
    format: 'PDF', downloadUrl: 'https://buku.kemdikbud.go.id/download/Bahasa%20Indonesia%20Kelas%207.pdf',
  },
  {
    id: 'bse-002', title: 'Bahasa Indonesia Kelas X SMA', author: 'Kemdikbud', year: 2023,
    category: 'Buku Pelajaran', emoji: '📗', color: '#1B4332', isBSE: true,
    coverColor: 'linear-gradient(135deg, #1B4332, #2D6A4F)',
    desc: 'Buku teks Bahasa Indonesia untuk SMA/MA kelas X — Kurikulum Merdeka 2023.',
    format: 'PDF', downloadUrl: 'https://buku.kemdikbud.go.id/download/Bahasa%20Indonesia%20Kelas%2010.pdf',
  },
  {
    id: 'bse-003', title: 'Matematika Kelas VII SMP', author: 'Kemdikbud', year: 2023,
    category: 'Buku Pelajaran', emoji: '📘', color: '#4361EE', isBSE: true,
    coverColor: 'linear-gradient(135deg, #4361EE, #3A0CA3)',
    desc: 'Buku teks Matematika untuk SMP/MTs kelas VII — Kurikulum Merdeka 2023.',
    format: 'PDF', downloadUrl: 'https://buku.kemdikbud.go.id/download/Matematika%20Kelas%207.pdf',
  },
  {
    id: 'bse-004', title: 'Matematika Kelas X SMA', author: 'Kemdikbud', year: 2023,
    category: 'Buku Pelajaran', emoji: '📘', color: '#4361EE', isBSE: true,
    coverColor: 'linear-gradient(135deg, #4361EE, #3A0CA3)',
    desc: 'Buku teks Matematika untuk SMA/MA kelas X — Kurikulum Merdeka 2023.',
    format: 'PDF', downloadUrl: 'https://buku.kemdikbud.go.id/download/Matematika%20Kelas%2010.pdf',
  },
  {
    id: 'bse-005', title: 'IPA Terpadu Kelas VII SMP', author: 'Kemdikbud', year: 2023,
    category: 'Buku Pelajaran', emoji: '🔬', color: '#06D6A0', isBSE: true,
    coverColor: 'linear-gradient(135deg, #06D6A0, #2A9D8F)',
    desc: 'Buku IPA Terpadu untuk SMP/MTs kelas VII — Kurikulum Merdeka 2023.',
    format: 'PDF', downloadUrl: 'https://buku.kemdikbud.go.id/download/IPA%20Kelas%207.pdf',
  },
  {
    id: 'bse-006', title: 'Sejarah Indonesia Kelas X', author: 'Kemdikbud', year: 2023,
    category: 'Buku Pelajaran', emoji: '🏛️', color: '#8B5E3C', isBSE: true,
    coverColor: 'linear-gradient(135deg, #6B4226, #9B2226)',
    desc: 'Buku Sejarah Indonesia untuk SMA/MA kelas X — Kurikulum Merdeka 2023.',
    format: 'PDF', downloadUrl: 'https://buku.kemdikbud.go.id/download/Sejarah%20Indonesia%20Kelas%2010.pdf',
  },
  {
    id: 'bse-007', title: 'Pendidikan Pancasila Kelas VII', author: 'Kemdikbud', year: 2023,
    category: 'Buku Pelajaran', emoji: '🦅', color: '#E63946', isBSE: true,
    coverColor: 'linear-gradient(135deg, #E63946, #9B2226)',
    desc: 'Buku Pendidikan Pancasila dan Kewarganegaraan untuk SMP kelas VII.',
    format: 'PDF', downloadUrl: 'https://buku.kemdikbud.go.id/download/PPKn%20Kelas%207.pdf',
  },
  {
    id: 'bse-008', title: 'Bahasa Inggris Kelas VII', author: 'Kemdikbud', year: 2023,
    category: 'Buku Pelajaran', emoji: '🇬🇧', color: '#3A86FF', isBSE: true,
    coverColor: 'linear-gradient(135deg, #3A86FF, #023E8A)',
    desc: 'Buku teks Bahasa Inggris "English for Nusantara" untuk SMP kelas VII.',
    format: 'PDF', downloadUrl: 'https://buku.kemdikbud.go.id/download/Bahasa%20Inggris%20Kelas%207.pdf',
  },
  {
    id: 'bse-009', title: 'Informatika Kelas VII', author: 'Kemdikbud', year: 2023,
    category: 'Buku Pelajaran', emoji: '💻', color: '#06AED5', isBSE: true,
    coverColor: 'linear-gradient(135deg, #06AED5, #023E8A)',
    desc: 'Buku Informatika untuk SMP kelas VII — coding, algoritma, dan teknologi digital.',
    format: 'PDF', downloadUrl: 'https://buku.kemdikbud.go.id/download/Informatika%20Kelas%207.pdf',
  },
  {
    id: 'bse-010', title: 'Seni Budaya Kelas VII', author: 'Kemdikbud', year: 2023,
    category: 'Buku Pelajaran', emoji: '🎨', color: '#B5179E', isBSE: true,
    coverColor: 'linear-gradient(135deg, #B5179E, #7B2D8B)',
    desc: 'Buku Seni Budaya untuk SMP kelas VII — seni musik, tari, rupa, dan teater.',
    format: 'PDF', downloadUrl: 'https://buku.kemdikbud.go.id/download/Seni%20Budaya%20Kelas%207.pdf',
  },

  // ════════════════════════════════════════════════════════
  // PENGEMBANGAN DIRI & MOTIVASI
  // ════════════════════════════════════════════════════════
  {
    id: 'mot-001', title: 'Menjadi Manusia Pancasila', author: 'Yudi Latif', year: 2020,
    category: 'Non-Fiksi', emoji: '🦅', color: '#E63946',
    coverColor: 'linear-gradient(135deg, #E63946, #9B2226)',
    desc: 'Refleksi mendalam tentang nilai-nilai Pancasila dan relevansinya bagi kehidupan modern Indonesia.',
    format: 'PDF', downloadUrl: 'https://archive.org/download/menjadi-manusia-pancasila/menjadi-manusia-pancasila.pdf',
  },
  {
    id: 'mot-002', title: 'Merawat Kebhinekaan', author: 'Kompas', year: 2018,
    category: 'Non-Fiksi', emoji: '🤝', color: '#D4A017',
    coverColor: 'linear-gradient(135deg, #D4A017, #B8891A)',
    desc: 'Kumpulan esai tentang keberagaman Indonesia dan pentingnya toleransi antar suku, agama, dan budaya.',
    format: 'PDF', downloadUrl: 'https://archive.org/download/merawat-kebhinekaan/merawat-kebhinekaan.pdf',
  },
  {
    id: 'mot-003', title: 'Pemuda dan Masa Depan Indonesia', author: 'Anies Baswedan', year: 2014,
    category: 'Non-Fiksi', emoji: '🌟', color: '#1B4332',
    coverColor: 'linear-gradient(135deg, #1B4332, #2D6A4F)',
    desc: 'Visi dan gagasan tentang peran pemuda dalam membangun Indonesia yang lebih baik.',
    format: 'PDF', downloadUrl: 'https://archive.org/download/pemuda-masa-depan-indonesia/pemuda-masa-depan.pdf',
  },

  // ════════════════════════════════════════════════════════
  // BUDAYA LOKAL SUMATERA UTARA
  // ════════════════════════════════════════════════════════
  {
    id: 'sumut-001', title: 'Adat dan Budaya Batak: Dalihan Na Tolu', author: 'P. Hutagalung', year: 2005,
    category: 'Budaya Lokal', emoji: '🏔️', color: '#9B2226',
    coverColor: 'linear-gradient(135deg, #9B2226, #C1121F)',
    desc: 'Kajian mendalam tentang sistem kekerabatan Dalihan Na Tolu dan filosofi hidup masyarakat Batak.',
    format: 'PDF', downloadUrl: 'https://archive.org/download/adat-budaya-batak/dalihan-na-tolu.pdf',
  },
  {
    id: 'sumut-002', title: 'Sejarah Kota Medan', author: 'Tengku Luckman Sinar', year: 2003,
    category: 'Sejarah Lokal', emoji: '🏙️', color: '#1B4332',
    coverColor: 'linear-gradient(135deg, #1B4332, #2D6A4F)',
    desc: 'Perjalanan Kota Medan dari kampung kecil di tepi Sungai Deli menjadi kota metropolis terbesar ketiga Indonesia.',
    format: 'PDF', downloadUrl: 'https://archive.org/download/sejarah-kota-medan/sejarah-kota-medan.pdf',
  },
  {
    id: 'sumut-003', title: 'Umpasa dan Umpama Batak Toba', author: 'Berbagai Penulis', year: 2008,
    category: 'Budaya Lokal', emoji: '📣', color: '#D4A017',
    coverColor: 'linear-gradient(135deg, #D4A017, #8C6514)',
    desc: 'Kumpulan umpasa (pantun adat) dan umpama (peribahasa) Batak Toba beserta makna dan konteks penggunaannya.',
    format: 'PDF', downloadUrl: 'https://archive.org/download/umpasa-batak-toba/umpasa-dan-umpama-batak.pdf',
  },
  {
    id: 'sumut-004', title: 'Budaya Melayu Deli: Tradisi dan Modernitas', author: 'Wan Syaifuddin', year: 2010,
    category: 'Budaya Lokal', emoji: '🌙', color: '#2D6A4F',
    coverColor: 'linear-gradient(135deg, #2D6A4F, #1B4332)',
    desc: 'Studi tentang warisan budaya Melayu Deli di Kota Medan — adat, seni, dan adaptasinya di era modern.',
    format: 'PDF', downloadUrl: 'https://archive.org/download/budaya-melayu-deli/budaya-melayu-deli.pdf',
  },
  {
    id: 'sumut-005', title: 'Karo Batak: Etnografi dan Kebudayaan', author: 'Masri Singarimbun', year: 1975,
    category: 'Budaya Lokal', emoji: '🌿', color: '#40916C',
    coverColor: 'linear-gradient(135deg, #40916C, #2D6A4F)',
    desc: 'Etnografi klasik tentang masyarakat Karo di Sumatera Utara — sistem sosial, adat, dan kepercayaan.',
    format: 'PDF', downloadUrl: 'https://archive.org/download/karo-batak-etnografi/karo-batak.pdf',
  },
  {
    id: 'sumut-006', title: 'Gondang Hasapi: Musik Tradisional Batak', author: 'Mauly Purba', year: 2002,
    category: 'Budaya Lokal', emoji: '🎵', color: '#9D4EDD',
    coverColor: 'linear-gradient(135deg, #9D4EDD, #7B2D8B)',
    desc: 'Kajian musikologis tentang gondang sabangunan dan gondang hasapi dalam upacara adat Batak Toba.',
    format: 'PDF', downloadUrl: 'https://archive.org/download/gondang-hasapi/gondang-hasapi-musik-batak.pdf',
  },
]

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const search   = (searchParams.get('search') || '').toLowerCase()
  const category = (searchParams.get('category') || '').toLowerCase()
  const page     = parseInt(searchParams.get('page') || '1')
  const limit    = parseInt(searchParams.get('limit') || '24')
  const src      = searchParams.get('source') || 'all'

  try {
    let books = []

    // ── 1. Gutenberg Bahasa Indonesia ─────────────────────────────────────
    if (src === 'all' || src === 'gutenberg') {
      try {
        const params = new URLSearchParams({ languages: 'id', page: 1 })
        if (search) params.set('search', search)
        const res = await fetch(`https://gutendex.com/books?${params}`, {
          headers: { 'User-Agent': 'PINTAR-JOHOR/1.0' },
          next: { revalidate: 3600 },
        })
        if (res.ok) {
          const data = await res.json()
          const parsed = (data.results || []).map(book => {
            const formats  = book.formats || {}
            const epubUrl  = formats['application/epub+zip'] || ''
            const pdfKey   = Object.keys(formats).find(k => k.includes('pdf'))
            const pdfUrl   = pdfKey ? formats[pdfKey] : ''
            const coverUrl = formats['image/jpeg'] || ''
            return {
              id: `gut-id-${book.id}`, title: book.title,
              author: book.authors?.map(a => a.name).join(', ') || 'Tidak diketahui',
              category: 'Karya Klasik', emoji: '📖', color: '#2D6A4F',
              coverUrl, coverColor: 'linear-gradient(135deg,#2D6A4F,#40916C)',
              format: epubUrl ? 'EPUB' : pdfUrl ? 'PDF' : 'TXT',
              epubUrl, pdfUrl, downloadUrl: epubUrl || pdfUrl || '',
              source: 'indonesia', subSource: 'gutenberg',
              categoryColor: '#2D6A4F', categoryEmoji: '📖',
              coverQuery: encodeURIComponent(book.title),
            }
          }).filter(b => b.downloadUrl)
          books = [...books, ...parsed]
        }
      } catch (e) { console.error('[Gut-ID]', e) }
    }

    // ── 2. Koleksi kurasi lokal ────────────────────────────────────────────
    if (src === 'all' || src === 'lokal') {
      let lokal = CURATED_BOOKS.filter(b => {
        if (search && !b.title.toLowerCase().includes(search) && !b.author.toLowerCase().includes(search) && !b.category.toLowerCase().includes(search)) return false
        if (category && !b.category.toLowerCase().includes(category)) return false
        return true
      })
      books = [
        ...lokal.map(b => ({
          ...b,
          source: 'indonesia',
          categoryColor: b.color,
          categoryEmoji: b.emoji,
          coverQuery: encodeURIComponent(b.title),
        })),
        ...books,
      ]
    }

    const total     = books.length
    const offset    = (page - 1) * limit
    const paginated = books.slice(offset, offset + limit)

    return Response.json({
      books: paginated, total, page, limit,
      totalPages: Math.ceil(total / limit),
      source: 'indonesia',
    })
  } catch (err) {
    console.error('[buku-indonesia]', err)
    return Response.json({ error: err.message, books: [], total: 0, totalPages: 0 }, { status: 500 })
  }
}
