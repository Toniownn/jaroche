import type { Request, Response } from 'express';
import { Prisma } from '@prisma/client';
import { updateProfileSchema } from '@jaroche/shared';
import { asyncHandler, AppError } from '../utils/asyncHandler';
import { prisma } from '../config/prisma';
import { publicUser } from '../services/auth.service';

export const usersController = {
  getProfile: asyncHandler(async (req: Request, res: Response) => {
    const user = await prisma.user.findUniqueOrThrow({ where: { id: req.user!.sub } });
    res.json(publicUser(user));
  }),

  updateProfile: asyncHandler(async (req: Request, res: Response) => {
    const data = updateProfileSchema.parse(req.body);
    const user = await prisma.user.update({
      where: { id: req.user!.sub },
      data,
    });
    res.json(publicUser(user));
  }),

  listAll: asyncHandler(async (_req: Request, res: Response) => {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        _count: { select: { orders: true } },
        orders: {
          select: { total: true, status: true, createdAt: true },
        },
      },
    });
    const shaped = users.map((u) => {
      const lifetime = u.orders
        .filter((o) => o.status !== 'CANCELLED' && o.status !== 'PENDING')
        .reduce((sum, o) => sum.plus(new Prisma.Decimal(o.total)), new Prisma.Decimal(0));
      const last = u.orders[0]?.createdAt ?? null;
      return {
        id: u.id,
        name: u.name,
        email: u.email,
        role: u.role,
        createdAt: u.createdAt,
        _count: { orders: u._count.orders },
        lifetimeSpend: Number(lifetime),
        lastOrderAt: last,
      };
    });
    res.json(shaped);
  }),

  getById: asyncHandler(async (req: Request, res: Response) => {
    const user = await prisma.user.findUnique({
      where: { id: req.params.id },
      include: {
        orders: {
          include: { items: { include: { product: true } } },
          orderBy: { createdAt: 'desc' },
        },
      },
    });
    if (!user) throw new AppError(404, 'User not found');
    const lifetime = user.orders
      .filter((o) => o.status !== 'CANCELLED' && o.status !== 'PENDING')
      .reduce((sum, o) => sum.plus(new Prisma.Decimal(o.total)), new Prisma.Decimal(0));
    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
      orders: user.orders,
      lifetimeSpend: Number(lifetime),
      _count: { orders: user.orders.length },
    });
  }),
};
