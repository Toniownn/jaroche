'use client';

import Link from 'next/link';
import type { Product } from '@jaroche/shared';
import { useCartStore } from '@/stores/cart.store';
import { toast } from 'sonner';
import { Placeholder } from '@/components/common/Placeholder';
import { formatPHP } from '@/lib/utils';

export function JarocheProductCard({ product, tag }: { product: Product; tag?: string }) {
  const add = useCartStore((s) => s.add);
  const outOfStock = product.stock <= 0;
  const displayTag = tag ?? product.tag ?? undefined;

  async function handleAdd(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (outOfStock) {
      toast.error('Out of stock');
      return;
    }
    try {
      await add(product, 1);
      toast.success(`${product.name} added to your basket.`);
    } catch {
      toast.error('Could not add to cart.');
    }
  }

  function handleFav(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    toast.success(`${product.name} saved to your wishlist.`);
  }

  return (
    <article className="prod-card">
      <Link href={`/products/${product.id}`} className="block">
        <div className="prod-img">
          {product.imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={product.imageUrl}
              alt={product.name}
              loading="lazy"
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', aspectRatio: '4 / 5' }}
            />
          ) : (
            <Placeholder
              label={product.label ?? product.name.toLowerCase()}
              tone={product.tone ?? 'beige'}
              ratio="4 / 5"
            />
          )}
          {displayTag && <span className="prod-tag">{displayTag}</span>}
          {outOfStock && (
            <span className="prod-tag" style={{ background: '#8A2929', top: '2.4rem' }}>
              Sold out
            </span>
          )}
          <button type="button" className="prod-fav" aria-label="Save" onClick={handleFav}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth={1.3}>
              <path d="M7 12s-5-3.2-5-7a3 3 0 0 1 5-2 3 3 0 0 1 5 2c0 3.8-5 7-5 7z" strokeLinejoin="round" />
            </svg>
          </button>
          {!outOfStock && (
            <button type="button" className="prod-add" onClick={handleAdd}>
              + Add to cart
            </button>
          )}
        </div>
        <div className="prod-meta">
          <div>
            <h3>{product.name}</h3>
            <div className="prod-swatches" aria-label="Available colors">
              <span style={{ background: '#D4A97A' }} />
              <span style={{ background: '#3D2F2F' }} />
              <span style={{ background: '#F3DDD3' }} />
            </div>
          </div>
          <span className="prod-price">{formatPHP(product.price)}</span>
        </div>
      </Link>
    </article>
  );
}
