# 📋 Spesifikasi Teknis Sistem (System Specification)

Dokumen ini merangkum kebutuhan teknis, arsitektur perangkat lunak, dan spesifikasi fungsional maupun non-fungsional untuk **Sistem Booking Billiard**.

---

## 1. Arsitektur & Teknologi Terpilih

- **Pola Arsitektur**: Client-Server Decoupled (RESTful API & Single Page Application).
- **Teknologi Backend**: Laravel 11.x (PHP 8.2+).
- **Manajemen Autentikasi**: Laravel Sanctum (Token-Based Authentication & Stateful Session).
- **Teknologi Database**: MySQL 8.0 / MariaDB.
- **Teknologi Frontend**: React 18.x + Vite 5.x + Tailwind CSS + Lucide Icons.
- **Manajemen API**: Axios HTTP Client dengan Interceptor Bearer Token.

---

## 2. Spesifikasi Kebutuhan Fungsional (Functional Requirements)

### **A. Modul Keamanan & Akun (Auth)** — ![Terimplementasi](https://img.shields.io/badge/-Terimplementasi-brightgreen)
- Pengguna (Customer) dapat mendaftarkan akun baru melalui endpoint `/api/register`.
- Sistem menyediakan fungsionalitas Login `/api/login` yang mengembalikan API Sanctum Token.
- Pembagian Otorisasi Hak Akses secara ketat:
  - **Administrator**: Akses penuh ke kelola meja, jadwal, transaksi, monitoring live, dan dashboard analytics.
  - **Customer**: Akses untuk memilih meja, mengecek ketersediaan jam, dan melakukan booking.

### **B. Modul Master Data (Meja & Jadwal)** — ![Terimplementasi](https://img.shields.io/badge/-Terimplementasi-brightgreen)
- Administrator memiliki akses CRUD (*Create, Read, Update, Delete*) data meja billiard.
- Mengatur tarif sewa per jam (`price_per_hour`), kapasitas, dan tipe meja (9-foot/10-foot).
- Fitur pencarian (**Search** nomor/nama meja), penyaringan (**Filter** status aktif/maintenance), dan pembatasan data (**Pagination**) pada endpoint `/api/tables`.
- Pengaturan jadwal harian jam buka & tutup operasional per meja.

### **C. Modul Transaksi (Booking & Prevent Double-Booking)** — ![Terimplementasi](https://img.shields.io/badge/-Terimplementasi-brightgreen)
- Customer dapat melihat ketersediaan jam operasional meja secara *real-time* (`/api/tables/{id}/availability`).
- Customer dapat melakukan pemesanan (booking) untuk tanggal, jam mulai, dan durasi tertentu.
- **Algoritma Validasi Kritis**: Sistem menolak secara otomatis pembuatan booking jika pada rentang jam dan meja yang sama sudah ada reservasi berstatus aktif (`pending` atau `confirmed`).
- Penanganan status transaksi: `pending`, `confirmed`, `cancelled`, serta status pembayaran `unpaid`, `paid`, `refunded`.

### **D. Modul Pelaporan & Live Monitoring** — ![Terimplementasi](https://img.shields.io/badge/-Terimplementasi-brightgreen)
- Dashboard Administrator menyajikan kompilasi data statistik: Total Pendapatan, Meja Populer, dan Grafik Ringkasan Transaksi (`/api/reports/dashboard`).
- Endpoint Live Monitor (`/api/tables/monitor`) menyajikan status riil seluruh meja saat ini secara visual.

---

## 3. Spesifikasi Non-Fungsional (Non-Functional Requirements)

- **Keamanan (Security)**:
  - Seluruh endpoint sensitif diproteksi oleh `auth:sanctum` dan middleware `admin`.
  - Validasi input menggunakan Laravel `FormRequest` untuk mencegah *SQL Injection* dan *XSS Attack*.
  - Enkripsi password menggunakan algoritma `Bcrypt`.

- **Dokumentasi & Usability**:
  - Menyediakan berkas `postman_collection.json` lengkap dengan contoh *Request Payload* dan *Response JSON* untuk kemudahan integrasi.

- **Integritas Data (Data Integrity)**:
  - Penggunaan *Foreign Key Constraints* (`ON DELETE RESTRICT` / `CASCADE`) pada MySQL untuk menjaga konsistensi relasi antara User, Table, Booking, dan Transaction.
