# Auth Implementation Plan: KoncoKirim (Lite)

Dokumen ini merinci langkah-langkah implementasi fitur Login dan Register dengan dukungan metadata tambahan (`role`, `phoneNumber`) untuk mendukung ekosistem delivery desa.

## 1. Strategi Aktor & Metadata
*   **Role Default**: Setiap pendaftar baru akan mendapatkan `role: 'CUSTOMER'`.
*   **Akses Super Admin**: Fitur pemindahan role (ke `COURIER` atau `ADMIN`) akan diimplementasikan kemudian sebagai fitur dashboard terpisah.
*   **Nomor WhatsApp**: Digunakan sebagai koordinasi utama antara Customer -> Admin -> Kurir.

## 2. Spesifikasi Validasi Nomor WhatsApp
Validasi akan menggunakan regex ketat pada level Frontend (Zod) dan Backend:
*   **Format**: Diawali `08` atau `+628`.
*   **Panjang Minimal**: 10 digit (e.g., `0812345678`).
*   **Panjang Maksimal**: 15 digit (standar internasional).
*   **Regex**: `/^(08|\+628)\d{8,12}$/`

## 3. Scope Implementasi
- **In**:
    - Update schema database SQLite (`packages/db`).
    - Sinkronisasi metadata `better-auth` (`packages/auth`).
    - Komponen `SignUpForm` & `SignInForm` di Web App.
    - Proteksi route `/dashboard`.
- **Out**:
    - Aplikasi Mobile/Native (React Native/Expo) - Diabaikan sementara.
    - Sistem OTP/Verifikasi SMS (Mengandalkan email/password dulu).
    - UI Editor Role.

## 4. Action Items (Daftar Tugas)

| No | Komponen | Tugas | Status |
| :--- | :--- | :--- | :---: |
| 1 | `packages/db` | Tambah kolom `role` (text, default: 'CUSTOMER') & `phoneNumber` (text, unique) di `schema/auth.ts`. | [X] |
| 2 | `packages/auth` | Daftarkan field baru di konfigurasi `betterAuth` (plugin `metadata` atau `schema` extension). | [X] |
| 3 | `packages/db` | Jalankan `bun x drizzle-kit generate` & `push` untuk update database lokal. | [X] |
| 4 | `apps/web` | Tambahkan validasi regex WhatsApp di `SignUpForm.tsx` via Zod. | [X] |
| 5 | `apps/web` | Update `SignUpForm.tsx` untuk menyertakan input text "Nomor WhatsApp (Aktif)". | [X] |
| 6 | `apps/web` | Kirim `role`: 'CUSTOMER' secara otomatis pada payload `authClient.signUp.email()`. | [X] |
| 7 | `apps/web` | Tambahkan middleware/proteksi sederhana pada route `/dashboard` menggunakan TanStack Router. | [X] |
| 8 | **Validation** | Verifikasi data tersimpan benar melalui `drizzle-kit studio` atau SQLite viewer. | [X] |

## 5. Timeline & Milestone
- **Phase 1**: Database & Auth Logic Setup.
- **Phase 2**: UI/Web Register Implementation.
- **Phase 3**: Authentication Test & Dashboard Redirect.

---
*Created by Antigravity - 2026-03-29*
