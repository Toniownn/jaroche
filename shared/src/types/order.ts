import type { Product } from './product';

export type OrderStatus =
  | 'PENDING'
  | 'PAID'
  | 'SHIPPED'
  | 'DELIVERED'
  | 'CANCELLED';

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  quantity: number;
  price: number;
  product?: Product;
}

export interface Order {
  id: string;
  userId: string;
  status: OrderStatus;
  total: number;
  stripeSessionId?: string | null;
  createdAt: string;
  items?: OrderItem[];
}
