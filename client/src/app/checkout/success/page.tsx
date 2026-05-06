'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { CheckCircle2 } from 'lucide-react';
import { useCartStore } from '@/stores/cart.store';
import { Button } from '@/components/ui/button';

export default function CheckoutSuccessPage() {
  const clearCart = useCartStore((s) => s.clear);

  useEffect(() => {
    void clearCart();
  }, [clearCart]);

  return (
    <div className="mx-auto max-w-xl px-4 py-24 text-center">
      <CheckCircle2 className="mx-auto size-14 text-emerald-400" />
      <h1 className="mt-6 font-display text-4xl tracking-tight">Thank you</h1>
      <p className="mt-3 text-muted-foreground">
        Your payment is being confirmed. The order will appear in your history shortly.
      </p>
      <div className="mt-8 flex justify-center gap-3">
        <Button asChild>
          <Link href="/profile">View orders</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/shop">Continue shopping</Link>
        </Button>
      </div>
    </div>
  );
}
