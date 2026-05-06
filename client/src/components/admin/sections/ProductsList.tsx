'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { formatPHP } from '@/lib/utils';
import type { Product } from '@jaroche/shared';
import { Icon } from '../Icon';
import { StockStatusPill } from '../StatusPill';
import { useAdminModal } from '../Modal';

export function ProductsList() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[] | null>(null);
  const [q, setQ] = useState('');
  const [category, setCategory] = useState<string>('all');
  const m = useAdminModal();

  const reload = () => api.get<Product[]>('/products').then((r) => setProducts(r.data));

  useEffect(() => {
    void reload();
  }, []);

  const categories = useMemo(() => {
    const set = new Set<string>();
    (products ?? []).forEach((p) => set.add(p.category));
    return Array.from(set).sort();
  }, [products]);

  const filtered = useMemo(() => {
    let f = products ?? [];
    if (category !== 'all') f = f.filter((p) => p.category === category);
    if (q.trim()) {
      const ql = q.trim().toLowerCase();
      f = f.filter((p) => p.name.toLowerCase().includes(ql));
    }
    return f;
  }, [products, q, category]);

  if (!products) return <p className="muted">Loading products…</p>;

  return (
    <div>
      <div className="page-head">
        <div>
          <h1 className="page-title">Products</h1>
          <p className="page-sub">{products.length} pieces in your catalog</p>
        </div>
        <div className="page-actions">
          <Link href="/admin/products/new" className="btn btn-primary">
            <Icon name="plus" size={14} />
            New product
          </Link>
        </div>
      </div>

      <div className="filters">
        <div className="filter-pills">
          <button
            className={`filter-pill ${category === 'all' ? 'is-active' : ''}`}
            onClick={() => setCategory('all')}
          >
            All <span className="count">{products.length}</span>
          </button>
          {categories.map((c) => (
            <button
              key={c}
              className={`filter-pill ${category === c ? 'is-active' : ''}`}
              onClick={() => setCategory(c)}
            >
              {c}{' '}
              <span className="count">
                {products.filter((p) => p.category === c).length}
              </span>
            </button>
          ))}
        </div>
        <div className="filter-search">
          <Icon name="search" size={14} />
          <input
            placeholder="Search products…"
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
                <th>Product</th>
                <th>Category</th>
                <th>Tone</th>
                <th>Material</th>
                <th>Made by</th>
                <th>Tag</th>
                <th className="num">Price</th>
                <th>Stock</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr
                  key={p.id}
                  onClick={() => router.push(`/admin/products/${p.id}`)}
                  style={{ cursor: 'pointer' }}
                >
                  <td>
                    <div className="prod-cell">
                      <div
                        className={`prod-thumb prod-thumb-tone-${p.tone ?? 'beige'}`}
                        style={{
                          backgroundImage: p.imageUrl ? `url(${p.imageUrl})` : undefined,
                        }}
                      />
                      <div>
                        <div style={{ fontWeight: 500 }}>{p.name}</div>
                        <div className="muted" style={{ fontSize: '0.78rem' }}>
                          {p.label ?? ''}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="muted">{p.category}</td>
                  <td className="muted">{p.tone ?? '—'}</td>
                  <td className="muted">{p.material ?? '—'}</td>
                  <td className="muted">{p.madeBy ?? '—'}</td>
                  <td>
                    {p.tag ? (
                      <span className="badge neutral no-dot">{p.tag}</span>
                    ) : (
                      <span className="muted">—</span>
                    )}
                  </td>
                  <td className="num">
                    <strong>{formatPHP(p.price)}</strong>
                  </td>
                  <td>
                    <StockStatusPill qty={p.stock} />
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
      {m.modal}
    </div>
  );
}
