'use client';

import { useState } from 'react';
import { ShoppingCart } from 'lucide-react';
import { toast } from 'sonner';
import type { Product } from '@jaroche/shared';
import { useCartStore } from '@/stores/cart.store';
import { Button } from '@/components/ui/button';

export function AddToCartButton({ product }: { product: Product }) {
  const add = useCartStore((s) => s.add);
  const [loading, setLoading] = useState(false);

  async function onClick() {
    setLoading(true);
    try {
      await add(product, 1);
      toast.success(`Added ${product.name} to cart.`);
    } catch (err) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        'Could not add to cart.';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }

  if (product.stock <= 0) {
    return (
      <Button disabled size="lg" className="w-full">
        Out of stock
      </Button>
    );
  }

  return (
    <Button size="lg" className="w-full" onClick={onClick} disabled={loading}>
      <ShoppingCart className="size-4" />
      {loading ? 'Adding…' : 'Add to cart'}
    </Button>
  );
}
