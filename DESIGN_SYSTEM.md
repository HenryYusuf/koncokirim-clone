# Design System: KoncoKirim Lite

## 1. Filosofi Desain (Design Philosophy)
KoncoKirim Lite dirancang untuk kecepatan dan kemudahan penggunaan di lingkungan desa dengan keterbatasan koneksi. 
*   **Lite**: Meminimalkan aset berat, mengandalkan tipografi dan warna solid.
*   **Bold**: Menggunakan kontras tinggi agar teks mudah dibaca di bawah sinar matahari (outdoor).
*   **Clean**: Antarmuka tanpa gangguan, fokus pada tugas utama (Pesan & Kirim).

---

## 2. Palet Warna (Tailwind v4 Theme)
Warna didefinisikan melalui variabel CSS dalam blok `@theme` untuk fleksibilitas maksimal dan kompatibilitas dengan Shadcn UI.

| Peran | CSS Variable | Hex | Kegunaan |
| :--- | :--- | :--- | :--- |
| **Primary** | `--color-primary` | `#3B82F6` | Identitas brand, Header, Tombol utama. |
| **Secondary** | `--color-secondary` | `#60A5FA` | Aksen, Tombol sekunder, Status aktif. |
| **CTA / Accent** | `--color-accent` | `#F97316` | Pesan Sekarang, Kirim via WA, Checkout. |
| **Success** | `--color-success` | `#22C55E` | Terkirim, Pesanan Selesai. |
| **Background** | `--color-background` | `#F8FAFC` | Latar belakang aplikasi. |
| **Foreground** | `--color-foreground` | `#0F172A` | Teks utama (Kontras tinggi). |
| **Muted** | `--color-muted` | `#475569` | Teks pendukung, Deskripsi menu. |
| **Destructive** | `--color-destructive` | `#EF4444` | Pesan Error, Batalkan Pesanan. |

---

## 3. Tipografi (Typography)

*   **Heading Font**: `Outfit` (Geometric, Modern)
*   **Body Font**: `Work Sans` (Versatile, Highly Readable)

### Skala Tipografi
*   **Display**: `text-4xl font-black tracking-tight` (Hero sections)
*   **Heading 1**: `text-2xl font-bold` (Judul Halaman)
*   **Heading 2**: `text-lg font-semibold` (Judul Card/Section)
*   **Body**: `text-base font-normal` (Minimal 16px untuk aksesibilitas)
*   **Small**: `text-sm font-medium` (Metadata, Status)

---

## 4. Komponen UI (Component Standards)
Menggunakan **Shadcn UI** sebagai basis komponen untuk konsistensi dan aksesibilitas.

### Tombol (Buttons)
*   **Base**: Shadcn Button component.
*   **Touch Target**: Minimal **44px x 44px**.
*   **Rounded**: `rounded-xl` (Modern feel).
*   **Transition**: `transition-all duration-200 active:scale-95`.
*   **Loading State**: Tampilkan `animate-spin` dari Lucide-react saat proses.

### Input & Form
*   **Base**: Shadcn Input, Form, & Label components.
*   **Style**: Bordered `border-slate-200` dengan focus state `ring-2 ring-primary`.
*   **Feedback**: Pesan error harus muncul di bawah input dengan warna merah kontras (menggunakan Shadcn Form message).

### Cards (Merchant & Menu)
*   **Base**: Shadcn Card component.
*   **Style**: `bg-white shadow-sm border border-slate-100 rounded-2xl`.
*   **Interaction**: Berikan feedback visual saat di-klik/tap.

---

## 5. Pengalaman PWA & Offline (UX Standards)

### Feedback Instan
*   **Optimistic UI**: Update status UI segera setelah aksi (misal: tambah ke keranjang), lalu sinkronkan dengan database di background.
*   **Skeleton Screens**: Gunakan `animate-pulse` untuk area yang sedang memuat data, jangan biarkan layar kosong.

### Fallback WhatsApp
*   Tombol "Kirim via WhatsApp" harus menggunakan warna **CTA Orange** atau **WhatsApp Green** dengan ikon yang jelas.
*   Tampilkan pesan "Koneksi Lemah - Kirim via WA?" jika API timeout > 5 detik.

---

## 6. Pedoman Implementasi (Tailwind CSS v4)
Implementasi menggunakan **Tailwind CSS v4** dengan pendekatan **CSS-first**, menghilangkan kebutuhan akan `tailwind.config.js`.

### Konfigurasi V4 (src/index.css)
```css
@import "tailwindcss";

@theme {
  --font-heading: "Outfit", sans-serif;
  --font-body: "Work Sans", sans-serif;

  --color-primary: #3b82f6;
  --color-accent: #f97316;
  /* ... mapping warna lainnya */

  --radius-xl: 0.75rem;
  --radius-2xl: 1rem;
}
```

### Breakpoints (Mobile-First)
*   **Default**: Desain untuk layar 375px (Mobile).
*   **md**: 768px (Tablet).
*   **lg**: 1024px (Dashboard Admin).

### Spacing & Utility
*   Gunakan unit standar Tailwind (misal: `gap-4` untuk 1rem).
*   Hindari *magic numbers* di luar sistem spacing.

---

## 7. Checklist Kualitas Visual
- [ ] Tidak menggunakan emoji sebagai ikon (Gunakan Lucide-react).
- [ ] Semua elemen interaktif memiliki `cursor-pointer`.
- [ ] Kontras teks minimal 4.5:1 (Slate 900 di atas Slate 50).
- [ ] State focus terlihat jelas untuk navigasi keyboard.
- [ ] Tidak ada scroll horizontal pada perangkat mobile.
horizontal pada perangkat mobile.
