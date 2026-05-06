'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { PublicUser } from '@jaroche/shared';

interface AuthState {
  accessToken: string | null;
  user: PublicUser | null;
  isHydrated: boolean;
  setAuth: (token: string, user: PublicUser) => void;
  clear: () => void;
  setHydrated: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      user: null,
      isHydrated: false,
      setAuth: (token, user) => set({ accessToken: token, user }),
      clear: () => set({ accessToken: null, user: null }),
      setHydrated: () => set({ isHydrated: true }),
    }),
    {
      name: 'jaroche.auth',
      partialize: (state) => ({ accessToken: state.accessToken, user: state.user }),
      onRehydrateStorage: () => (state) => state?.setHydrated(),
    }
  )
);
