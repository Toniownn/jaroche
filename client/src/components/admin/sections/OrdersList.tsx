'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { formatPHP } from '@/lib/utils';
import type { Order, OrderStatus } from '@jaroche/shared';
import { Icon } from '../Icon';
import { OrderStatusPill } from '../StatusPill';
import { useAdminModal } from '../Modal';

interface AdminOrder extends Order {
  user?: { id: string; name: string; email: string };
}

const TABS: { id: 'all' | OrderStatus; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'PENDING', label: 'Pending' },
  { id: 'PAID', label: 'Paid' },
  { id: 'SHIPPED', label: 'Shipped' },
  { id: 'DELIVERED', label: 'Delivered' },
  { id: 'CANCELLED', label: 'Cancelled' },
];

export function OrdersList() {
  const router = useRouter();
  const [orders, setOrders] = useState<AdminOrder[] | null>(null);
  const [tab, setTab] = useState<'all' | OrderStatus>('all');
  const [q, setQ] = useState('');
  const m = useAdminModal();

  useEffect(() => {
    api.get<AdminOrder[]>('/orders/all').then((r) => setOrders(r.data));
  }, []);

  const counts = useMemo(() => {
    const safe = orders ?? [];
    const obj: Record<string, number> = { all: safe.length };
    for (const t of TABS) if (t.id !== 'all') obj[t.id] = safe.filter((o) => o.status === t.id).length;
    return obj;
  }, [orders]);

  const filtered = useMemo(() => {
    const safe = orders ?? [];
    let f = tab === 'all' ? safe : safe.filter((o) => o.status === tab);
    if (q.trim()) {
      const ql = q.trim().toLowerCase();
      f = f.filter(
        (o) =>
          o.id.toLowerCase().includes(ql) ||
          (o.user?.name ?? '').toLowerCase().includes(ql) ||
          (o.user?.email ?? '').toLowerCase().includes(ql)
      );
    }
    return f;
  }, [orders, tab, q]);

  if (!orders) {
    return <p className="muted">Loading orders…</p>;
  }

  function initials(name?: string) {
    return (name ?? 'GU')
      .split(' ')
      .map((s) => s[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();
  }

  return (
    <div>
      <div className="page-head">
        <div>
          <h1 className="page-title">Orders</h1>
          <p className="page-sub">Every piece going onto and off the hook.</p>
        </div>
        <div className="page-actions">
          <button
            className="btn btn-ghost"
            onClick={() => m.info('Export', 'CSV export will land here once wired.')}
          >
            <Icon name="download" size={14} />
            <span>Export</span>
          </button>
        </div>
      </div>

      <div className="filters">
        <div className="filter-pills">
          {TABS.map((t) => (
            <button
              key={t.id}
              className={`filter-pill ${tab === t.id ? 'is-active' : ''}`}
              onClick={() => setTab(t.id)}
            >
              {t.label} <span className="count">{counts[t.id] ?? 0}</span>
            </button>
          ))}
        </div>
        <div className="filter-search">
          <Icon name="search" size={14} />
          <input
            placeholder="Search by order ID, customer, email…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>
      </div>

      <div className="card">
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>Order</th>
                <th>Date</th>
                <th>Customer</th>
                <th className="num">Items</th>
                <th className="num">Total</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((o) => (
                <tr
                  key={o.id}
                  onClick={() => router.push(`/admin/orders/${o.id}`)}
                  style={{ cursor: 'pointer' }}
                >
                  <td className="id-cell">{o.id.slice(0, 10)}</td>
                  <td className="muted">{new Date(o.createdAt).toLocaleString()}</td>
                  <td>
                    <div className="user-cell">
                      <div className="avatar">{initials(o.user?.name)}</div>
                      <div className="user-cell-meta">
                        <div className="user-cell-name">{o.user?.name ?? 'Guest'}</div>
                        <div className="user-cell-sub">{o.user?.email ?? ''}</div>
                      </div>
                    </div>
                  </td>
                  <td className="num">{o.items?.length ?? 0}</td>
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
        <div
          className="between"
          style={{ padding: '0.8rem 1.3rem', borderTop: '1px solid var(--a-line-2)' }}
        >
          <span className="muted" style={{ fontSize: '0.84rem' }}>
            Showing <strong>{filtered.length}</strong> of <strong>{orders.length}</strong> orders
          </span>
        </div>
      </div>
      {m.modal}
    </div>
  );
}
