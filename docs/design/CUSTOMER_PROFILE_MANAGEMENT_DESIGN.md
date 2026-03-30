# Design Specification: Customer Profile Management (Deep Routes Hub)

Dokumen ini merinci spesifikasi desain untuk fitur **Manajemen Profil Customer** pada aplikasi KoncoKirim (Lite). Fitur ini dirancang untuk memberikan kendali penuh kepada pelanggan atas data diri operasional dan keamanan akun mereka dalam lingkungan *mobile-first*.

---

## 1. Ringkasan Pemahaman (Understanding Summary)

*   **Tujuan:** Membangun modul manajemen profil yang modular, aman, dan hemat bandwidth (*Lite*).
*   **Target Pengguna:** Masyarakat desa (Milenial/Gen Z) pengguna KoncoKirim.
*   **Arsitektur:** **Deep Routes Hub** (Satu rute utama `/profile` yang membawahi sub-rute khusus).
*   **Fitur Utama:**
    *   **Data Diri:** Nama Lengkap dan Nomor WhatsApp (Status Verifikasi).
    *   **Buku Alamat:** Manajemen banyak alamat pengiriman sekaligus (*Multiple Addresses*).
    *   **Keamanan:** Pengaturan Password dan Email melalui integrasi `better-auth`.
    *   **Verifikasi:** Sistem OTP via WhatsApp untuk setiap pengubahan nomor telepon.
*   **Konektivitas:** Bersifat **Wajib Online** untuk seluruh aksi pengeditan (tidak ada antrean offline).
*   **Identitas Visual:** Menggunakan **Inisial Nama** otomatis sebagai pengganti unggahan foto profil (Lite Payload).

---

## 2. Struktur Rute (TanStack Router)

Struktur rute dipecah untuk memastikan pemuatan halaman yang sangat ringan (per-modul):

1.  `/_app.profile.tsx` (Index Hub): Menu navigasi utama dan ringkasan data user.
2.  `/_app.profile.edit.tsx`: Form edit nama dan pemicu OTP WhatsApp.
3.  `/_app.profile.addresses.tsx`: Daftar alamat tersimpan dan manajemen *default address*.
4.  `/_app.profile.security.tsx`: Form pengaturan password dan kredensial akun.

---

## 3. Spesifikasi Teknis & Database

### A. Skema Database (Drizzle ORM)

**Tabel Baru: `addresses`**
| Kolom | Tipe Data | Deskripsi |
| :--- | :--- | :--- |
| `id` | uuid (PK) | ID unik alamat. |
| `userId` | text (FK) | Pemilik alamat (Ref: `user.id`). |
| `label` | text | Nama alamat (e.g. "Rumah", "Kontrakan"). |
| `fullAddress`| text | Alamat lengkap desa secara detail. |
| `notes` | text (Null) | Catatan pengiriman (e.g. "Pagar Biru"). |
| `isDefault` | boolean | Penanda alamat utama (checkout). |

**Update Tabel: `user` (Keamanan)**
*   `phoneNumberVerified` (boolean): Menandai status verifikasi WA.
*   `lastOtpCode` (text): Hash kode OTP terbaru.
*   `otpExpiresAt` (timestamp): Batas waktu aktif kode OTP.

### B. Alur Verifikasi WhatsApp (OTP)
1.  User `INPUT_PHONE` $\rightarrow$ Klik **Save**.
2.  Trigger API call ke **Evolution API** $\rightarrow$ Kirim pesan WA berisi 6 digit kode.
3.  Tampilkan **OTP Overlay** di UI dengan timer kirim ulang 60 detik.
4.  User `INPUT_OTP` $\rightarrow$ Validasi Server $\rightarrow$ Update DB (Status `Verified`).

---

## 4. Komponen UI (Mobile-First)

*   **`ProfileHub`**: Daftar navigasi besar denagn ikon Lucide untuk akses jari yang mudah.
*   **`AddressCard`**: Kartu alamat kontras tinggi dengan tombol aksi "Jadikan Utama" yang mencolok.
*   **`SubmitButton`**: Tombol lebar penuh (full-width) yang *sticky* untuk kemudahan simpan data.
*   **`UserAvatar`**: Inisial nama di dalam lingkaran warna-warni (Tanpa file berat JPG/PNG).

---

## 5. Decision Log (Pencatatan Keputusan)

| No | Keputusan | Alasan / Alternatif |
| :--- | :--- | :--- |
| 1 | **Deep Routes (Modular)** | Dipilih dibanding Single-Page untuk menjaga payload kecil per halaman (Lite UI). |
| 2 | **OTP WhatsApp (Mandatory)** | Menjamin validitas nomor WA yang krusial bagi kurir & admin (Village Loop). |
| 3 | **Wajib Online (Strict)** | Menghindari konflik sinkronisasi data krusial & kegagalan OTP akibat lag offline. |
| 4 | **Initial-Based Avatar** | Alternatif unggah foto profil ditiadakan untuk menjaga total load aplikasi < 2MB. |
| 5 | **Multiple Addresses** | Memberikan fleksibilitas bagi customer yang sering pindah lokasi pengantaran (Rumah/Kerja). |

---

## 6. Kasus Khusus (Edge Cases)

*   **Gagal Sinyal:** Tombol aksi dinonaktifkan otomatis (`navigator.onLine`) dengan pesan ramah desa.
*   **OTP Gagal Kirim:** Menampilkan timer kirim ulang dan peringatan aktivasi nomor WA.
*   **Hapus Alamat Utama:** Dilarang kecuali pengguna telah menetapkan alamat utama baru terlebih dahulu.

---

**Status:** *Approved by User (Ready for Implementation Plan)*
**Documented by:** Antigravity (Assistant)
