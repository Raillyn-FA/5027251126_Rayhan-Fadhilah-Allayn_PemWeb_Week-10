# Express Products API (Week 10: PostgreSQL + Prisma)

Lanjutan API produk Week 9. Array di memori diganti PostgreSQL yang diakses lewat Prisma 7.
Route dan bentuk response tetap sama; ditambah PUT dan DELETE.

Syarat: Node.js 20.19+ (atau 22.12+) dan database PostgreSQL (lokal atau Neon).

## Cara menjalankan
```bash
npm install
```
```bash
copy .env.example .env
```
```bash
npx prisma generate
```
```bash
npx prisma migrate dev --name init
```
```bash
npx prisma db seed
```
```bash
npm run dev
```
Lihat isi database: `npx prisma studio`

## Neon

`neon deploy` pulls the linked branch's environment into `.env.local` when `.env`
does not exist. The app loads `.env` if present, or `.env.local` otherwise.
Application queries use the pooled `DATABASE_URL`; Prisma schema migrations use
`DATABASE_URL_UNPOOLED` when Neon provides it.

## Struktur
```
prisma/
├── schema.prisma          # model Product
├── seed.ts                # data awal
└── migrations/            # dibuat oleh prisma migrate
prisma.config.ts           # koneksi (DATABASE_URL) untuk Prisma CLI
src/
├── controllers/product.controller.ts
├── routes/product.routes.ts
├── middleware/            # request-logger, error-handler
├── lib/prisma.ts          # PrismaClient + adapter PostgreSQL
├── app.ts
└── index.ts
```

## Daftar endpoint
| Method | URL | Body | Hasil |
|---|---|---|---|
| GET | /products | - | 200 + array seluruh produk |
| GET | /products/:id | - | 200 + produk; 400 id tidak valid; 404 tidak ada |
| POST | /products | `{name, price}` | 201 + produk baru; 400 body tidak valid |
| PUT | /products | `{id, name, price}` | 200 + produk terbaru; 400; 404 |
| PUT | /products/:id | `{name, price}` | sama seperti di atas (id di URL) |
| DELETE | /products/:id | - | 200 + produk yang dihapus; 400; 404 |

## Skenario pengujian (untuk evidence)
| # | Request | Hasil |
|---|---|---|
| 1 | GET /products | 200 |
| 2 | GET /products/1 | 200 |
| 3 | GET /products/999 | 404 |
| 4 | GET /products/abc | 400 |
| 5 | POST `{"name":"Penghapus","price":3000}` | 201 |
| 6 | POST `{"name":"","price":"murah"}` | 400 |
| 7 | POST dengan JSON rusak | 400 |
| 8 | PUT `{"id":3,"name":"Penghapus Besar","price":3500}` | 200 |
| 9 | PUT `{"id":999,"name":"X","price":1000}` | 404 |
| 10 | PUT `{"id":3,"price":3500}` (tanpa name) | 400 |
| 11 | DELETE /products/3 | 200 |
| 12 | DELETE /products/3 (diulang) | 404 |

Untuk skenario 5, 8, dan 11, ambil screenshot Prisma Studio (tabel Product) sebelum dan sesudah request.

## Pengumpulan
1. `git init`, commit, lalu push ke repository GitHub. File `.env` sudah di `.gitignore` (rahasia tidak masuk Git).
2. Kumpulkan link repository dan laporan evidence.
