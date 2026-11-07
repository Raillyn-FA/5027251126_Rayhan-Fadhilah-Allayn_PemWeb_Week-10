import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client.js";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  // Hanya isi data awal jika tabel masih kosong.
  // ID dibiarkan dibuat otomatis oleh database (autoincrement).
  const total = await prisma.product.count();
  if (total > 0) {
    console.log(`Seed dilewati: sudah ada ${total} produk.`);
    return;
  }

  await prisma.product.createMany({
    data: [
      { name: "Buku", price: 15000 },
      { name: "Pulpen", price: 5000 },
    ],
  });
  console.log("Seed selesai: Buku dan Pulpen ditambahkan.");
}

main()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
