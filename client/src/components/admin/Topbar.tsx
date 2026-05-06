'use client';

import Link from 'next/link';
import { Fragment } from 'react';
import { usePathname } from 'next/navigation';
import { Icon } from './Icon';

interface Props {
  onCollapse: () => void;
}

const labels: Record<string, string> = {
  admin: 'Studio admin',
  orders: 'Orders',
  products: 'Products',
  customers: 'Customers',
  journal: 'Journal',
  discounts: 'Discounts',
  reviews: 'Reviews',
  analytics: 'Analytics',
  settings: 'Settings',
  new: 'New',
};

export function AdminTopbar({ onCollapse }: Props) {
  const pathname = usePathname();
  const segments = pathname.split('/').filter(Boolean);

  const crumbs = segments.map((seg, i) => {
    const href = '/' + segments.slice(0, i + 1).join('/');
    const label = labels[seg] ?? seg;
    return { href, label };
  });

  if (crumbs.length === 0) crumbs.push({ href: '/admin', label: 'Studio admin' });

  return (
    <header className="topbar">
      <button className="topbar-collapse" onClick={onCollapse} aria-label="Toggle sidebar">
        <Icon name="filter" size={18} />
      </button>
      <nav className="crumbs">
        {crumbs.map((c, i) => (
          <Fragment key={c.href}>
            {i > 0 && <span className="crumb-sep">/</span>}
            {i === crumbs.length - 1 ? (
              <strong>{c.label}</strong>
            ) : (
              <Link href={c.href}>{c.label}</Link>
            )}
          </Fragment>
        ))}
      </nav>
      <div className="topbar-search">
        <Icon name="search" size={16} />
        <input placeholder="Search orders, products, customers…" />
        <kbd>⌘K</kbd>
      </div>
      <div className="topbar-right">
        <button className="topbar-icon" aria-label="Notifications">
          <Icon name="bell" size={18} />
          <span className="dot" />
        </button>
        <Link href="/" className="btn btn-ghost btn-sm" title="View storefront">
          <Icon name="eye" size={14} />
          <span>View store</span>
        </Link>
      </div>
    </header>
  );
}
