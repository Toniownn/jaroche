'use client';

import type { OrderStatus } from '@jaroche/shared';

const orderStatusMap: Record<OrderStatus | string, { label: string; cls: string }> = {
  PAID: { label: 'Paid', cls: 'good' },
  PENDING: { label: 'Pending', cls: 'warn' },
  SHIPPED: { label: 'Shipped', cls: 'info' },
  DELIVERED: { label: 'Delivered', cls: 'good' },
  CANCELLED: { label: 'Cancelled', cls: 'bad' },
};

export function OrderStatusPill({ status }: { status: OrderStatus | string }) {
  const m = orderStatusMap[status] ?? { label: String(status), cls: 'neutral' };
  return <span className={`badge ${m.cls}`}>{m.label}</span>;
}

export function StockStatusPill({ qty, low = 5 }: { qty: number; low?: number }) {
  if (qty === 0) return <span className="badge bad">Out of stock</span>;
  if (qty <= low) return <span className="badge warn">Low · {qty}</span>;
  return <span className="badge good">{qty} in stock</span>;
}
