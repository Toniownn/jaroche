'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { formatPHP } from '@/lib/utils';
import type { User } from '@jaroche/shared';
import { Icon } from '../Icon';

interface AdminCustomer extends User {
  lifetimeSpend?: number;
  lastOrderAt?: string | null;
  _count?: { orders: number };
}

type SortKey = 'name' | 'orders' | 'lifetime';

export function CustomersList() {
  const router = useRouter();
  const [customers, setCustomers] = useState<AdminCustomer[] | null>(null);
  const [q, setQ] = useState('');
  const [sort, setSort] = useState<SortKey>('lifetime');

  useEffect(() => {
    api.get<AdminCustomer[]>('/users').then((r) => setCustomers(r.data));
  }, []);

  const sorted = useMemo(() => {
    let f = customers ?? [];
    if (q.trim()) {
      const ql = q.trim().toLowerCase();
      f = f.filter(
        (c) => c.name.toLowerCase().includes(ql) || c.email.toLowerCase().includes(ql)
      );
    }
    return [...f].sort((a, b) => {
      if (sort === 'name') return a.name.localeCompare(b.name);
      if (sort === 'orders') return (b._count?.orders ?? 0) - (a._count?.orders ?? 0);
      return (b.lifetimeSpend ?? 0) - (a.lifetimeSpend ?? 0);
    });
  }, [customers, q, sort]);

  if (!customers) return <p className="muted">Loading customers…</p>;

  function initials(name: string) {
    return name
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
          <h1 className="page-title">Customers</h1>
          <p className="page-sub">{customers.length} studio friends</p>
        </div>
      </div>

      <div className="filters">
        <div className="filter-pills">
          {(
            [
              { id: 'lifetime', label: 'By spend' },
              { id: 'orders', label: 'By orders' },
              { id: 'name', label: 'A → Z' },
            ] as { id: SortKey; label: string }[]
          ).map((opt) => (
            <button
              key={opt.id}
              className={`filter-pill ${sort === opt.id ? 'is-active' : ''}`}
              onClick={() => setSort(opt.id)}
            >
              {opt.label}
            </button>
          ))}
        </div>
        <div className="filter-search">
          <Icon name="search" size={14} />
          <input
            placeholder="Search by name, email…"
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
                <th>Customer</th>
                <th>Role</th>
                <th className="num">Orders</th>
                <th className="num">Lifetime</th>
                <th>Joined</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((c) => (
                <tr
                  key={c.id}
                  onClick={() => router.push(`/admin/customers/${c.id}`)}
                  style={{ cursor: 'pointer' }}
                >
                  <td>
                    <div className="user-cell">
                      <div className="avatar">{initials(c.name)}</div>
                      <div className="user-cell-meta">
                        <div className="user-cell-name">{c.name}</div>
                        <div className="user-cell-sub">{c.email}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span
                      className={`badge ${c.role === 'ADMIN' ? 'good' : 'neutral'} no-dot`}
                    >
                      {c.role.toLowerCase()}
                    </span>
                  </td>
                  <td className="num">{c._count?.orders ?? 0}</td>
                  <td className="num">
                    <strong>{formatPHP(c.lifetimeSpend ?? 0)}</strong>
                  </td>
                  <td className="muted">{new Date(c.createdAt).toLocaleDateString()}</td>
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
  );
}
