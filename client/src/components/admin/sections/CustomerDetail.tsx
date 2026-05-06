'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { formatPHP } from '@/lib/utils';
import type { Order, User } from '@jaroche/shared';
import { Icon } from '../Icon';
import { KpiCard } from '../KpiCard';
import { OrderStatusPill } from '../StatusPill';

interface CustomerDetailData extends User {
  orders: Order[];
  lifetimeSpend: number;
  _count: { orders: number };
}

export function CustomerDetail({ id }: { id: string }) {
  const router = useRouter();
  const [data, setData] = useState<CustomerDetailData | null>(null);

  useEffect(() => {
    api.get<CustomerDetailData>(`/users/${id}`).then((r) => setData(r.data));
  }, [id]);

  if (!data) return <p className="muted">Loading customer…</p>;

  const initials = data.name
    .split(' ')
    .map((s) => s[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const orderCount = data._count.orders;
  const avg = orderCount > 0 ? data.lifetimeSpend / orderCount : 0;
  const since = new Date(data.createdAt).toLocaleDateString(undefined, {
    month: 'short',
    year: 'numeric',
  });

  return (
    <div>
      <div className="page-head">
        <div>
          <button
            className="btn btn-quiet"
            onClick={() => router.push('/admin/customers')}
            style={{ marginBottom: '0.4rem', paddingLeft: 0, fontSize: '0.82rem' }}
          >
            <Icon name="chevronLeft" size={14} /> Customers
          </button>
          <div className="row gap-lg" style={{ alignItems: 'center' }}>
            <div className="avatar lg" style={{ width: 56, height: 56, fontSize: '1.1rem' }}>
              {initials}
            </div>
            <div>
              <h1 className="page-title" style={{ marginBottom: 0 }}>
                {data.name}
              </h1>
              <p className="page-sub">{data.email}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="kpis">
        <KpiCard label="Lifetime spend" value={formatPHP(data.lifetimeSpend)} />
        <KpiCard label="Total orders" value={String(orderCount)} />
        <KpiCard label="Avg. order" value={formatPHP(avg)} />
        <KpiCard label="Customer since" value={since} />
      </div>

      <div className="detail-grid">
        <div>
          <div className="card">
            <div className="card-head">
              <h3 className="card-title">Order history</h3>
            </div>
            <div className="table-wrap">
              <table className="table">
                <thead>
                  <tr>
                    <th>Order</th>
                    <th>Date</th>
                    <th className="num">Total</th>
                    <th>Status</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {data.orders.length === 0 && (
                    <tr>
                      <td colSpan={5} className="muted" style={{ padding: '1.4rem' }}>
                        No orders yet.
                      </td>
                    </tr>
                  )}
                  {data.orders.map((o) => (
                    <tr
                      key={o.id}
                      onClick={() => router.push(`/admin/orders/${o.id}`)}
                      style={{ cursor: 'pointer' }}
                    >
                      <td className="id-cell">{o.id.slice(0, 10)}</td>
                      <td className="muted">{new Date(o.createdAt).toLocaleDateString()}</td>
                      <td className="num">
                        <strong>{formatPHP(o.total)}</strong>
                      </td>
                      <td>
                        <OrderStatusPill status={o.status} />
                      </td>
                      <td className="actions-cell">
                        <Icon name="chevron" size={14} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div>
          <div className="card" style={{ marginBottom: 'var(--gap)' }}>
            <div className="card-head">
              <h3 className="card-title">Account</h3>
            </div>
            <div className="card-pad" style={{ paddingTop: 0 }}>
              <dl className="detail-key">
                <dt>Role</dt>
                <dd>{data.role.toLowerCase()}</dd>
                <dt>Joined</dt>
                <dd className="muted">{new Date(data.createdAt).toLocaleDateString()}</dd>
                <dt>User ID</dt>
                <dd className="tabular" style={{ fontSize: '0.78rem' }}>
                  {data.id}
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
