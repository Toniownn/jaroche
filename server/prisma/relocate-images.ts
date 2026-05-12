import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const products = await prisma.product.findMany({ select: { id: true, imageUrl: true } });
  let updated = 0;
  for (const p of products) {
    if (p.imageUrl.startsWith('/products/')) continue;
    const next = `/products/${p.id}.jpg`;
    await prisma.product.update({ where: { id: p.id }, data: { imageUrl: next } });
    updated++;
  }
  console.log(`updated=${updated} total=${products.length}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
