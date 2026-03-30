# Implementation Plan: Customer Profile Management

Rencana ini merinci langkah-langkah teknis untuk mengimplementasikan sistem Manajemen Profil Customer dengan arsitektur **Deep Routes Hub**, **Buku Alamat**, dan **Verifikasi OTP WhatsApp**.

## Approach
Implementasi ini menggunakan pendekatan modular dengan memisahkan fitur profil ke dalam sub-rute **TanStack Router** untuk menjaga payload aplikasi tetap kecil (*Lite*). Sisi backend akan memperluas skema **Drizzle ORM** dan menyatukan logika keamanan menggunakan **better-auth** dan **Evolution API** (untuk OTP).

## Scope

- **In**:
  - Migrasi database tabel `addresses` dan update tabel `user`.
  - TRPC Router untuk CRUD profil dan alamat.
  - Alur Verifikasi OTP WhatsApp (Integration with Evolution API).
  - 4 Sub-rute Profil baru (Hub, Edit, Alamat, Keamanan).
  - UI Dasar (Minimalist Avatar, Navigation Hub, Address List).
- **Out**:
  - Sistem pengeditan profil secara offline (Wajib Online).
  - Penyimpanan file avatar berat (Hanya menggunakan inisial).
  - Modul profil untuk Admin atau Kurir.

## Action Items

1. [x] **Database Update**: Tambahkan tabel `addresses` dan kolom OTP pada tabel `user` di `packages/db/src/schema.ts`.
2. [x] **Migration**: Generate dan jalankan migrasi database (`bun db:generate` & `bun db:push`).
3. [x] **TRPC Router (Profile)**: Buat prosedur `updateProfile`, `getAddresses`, `addAddress`, `deleteAddress`, dan `setDefaultAddress` di `apps/web/src/utils/trpc.ts` (atau router terkait).
4. [x] **OTP Service**: Lakukan konfigurasi/koneksi Evolution API dan implementasikan fungsi server-side untuk mengirim OTP serta validasi kode di backend.
5. [x] **Routing Scaffold**: Buat file rute baru di `apps/web/src/routes/` (`_app.profile.edit.tsx`, `_app.profile.addresses.tsx`, `_app.profile.security.tsx`).
6. [x] **UI: Profile Hub**: Perbarui `_app.profile.tsx` untuk menampilkan navigasi menu (Hub) dan Avatar inisial.
7. [x] **UI: Address Management**: Bangun halaman daftar alamat dengan kemampuan tambah/hapus dan set alamat utama.
8. [x] **UI: Edit & OTP Flow**: Implementasikan form edit data diri yang memicu modal/overlay OTP saat nomor WA diubah.
9. [x] **UI: Security Sub-route**: Gunakan kapabilitas `better-auth` untuk fitur ganti password dan email.
10. [ ] **Validation & Testing**: Verifikasi alur verifikasi WA, pengalihan alamat default, dan proteksi rute (Wajib Online).

## Decisions & Constraints

- **Evolution API**: Belum terkonfigurasi (perlu setup awal).
- **Buku Alamat**: Batas maksimal buku alamat sejumlah 3 alamat.
