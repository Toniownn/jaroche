import { z } from 'zod';

export const orderCreateSchema = z.object({});
export type OrderCreateInput = z.infer<typeof orderCreateSchema>;

export const orderStatusUpdateSchema = z.object({
  status: z.enum(['PENDING', 'PAID', 'SHIPPED', 'DELIVERED', 'CANCELLED']),
});
export type OrderStatusUpdateInput = z.infer<typeof orderStatusUpdateSchema>;
