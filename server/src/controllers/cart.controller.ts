import type { Request, Response } from 'express';
import { cartAddItemSchema, cartUpdateItemSchema } from '@jaroche/shared';
import { asyncHandler, AppError } from '../utils/asyncHandler';
import { prisma } from '../config/prisma';
import { ensureCart, getCartWithItems } from '../services/cart.service';

export const cartController = {
  getCart: asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.sub;
    const cart = await getCartWithItems(userId);
    res.json(cart);
  }),

  addItem: asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.sub;
    const data = cartAddItemSchema.parse(req.body);

    const product = await prisma.product.findUnique({ where: { id: data.productId } });
    if (!product) throw new AppError(404, 'Product not found');
    if (product.stock < data.quantity) throw new AppError(409, 'Insufficient stock');

    const cart = await ensureCart(userId);
    await prisma.cartItem.upsert({
      where: { cartId_productId: { cartId: cart.id, productId: data.productId } },
      create: { cartId: cart.id, productId: data.productId, quantity: data.quantity },
      update: { quantity: { increment: data.quantity } },
    });

    const result = await getCartWithItems(userId);
    res.json(result);
  }),

  updateItem: asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.sub;
    const data = cartUpdateItemSchema.parse(req.body);
    const cart = await ensureCart(userId);

    const item = await prisma.cartItem.findUnique({ where: { id: req.params.id } });
    if (!item || item.cartId !== cart.id) throw new AppError(404, 'Cart item not found');

    if (data.quantity === 0) {
      await prisma.cartItem.delete({ where: { id: item.id } });
    } else {
      await prisma.cartItem.update({ where: { id: item.id }, data: { quantity: data.quantity } });
    }

    const result = await getCartWithItems(userId);
    res.json(result);
  }),

  removeItem: asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.sub;
    const cart = await ensureCart(userId);
    const item = await prisma.cartItem.findUnique({ where: { id: req.params.id } });
    if (!item || item.cartId !== cart.id) throw new AppError(404, 'Cart item not found');
    await prisma.cartItem.delete({ where: { id: item.id } });
    const result = await getCartWithItems(userId);
    res.json(result);
  }),

  clearCart: asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.sub;
    const cart = await ensureCart(userId);
    await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
    const result = await getCartWithItems(userId);
    res.json(result);
  }),
};
