'use client';

import { create } from 'zustand';
import type { PublicUser } from '@jaroche/shared';
import { api } from '@/lib/api';

interface UserState {
  profile: PublicUser | null;
  loading: boolean;
  fetchProfile: () => Promise<void>;
  updateName: (name: string) => Promise<void>;
}

export const useUserStore = create<UserState>((set) => ({
  profile: null,
  loading: false,
  fetchProfile: async () => {
    set({ loading: true });
    try {
      const { data } = await api.get<PublicUser>('/users/profile');
      set({ profile: data });
    } finally {
      set({ loading: false });
    }
  },
  updateName: async (name) => {
    const { data } = await api.put<PublicUser>('/users/profile', { name });
    set({ profile: data });
  },
}));
