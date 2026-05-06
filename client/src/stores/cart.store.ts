'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Product } from '@jaroche/shared';
import { api } from '@/lib/api';
import { useAuthStore } from './auth.store';

export interface LocalCartItem {
  id?: string; // server cart item id (only when authed)
  productId: string;
  quantity: number;
  product: Product;
}

interface ServerCart {
  items: { id: string; productId: string; quantity: number; product: Product }[];
}

interface CartState {
  items: LocalCartItem[];
  loading: boolean;
  hydrate: () => Promise<void>;
  add: (product: Product, qty?: number) => Promise<void>;
  setQuantity: (productId: string, qty: number) => Promise<void>;
  remove: (productId: string) => Promise<void>;
  clear: () => Promise<void>;
  totalCount: () => number;
  totalPrice: () => number;
}

function isLoggedIn() {
  return Boolean(useAuthStore.getState().accessToken);
}

function fromServer(cart: ServerCart | null): LocalCartItem[] {
  return (
    cart?.items.map((i) => ({
      id: i.id,
      productId: i.productId,
      quantity: i.quantity,
      product: i.product,
    })) ?? []
  );
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      loading: false,

      hydrate: async () => {
        if (!isLoggedIn()) return;
        set({ loading: true });
        try {
          const { data } = await api.get<ServerCart | null>('/cart');
          set({ items: fromServer(data) });
        } finally {
          set({ loading: false });
        }
      },

      add: async (product, qty = 1) => {
        if (isLoggedIn()) {
          const { data } = await api.post<ServerCart>('/cart/items', {
            productId: product.id,
            quantity: qty,
          });
          set({ items: fromServer(data) });
        } else {
          const items = [...get().items];
          const existing = items.find((i) => i.productId === product.id);
          if (existing) existing.quantity += qty;
          else items.push({ productId: product.id, quantity: qty, product });
          set({ items });
        }
      },

      setQuantity: async (productId, qty) => {
        const target = get().items.find((i) => i.productId === productId);
        if (!target) return;
        if (isLoggedIn() && target.id) {
          const { data } = await api.patch<ServerCart>(`/cart/items/${target.id}`, {
            quantity: qty,
          });
          set({ items: fromServer(data) });
        } else {
          const items = get().items.flatMap((i) =>
            i.productId === productId ? (qty <= 0 ? [] : [{ ...i, quantity: qty }]) : [i]
          );
          set({ items });
        }
      },

      remove: async (productId) => {
        await get().setQuantity(productId, 0);
      },

      clear: async () => {
        if (isLoggedIn()) {
          await api.delete('/cart');
        }
        set({ items: [] });
      },

      totalCount: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
      totalPrice: () =>
        get().items.reduce((sum, i) => sum + Number(i.product.price) * i.quantity, 0),
    }),
    {
      name: 'jaroche.cart',
      partialize: (state) => ({ items: state.items }),
    }
  )
);
