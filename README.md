# 🎱 Sistem Reservasi & Manajemen Billiard (Billiard Booking System)

[![Laravel](https://img.shields.io/badge/Laravel-11-FF2D20?style=for-the-badge&logo=laravel&logoColor=white)](https://laravel.com)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-5-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38BDF8?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com)
[![MySQL](https://img.shields.io/badge/MySQL-8.0-4479A1?style=for-the-badge&logo=mysql&logoColor=white)](https://www.mysql.com)
[![Status](https://img.shields.io/badge/Status-100%25%20Production%20Ready-brightgreen?style=for-the-badge)](# status)

Sistem Informasi Penyewaan dan Operasional Meja Billiard Berbasis Web Full-Stack. Aplikasi ini dirancang untuk memfasilitasi pelanggan dalam melakukan reservasi meja billiard secara daring (*online*), mencegah konflik jadwal (*double booking*), serta memberikan panel administrasi komprehensif untuk pengelola area billiard.

Sistem ini dikembangkan menggunakan arsitektur **Monorepo** yang memisahkan backend RESTful API berbasis Laravel dan frontend SPA (Single Page Application) berbasis React + Vite.

---

## 📁 Struktur Direktori Monorepo (Directory Structure)

```
booking-apps/
├── 📁 docs/                             # Dokumentasi Arsitektur & Laporan Proyek
├── 📁 booking-api/                      # [BACKEND] Laravel 11 RESTful API Service
│   ├── 📁 app/
│   │   ├── 📁 Http/
│   │   │   ├── 📁 Controllers/
│   │   │   │   └── 📁 Api/              # Controllers RESTful API
│   │   │   ├── 📁 Middleware/           # Middleware Otorisasi Hak Akses
│   │   │   └── 📁 Requests/             # Form Request Validations
│   │   ├── 📁 Models/                   # Eloquent ORM Models
│   │   └── 📁 Providers/                # Service Providers Framework
│   ├── 📁 bootstrap/                    # Framework Bootstrap & Cache
│   ├── 📁 config/                       # Konfigurasi Aplikasi & Framework
│   ├── 📁 database/
│   │   ├── 📁 factories/                # Database Factories
│   │   ├── 📁 migrations/               # Skema Tabel Database MySQL
│   │   └── 📁 seeders/                  # Injeksi Data Inisialisasi
│   ├── 📁 public/                       # Assets & Web Entry Point Backend
│   ├── 📁 resources/                    # Asset Views/Lang Resources
│   ├── 📁 routes/                       # Endpoint API Routes (`api.php`)
│   ├── 📁 storage/                      # Storage Logs & Cache
│   └── 📁 tests/                        # Automated Test Suites
└── 📁 booking-web/                      # [FRONTEND] React + Vite Single Page Application
    ├── 📁 public/                       # Asset Statis Client
    └── 📁 src/                          # Kode Sumber Utama Frontend SPA
        ├── 📁 assets/                   # Asset Statis (Gambar, Vector, Logo)
        ├── 📁 components/               # Komponen UI Berarsitektur Atomic Design
        │   ├── 📁 atoms/                # Atomic UI Elements (Basic Components)
        │   ├── 📁 molecules/            # Molecules UI (Combined Atoms)
        │   ├── 📁 organisms/            # Complex Organism Components
        │   └── 📁 templates/            # Layout Templates & Wrappers
        ├── 📁 context/                  # State Context API (Auth & Booking)
        ├── 📁 hooks/                    # Custom React Hooks
        ├── 📁 pages/                    # Halaman Utama Customer Area
        │   └── 📁 admin/                # Halaman Khusus Area Panel Administrator
        ├── 📁 services/                 # HTTP API Service Client (Axios)
        ├── 📁 stores/                   # Central App State Stores
        └── 📁 theme/                    # Design Tokens & Theme Provider
```

---

## 🛠️ Tumpukan Teknologi (Tech Stack)

### **Backend (RESTful API Service)**
- **Framework**: Laravel 11.x (PHP 8.2+)
- **Authentication**: Laravel Sanctum (Stateful & Bearer Token Authentication)
- **Database**: MySQL / MariaDB (Relational Database Management System)
- **Architecture**: MVC & RESTful Service Pattern
- **Authorization**: Custom Middleware Otorisasi Berbasis Peran (`admin`, `customer`)

### **Frontend (Single Page Application)**
- **Framework**: React 18.x + Vite 5.x
- **Component Architecture**: Atomic Design Pattern (`atoms`, `molecules`, `organisms`, `templates`)
- **Styling**: Material-UI (MUI v5) + Custom CSS Variables + Tailwind CSS
- **Design Aesthetic**: Premium Dark Theme, Glassmorphism Cards, Smooth Animations, Gradient Accents
- **HTTP Client**: Axios dengan Interceptor Token Sanctum
- **Icons**: Material Symbols & Lucide React Icons

---

## ✨ Fitur Utama Sistem

1. 🔑 **Manajemen Autentikasi & Keamanan (Sanctum)**
   - Registrasi & Login Pelanggan / Admin dengan enkripsi password `Bcrypt`.
   - Token-based API access dengan auto-expiration dan pembersihan session secara aman.

2. 🎱 **Katalog & Manajemen Meja Billiard (Master Data)**
   - Pengelolaan data meja billiard (CRUD, tipe meja 9-foot / 10-foot, kapasitas, tarif per jam).
   - Fitur pencarian (*Search*), penyaringan status (*Filter*), dan *Pagination* data dinamis.

3. 📅 **Mesin Booking & Penjadwalan Bebas Bentrok (Real-Time Slot Engine)**
   - Pengecekan ketersediaan slot jam operasional meja secara *live*.
   - Validasi ketat pencegahan *double-booking* pada jam dan meja yang sama.
   - Penghitungan total biaya sewa secara otomatis berdasarkan durasi.

4. 💳 **Manajemen Transaksi & Pembayaran**
   - Pencatatan otomatis transaksi untuk setiap reservasi.
   - Dukungan status pembayaran: `unpaid`, `paid`, dan `refunded`.
   - Cetak E-Ticket dan Kuitansi Pembayaran (*Receipt Modal*).

5. 📊 **Dashboard Analytics & Live Monitor Administrator**
   - Ringkasan statistik pendapatan harian/bulanan, total reservasi, dan meja favorit.
   - Panel monitoring status meja secara visual (Tersedia, Terpakai, Maintenance).

---

## 🚀 Panduan Instalasi & Pengoperasian Lokal

### **Prasyarat Sistem**
- PHP >= 8.2 dengan ekstensi `pdo_mysql`, `mbstring`, `openssl`
- Composer (PHP Package Manager)
- Node.js >= 18.x dan npm
- MySQL / MariaDB Server

---

### 1. Inisialisasi Backend (`booking-api`)

```bash
cd booking-api
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate --seed
php artisan serve
```
Layanan REST API akan berjalan secara default di `http://localhost:8000`.

---

### 2. Inisialisasi Frontend (`booking-web`)

```bash
cd booking-web
npm install
npm run dev
```
Aplikasi web frontend akan berjalan di `http://localhost:5173`.

---

## 🔗 Ringkasan Endpoint Utama RESTful API

| Method | Endpoint | Hak Akses | Deskripsi |
|---|---|---|---|
| `POST` | `/api/register` | Publik | Registrasi akun customer baru |
| `POST` | `/api/login` | Publik | Login & dapatkan token autentikasi |
| `GET` | `/api/tables` | Publik | Daftar katalog meja (Search, Filter, Pagination) |
| `GET` | `/api/tables/{id}/availability` | Auth | Cek ketersediaan jam meja |
| `GET` | `/api/bookings` | Auth | Daftar riwayat booking pengguna / admin |
| `POST` | `/api/bookings` | Customer | Buat reservasi meja baru (dengan validasi bentrok) |
| `POST` | `/api/transactions` | Auth | Proses konfirmasi pembayaran transaksi |
| `GET` | `/api/reports/dashboard` | Admin | Ringkasan statistik & analytics operasional |
| `GET` | `/api/tables/monitor` | Admin | Live status monitoring meja billiard |

---

## 📑 Dokumentasi Terkait

- [Spesifikasi Teknis Sistem (SPEC.md)](file:///c:/laragon/www/booking-apps/SPEC.md)
- [Panduan Pengerjaan Proyek (PANDUAN_PENGERJAAN.md)](file:///c:/laragon/www/booking-apps/PANDUAN_PENGERJAAN.md)
- [Entity Relationship Diagram Database (docs/ERD.md)](file:///c:/laragon/www/booking-apps/docs/ERD.md)
- [Jadwal Pelaksanaan & Timeline Proyek (docs/Jadwal_Pelaksanaan.md)](file:///c:/laragon/www/booking-apps/docs/Jadwal_Pelaksanaan.md)
