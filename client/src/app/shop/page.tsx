import { Suspense } from 'react';
import type { Product } from '@jaroche/shared';
import { ShopGrid } from '@/components/shop/ShopGrid';
import { PageHero } from '@/components/common/PageHero';

const API = process.env.API_TARGET ?? 'http://localhost:4000';

async function fetchProducts(): Promise<Product[]> {
  try {
    const res = await fetch(`${API}/api/products`, { cache: 'no-store' });
    if (!res.ok) return [];
    return (await res.json()) as Product[];
  } catch {
    return [];
  }
}

export default async function ShopPage() {
  const products = await fetchProducts();

  return (
    <div className="page">
      <PageHero
        kicker="Spring 2026"
        title={<>The <em>full</em> collection.</>}
        sub="118 pieces in small batches. Made to order in 7–14 days, shipped in unbleached linen."
      />

      <Suspense fallback={<div className="shop-grid"><p className="kicker">Loading…</p></div>}>
        <ShopGrid products={products} />
      </Suspense>
    </div>
  );
}
