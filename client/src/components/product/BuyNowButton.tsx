'use client';

import { useState } from 'react';
import { Zap } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import type { Product } from '@jaroche/shared';
import { useCartStore } from '@/stores/cart.store';
import { Button } from '@/components/ui/button';

export function BuyNowButton({ product }: { product: Product }) {
  const router = useRouter();
  const add = useCartStore((s) => s.add);
  const [loading, setLoading] = useState(false);

  async function onClick() {
    setLoading(true);
    try {
      await add(product, 1);
      router.push('/checkout');
    } catch (err) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        'Could not start checkout.';
      toast.error(msg);
      setLoading(false);
    }
  }

  if (product.stock <= 0) return null;

  return (
    <Button
      size="lg"
      variant="secondary"
      className="w-full"
      onClick={onClick}
      disabled={loading}
    >
      <Zap className="size-4" />
      {loading ? 'Starting…' : 'Buy now'}
    </Button>
  );
}
