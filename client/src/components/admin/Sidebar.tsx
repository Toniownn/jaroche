'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Icon, type IconName } from './Icon';
import { useAuthStore } from '@/stores/auth.store';

interface NavItem {
  href: string;
  segment: string;
  icon: IconName;
  label: string;
  badge?: number;
}

interface NavSection {
  label: string;
  items: NavItem[];
}

interface Props {
  collapsed: boolean;
  badges?: { orders?: number; journal?: number; reviews?: number };
}

export function AdminSidebar({ collapsed, badges = {} }: Props) {
  const pathname = usePathname();
  const user = useAuthStore((s) => s.user);

  const sections: NavSection[] = [
    {
      label: 'Workspace',
      items: [
        { href: '/admin', segment: '', icon: 'dashboard', label: 'Dashboard' },
        { href: '/admin/orders', segment: 'orders', icon: 'orders', label: 'Orders', badge: badges.orders },
        { href: '/admin/products', segment: 'products', icon: 'products', label: 'Products' },
        { href: '/admin/customers', segment: 'customers', icon: 'customers', label: 'Customers' },
      ],
    },
    {
      label: 'Content',
      items: [
        { href: '/admin/journal', segment: 'journal', icon: 'journal', label: 'Journal', badge: badges.journal },
        { href: '/admin/discounts', segment: 'discounts', icon: 'discounts', label: 'Discounts' },
        { href: '/admin/reviews', segment: 'reviews', icon: 'reviews', label: 'Reviews', badge: badges.reviews },
      ],
    },
    {
      label: 'Insight',
      items: [
        { href: '/admin/analytics', segment: 'analytics', icon: 'analytics', label: 'Analytics' },
        { href: '/admin/settings', segment: 'settings', icon: 'settings', label: 'Settings' },
      ],
    },
  ];

  function isActive(segment: string) {
    if (segment === '') return pathname === '/admin';
    return pathname === `/admin/${segment}` || pathname.startsWith(`/admin/${segment}/`);
  }

  const initials = user?.name
    ? user.name
        .split(' ')
        .map((s) => s[0])
        .join('')
        .slice(0, 2)
        .toUpperCase()
    : 'JR';

  return (
    <aside className="sidebar">
      <Link href="/admin" className="sb-brand">
        <div className="sb-brand-mark">J</div>
        <div className="sb-brand-name">
          Jaroché
          <span className="sb-brand-sub">Studio admin</span>
        </div>
      </Link>

      {sections.map((sec) => (
        <div key={sec.label}>
          <div className="sb-section-label">{sec.label}</div>
          {sec.items.map((it) => (
            <Link
              key={it.href}
              href={it.href}
              className={`sb-link ${isActive(it.segment) ? 'is-active' : ''}`}
              title={collapsed ? it.label : undefined}
            >
              <Icon name={it.icon} size={18} />
              <span>{it.label}</span>
              {it.badge ? <span className="badge">{it.badge}</span> : null}
            </Link>
          ))}
        </div>
      ))}

      <div className="sb-foot">
        <div className="sb-user">
          <div className="sb-avatar">{initials}</div>
          <div className="sb-user-meta">
            <div className="sb-user-name">{user?.name ?? 'Admin'}</div>
            <div className="sb-user-role">{user?.role === 'ADMIN' ? 'Owner' : 'Member'}</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
