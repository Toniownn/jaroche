import type { Request, Response } from 'express';
import { orderStatusUpdateSchema } from '@jaroche/shared';
import { asyncHandler, AppError } from '../utils/asyncHandler';
import { prisma } from '../config/prisma';
import { createOrderFromCart } from '../services/order.service';

export const ordersController = {
  create: asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.sub;
    const order = await createOrderFromCart(userId);
    res.status(201).json(order);
  }),

  listOwn: asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.sub;
    const orders = await prisma.order.findMany({
      where: { userId },
      include: { items: { include: { product: true } } },
      orderBy: { createdAt: 'desc' },
    });
    res.json(orders);
  }),

  listAll: asyncHandler(async (_req: Request, res: Response) => {
    const orders = await prisma.order.findMany({
      include: {
        items: { include: { product: true } },
        user: { select: { id: true, name: true, email: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
    res.json(orders);
  }),

  getById: asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.sub;
    const role = req.user!.role;
    const order = await prisma.order.findUnique({
      where: { id: req.params.id },
      include: { items: { include: { product: true } } },
    });
    if (!order) throw new AppError(404, 'Order not found');
    if (order.userId !== userId && role !== 'ADMIN') throw new AppError(403, 'Forbidden');
    res.json(order);
  }),

  updateStatus: asyncHandler(async (req: Request, res: Response) => {
    const data = orderStatusUpdateSchema.parse(req.body);
    const order = await prisma.order.update({
      where: { id: req.params.id },
      data: { status: data.status },
    });
    res.json(order);
  }),
};
