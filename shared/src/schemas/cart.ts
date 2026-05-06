import { z } from 'zod';

export const cartAddItemSchema = z.object({
  productId: z.string().min(1),
  quantity: z.number().int().positive().max(99).default(1),
});
export type CartAddItemInput = z.infer<typeof cartAddItemSchema>;

export const cartUpdateItemSchema = z.object({
  quantity: z.number().int().min(0).max(99),
});
export type CartUpdateItemInput = z.infer<typeof cartUpdateItemSchema>;
