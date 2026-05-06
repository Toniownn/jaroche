'use client';

import { usePathname } from 'next/navigation';
import { Footer } from './Footer';

export function FooterGate() {
  const pathname = usePathname();
  if (
    pathname.startsWith('/login') ||
    pathname.startsWith('/register') ||
    pathname.startsWith('/admin')
  ) {
    return null;
  }
  return <Footer />;
}
