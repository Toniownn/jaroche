import type { Request, Response } from 'express';
import { productCreateSchema, productUpdateSchema, productListQuerySchema } from '@jaroche/shared';
import { asyncHandler, AppError } from '../utils/asyncHandler';
import { prisma } from '../config/prisma';

export const productsController = {
  list: asyncHandler(async (req: Request, res: Response) => {
    const query = productListQuerySchema.parse(req.query);
    const where: Record<string, unknown> = {};
    if (query.category) where.category = query.category;
    if (query.q) where.name = { contains: query.q, mode: 'insensitive' };
    const products = await prisma.product.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });
    res.json(products);
  }),

  getById: asyncHandler(async (req: Request, res: Response) => {
    const product = await prisma.product.findUnique({ where: { id: req.params.id } });
    if (!product) throw new AppError(404, 'Product not found');
    res.json(product);
  }),

  create: asyncHandler(async (req: Request, res: Response) => {
    const data = productCreateSchema.parse(req.body);
    const product = await prisma.product.create({ data });
    res.status(201).json(product);
  }),

  update: asyncHandler(async (req: Request, res: Response) => {
    const data = productUpdateSchema.parse(req.body);
    const product = await prisma.product.update({
      where: { id: req.params.id },
      data,
    });
    res.json(product);
  }),

  remove: asyncHandler(async (req: Request, res: Response) => {
    await prisma.product.delete({ where: { id: req.params.id } });
    res.status(204).end();
  }),
};
