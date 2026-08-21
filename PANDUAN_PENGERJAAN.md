# 📘 Panduan Pengerjaan & Alur Kerja Proyek (Development Guide)

Dokumen ini memuat standar teknis, konvensi pengkodean (*coding standards*), alur kerja kolaborasi Git, serta struktur organisasi modul yang berlaku pada proyek **Sistem Booking Billiard**.

---

## 1. Standar Pengkodean (Coding Standards)

Untuk menjaga konsistensi kode, kemudahan perbaikan (*maintainability*), dan keterbacaan antar pengembang:

### **A. Backend (PHP & Laravel)**
- **Prinsip Dasar**: Mematuhi standar **PSR-12** (PHP Coding Standard).
- **Penamaan Class & Model**: Menggunakan **PascalCase** (contoh: `BookingTransaction`, `TableMaster`, `ScheduleController`).
- **Penamaan Variabel & Method**: Menggunakan **camelCase** (contoh: `checkAvailability()`, `totalAmount`, `getUserProfile()`).
- **Penamaan Tabel & Kolom Database**: Menggunakan **snake_case** jamak/tunggal standar Eloquent (contoh: `tables`, `booking_date`, `price_per_hour`).
- **Standard Format Response API**:
  Seluruh RESTful API controller **Wajib** mengembalikan format JSON konsisten:
  ```json
  {
    "status": true,
    "message": "Deskripsi respon yang informatif",
    "data": { ... }
  }
  ```
- **Validasi Data Payload**: Wajib menggunakan **Form Request Validation** (contoh: `StoreBookingRequest`) untuk mencegah data invalid dan menjaga kerapihan Controller.

### **B. Frontend (JavaScript & React)**
- **Penamaan File Komponen**: Menggunakan **PascalCase** `.jsx` (contoh: `Navbar.jsx`, `TableCard.jsx`, `BookingModal.jsx`).
- **Penamaan Helper & Services**: Menggunakan **camelCase** `.js` (contoh: `apiService.js`, `formatCurrency.js`).
- **Styling Rules**: Menggunakan kombinasi CSS variables global (`index.css`) dan Tailwind CSS utility classes. Gunakan skema warna kegelapan (*dark theme*) dengan aksen neon/cyan untuk tampilan modern.

---

## 2. Alur Kerja Git & Kolaborasi (Git Workflow)

- **Branch Utama**:
  - `main` : Kode stabil siap pakai (Production-ready).
  - `development` : Integrasi fitur yang sedang berjalan.
- **Konvensi Penamaan Branch Fitur**:
  - `feat/nama-fitur` (contoh: `feat/auth-sanctum`, `feat/table-monitor`)
  - `fix/nama-bug` (contoh: `fix/double-booking-validation`)
  - `docs/nama-dokumen` (contoh: `docs/update-timeline-structure`)

- **Format Pesan Commit (Conventional Commits)**:
  - `feat: [deskripsi singkat]` — Penambahan fitur baru.
  - `fix: [deskripsi singkat]` — Perbaikan kutu/bug.
  - `docs: [deskripsi singkat]` — Pembaruan atau penambahan dokumentasi.
  - `refactor: [deskripsi singkat]` — Penyempurnaan kode tanpa mengubah perilaku fungsional.

---

## 3. Status Milestone & Fase Pengembangan (Project Milestones)

Seluruh fase pengerjaan telah diselesaikan 100% sesuai dengan target perencanaan:

| Fase | Cakupan Pekerjaan | Status | Catatan Hasil |
|---|---|---|---|
| **Fase 1: Core Backend & Database** | Perancangan ERD, Migrasi Database, Auth Sanctum, CRUD Meja, Validasi Jadwal Booking. | ![Selesai](https://img.shields.io/badge/-Selesai-brightgreen) | Fondasi API aman & bebas *double booking*. |
| **Fase 2: Advanced API & Analytics** | Endpoint Transaksi, Pembayaran, Monitoring Meja Live, Dashboard Analytics Admin, Postman Collection. | ![Selesai](https://img.shields.io/badge/-Selesai-brightgreen) | Seluruh endpoint REST API siap terintegrasi. |
| **Fase 3: Frontend & Final Integration** | SPA React + Vite, Glassmorphism UI, Responsive Layout, HTTP Client Service, E2E Testing, & Docs Refinement. | ![Selesai](https://img.shields.io/badge/-Selesai-brightgreen) | Aplikasi full-stack beroperasi penuh & teruji. |

---

## 4. Struktur Folder & Alokasi File

Saat menambahkan fitur baru, pastikan meletakkan file sesuai tempatnya:

```
booking-apps/
├── booking-api/app/Http/Controllers/Api/  --> Controller RESTful API
├── booking-api/app/Http/Requests/         --> Validasi payload request
├── booking-api/app/Models/                --> Model Eloquent Database
├── booking-api/routes/api.php             --> Routing Endpoint API
├── booking-web/src/components/            --> Komponen UI Reusable
├── booking-web/src/pages/                 --> Halaman View React Routing
├── booking-web/src/services/              --> Axios Call API HTTP Services
└── docs/                                  --> Berkas Dokumentasi Teknis
```
