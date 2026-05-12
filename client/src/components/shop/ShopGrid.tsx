'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import type { Product } from '@jaroche/shared';
import { JarocheProductCard } from './JarocheProductCard';

type SortKey = 'featured' | 'price-asc' | 'price-desc' | 'newest';

const PILLS = [
  'All',
  'Bouquets',
  'Gift Sets',
  'Amigurumi',
  'Tops',
  'Bags',
  'Hats',
  'Home',
] as const;

const SWATCHES: Array<{ tone: string; hex: string; title: string }> = [
  { tone: 'beige', hex: '#D4A97A', title: 'Sand' },
  { tone: 'cocoa', hex: '#3D2F2F', title: 'Cocoa' },
  { tone: 'blush', hex: '#F3DDD3', title: 'Blush' },
  { tone: 'sage', hex: '#CDC6B0', title: 'Sage' },
  { tone: 'cream', hex: '#FDF6F0', title: 'Cream' },
];

const MATERIALS = ['Organic cotton', 'Linen', 'Raffia', 'Merino wool'] as const;
const MAKERS = ['Kathlyn Jarocan'] as const;

const PRICE_MIN_DEFAULT = 0;
const PRICE_MAX_DEFAULT = 12000;

function toggleInSet<T>(set: Set<T>, value: T): Set<T> {
  const next = new Set(set);
  if (next.has(value)) next.delete(value);
  else next.add(value);
  return next;
}

function parsePrice(raw: string, fallback: number): number {
  const digits = raw.replace(/[^\d.]/g, '');
  if (!digits) return fallback;
  const n = Number(digits);
  return Number.isFinite(n) ? n : fallback;
}

export function ShopGrid({ products }: { products: Product[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialCat = searchParams.get('category') ?? 'All';

  const [active, setActive] = useState<string>(initialCat);
  const [sort, setSort] = useState<SortKey>('featured');
  const [tones, setTones] = useState<Set<string>>(new Set());
  const [materials, setMaterials] = useState<Set<string>>(new Set());
  const [makers, setMakers] = useState<Set<string>>(new Set());
  const [priceMinRaw, setPriceMinRaw] = useState<string>(`₱${PRICE_MIN_DEFAULT.toLocaleString()}`);
  const [priceMaxRaw, setPriceMaxRaw] = useState<string>(`₱${PRICE_MAX_DEFAULT.toLocaleString()}`);

  useEffect(() => {
    setActive(searchParams.get('category') ?? 'All');
  }, [searchParams]);

  const visible = useMemo(() => {
    const priceMin = parsePrice(priceMinRaw, PRICE_MIN_DEFAULT);
    const priceMax = parsePrice(priceMaxRaw, PRICE_MAX_DEFAULT);
    const lo = Math.min(priceMin, priceMax);
    const hi = Math.max(priceMin, priceMax);

    let list = products.filter((p) => {
      if (active !== 'All' && p.category !== active) return false;
      if (tones.size > 0 && (!p.tone || !tones.has(p.tone))) return false;
      if (materials.size > 0 && (!p.material || !materials.has(p.material))) return false;
      if (makers.size > 0 && (!p.madeBy || !makers.has(p.madeBy))) return false;
      const price = Number(p.price);
      if (price < lo || price > hi) return false;
      return true;
    });

    if (sort === 'price-asc') list = [...list].sort((a, b) => Number(a.price) - Number(b.price));
    else if (sort === 'price-desc') list = [...list].sort((a, b) => Number(b.price) - Number(a.price));
    else if (sort === 'newest')
      list = [...list].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    return list;
  }, [products, active, sort, tones, materials, makers, priceMinRaw, priceMaxRaw]);

  function selectCategory(cat: string) {
    setActive(cat);
    const params = new URLSearchParams(searchParams.toString());
    if (cat === 'All') params.delete('category');
    else params.set('category', cat);
    const qs = params.toString();
    router.replace(qs ? `/shop?${qs}` : '/shop', { scroll: false });
  }

  function clearFilters() {
    setTones(new Set());
    setMaterials(new Set());
    setMakers(new Set());
    setPriceMinRaw(`₱${PRICE_MIN_DEFAULT.toLocaleString()}`);
    setPriceMaxRaw(`₱${PRICE_MAX_DEFAULT.toLocaleString()}`);
  }

  const anyFilterActive =
    tones.size > 0 ||
    materials.size > 0 ||
    makers.size > 0 ||
    parsePrice(priceMinRaw, PRICE_MIN_DEFAULT) !== PRICE_MIN_DEFAULT ||
    parsePrice(priceMaxRaw, PRICE_MAX_DEFAULT) !== PRICE_MAX_DEFAULT;

  return (
    <>
      <div className="shop-bar">
        <div className="shop-pills">
          {PILLS.map((c) => (
            <button
              key={c}
              type="button"
              className={`shop-pill ${active === c ? 'is-active' : ''}`}
              onClick={() => selectCategory(c)}
            >
              {c}
            </button>
          ))}
        </div>
        <div className="shop-tools">
          <span>Sort by</span>
          <select value={sort} onChange={(e) => setSort(e.target.value as SortKey)}>
            <option value="featured">Featured</option>
            <option value="price-asc">Price — low to high</option>
            <option value="price-desc">Price — high to low</option>
            <option value="newest">Newest</option>
          </select>
        </div>
      </div>

      <div className="shop-grid">
        <aside className="shop-aside">
          <h4>Color</h4>
          <div className="swatch-row" role="group" aria-label="Filter by color">
            {SWATCHES.map((s) => (
              <button
                key={s.tone}
                type="button"
                title={s.title}
                aria-pressed={tones.has(s.tone)}
                aria-label={`${s.title}${tones.has(s.tone) ? ' (selected)' : ''}`}
                className={`swatch ${tones.has(s.tone) ? 'is-active' : ''}`}
                style={{ background: s.hex }}
                onClick={() => setTones((t) => toggleInSet(t, s.tone))}
              />
            ))}
          </div>

          <h4 style={{ marginTop: '2rem' }}>Material</h4>
          <ul>
            {MATERIALS.map((m) => (
              <li key={m}>
                <label>
                  <input
                    type="checkbox"
                    checked={materials.has(m)}
                    onChange={() => setMaterials((s) => toggleInSet(s, m))}
                  />{' '}
                  {m}
                </label>
              </li>
            ))}
          </ul>

          <h4>Price</h4>
          <div className="price-range">
            <input
              value={priceMinRaw}
              onChange={(e) => setPriceMinRaw(e.target.value)}
              onBlur={() => {
                const n = parsePrice(priceMinRaw, PRICE_MIN_DEFAULT);
                setPriceMinRaw(`₱${n.toLocaleString()}`);
              }}
              aria-label="Minimum price"
            />
            <span>–</span>
            <input
              value={priceMaxRaw}
              onChange={(e) => setPriceMaxRaw(e.target.value)}
              onBlur={() => {
                const n = parsePrice(priceMaxRaw, PRICE_MAX_DEFAULT);
                setPriceMaxRaw(`₱${n.toLocaleString()}`);
              }}
              aria-label="Maximum price"
            />
          </div>

          <h4 style={{ marginTop: '2rem' }}>Made by</h4>
          <ul>
            {MAKERS.map((m) => (
              <li key={m}>
                <label>
                  <input
                    type="checkbox"
                    checked={makers.has(m)}
                    onChange={() => setMakers((s) => toggleInSet(s, m))}
                  />{' '}
                  {m}
                </label>
              </li>
            ))}
          </ul>

          {anyFilterActive && (
            <button
              type="button"
              onClick={clearFilters}
              style={{
                marginTop: '1.4rem',
                fontSize: '0.78rem',
                letterSpacing: '0.16em',
                textTransform: 'uppercase',
                color: 'var(--color-cocoa-soft)',
                background: 'transparent',
                border: 0,
                padding: 0,
                cursor: 'pointer',
                borderBottom: '1px solid color-mix(in oklab, var(--color-cocoa) 25%, transparent)',
              }}
            >
              Clear filters
            </button>
          )}
        </aside>

        <main>
          <p className="kicker" style={{ marginBottom: '1.2rem' }}>
            {visible.length} {visible.length === 1 ? 'piece' : 'pieces'}
          </p>
          {visible.length === 0 ? (
            <div
              className="rounded-xl border border-dashed p-12 text-center"
              style={{
                borderColor: 'color-mix(in oklab, var(--color-cocoa) 15%, transparent)',
                color: 'var(--color-cocoa-soft)',
              }}
            >
              No pieces match your filters yet.
            </div>
          ) : (
            <div className="shop-results">
              {visible.map((p) => (
                <JarocheProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </main>
      </div>
    </>
  );
}
