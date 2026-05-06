import { Prisma } from '@prisma/client';
import { prisma } from '../config/prisma';
import { AppError } from '../utils/asyncHandler';
import { getCartWithItems } from './cart.service';

/**
 * Create a PENDING order from the user's cart.
 * Stock is checked here but NOT decremented — that happens on Stripe webhook PAID,
 * so abandoned checkouts don't oversell.
 */
export async function createOrderFromCart(userId: string) {
  const cart = await getCartWithItems(userId);
  if (!cart || cart.items.length === 0) throw new AppError(400, 'Cart is empty');

  for (const item of cart.items) {
    if (item.product.stock < item.quantity) {
      throw new AppError(409, `Insufficient stock for ${item.product.name}`);
    }
  }

  const total = cart.items.reduce(
    (sum, item) => sum.plus(new Prisma.Decimal(item.product.price).times(item.quantity)),
    new Prisma.Decimal(0)
  );

  const order = await prisma.$transaction(async (tx) => {
    return tx.order.create({
      data: {
        userId,
        status: 'PENDING',
        total,
        items: {
          create: cart.items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.product.price,
          })),
        },
      },
      include: { items: { include: { product: true } } },
    });
  });

  return order;
}

/**
 * On Stripe webhook PAID: idempotently flip status, decrement stock, clear cart.
 */
export async function markOrderPaid(orderId: string, stripeSessionId: string) {
  await prisma.$transaction(async (tx) => {
    const order = await tx.order.findUnique({
      where: { id: orderId },
      include: { items: true },
    });
    if (!order) throw new AppError(404, 'Order not found');
    if (order.status === 'PAID') return; // idempotent no-op

    for (const item of order.items) {
      const updated = await tx.product.updateMany({
        where: { id: item.productId, stock: { gte: item.quantity } },
        data: { stock: { decrement: item.quantity } },
      });
      if (updated.count === 0) {
        throw new AppError(409, `Stock changed for product ${item.productId}`);
      }
    }

    await tx.order.update({
      where: { id: orderId },
      data: { status: 'PAID', stripeSessionId },
    });

    const cart = await tx.cart.findUnique({ where: { userId: order.userId } });
    if (cart) await tx.cartItem.deleteMany({ where: { cartId: cart.id } });
  });
}
