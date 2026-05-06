'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/stores/auth.store';
import { useCartStore } from '@/stores/cart.store';

export function AuthBootstrap() {
  const isHydrated = useAuthStore((s) => s.isHydrated);
  const accessToken = useAuthStore((s) => s.accessToken);
  const clear = useAuthStore((s) => s.clear);
  const hydrateCart = useCartStore((s) => s.hydrate);

  useEffect(() => {
    if (!isHydrated || !accessToken) return;
    // If hydration fails (stale/expired token, refresh failed), clear local auth.
    void hydrateCart().catch(() => clear());
  }, [isHydrated, accessToken, hydrateCart, clear]);

  return null;
}
