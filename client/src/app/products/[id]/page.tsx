import { notFound } from 'next/navigation';
import type { Product } from '@jaroche/shared';
import { formatPHP } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { AddToCartButton } from '@/components/product/AddToCartButton';
import { BuyNowButton } from '@/components/product/BuyNowButton';
import { Placeholder } from '@/components/common/Placeholder';

const API = process.env.API_TARGET ?? 'http://localhost:4000';

async function fetchProduct(id: string): Promise<Product | null> {
  try {
    const res = await fetch(`${API}/api/products/${id}`, { cache: 'no-store' });
    if (!res.ok) return null;
    return (await res.json()) as Product;
  } catch {
    return null;
  }
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await fetchProduct(id);
  if (!product) notFound();

  return (
    <div className="mx-auto grid max-w-6xl gap-10 px-4 py-10 md:grid-cols-2 md:px-8 md:py-16">
      <div className="relative aspect-[4/5] overflow-hidden rounded-xl bg-muted">
        {product.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={product.imageUrl}
            alt={product.name}
            className="h-full w-full object-cover"
          />
        ) : (
          <Placeholder
            label={product.label ?? product.name.toLowerCase()}
            tone={product.tone ?? 'beige'}
            ratio="4 / 5"
          />
        )}
      </div>

      <div className="flex flex-col">
        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
          {product.category}
        </p>
        <h1 className="mt-3 font-display text-4xl tracking-tight">{product.name}</h1>
        <p className="mt-4 text-2xl font-semibold">{formatPHP(product.price)}</p>

        <div className="mt-6 max-w-prose text-sm leading-relaxed text-muted-foreground">
          {product.description}
        </div>

        <div className="mt-6">
          {product.stock > 0 ? (
            <Badge variant="success">In stock — {product.stock} available</Badge>
          ) : (
            <Badge variant="warning">Out of stock</Badge>
          )}
        </div>

        <div className="mt-8 flex max-w-xs flex-col gap-3">
          <AddToCartButton product={product} />
          <BuyNowButton product={product} />
        </div>
      </div>
    </div>
  );
}
