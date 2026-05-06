'use client';

import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios';
import { useAuthStore } from '@/stores/auth.store';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? '/api';

export const api = axios.create({
  baseURL: API_BASE,
  withCredentials: true, // refresh cookie on /api/auth/refresh
});

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = useAuthStore.getState().accessToken;
  if (token) {
    config.headers.set('Authorization', `Bearer ${token}`);
  }
  return config;
});

let refreshing: Promise<string | null> | null = null;

async function refreshAccessToken(): Promise<string | null> {
  if (!refreshing) {
    refreshing = (async () => {
      try {
        const { data } = await axios.post<{ accessToken: string; user: unknown }>(
          `${API_BASE}/auth/refresh`,
          {},
          { withCredentials: true }
        );
        useAuthStore.getState().setAuth(
          data.accessToken,
          data.user as never
        );
        return data.accessToken;
      } catch {
        useAuthStore.getState().clear();
        return null;
      } finally {
        refreshing = null;
      }
    })();
  }
  return refreshing;
}

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const original = error.config as InternalAxiosRequestConfig & { _retried?: boolean };
    const isAuthEndpoint =
      typeof original?.url === 'string' && original.url.includes('/auth/');

    if (error.response?.status === 401 && original && !original._retried && !isAuthEndpoint) {
      original._retried = true;
      const token = await refreshAccessToken();
      if (token) {
        original.headers.set('Authorization', `Bearer ${token}`);
        return api.request(original);
      }
    }
    return Promise.reject(error);
  }
);
