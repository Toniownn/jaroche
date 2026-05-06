import Link from 'next/link';
import { XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function CheckoutCancelPage() {
  return (
    <div className="mx-auto max-w-xl px-4 py-24 text-center">
      <XCircle className="mx-auto size-14 text-amber-400" />
      <h1 className="mt-6 font-display text-4xl tracking-tight">Payment cancelled</h1>
      <p className="mt-3 text-muted-foreground">
        Your cart is still here. You can try again whenever you&apos;re ready.
      </p>
      <div className="mt-8 flex justify-center gap-3">
        <Button asChild>
          <Link href="/checkout">Try again</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/cart">Back to cart</Link>
        </Button>
      </div>
    </div>
  );
}
