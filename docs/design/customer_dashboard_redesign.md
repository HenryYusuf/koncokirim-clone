# Design Specification: Customer Dashboard Redesign

## 1. Understanding Summary
*   **Aplikasi:** KoncoKirim Lite (Village Food Delivery).
*   **Halaman:** Dashboard Customer (`/_app.dashboard.tsx`).
*   **Tujuan:** Memberikan antarmuka yang sangat bersih (*Lite*), cepat, dan kontras tinggi (*Bold*) untuk mencari warung lokal di area desa.
*   **Cakupan:** 100% fokus pada **Discovery Hub** (Pencarian), navigasi utama dipindahkan ke **Bottom Navigation**.

## 2. Asumsi Teknis
*   **Performance:** Target muat awal < 2MB, dashboard aktif dalam < 1 detik.
*   **Connectivity:** Mendukung *Offline-First* dengan caching data merchant via TRPC/TanStack Query.
*   **Tech Stack:** React (Vite), Tailwind CSS v4, Lucide Icons, Shadcn UI.
*   **Typography:** Outfit (Heading), Work Sans (Body).

## 3. Log Keputusan (Decision Log)

| Keputusan | Alternatif Dipertimbangkan | Alasan Pemilihan |
| :--- | :--- | :--- |
| **Discovery Hub (100%)** | Activity Hub, Mixed Dash | Menghilangkan distraksi, fokus pada tugas "Pesan". |
| **Bottom Navigation** | Top Header Nav | Memudahkan penggunaan satu tangan (*one-handed mobile usage*). |
| **Separated Layouts** | Shared Single Layout | Membedakan nuansa "Informasional" (Landing) dan "Operasional" (App/Dashboard). |
| **Semantic Dark Mode** | Local Hardcoded Colors | Menjamin konsistensi visual di seluruh komponen (Card, Input, Nav). |

## 4. Desain Akhir (Final UI Design)

### 4.1 Layout & Area Hero
*   **Layout App (`_app.tsx`):** `h-svh bg-background` dengan `BottomNavigation` dan `pb-24`.
*   **Hero Heading:** `text-4xl font-black text-primary tracking-tight` (Outfit). Teks: *"Makan apa hari ini?"*
*   **Subtext:** `text-base text-muted-foreground mt-2` (Work Sans). Teks: *"Cari warung favorit di sekitarmu."*

### 4.2 Sistem Pencarian (The Search Unit)
*   **Search Input:** `h-14 rounded-2xl bg-card border-2 border-border focus-visible:ring-primary shadow-sm`.
*   **Placeholder:** *"Cari nama warung..."*
*   **Ikon:** `Search` (Lucide) di sisi kiri, `SlidersHorizontal` di sisi kanan.

### 4.3 Merchant List (Daftar Warung)
*   **Wrapper:** `space-y-4 mt-8`.
*   **Card Element:** `bg-card border border-border rounded-2xl p-5 shadow-sm active:scale-95 transition-all`.
*   **Informasi Kartu:**
    - **Nama (Outfit/Bold):** `text-lg font-black text-foreground`.
    - **Jarak (Work Sans/Muted):** `text-muted-foreground text-sm` dengan ikon `MapPin`.
    - **Status (Badge):** `Badge` hijau untuk "BUKA", `bg-muted` untuk "TUTUP".

### 4.4 Kondisi Khusus (Edge Cases)
*   **Loading:** Gunakan `Skeleton` dengan pola kartu yang sama.
*   **Offline:** Badge `"Bekerja Luring"` (`bg-accent/15 text-accent`) yang muncul secara dinamis via `navigator.onLine`.
*   **Dark Mode:** Seluruh elemen menggunakan variabel CSS (`bg-card`, `text-foreground`, `border-border`) untuk dukungan mode gelap otomatis.

## 5. Implementation Status

| Task ID | Description | Status | Files |
| :--- | :--- | :--- | :--- |
| **T1** | Setup Layout & Hero | ✅ Done | `_app.dashboard.tsx` |
| **T2** | Search Unit Component | ✅ Done | `_app.dashboard.tsx` |
| **T3** | Badge UI Component | ✅ Done | `packages/ui/src/components/badge.tsx` |
| **T4** | Merchant List (Mock) | ✅ Done | `_app.dashboard.tsx` |
| **T5** | Bottom Navigation UI | ✅ Done | `components/bottom-navigation.tsx` |
| **T6** | Separated Layouts | ✅ Done | `_app.tsx`, `_landing.tsx` |
| **T7** | Dark Mode Polish | ✅ Done | All dashboard pages |

---
*Updated by Antigravity - 2026-03-29*
