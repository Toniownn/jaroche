'use client';

import { useEffect, useState, type ReactNode } from 'react';
import { AdminSidebar } from './Sidebar';
import { AdminTopbar } from './Topbar';

const COLLAPSE_KEY = 'jaroche.admin.sidebar';
const DENSITY_KEY = 'jaroche.admin.density';

export function AdminShell({ children }: { children: ReactNode }) {
  const [collapsed, setCollapsed] = useState(() => {
    if (typeof window === 'undefined') return false;
    try {
      return localStorage.getItem(COLLAPSE_KEY) === 'collapsed';
    } catch {
      return false;
    }
  });

  useEffect(() => {
    let density: 'comfy' | 'balanced' | 'compact' = 'balanced';
    try {
      const d = localStorage.getItem(DENSITY_KEY);
      if (d === 'comfy' || d === 'compact' || d === 'balanced') density = d;
    } catch {}
    document.documentElement.dataset.density = density;
  }, []);

  function onToggleCollapse() {
    setCollapsed((c) => {
      const next = !c;
      try {
        localStorage.setItem(COLLAPSE_KEY, next ? 'collapsed' : 'expanded');
      } catch {}
      return next;
    });
  }

  return (
    <div className="admin-app" data-sidebar={collapsed ? 'collapsed' : 'expanded'}>
      <AdminSidebar collapsed={collapsed} badges={{ orders: 0 }} />
      <div>
        <AdminTopbar onCollapse={onToggleCollapse} />
        <div className="page-body">{children}</div>
      </div>
    </div>
  );
}
