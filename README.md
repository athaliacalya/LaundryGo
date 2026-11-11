# LaundryGo

LaundryGo adalah aplikasi sistem informasi pengelolaan operasional laundry berbasis web.

## Fitur Utama
- **Autentikasi Dua Peran**: Akses khusus untuk Admin dan Kasir.
- **Manajemen Pelanggan**: Pencatatan data pelanggan laundry (CRUD).
- **Manajemen Layanan**: Pengaturan daftar paket dan harga layanan laundry.
- **Transaksi Laundry**: Pencatatan order, status pengerjaan pakaian, dan status pembayaran.

## Teknologi yang Digunakan
- Next.js (App Router)
- React
- Tailwind CSS
- Supabase (PostgreSQL)
- Iron Session & Bcryptjs

## Cara Menjalankan

1. Siapkan file `.env.local` dengan konfigurasi Supabase dan session secret.
2. Pasang dependensi:
   ```bash
   npm install
   ```
3. Jalankan server lokal:
   ```bash
   npm run dev
   ```
4. Buka [http://localhost:3000](http://localhost:3000) di browser.
