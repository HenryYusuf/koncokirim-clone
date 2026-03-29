# Arsitektur Teknis: KoncoKirim (Lite)

Dokumen ini merinci keputusan arsitektur, tumpukan teknologi, dan struktur folder untuk proyek KoncoKirim (Lite) berdasarkan boilerplate Better-T-Stack.

## 1. Tumpukan Teknologi (Tech Stack)

Aplikasi ini dibangun menggunakan **Better-T-Stack**, fokus pada *type-safety* end-to-end dan performa tinggi menggunakan Bun runtime.

| Layer | Teknologi | Peran & Alasan |
| :--- | :--- | :--- |
| **Runtime** | **Bun** | Runtime JavaScript super cepat dengan *package manager* terintegrasi. |
| **Frontend (Web)** | **React + TanStack Router** | SPA dengan *routing* berbasis file yang sepenuhnya *type-safe*. |
| **Mobile** | **React Native + Expo** | Aplikasi native lintas platform (iOS/Android) dengan Expo Router. |
| **API Layer** | **tRPC** | Komunikasi antara klien dan server dengan *type-safety* otomatis tanpa kode manual. |
| **Backend** | **Hono** | Framework web ultra-ringan dan cepat untuk menangani request API & Auth. |
| **Database** | **SQLite (Turso)** | Database SQL ringan, optimal untuk performa tinggi dan *edge deployment*. |
| **ORM** | **Drizzle ORM** | Type-safe ORM tercepat, berinteraksi langsung dengan SQLite. |
| **Authentication** | **Better-auth** | Solusi auth modern dengan dukungan plugin Expo dan integrasi Drizzle. |
| **Styling** | **Tailwind CSS v4** | *Utility-first* CSS generasi terbaru untuk performa runtime nol. |
| **Monorepo** | **Turborepo** | Sistem build yang dioptimalkan untuk mengelola multiple apps dan packages. |

## 2. Struktur Folder (Monorepo)

Menggunakan struktur monorepo Turborepo untuk berbagi logika bisnis, tipe data, dan komponen UI antar platform.

```text
koncokirim-app/
├── apps/
│   ├── web/         # Frontend Web (React + TanStack Router + Vite)
│   ├── native/      # Aplikasi Mobile (React Native + Expo)
│   └── server/      # Backend Entry Point (Hono + tRPC Server)
│
├── packages/
│   ├── api/         # Definisi Router tRPC & Business Logic
│   ├── auth/        # Konfigurasi Better-Auth (Server-side)
│   ├── db/          # Schema Drizzle, Migrasi, & Database Client
│   ├── env/         # Validasi Environment Variables (T3 Env)
│   ├── ui/          # Shared UI Components (shadcn/ui + Base UI)
│   └── config/      # Konfigurasi Shared (TSConfig, dsb)
│
├── ARCHITECTURE.md  # Dokumen ini
├── PRD.md           # Dokumen Kebutuhan Produk
├── turbo.json       # Konfigurasi Turborepo
└── package.json     # Workspace Root
```

## 3. Strategi Fitur Utama

### 3.1 Type-Safe Communication (tRPC)
Berbeda dengan REST tradisional, tRPC memungkinkan frontend (Web & Native) untuk memanggil fungsi backend seolah-olah fungsi lokal dengan validasi tipe data otomatis dari router di `packages/api`.

### 3.2 Unified Auth (Better-auth)
*   **Web:** Menggunakan `better-auth/react` untuk manajemen session via cookie.
*   **Native:** Menggunakan `@better-auth/expo` dengan `SecureStore` untuk persistensi token secara aman di perangkat mobile.
*   **Database:** Tabel user, session, dan account dikelola secara otomatis via adapter Drizzle di `packages/db`.

### 3.3 Shared Design System
Komponen UI dasar (Button, Input, Card) didefinisikan sekali di `packages/ui` menggunakan Tailwind CSS v4 dan Radix UI primitives (Base UI), lalu diimpor oleh aplikasi Web.

### 3.4 Environment Management
Menggunakan `packages/env` untuk memastikan semua *environment variables* yang dibutuhkan (seperti `DATABASE_URL` atau `SERVER_URL`) tervalidasi saat *build-time* dan *runtime* menggunakan Zod.

## 4. Keamanan & Performa
*   **End-to-End Type Safety:** Mencegah bug runtime dengan memastikan kontrak data antara DB -> API -> Frontend konsisten.
*   **SQLite Optimization:** SQLite memberikan latensi rendah untuk operasi baca/tulis yang sering dilakukan pada aplikasi lite.
*   **Bun Performance:** Mempercepat proses instalasi dependensi, build, dan waktu start server secara signifikan.
