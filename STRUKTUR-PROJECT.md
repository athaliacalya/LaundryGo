# Struktur Project: LaundryGo

> **LaundryGo** adalah Sistem Informasi Laundry berbasis web, dibangun dengan **Next.js 16 (App Router)**, **Tailwind CSS**, dan **Supabase (PostgreSQL)** sebagai database. Autentikasi dibuat manual menggunakan **bcryptjs** (enkripsi password) dan **iron-session** (session berbasis cookie terenkripsi). Terdapat dua role pengguna: **admin** dan **kasir**, yang aksesnya diatur lewat `middleware.js`.

---

## Diagram Struktur Folder

```
laundry-app/
│
├── middleware.js              ← proteksi route berdasarkan login & role
├── .env.local                 ← kredensial rahasia (tidak di-commit ke Git)
│
├── lib/                       ← fungsi utilitas sisi server
│   ├── session.js             ← konfigurasi & helper baca session login (iron-session)
│   └── supabaseAdmin.js       ← koneksi Supabase pakai service_role key (server only)
│
├── components/                ← komponen React yang dipakai ulang di banyak halaman
│   ├── LogoutButton.js        ← tombol logout (dipakai di semua layout admin & kasir)
│   ├── pelanggan/
│   │   └── PelangganForm.js   ← form tambah & edit pelanggan (dipakai ulang)
│   ├── layanan/               ← (kosong, siap diisi) form untuk fitur Layanan
│   └── transaksi/             ← (kosong, siap diisi) form untuk fitur Transaksi
│
├── scripts/
│   └── hash-password.mjs      ← skrip sekali pakai: bikin hash password untuk data awal
│
└── app/                       ← semua halaman & API (konvensi Next.js App Router)
    │
    ├── layout.tsx             ← layout paling luar (html, body, font global)
    ├── globals.css            ← CSS global & konfigurasi Tailwind
    ├── page.tsx               ← halaman root ("/") → langsung redirect ke /login
    │
    ├── login/
    │   └── page.js            ← halaman login (dipakai oleh admin & kasir)
    │
    ├── api/                   ← endpoint API Route (backend, berjalan di server)
    │   ├── login/
    │   │   └── route.js       ← proses login: cek username/password, buat session
    │   └── logout/
    │       └── route.js       ← proses logout: hapus session, redirect ke /login
    │
    ├── admin/                 ← semua halaman khusus role "admin"
    │   ├── layout.js          ← header LaundryGo + nama user + tombol logout (admin)
    │   │
    │   ├── pelanggan/         ← FITUR SELESAI: CRUD data pelanggan
    │   │   ├── page.js        ← daftar pelanggan (tabel, search, pagination)
    │   │   ├── actions.js     ← Server Actions: tambah, update, hapus pelanggan
    │   │   ├── baru/
    │   │   │   └── page.js    ← halaman form tambah pelanggan baru
    │   │   └── [id]/
    │   │       └── edit/
    │   │           └── page.js ← halaman form edit pelanggan berdasarkan id
    │   │
    │   ├── layanan/           ← SCAFFOLD SIAP: tinggal isi konten
    │   │   ├── page.js        ← (placeholder) daftar layanan
    │   │   ├── actions.js     ← (placeholder) Server Actions layanan
    │   │   ├── baru/
    │   │   │   └── page.js    ← (placeholder) tambah layanan baru
    │   │   └── [id]/
    │   │       └── edit/
    │   │           └── page.js ← (placeholder) edit layanan
    │   │
    │   └── transaksi/         ← SCAFFOLD SIAP: tinggal isi konten
    │       ├── page.js        ← (placeholder) daftar transaksi (admin)
    │       ├── actions.js     ← (placeholder) Server Actions transaksi
    │       ├── baru/
    │       │   └── page.js    ← (placeholder) tambah transaksi baru
    │       └── [id]/
    │           └── edit/
    │               └── page.js ← (placeholder) edit transaksi
    │
    └── kasir/                 ← semua halaman khusus role "kasir"
        ├── layout.js          ← (placeholder) header kasir + tombol logout
        └── transaksi/         ← SCAFFOLD SIAP: tinggal isi konten
            ├── page.js        ← (placeholder) daftar transaksi (kasir)
            ├── actions.js     ← (placeholder) Server Actions transaksi kasir
            └── baru/
                └── page.js   ← (placeholder) input transaksi baru (kasir)
```

---

## Penjelasan File & Folder Utama

### File Konfigurasi di Root

| File | Fungsi |
|------|--------|
| `middleware.js` | Penjaga akses: setiap request yang menuju `/admin/*` atau `/kasir/*` dicek dulu — apakah sudah login? Apakah rolenya sesuai? Jika tidak, diarahkan ke halaman yang tepat. |
| `.env.local` | Menyimpan kredensial rahasia: URL Supabase, service role key, dan kunci enkripsi session. File ini **tidak boleh di-commit** ke Git. |

### Folder `lib/` — Fungsi Utilitas Server

| File | Fungsi |
|------|--------|
| `session.js` | Mengatur konfigurasi session (nama cookie, kunci enkripsi) dan menyediakan fungsi `getSession()` untuk membaca data user yang sedang login dari dalam halaman atau API. |
| `supabaseAdmin.js` | Membuat koneksi ke database Supabase menggunakan kunci admin (`service_role key`). Hanya boleh dipakai di sisi server (Server Actions, API Route) — jangan dipakai di komponen `'use client'`. |

### Folder `components/` — Komponen Reusable

| File | Fungsi |
|------|--------|
| `LogoutButton.js` | Tombol "Keluar" yang memanggil `/api/logout` lalu mengarahkan user ke halaman login. Dipakai di header admin dan kasir. |
| `pelanggan/PelangganForm.js` | Formulir input data pelanggan (nama, no HP, alamat) yang dipakai ulang di halaman "tambah" maupun "edit". Menangani validasi dan tampilan pesan error. |

### Folder `scripts/`

| File | Fungsi |
|------|--------|
| `hash-password.mjs` | Skrip utilitas yang dijalankan sekali dari terminal (`node scripts/hash-password.mjs`) untuk menghasilkan hash bcrypt dari password, yang kemudian disimpan langsung ke tabel `users` di Supabase. |

### Folder `app/` — Halaman & API (Next.js App Router)

| Path | Fungsi |
|------|--------|
| `app/page.tsx` | Halaman akar (`/`). Langsung redirect ke `/login`. |
| `app/login/page.js` | Halaman login dengan form username & password. Berlaku untuk semua role. |
| `app/api/login/route.js` | API endpoint (POST): menerima username & password, memverifikasi ke database, membuat session jika berhasil, mengembalikan role user. |
| `app/api/logout/route.js` | API endpoint (POST): menghapus session, mengakhiri sesi login. |
| `app/admin/layout.js` | Layout yang membungkus semua halaman admin: menampilkan header dengan nama aplikasi, nama user, role, dan tombol logout. |
| `app/admin/pelanggan/page.js` | Menampilkan tabel daftar pelanggan dengan fitur pencarian nama dan pagination (10 data per halaman). |
| `app/admin/pelanggan/actions.js` | Server Actions untuk operasi database pelanggan: `tambahPelanggan`, `updatePelanggan`, `hapusPelanggan`. Dijalankan di server, bukan di browser. |
| `app/admin/pelanggan/baru/page.js` | Halaman form untuk menambah pelanggan baru (URL: `/admin/pelanggan/baru`). |
| `app/admin/pelanggan/[id]/edit/page.js` | Halaman form untuk mengedit data pelanggan berdasarkan ID (URL: `/admin/pelanggan/123/edit`). |

---

## Alur Kerja Aplikasi

```
Pengguna membuka browser
        |
        v
  Masuk ke /login
  (memasukkan username & password)
        |
        v
  POST /api/login
  +-------------------------------------+
  | 1. Cek username di tabel "users"    |
  |    (Supabase/PostgreSQL)            |
  | 2. Verifikasi password dengan       |
  |    bcryptjs.compare()               |
  | 3. Jika cocok -> simpan data user   |
  |    ke session (iron-session cookie) |
  +-------------------------------------+
        |
        +--- role = "admin"  -->  /admin/pelanggan
        +--- role = "kasir"  -->  /kasir/transaksi
                |
                v
  middleware.js (berjalan di setiap request)
  +-------------------------------------+
  | Cek: apakah ada session?            |
  |   -> Tidak: redirect ke /login      |
  | Cek: apakah role sesuai dengan URL? |
  |   -> Kasir coba buka /admin/*:      |
  |      redirect ke /dashboard         |
  +-------------------------------------+
                |
                v
  Halaman admin/kasir ditampilkan
  (Server Component membaca data dari Supabase)
                |
                v
  User mengisi form (tambah/edit data)
                |
                v
  Server Action dijalankan di server:
  +-------------------------------------+
  | 1. Validasi input                   |
  | 2. INSERT / UPDATE / DELETE         |
  |    ke Supabase via supabaseAdmin    |
  | 3. revalidatePath -> halaman refresh|
  | 4. redirect -> kembali ke daftar    |
  +-------------------------------------+
```

---

## Konvensi Penamaan

| Jenis File | Konvensi | Contoh |
|---|---|---|
| Halaman (route) | `page.js` (huruf kecil) | `app/admin/pelanggan/page.js` |
| Layout | `layout.js` (huruf kecil) | `app/admin/layout.js` |
| Server Actions | `actions.js` (huruf kecil) | `app/admin/pelanggan/actions.js` |
| API Route | `route.js` (huruf kecil) | `app/api/login/route.js` |
| Komponen React | PascalCase | `components/pelanggan/PelangganForm.js` |
| Dynamic route | Nama folder dalam `[kurung]` | `app/admin/pelanggan/[id]/edit/` |

> **Catatan:** Konvensi Next.js App Router mewajibkan file-file khusus (`page.js`, `layout.js`, `route.js`) ditulis dengan huruf kecil. Komponen React biasa menggunakan PascalCase sesuai konvensi ekosistem React.

---

## Teknologi yang Digunakan

| Teknologi | Versi | Kegunaan |
|---|---|---|
| Next.js | 16 (App Router) | Framework utama: routing, rendering, Server Actions |
| Tailwind CSS | v4 | Styling komponen |
| Supabase | - | Database PostgreSQL (cloud) |
| iron-session | - | Manajemen session login berbasis cookie terenkripsi |
| bcryptjs | - | Enkripsi & verifikasi password |
