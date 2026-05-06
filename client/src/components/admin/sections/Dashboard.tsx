'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { formatPHP } from '@/lib/utils';
import type { Order, Product } from '@jaroche/shared';
import { Icon } from '../Icon';
import { KpiCard, Spark } from '../KpiCard';
import { OrderStatusPill, StockStatusPill } from '../StatusPill';
import { useAdminModal } from '../Modal';

interface AdminOrder extends Order {
  user?: { id: string; name: string; email: string };
}

type Range = 'week' | 'month';

function withinRange(d: string, r: Range) {
  const now = Date.now();
  const ms = r === 'week' ? 7 * 86400_000 : 30 * 86400_000;
  return now - new Date(d).getTime() <= ms;
}

function bucketRevenue(orders: AdminOrder[], days = 14): number[] {
  const buckets = Array(days).fill(0) as number[];
  const now = Date.now();
  for (const o of orders) {
    if (o.status !== 'PAID' && o.status !== 'SHIPPED' && o.status !== 'DELIVERED') continue;
    const ageDays = Math.floor((now - new Date(o.createdAt).getTime()) / 86400_000);
    if (ageDays < 0 || ageDays >= days) continue;
    buckets[days - 1 - ageDays] += Number(o.total);
  }
  return buckets;
}

export function Dashboard() {
  const [orders, setOrders] = useState<AdminOrder[] | null>(null);
  const [products, setProducts] = useState<Product[] | null>(null);
  const [range, setRange] = useState<Range>('week');
  const m = useAdminModal();

  useEffect(() => {
    api.get<AdminOrder[]>('/orders/all').then((r) => setOrders(r.data));
    api.get<Product[]>('/products').then((r) => setProducts(r.data));
  }, []);

  const { revenue, orderCount, paidCount, recent, dailyRev } = useMemo(() => {
    const safeOrders = orders ?? [];
    const filtered = safeOrders.filter((o) => withinRange(o.createdAt, range));
    const paid = filtered.filter(
      (o) => o.status === 'PAID' || o.status === 'SHIPPED' || o.status === 'DELIVERED'
    );
    const rev = paid.reduce((s, o) => s + Number(o.total), 0);
    return {
      revenue: rev,
      orderCount: filtered.length,
      paidCount: paid.length,
      recent: safeOrders.slice(0, 5),
      dailyRev: bucketRevenue(safeOrders, 14),
    };
  }, [orders, range]);

  const lowStock = useMemo(
    () =>
      (products ?? [])
        .filter((p) => p.stock < 5)
        .sort((a, b) => a.stock - b.stock)
        .slice(0, 6),
    [products]
  );

  if (!orders || !products) {
    return (
      <div>
        <p className="muted">Loading studio data…</p>
      </div>
    );
  }

  const avgOrder = paidCount > 0 ? revenue / paidCount : 0;
  const todayName = new Date().toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div>
      <div className="page-head">
        <div>
          <h1 className="page-title">
            Welcome back, <em>Studio.</em>
          </h1>
          <p className="page-sub">Here&apos;s how the studio is moving — {todayName}.</p>
        </div>
        <div className="page-actions">
          <div className="filter-pills">
            {(['week', 'month'] as Range[]).map((r) => (
              <button
                key={r}
                className={`filter-pill ${range === r ? 'is-active' : ''}`}
                onClick={() => setRange(r)}
              >
                {r === 'week' ? 'This week' : 'This month'}
              </button>
            ))}
          </div>
          <Link href="/admin/products/new" className="btn btn-primary">
            <Icon name="plus" size={14} />
            <span>New product</span>
          </Link>
        </div>
      </div>

      <div className="kpis">
        <KpiCard
          label={`Revenue (${range === 'week' ? '7d' : '30d'})`}
          value={formatPHP(revenue)}
          spark={<Spark vals={dailyRev.length ? dailyRev : [0, 0, 0]} color="var(--a-good)" />}
        />
        <KpiCard label="Orders" value={String(orderCount)} />
        <KpiCard label="Paid" value={String(paidCount)} />
        <KpiCard label="Avg. order" value={formatPHP(avgOrder)} />
      </div>

      <div className="dash-grid">
        <div className="card">
          <div className="card-head">
            <h3 className="card-title">
              Revenue <span className="muted">last 14 days</span>
            </h3>
          </div>
          <RevenueChart data={dailyRev} />
        </div>

        <div className="card">
          <div className="card-head">
            <h3 className="card-title">Recent orders</h3>
            <Link className="card-link" href="/admin/orders">
              All orders <Icon name="chevron" size={12} />
            </Link>
          </div>
          <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
            {recent.length === 0 && <li style={{ padding: '1rem 1.3rem' }} className="muted">No orders yet.</li>}
            {recent.map((o, i) => (
              <li
                key={o.id}
                style={{
                  padding: '0.85rem 1.3rem',
                  borderBottom: i < recent.length - 1 ? '1px solid var(--a-line-2)' : 'none',
                }}
              >
                <div className="between" style={{ marginBottom: '0.3rem' }}>
                  <Link
                    href={`/admin/orders/${o.id}`}
                    style={{ fontSize: '0.86rem', fontWeight: 500 }}
                  >
                    {o.user?.name ?? 'Guest'}
                  </Link>
                  <strong style={{ fontSize: '0.86rem' }}>{formatPHP(o.total)}</strong>
                </div>
                <div className="between">
                  <span className="muted" style={{ fontSize: '0.78rem' }}>
                    {new Date(o.createdAt).toLocaleString()}
                  </span>
                  <OrderStatusPill status={o.status} />
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="dash-grid-3">
        <div className="card">
          <div className="card-head">
            <h3 className="card-title">Catalog</h3>
            <Link className="card-link" href="/admin/products">
              Manage <Icon name="chevron" size={12} />
            </Link>
          </div>
          <div className="card-pad">
            <div className="between" style={{ marginBottom: '0.6rem' }}>
              <span className="muted">Total products</span>
              <strong>{products.length}</strong>
            </div>
            <div className="between" style={{ marginBottom: '0.6rem' }}>
              <span className="muted">Low stock (&lt; 5)</span>
              <strong>{lowStock.length}</strong>
            </div>
            <div className="between">
              <span className="muted">Out of stock</span>
              <strong>{products.filter((p) => p.stock === 0).length}</strong>
            </div>
          </div>
        </div>

        <div className="card" style={{ gridColumn: 'span 2' }}>
          <div className="card-head">
            <h3 className="card-title">Needs restock</h3>
            <Link className="card-link" href="/admin/products">
              Manage <Icon name="chevron" size={12} />
            </Link>
          </div>
          <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
            {lowStock.length === 0 && (
              <li className="muted" style={{ padding: '1rem 1.3rem' }}>
                Everything is well stocked.
              </li>
            )}
            {lowStock.map((p, i) => (
              <li
                key={p.id}
                className="between"
                style={{
                  padding: '0.85rem 1.3rem',
                  borderBottom: i < lowStock.length - 1 ? '1px solid var(--a-line-2)' : 'none',
                }}
              >
                <div>
                  <div style={{ fontSize: '0.88rem', fontWeight: 500 }}>{p.name}</div>
                  <div className="muted" style={{ fontSize: '0.76rem' }}>
                    {p.category}
                  </div>
                </div>
                <StockStatusPill qty={p.stock} />
              </li>
            ))}
          </ul>
        </div>
      </div>
      {m.modal}
    </div>
  );
}

function RevenueChart({ data }: { data: number[] }) {
  const w = 720;
  const h = 220;
  const pad = 30;
  const safe = data.length >= 2 ? data : [0, 0];
  const max = Math.max(...safe, 1) * 1.1;
  const step = (w - pad * 2) / (safe.length - 1);
  const yFor = (v: number) => pad + (h - pad * 2) * (1 - v / max);
  const pts = safe.map((v, i) => [pad + i * step, yFor(v)] as const);
  const d = pts.map((p, i) => (i ? 'L' : 'M') + p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join(' ');
  const fill = `${d} L${w - pad} ${h - pad} L${pad} ${h - pad} Z`;
  const ylabs = [0, 25, 50, 75, 100];

  return (
    <div className="chart" style={{ padding: 0 }}>
      <svg className="chart-svg" viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none">
        {ylabs.map((p) => {
          const y = pad + (h - pad * 2) * (1 - p / 100);
          return (
            <g key={p}>
              <line
                x1={pad}
                x2={w - pad}
                y1={y}
                y2={y}
                stroke="var(--a-line-2)"
                strokeDasharray="2 4"
              />
              <text x={pad - 6} y={y + 3} textAnchor="end" fontSize="9" fill="var(--a-muted)">
                ₱{Math.round((max * p) / 100 / 1000)}k
              </text>
            </g>
          );
        })}
        <defs>
          <linearGradient id="rev-fill" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#3D2F2F" stopOpacity="0.18" />
            <stop offset="100%" stopColor="#3D2F2F" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={fill} fill="url(#rev-fill)" />
        <path d={d} stroke="#3D2F2F" strokeWidth="2" fill="none" strokeLinecap="round" />
        <circle cx={pts[pts.length - 1][0]} cy={pts[pts.length - 1][1]} r="4" fill="#3D2F2F" />
      </svg>
      <div className="chart-legend">
        <span>
          <span className="chart-legend-dot" style={{ background: '#3D2F2F' }} />
          Revenue
        </span>
      </div>
    </div>
  );
}
