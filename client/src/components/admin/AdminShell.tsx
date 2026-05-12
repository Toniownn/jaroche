'use client';

import { useEffect, useState, type ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { AdminSidebar } from './Sidebar';
import { AdminTopbar } from './Topbar';

const COLLAPSE_KEY = 'jaroche.admin.sidebar';
const DENSITY_KEY = 'jaroche.admin.density';

export function AdminShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(() => {
    if (typeof window === 'undefined') return false;
    try {
      return localStorage.getItem(COLLAPSE_KEY) === 'collapsed';
    } catch {
      return false;
    }
  });
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    let density: 'comfy' | 'balanced' | 'compact' = 'balanced';
    try {
      const d = localStorage.getItem(DENSITY_KEY);
      if (d === 'comfy' || d === 'compact' || d === 'balanced') density = d;
    } catch {}
    document.documentElement.dataset.density = density;
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (mobileOpen) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [mobileOpen]);

  function onToggle() {
    if (typeof window !== 'undefined' && window.matchMedia('(max-width: 760px)').matches) {
      setMobileOpen((o) => !o);
      return;
    }
    setCollapsed((c) => {
      const next = !c;
      try {
        localStorage.setItem(COLLAPSE_KEY, next ? 'collapsed' : 'expanded');
      } catch {}
      return next;
    });
  }

  return (
    <div
      className="admin-app"
      data-sidebar={collapsed ? 'collapsed' : 'expanded'}
      data-mobile-open={mobileOpen ? 'true' : 'false'}
    >
      <AdminSidebar collapsed={collapsed} badges={{ orders: 0 }} />
      <button
        type="button"
        className="admin-mobile-overlay"
        aria-label="Close menu"
        onClick={() => setMobileOpen(false)}
      />
      <div>
        <AdminTopbar onCollapse={onToggle} />
        <div className="page-body">{children}</div>
      </div>
    </div>
  );
}
