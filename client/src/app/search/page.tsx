'use client';

import { useEffect, useState } from 'react';
import type { Product } from '@jaroche/shared';
import { JarocheProductCard } from '@/components/shop/JarocheProductCard';
import { YarnIcon } from '@/components/icons/YarnIcon';

export default function SearchPage() {
  const [q, setQ] = useState('');
  const [debounced, setDebounced] = useState('');
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setDebounced(q.trim()), 250);
    return () => clearTimeout(t);
  }, [q]);

  useEffect(() => {
    if (!debounced) {
      setResults([]);
      return;
    }
    const ctrl = new AbortController();
    setLoading(true);
    fetch(`/api/products?q=${encodeURIComponent(debounced)}`, { signal: ctrl.signal })
      .then((r) => (r.ok ? r.json() : []))
      .then((data: Product[]) => setResults(Array.isArray(data) ? data : []))
      .catch(() => {
        // ignore abort
      })
      .finally(() => setLoading(false));
    return () => ctrl.abort();
  }, [debounced]);

  return (
    <div className="page">
      <section className="search-bar-wrap">
        <div className="search-input-wrap">
          <span className="search-icon-left">
            <svg width="22" height="22" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.4">
              <circle cx="9" cy="9" r="6" />
              <path d="m14 14 4 4" strokeLinecap="round" />
            </svg>
          </span>
          <input
            className="search-input"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="What are you looking for?"
            autoFocus
          />
          {q && (
            <button type="button" className="search-clear" aria-label="Clear" onClick={() => setQ('')}>
              <svg width="12" height="12" viewBox="0 0 12 12" stroke="currentColor" strokeWidth="1.5">
                <path d="M2 2l8 8M10 2l-8 8" strokeLinecap="round" />
              </svg>
            </button>
          )}
        </div>
        <div className="search-suggest">
          <strong>Try</strong>
          {['tote', 'hat', 'cushion', 'pouch', 'bag'].map((s) => (
            <button key={s} type="button" onClick={() => setQ(s)}>
              {s}
            </button>
          ))}
        </div>
      </section>

      {debounced ? (
        <section className="search-results-wrap">
          <div className="results-meta">
            <h2>
              Results for <em>&ldquo;{debounced}&rdquo;</em>
            </h2>
            <span className="count">
              {loading ? 'Searching…' : `${results.length} ${results.length === 1 ? 'piece' : 'pieces'}`}
            </span>
          </div>

          {!loading && results.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--color-cocoa-soft)' }}>
              <YarnIcon size={28} color="#B98A5C" />
              <p style={{ marginTop: '1rem' }}>Nothing here yet. Try another word.</p>
            </div>
          ) : (
            <div className="search-results-grid">
              {results.map((p) => (
                <JarocheProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </section>
      ) : (
        <section className="search-results-wrap" style={{ textAlign: 'center', padding: '4rem var(--pad)' }}>
          <YarnIcon size={36} color="#B98A5C" />
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', fontWeight: 400, marginTop: '1rem' }}>
            Start typing to <em>find a piece.</em>
          </h2>
          <p style={{ color: 'var(--color-cocoa-soft)', marginTop: '0.6rem' }}>
            Search the catalog by name, category, or material.
          </p>
        </section>
      )}
    </div>
  );
}
