'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useAuthStore } from '@/stores/auth.store';
import { useCartStore } from '@/stores/cart.store';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { formatPHP } from '@/lib/utils';
import type { Order } from '@jaroche/shared';

export default function CheckoutPage() {
  const router = useRouter();
  const isHydrated = useAuthStore((s) => s.isHydrated);
  const user = useAuthStore((s) => s.user);
  const items = useCartStore((s) => s.items);
  const totalPrice = useCartStore((s) => s.totalPrice());

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isHydrated) return;
    if (!user) router.replace('/login?next=/checkout');
  }, [isHydrated, user, router]);

  if (!isHydrated || !user) {
    return <div className="px-8 py-16 text-center text-muted-foreground">Loading…</div>;
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-24 text-center">
        <h1 className="font-display text-3xl">Nothing to check out</h1>
        <Button asChild className="mt-6">
          <a href="/shop">Back to shop</a>
        </Button>
      </div>
    );
  }

  async function startCheckout() {
    setLoading(true);
    try {
      const orderRes = await api.post<Order>('/orders', {});
      const sessionRes = await api.post<{ url: string }>('/stripe/checkout', {
        orderId: orderRes.data.id,
      });
      if (!sessionRes.data.url) throw new Error('No Stripe session URL returned');
      window.location.href = sessionRes.data.url;
    } catch (err) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        'Checkout failed';
      toast.error(msg);
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto grid max-w-5xl gap-10 px-4 py-10 md:grid-cols-2 md:px-8 md:py-16">
      <div>
        <h1 className="font-display text-4xl tracking-tight">Checkout</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Payment is handled by Stripe in test mode. Use card{' '}
          <code className="text-foreground">4242 4242 4242 4242</code>, any future date, any CVC.
        </p>

        <div className="mt-8 space-y-4 rounded-xl border border-border bg-card p-6">
          <div>
            <p className="text-xs uppercase tracking-wider text-muted-foreground">Account</p>
            <p className="mt-1">{user.name}</p>
            <p className="text-sm text-muted-foreground">{user.email}</p>
          </div>
        </div>
      </div>

      <aside className="h-fit rounded-xl border border-border bg-card p-6">
        <h2 className="text-lg font-semibold">Order summary</h2>
        <ul className="mt-4 space-y-3 text-sm">
          {items.map((item) => (
            <li key={item.productId} className="flex justify-between">
              <span>
                {item.product.name}{' '}
                <span className="text-muted-foreground">× {item.quantity}</span>
              </span>
              <span>{formatPHP(Number(item.product.price) * item.quantity)}</span>
            </li>
          ))}
        </ul>
        <hr className="my-4 border-border" />
        <div className="flex justify-between text-base font-semibold">
          <span>Total</span>
          <span>{formatPHP(totalPrice)}</span>
        </div>
        <Button size="lg" className="mt-6 w-full" onClick={startCheckout} disabled={loading}>
          {loading ? 'Redirecting…' : 'Pay with Stripe'}
        </Button>
      </aside>
    </div>
  );
}
