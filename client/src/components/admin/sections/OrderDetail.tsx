'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { formatPHP } from '@/lib/utils';
import type { Order, OrderStatus } from '@jaroche/shared';
import { Icon } from '../Icon';
import { OrderStatusPill } from '../StatusPill';
import { useAdminModal } from '../Modal';

interface AdminOrderDetail extends Order {
  user?: { id: string; name: string; email: string };
}

const STATUS_OPTIONS: OrderStatus[] = [
  'PENDING',
  'PAID',
  'SHIPPED',
  'DELIVERED',
  'CANCELLED',
];

export function OrderDetail({ id }: { id: string }) {
  const router = useRouter();
  const [order, setOrder] = useState<AdminOrderDetail | null>(null);
  const [updating, setUpdating] = useState(false);
  const m = useAdminModal();

  useEffect(() => {
    api.get<AdminOrderDetail>(`/orders/${id}`).then((r) => setOrder(r.data));
  }, [id]);

  if (!order) return <p className="muted">Loading order…</p>;

  async function changeStatus(next: OrderStatus) {
    if (!order || next === order.status) return;
    const ok = await m.confirm(
      `Mark as ${next.toLowerCase()}?`,
      'This updates the order status immediately.',
      'Update'
    );
    if (!ok) return;
    setUpdating(true);
    try {
      const r = await api.put<AdminOrderDetail>(`/orders/${order.id}/status`, { status: next });
      setOrder((prev) => (prev ? { ...prev, status: r.data.status } : prev));
      await m.success('Updated.', 'Order status saved.');
    } catch {
      await m.error('Could not update', 'Something went wrong saving status.');
    } finally {
      setUpdating(false);
    }
  }

  function initials(name?: string) {
    return (name ?? 'GU')
      .split(' ')
      .map((s) => s[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();
  }

  const subtotal = (order.items ?? []).reduce(
    (s, it) => s + Number(it.price) * it.quantity,
    0
  );

  return (
    <div>
      <div className="page-head">
        <div>
          <button
            className="btn btn-quiet"
            onClick={() => router.push('/admin/orders')}
            style={{ marginBottom: '0.4rem', paddingLeft: 0, fontSize: '0.82rem' }}
          >
            <Icon name="chevronLeft" size={14} /> Orders
          </button>
          <div className="row gap-lg" style={{ alignItems: 'center' }}>
            <h1 className="page-title" style={{ marginBottom: 0 }}>
              {order.id.slice(0, 12)}
            </h1>
            <OrderStatusPill status={order.status} />
          </div>
          <p className="page-sub">{new Date(order.createdAt).toLocaleString()}</p>
        </div>
        <div className="page-actions">
          <select
            className="filter-select"
            value={order.status}
            onChange={(e) => void changeStatus(e.target.value as OrderStatus)}
            disabled={updating}
          >
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>
                Mark as {s.toLowerCase()}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="detail-grid">
        <div>
          <div className="card" style={{ marginBottom: 'var(--gap)' }}>
            <div className="card-head">
              <h3 className="card-title">
                Items <span className="muted">{order.items?.length ?? 0} pieces</span>
              </h3>
            </div>
            <div className="card-pad" style={{ paddingTop: 0 }}>
              <div className="line-items">
                {(order.items ?? []).map((it) => (
                  <div key={it.id} className="line-item">
                    <div
                      className="prod-thumb prod-thumb-tone-beige"
                      style={{
                        width: 48,
                        height: 48,
                        borderRadius: 8,
                        backgroundImage: it.product?.imageUrl
                          ? `url(${it.product.imageUrl})`
                          : undefined,
                      }}
                    />
                    <div>
                      <h4>{it.product?.name ?? 'Product'}</h4>
                      <div className="meta">
                        qty {it.quantity} · {formatPHP(it.price)} each
                      </div>
                    </div>
                    <div className="price tabular">
                      {formatPHP(Number(it.price) * it.quantity)}
                    </div>
                  </div>
                ))}
              </div>
              <div className="summary-rows" style={{ marginTop: '1rem' }}>
                <div className="r">
                  <span>Subtotal</span>
                  <span className="v">{formatPHP(subtotal)}</span>
                </div>
                <div className="r total">
                  <span>Total</span>
                  <span className="v">{formatPHP(order.total)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className="card" style={{ marginBottom: 'var(--gap)' }}>
            <div className="card-head">
              <h3 className="card-title">Customer</h3>
            </div>
            <div className="card-pad" style={{ paddingTop: 0 }}>
              <div className="row" style={{ marginBottom: '0.8rem' }}>
                <div className="avatar lg">{initials(order.user?.name)}</div>
                <div>
                  <div style={{ fontWeight: 500 }}>{order.user?.name ?? 'Guest'}</div>
                  <div className="muted" style={{ fontSize: '0.84rem' }}>
                    {order.user?.email ?? ''}
                  </div>
                </div>
              </div>
              <dl className="detail-key">
                <dt>Order ID</dt>
                <dd className="tabular">{order.id}</dd>
                <dt>Placed</dt>
                <dd className="muted">{new Date(order.createdAt).toLocaleString()}</dd>
                {order.stripeSessionId && (
                  <>
                    <dt>Stripe</dt>
                    <dd className="tabular" style={{ fontSize: '0.78rem' }}>
                      {order.stripeSessionId.slice(0, 18)}…
                    </dd>
                  </>
                )}
              </dl>
            </div>
          </div>
        </div>
      </div>
      {m.modal}
    </div>
  );
}
