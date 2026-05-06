'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/stores/auth.store';
import { AdminShell } from '@/components/admin/AdminShell';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const isHydrated = useAuthStore((s) => s.isHydrated);
  const user = useAuthStore((s) => s.user);

  useEffect(() => {
    if (!isHydrated) return;
    if (!user) router.replace(`/login?next=${encodeURIComponent(pathname)}`);
    else if (user.role !== 'ADMIN') router.replace('/');
  }, [isHydrated, user, router, pathname]);

  if (!isHydrated || !user || user.role !== 'ADMIN') {
    return <div className="px-8 py-16 text-center text-muted-foreground">Loading…</div>;
  }

  return <AdminShell>{children}</AdminShell>;
}
