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

link github: https://github.com/Raillyn-FA/5027251126_Rayhan-Fadhilah-Allayn_PemWeb_Week-10.git
