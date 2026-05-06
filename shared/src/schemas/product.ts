import { z } from 'zod';

export const productCreateSchema = z.object({
  name: z.string().trim().min(1).max(200),
  description: z.string().trim().min(1).max(2000),
  price: z.number().positive().max(1_000_000),
  stock: z.number().int().min(0).max(1_000_000),
  imageUrl: z.string().url(),
  category: z.string().trim().min(1).max(100),
});
export type ProductCreateInput = z.infer<typeof productCreateSchema>;

export const productUpdateSchema = productCreateSchema.partial();
export type ProductUpdateInput = z.infer<typeof productUpdateSchema>;

export const productListQuerySchema = z.object({
  category: z.string().trim().min(1).optional(),
  q: z.string().trim().min(1).optional(),
});
export type ProductListQuery = z.infer<typeof productListQuerySchema>;
