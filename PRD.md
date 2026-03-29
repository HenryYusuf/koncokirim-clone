# Product Requirements Document (PRD): KoncoKirim (Lite)

## 1. Executive Summary
Aplikasi Food Delivery Order yang dirancang khusus untuk masyarakat desa dengan keterbatasan koneksi internet. Menggunakan pendekatan *PWA (Progressive Web App)* yang sangat ringan, sistem koordinasi berbasis WhatsApp, dan metode pembayaran tunai (COD).

---

## 2. Target Pasar (Target Audience)
*   **Customer Utama:** Anak muda desa (Gen Z & Milenial) yang memiliki smartphone, aktif di media sosial/WhatsApp, dan menginginkan kenyamanan memesan makanan.
*   **Penyedia Layanan (Admin/Kurir):** Pemuda desa setempat/Karang Taruna yang ingin memberdayakan ekonomi lokal melalui sistem piket kurir.
*   **Merchant:** UMKM kuliner desa (Warung, pedagang kaki lima) yang belum terjangkau platform delivery besar.

---

## 3. Prioritas Fitur (Metode RICE)

Skor RICE dihitung dengan rumus: `(Reach * Impact * Confidence) / Effort`

| Fitur | Reach (1-10) | Impact (1-3) | Confidence (%) | Effort (Pers-Month) | RICE Score | Prioritas |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: |
| **Hybrid Order Flow (Internet/WA)** | 10 | 3 | 90% | 1.0 | **27.0** | P0 (Critical) |
| **Lite Catalog & Local Search** | 10 | 2 | 85% | 0.8 | **21.2** | P0 (Critical) |
| **Admin Order Dashboard** | 8 | 3 | 90% | 1.2 | **18.0** | P1 (High) |
| **Full Profile Registration** | 7 | 2 | 80% | 1.0 | **11.2** | P1 (High) |
| **Courier Auction System (WA Integration)** | 6 | 2 | 70% | 1.5 | **5.6** | P2 (Medium) |

---

## 4. Spesifikasi Fitur Utama

### 4.1 Hybrid Order Flow (Internet $\rightarrow$ WhatsApp)
*   **Deskripsi:** Sistem pengiriman pesanan dua jalur.
*   **Requirement:** Aplikasi mencoba mengirim data via API. Jika dalam 5 detik tidak ada respon server, aplikasi memicu tombol "Kirim via WhatsApp Admin" dengan teks terformat otomatis.

### 4.2 Merchant-Focused Local Search
*   **Deskripsi:** Pencarian berbasis teks yang memprioritaskan nama warung lokal.
*   **Requirement:** Data nama warung dan menu di-cache secara lokal (offline storage) setelah login pertama, sehingga pencarian tetap responsif meski tanpa sinyal.

### 4.3 Admin Center & Stock Management
*   **Deskripsi:** Dashboard untuk pemuda desa yang sedang piket.
*   **Requirement:** Fitur "Update Stok" manual hasil konfirmasi via telepon/WA ke warung. Kemampuan untuk mengedit pesanan customer jika stok habis sebelum di-assign ke kurir.

### 4.4 Courier Auction System (Lelang)
*   **Deskripsi:** Mekanisme distribusi tugas kurir.
*   **Requirement:** Admin membagikan detail order ke Grup WA Kurir. Admin mencatat siapa kurir yang memenangkan lelang di aplikasi untuk keperluan bagi hasil.

---

## 5. Non-Functional Requirements
*   **Performance:** Ukuran aplikasi < 2MB (Initial load).
*   **Connectivity:** Pendaftaran akun mewajibkan koneksi internet; Transaksi operasional harus *graceful* terhadap *packet loss*.
*   **Security:** Data nomor HP customer dan kurir hanya dapat diakses oleh Admin aktif.
*   **Tech Stack (Styling):**
    *   **CSS Framework:** Tailwind CSS v4 (CSS-first engine).
    *   **UI Library:** Shadcn UI (Radix UI base).
    *   **Icons:** Lucide React.

---

## 6. Metrik Keberhasilan (Success Metrics)

| Nama Metrik | Target | Mengapa Ini Penting? |
| :--- | :--- | :--- |
| **Checkout Completion Rate** | > 85% | Mengukur efektivitas sistem fallback WhatsApp saat internet buruk. |
| **Courier Response Time** | < 5 Menit | Kecepatan lelang di grup WA menentukan kepuasan pelanggan. |
| **Merchant Retention** | > 90% | Memastikan warung lokal merasa terbantu dengan adanya admin pemuda. |
| **CAC (Customer Acquisition Cost)** | Rp 0 | Fokus pada pertumbuhan organik via komunitas desa (word of mouth). |

---

## 7. Operational Flow (The Village Loop)
1.  **User** pesan di App (Online/Fallback WA).
2.  **Admin** terima pesan $\rightarrow$ Cek Warung.
3.  **Admin** lelang tugas di Grup WA Kurir.
4.  **Kurir** tercepat ambil $\rightarrow$ Antar $\rightarrow$ COD.
5.  **Kurir** setor biaya layanan ke **Admin** di akhir shift.
