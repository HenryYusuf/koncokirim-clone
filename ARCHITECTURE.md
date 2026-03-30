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

Menggunakan struktur monorepo Turborepo untuk berbagi logika bisnis, tipe data, dan komponen UI antar platform. Dokumentasi utama berada di root project, sementara kode aplikasi berada di dalam `koncokirim-app`.

```text
koncokirim-clone/               # Root Project
├── ARCHITECTURE.md             # Dokumen ini
├── PRD.md                      # Dokumen Kebutuhan Produk
├── DATABASE_SCHEMA.md          # Skema Database & ERD
├── DESIGN_SYSTEM.md            # Panduan Visual & UI
└── koncokirim-app/             # Source Code (Monorepo)
    ├── apps/
    │   ├── web/                # Frontend Web (React + TanStack Router)
    │   ├── native/             # Aplikasi Mobile (Expo + Native Navigation)
    │   └── server/             # Backend (Hono + tRPC Server)
    ├── packages/
    │   ├── api/                # Router tRPC & Business Logic
    │   ├── auth/               # Konfigurasi Better-Auth (Server & Expo)
    │   ├── db/                 # Schema Drizzle, Migrasi, & Turso
    │   ├── env/                # Validasi Environment Variables
    │   ├── ui/                 # Shared UI (shadcn/ui + Tailwind v4)
    │   └── config/             # Konfigurasi Shared (TSConfig, dsb)
    ├── turbo.json              # Konfigurasi Turborepo
    └── package.json            # Workspace Root
```

## 3. Strategi Fitur Utama

### 3.1 Type-Safe Communication (tRPC)
Komunikasi antara frontend (Web/Native) dan backend menggunakan tRPC, yang memungkinkan pemanggilan fungsi server secara langsung dengan validasi tipe data otomatis tanpa perlu definisi REST API manual. Router utama didefinisikan di `packages/api`.

### 3.2 Unified Auth (Better-auth)
*   **Web:** Menggunakan `better-auth/react` dengan manajemen sesi berbasis cookie.
*   **Native:** Mendukung `@better-auth/expo` untuk persistensi token yang aman menggunakan `SecureStore`.
*   **Adapter:** Data user dikelola via adapter Drizzle di `packages/db`, mencakup tabel `user`, `session`, `account`, dan `verification`.

### 3.3 Shared UI & Tailwind v4
Desain sistem dibangun menggunakan Tailwind CSS v4 yang terintegrasi di `packages/ui`. Komponen UI bersifat modular dan dapat digunakan kembali di aplikasi Web, sementara aplikasi Native sedang dalam tahap transisi menggunakan komponen khusus mobile.

### 3.4 Environment Management
Validasi *environment variable* dilakukan secara ketat menggunakan Zod di `packages/env` untuk mencegah kesalahan konfigurasi (seperti `DATABASE_URL` atau `BETTER_AUTH_SECRET`) saat runtime.

## 4. Keamanan & Performa
*   **End-to-End Type Safety:** Meminimalkan bug dengan memastikan sinkronisasi tipe dari database hingga ke level UI.
*   **SQLite/Turso:** Optimal untuk performa tinggi dengan latensi rendah, cocok untuk aplikasi yang melayani komunitas lokal.
*   **Bun Ecosystem:** Mempercepat siklus pengembangan mulai dari manajemen paket hingga eksekusi server.
