# 💻 Frontend Web Application — Sistem Booking Billiard

[![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-5-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38BDF8?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com)
[![MUI](https://img.shields.io/badge/MUI-v5-007FFF?style=for-the-badge&logo=mui&logoColor=white)](https://mui.com)

Aplikasi antarmuka pengguna berbasis **Single Page Application (SPA)** yang dikembangkan menggunakan **React 18**, **Vite**, dan **Atomic Design Pattern**, dirancang untuk memberikan pengalaman reservasi meja billiard yang responsif, modern, dan intuitif.

---

## 📁 Struktur Direktori Folder (`booking-web`)

```
booking-web/
├── 📁 public/                       # Assets Statis Aplikasi Client
└── 📁 src/                          # Kode Sumber Utama React SPA
    ├── 📁 assets/                   # Vector, Logo, & Gambar Statis
    ├── 📁 components/               # Komponen UI Berarsitektur Atomic Design
    │   ├── 📁 atoms/                # Atomic UI Elements (Basic Components)
    │   ├── 📁 molecules/            # Molecules UI (Combined Atoms)
    │   ├── 📁 organisms/            # Complex Organism Components
    │   └── 📁 templates/            # Layout Structural Templates
    ├── 📁 context/                  # Context State Management API
    ├── 📁 hooks/                    # Custom React Hooks Reusable
    ├── 📁 pages/                    # Halaman Utama Customer Area
    │   └── 📁 admin/                # Halaman Khusus Area Panel Administrator
    ├── 📁 services/                 # Service Layer HTTP Client Axios
    ├── 📁 stores/                   # Central Application State Stores
    └── 📁 theme/                    # Design Tokens & Theme Provider
```

---

## ✨ Fitur Antarmuka Pengguna

1. ⚛️ **Atomic Design System Architecture**: Pengorganisasian komponen terstruktur dari `atoms`, `molecules`, `organisms`, hingga `templates` untuk kemudahan pemeliharaan kode.
2. 🌌 **Desain Glassmorphism Modern & Dark Mode**: Skema warna eksklusif bernuansa kegelapan dengan efek transparansi *glassmorphism*, aksen cyan/neon, dan animasi halus.
3. 🔍 **Pencarian & Filter Meja Dynamic**: Memudahkan pelanggan memfilter meja berdasarkan nomor, kapasitas, atau status ketersediaan.
4. ⚡ **Formulir Booking Real-Time**: Interaksi instan untuk mengecek ketersediaan jam meja tanpa memuat ulang halaman (*zero page refresh*).
5. 📜 **E-Ticket & Modal Kuitansi (Receipt)**: Pengguna dapat mengunduh/melihat bukti reservasi secara langsung setelah transaksi berhasil.
6. 📱 **Responsif di Semua Perangkat**: Tampilan teroptimasi untuk desktop, tablet, dan smartphone.
7. 🛡️ **Proteksi Halaman Berbasis Role (`RouteGuards`)**: Pembatasan navigasi otomatis antara pengunjung publik, pelanggan, dan administrator.

---

## 🚀 Panduan Instalasi & Pengoperasian

```bash
# 1. Masuk ke direktori booking-web
cd booking-web

# 2. Pasang dependensi project
npm install

# 3. Jalankan server pengembangan lokal
npm run dev

# 4. Build untuk produksi
npm run build
```
Aplikasi dapat diakses melalui browser pada alamat `http://localhost:5173`.
