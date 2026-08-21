# 🗄️ Entity Relationship Diagram (ERD) & Skema Database

Dokumen ini menguraikan rancangan arsitektur basis data relasional (RDBMS) dan relasi antar entitas yang diimplementasikan pada **Sistem Booking Billiard**.

---

## 📊 Visualisasi Diagram ERD (Mermaid)

```mermaid
erDiagram
    USERS ||--o{ BOOKINGS : "melakukan (1:N)"
    TABLES ||--o{ SCHEDULES : "memiliki jadwal operasional (1:N)"
    TABLES ||--o{ BOOKINGS : "dipesan pada (1:N)"
    BOOKINGS ||--o| TRANSACTIONS : "memiliki catatan pembayaran (1:1)"

    USERS {
        int id PK
        string name
        string email UK
        string password
        enum role "admin / customer"
        string phone
        timestamp created_at
        timestamp updated_at
    }

    TABLES {
        int id PK
        string table_number UK "Nomor/Nama Meja Unik"
        int capacity "Kapasitas Pengguna"
        decimal price_per_hour "Tarif Sewa per Jam"
        enum status "available / maintenance"
        timestamp created_at
        timestamp updated_at
    }

    SCHEDULES {
        int id PK
        int table_id FK "Foreign Key -> TABLES(id)"
        tinyint day_of_week "0=Minggu, 1=Senin, ..., 6=Sabtu"
        time open_time "Jam Buka Operasional"
        time close_time "Jam Tutup Operasional"
        boolean is_available "Status Operasional Hari Ini"
        timestamp created_at
        timestamp updated_at
    }

    BOOKINGS {
        int id PK
        int user_id FK "Foreign Key -> USERS(id)"
        int table_id FK "Foreign Key -> TABLES(id)"
        date booking_date "Tanggal Pemesanan"
        time start_time "Waktu Mulai"
        time end_time "Waktu Selesai"
        decimal total_price "Total Harga Sewa"
        enum status "pending / confirmed / cancelled"
        text notes "Catatan Tambahan"
        timestamp created_at
        timestamp updated_at
    }

    TRANSACTIONS {
        int id PK
        int booking_id FK UK "Foreign Key -> BOOKINGS(id)"
        decimal amount "Jumlah Pembayaran"
        enum payment_method "cash / transfer / ewallet"
        enum payment_status "unpaid / paid / refunded"
        timestamp paid_at "Waktu Pelunasan"
        timestamp created_at
        timestamp updated_at
    }
```

---

## 📝 Deskripsi Entitas, Kolom, & Aturan Integritas

### **1. Entitas `users`**
Menyimpan data pengguna aplikasi, baik pengelola (Admin) maupun pelanggan (Customer).
* **`id`**: Primary Key (Auto Increment).
* **`role`**: Menentukan tingkat hak akses (`admin` atau `customer`).
* **Kardinalitas**: Satu user dapat melakukan banyak booking (1:N ke `bookings`).

### **2. Entitas `tables`**
Menyimpan data induk meja billiard yang tersedia untuk disewa.
* **`table_number`**: Unique constraint untuk mencegah penamaan meja ganda.
* **`price_per_hour`**: Tarif sewa dalam format desimal.
* **Kardinalitas**:
  - Satu meja memiliki jadwal operasional harian (1:N ke `schedules`).
  - Satu meja dapat dipesan berulang kali untuk waktu berbeda (1:N ke `bookings`).

### **3. Entitas `schedules`**
Mengatur batasan waktu operasional meja berdasarkan hari dalam sepekan.
* **`day_of_week`**: Representasi numerik (0 = Minggu s/d 6 = Sabtu).
* **`open_time` & `close_time`**: Acuan jam operasional saat pengecekan ketersediaan booking.

### **4. Entitas `bookings`**
Merekam setiap transaksi penyewaan meja oleh pelanggan.
* **`start_time` & `end_time`**: Rentang durasi penyewaan yang divalidasi sistem untuk menghindari bentrok jadwal (*double-booking*).
* **Kardinalitas**: Memiliki relasi 1:1 ke entitas `transactions`.

### **5. Entitas `transactions`**
Mengelola rincian status finansial dan metode pembayaran dari setiap transaksi reservasi.
* **`booking_id`**: Foreign Key unik yang menghubungkan catatan pembayaran ke satu reservasi spesifik.
