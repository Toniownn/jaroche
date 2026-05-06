'use client';

import { useEffect, useMemo, useState } from 'react';
import { api } from '@/lib/api';
import { formatPHP } from '@/lib/utils';
import type { Order } from '@jaroche/shared';
import { KpiCard } from '../KpiCard';

interface AdminOrder extends Order {
  user?: { id: string; name: string; email: string };
}

type Range = 30 | 90 | 365;

export function Analytics() {
  const [orders, setOrders] = useState<AdminOrder[] | null>(null);
  const [range, setRange] = useState<Range>(30);

  useEffect(() => {
    api.get<AdminOrder[]>('/orders/all').then((r) => setOrders(r.data));
  }, []);

  const { totals, daily, prev } = useMemo(() => {
    const safe = orders ?? [];
    // eslint-disable-next-line react-hooks/purity -- time window depends on the current clock
    const now = Date.now();
    const cutoff = now - range * 86400_000;
    const prevCutoff = cutoff - range * 86400_000;
    const inRange = safe.filter((o) => new Date(o.createdAt).getTime() >= cutoff);
    const inPrev = safe.filter((o) => {
      const t = new Date(o.createdAt).getTime();
      return t >= prevCutoff && t < cutoff;
    });
    const paid = (xs: AdminOrder[]) =>
      xs.filter(
        (o) => o.status === 'PAID' || o.status === 'SHIPPED' || o.status === 'DELIVERED'
      );
    const sum = (xs: AdminOrder[]) => xs.reduce((s, o) => s + Number(o.total), 0);
    const t = {
      revenue: sum(paid(inRange)),
      orders: inRange.length,
      paid: paid(inRange).length,
      avg: paid(inRange).length > 0 ? sum(paid(inRange)) / paid(inRange).length : 0,
    };
    const buckets = Array(range).fill(0) as number[];
    const ordBuckets = Array(range).fill(0) as number[];
    for (const o of inRange) {
      const ageDays = Math.floor((now - new Date(o.createdAt).getTime()) / 86400_000);
      if (ageDays < 0 || ageDays >= range) continue;
      ordBuckets[range - 1 - ageDays] += 1;
      if (paid([o]).length) buckets[range - 1 - ageDays] += Number(o.total);
    }
    return {
      totals: t,
      daily: { rev: buckets, ord: ordBuckets },
      prev: {
        revenue: sum(paid(inPrev)),
        orders: inPrev.length,
      },
    };
  }, [orders, range]);

  if (!orders) return <p className="muted">Loading analytics…</p>;

  function pctDelta(curr: number, p: number) {
    if (p === 0) return curr > 0 ? '+100%' : '+0%';
    const d = Math.round(((curr - p) / p) * 100);
    return `${d >= 0 ? '+' : ''}${d}%`;
  }

  return (
    <div>
      <div className="page-head">
        <div>
          <h1 className="page-title">Analytics</h1>
          <p className="page-sub">
            Last {range} days · derived from order data
          </p>
        </div>
        <div className="page-actions">
          <select
            className="filter-select"
            value={range}
            onChange={(e) => setRange(Number(e.target.value) as Range)}
          >
            <option value={30}>Last 30 days</option>
            <option value={90}>Last 90 days</option>
            <option value={365}>This year</option>
          </select>
        </div>
      </div>

      <div className="kpis">
        <KpiCard
          label="Revenue"
          value={formatPHP(totals.revenue)}
          delta={pctDelta(totals.revenue, prev.revenue)}
          deltaDir={totals.revenue >= prev.revenue ? 'up' : 'down'}
        />
        <KpiCard
          label="Orders"
          value={String(totals.orders)}
          delta={pctDelta(totals.orders, prev.orders)}
          deltaDir={totals.orders >= prev.orders ? 'up' : 'down'}
        />
        <KpiCard label="Paid orders" value={String(totals.paid)} />
        <KpiCard label="Avg. order" value={formatPHP(totals.avg)} />
      </div>

      <div className="dash-grid">
        <div className="card">
          <div className="card-head">
            <h3 className="card-title">Revenue trend</h3>
          </div>
          <Chart vals={daily.rev} unit="currency" color="#3D2F2F" />
        </div>
        <div className="card">
          <div className="card-head">
            <h3 className="card-title">Daily orders</h3>
          </div>
          <BarChart vals={daily.ord} />
        </div>
      </div>
    </div>
  );
}

function Chart({
  vals,
  color,
  unit,
}: {
  vals: number[];
  color: string;
  unit: 'currency' | 'count';
}) {
  const w = 720;
  const h = 220;
  const pad = 30;
  const safe = vals.length >= 2 ? vals : [0, 0];
  const max = Math.max(...safe, 1) * 1.1;
  const step = (w - pad * 2) / (safe.length - 1);
  const yFor = (v: number) => pad + (h - pad * 2) * (1 - v / max);
  const pts = safe.map((v, i) => [pad + i * step, yFor(v)] as const);
  const d = pts.map((p, i) => (i ? 'L' : 'M') + p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join(' ');
  const fill = `${d} L${w - pad} ${h - pad} L${pad} ${h - pad} Z`;

  return (
    <div className="chart" style={{ padding: 0 }}>
      <svg className="chart-svg" viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none">
        {[0, 25, 50, 75, 100].map((p) => {
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
                {unit === 'currency'
                  ? `₱${Math.round((max * p) / 100 / 1000)}k`
                  : Math.round((max * p) / 100)}
              </text>
            </g>
          );
        })}
        <path d={fill} fill={color} fillOpacity={0.18} />
        <path d={d} stroke={color} strokeWidth="2" fill="none" strokeLinecap="round" />
      </svg>
    </div>
  );
}

function BarChart({ vals }: { vals: number[] }) {
  const w = 720;
  const h = 220;
  const pad = 30;
  const max = Math.max(...vals, 1);
  const bw = (w - pad * 2) / vals.length;
  return (
    <div className="chart" style={{ padding: 0 }}>
      <svg className="chart-svg" viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none">
        {[0, 25, 50, 75, 100].map((p) => {
          const y = pad + (h - pad * 2) * (1 - p / 100);
          return (
            <line
              key={p}
              x1={pad}
              x2={w - pad}
              y1={y}
              y2={y}
              stroke="var(--a-line-2)"
              strokeDasharray="2 4"
            />
          );
        })}
        {vals.map((v, i) => {
          const barH = ((h - pad * 2) * v) / max;
          return (
            <rect
              key={i}
              x={pad + i * bw + bw * 0.15}
              y={h - pad - barH}
              width={bw * 0.7}
              height={barH}
              fill="#B98A5C"
              rx="2"
            />
          );
        })}
      </svg>
    </div>
  );
}
