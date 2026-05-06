import { prisma } from '../config/prisma';

export async function ensureCart(userId: string) {
  return prisma.cart.upsert({
    where: { userId },
    create: { userId },
    update: {},
  });
}

export async function getCartWithItems(userId: string) {
  const cart = await ensureCart(userId);
  return prisma.cart.findUnique({
    where: { id: cart.id },
    include: {
      items: {
        include: { product: true },
        orderBy: { product: { name: 'asc' } },
      },
    },
  });
}
