# ⚙️ Backend RESTful API Service — Sistem Booking Billiard

[![Laravel](https://img.shields.io/badge/Laravel-11-FF2D20?style=for-the-badge&logo=laravel&logoColor=white)](https://laravel.com)
[![PHP](https://img.shields.io/badge/PHP-8.2+-777BB4?style=for-the-badge&logo=php&logoColor=white)](https://www.php.net)
[![Sanctum](https://img.shields.io/badge/Laravel_Sanctum-Token-red?style=for-the-badge)](https://laravel.com/docs/sanctum)
[![MySQL](https://img.shields.io/badge/MySQL-8.0-4479A1?style=for-the-badge&logo=mysql&logoColor=white)](https://www.mysql.com)

Layanan **Backend RESTful API** untuk **Sistem Reservasi Billiard**, dibangun menggunakan framework **Laravel 11**. Layanan ini bertanggung jawab menangani seluruh logika bisnis penyewaan, validasi bentrok jadwal (*double-booking prevention*), manajemen pengguna, transaksi pembayaran, hingga kompilasi laporan statistik.

---

## 📁 Struktur Direktori Folder Backend (`booking-api`)

```
booking-api/
├── 📁 app/
│   ├── 📁 Http/
│   │   ├── 📁 Controllers/
│   │   │   └── 📁 Api/              # RESTful API Controllers
│   │   ├── 📁 Middleware/           # Custom Authorization Middleware
│   │   └── 📁 Requests/             # Custom Form Request Payload Validation
│   ├── 📁 Models/                   # Eloquent ORM Database Models
│   └── 📁 Providers/                # Service Providers Framework
├── 📁 bootstrap/                    # Framework Bootstrap & Cache
├── 📁 config/                       # Application Configuration Files
├── 📁 database/
│   ├── 📁 factories/                # Model Factories
│   ├── 📁 migrations/               # Skema Tabel Basis Data MySQL
│   └── 📁 seeders/                  # Data Inisialisasi Database
├── 📁 public/                       # Assets & Web Entry Point Backend
├── 📁 resources/                    # Asset Views & Language Resources
├── 📁 routes/                       # Definisi Endpoint API (`api.php`)
├── 📁 storage/                      # Storage Logs & Application Cache
└── 📁 tests/                        # Feature & Unit Testing Suites
```

---

## 🔒 Autentikasi & Hak Akses (Laravel Sanctum)

API menggunakan sistem token berbasis **Laravel Sanctum**. Setiap permintaan ke endpoint terlindungi wajib menyertakan HTTP Header:
```http
Authorization: Bearer <your_sanctum_token>
Accept: application/json
```

---

## 🌐 Daftar Endpoint RESTful API Utama

### **1. Authentication Modul (`/api`)**
- `POST /api/register` — Pendaftaran akun customer baru (`RegisterRequest`).
- `POST /api/login` — Login pengguna & menghasilkan token akses (`LoginRequest`).
- `POST /api/logout` — Revoke token aktif (Memerlukan Auth Token).

### **2. Master Data Meja & Availability (`/api/tables`)**
- `GET /api/tables` — Mendapatkan daftar meja (Mendukung parameter `search`, `status`, dan `page`).
- `GET /api/tables/{id}` — Detail informasi meja tertentu.
- `GET /api/tables/{id}/availability` — Pengecekan slot jam buka & jam terisi pada tanggal tertentu.
- `POST /api/tables` — *(Admin Only)* Menambah meja baru (`StoreTableRequest`).
- `PUT /api/tables/{id}` — *(Admin Only)* Memperbarui data meja (`UpdateTableRequest`).
- `DELETE /api/tables/{id}` — *(Admin Only)* Menghapus data meja.
- `GET /api/tables/monitor` — *(Admin Only)* Real-time monitoring status seluruh meja.

### **3. Transaksi Booking (`/api/bookings`)**
- `GET /api/bookings` — Daftar transaksi booking milik user aktif / seluruh user (Admin).
- `POST /api/bookings` — Membuat reservasi meja (`StoreBookingRequest` dengan validasi bebas *double-booking*).
- `PUT /api/bookings/{id}/status` — Memperbarui status reservasi (`confirmed` / `cancelled`).

### **4. Pembayaran & Laporan Admin (`/api/transactions` & `/api/reports`)**
- `POST /api/transactions` — Mencatat dan mengonfirmasi pembayaran reservasi.
- `GET /api/reports/dashboard` — *(Admin Only)* Ringkasan statistik pendapatan & performa operasional.

---

## 🚀 Panduan Instalasi & Pengoperasian Lokal

1. Masuk ke direktori backend:
   ```bash
   cd booking-api
   ```

2. Install dependensi Composer:
   ```bash
   composer install
   ```

3. Salin file lingkungan dan atur kredensial MySQL:
   ```bash
   cp .env.example .env
   ```

4. Generate Application Key:
   ```bash
   php artisan key:generate
   ```

5. Jalankan migrasi dan seeder database:
   ```bash
   php artisan migrate --seed
   ```
   *Seeder akan membuatkan akun administrator default:*
   - **Email**: `admin@billiard.com`
   - **Password**: `password`

6. Jalankan server lokal:
   ```bash
   php artisan serve
   ```
   API akan berjalan di `http://localhost:8000`.
