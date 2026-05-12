'use client';

import Link from 'next/link';
import type { Product } from '@jaroche/shared';
import { formatPHP } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Placeholder } from '@/components/common/Placeholder';

export function ProductCard({ product }: { product: Product }) {
  const outOfStock = product.stock <= 0;
  return (
    <Link
      href={`/products/${product.id}`}
      className="group flex flex-col gap-3 rounded-xl border border-border bg-card p-4 transition hover:border-foreground/30"
    >
      <div className="relative aspect-[4/5] overflow-hidden rounded-lg bg-muted">
        {product.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={product.imageUrl}
            alt={product.name}
            className="h-full w-full object-cover transition group-hover:scale-[1.02]"
            loading="lazy"
          />
        ) : (
          <Placeholder
            label={product.label ?? product.name.toLowerCase()}
            tone={product.tone ?? 'beige'}
            ratio="4 / 5"
          />
        )}
        {outOfStock && (
          <div className="absolute inset-0 grid place-items-center bg-background/70">
            <Badge variant="warning">Out of stock</Badge>
          </div>
        )}
      </div>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-wider text-muted-foreground">
            {product.category}
          </p>
          <h3 className="mt-1 line-clamp-1 text-sm font-medium">{product.name}</h3>
        </div>
        <p className="whitespace-nowrap text-sm font-semibold">
          {formatPHP(product.price)}
        </p>
      </div>
    </Link>
  );
}
