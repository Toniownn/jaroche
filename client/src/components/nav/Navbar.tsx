'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Search, User as UserIcon, ShoppingBag, LogOut, Shield } from 'lucide-react';
import { useAuthStore } from '@/stores/auth.store';
import { useCartStore } from '@/stores/cart.store';
import { api } from '@/lib/api';

const links = [
  { href: '/shop', label: 'Shop', match: (p: string) => p === '/shop' || p.startsWith('/products') },
  { href: '/about', label: 'About', match: (p: string) => p.startsWith('/about') },
  { href: '/journal', label: 'Journal', match: (p: string) => p.startsWith('/journal') },
  { href: '/contact', label: 'Contact', match: (p: string) => p.startsWith('/contact') },
];

export function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const user = useAuthStore((s) => s.user);
  const clear = useAuthStore((s) => s.clear);
  const items = useCartStore((s) => s.items);
  const clearCart = useCartStore((s) => s.clear);

  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const totalCount = mounted ? items.reduce((s, i) => s + i.quantity, 0) : 0;
  const showUser = mounted ? user : null;

  async function logout() {
    try {
      await api.post('/auth/logout', {});
    } catch {
      // ignore
    }
    clear();
    await clearCart();
    router.push('/');
  }

  return (
    <nav
      className={`sticky top-0 z-50 px-[clamp(1.25rem,4vw,4rem)] py-4 backdrop-blur transition-all ${
        scrolled
          ? 'border-b border-[color-mix(in_oklab,var(--color-cocoa)_8%,transparent)] py-3'
          : 'border-b border-transparent'
      }`}
      style={{
        background: 'color-mix(in oklab, var(--color-blush) 88%, transparent)',
      }}
    >
      <div className="mx-auto grid max-w-[1380px] grid-cols-[1fr_auto_1fr] items-center gap-8">
        <Link href="/" className="text-cocoa">
          <span className="font-serif text-[1.85rem] font-medium italic tracking-[-0.01em] leading-none">
            Jaroché
          </span>
        </Link>

        <ul className="hidden list-none items-center gap-[2.4rem] md:flex">
          {links.map((l) => {
            const active = l.match(pathname);
            return (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="relative inline-block py-1.5 text-[0.92rem] tracking-[0.04em] text-cocoa"
                >
                  <span className="relative">
                    {l.label}
                    <span
                      className={`absolute left-0 right-0 -bottom-1 h-px bg-cocoa origin-left transition-transform duration-[450ms] ease-[cubic-bezier(.2,.7,.2,1)] ${
                        active ? 'scale-x-100' : 'scale-x-0'
                      }`}
                    />
                  </span>
                </Link>
              </li>
            );
          })}
          {showUser?.role === 'ADMIN' && (
            <li>
              <Link
                href="/admin"
                className="inline-flex items-center gap-1 py-1.5 text-[0.92rem] tracking-[0.04em] text-cocoa"
              >
                <Shield className="size-4" /> Admin
              </Link>
            </li>
          )}
        </ul>

        <div className="flex items-center justify-end gap-1">
          <Link
            href="/search"
            aria-label="Search"
            className="grid size-[38px] place-items-center rounded-full text-cocoa transition hover:bg-[color-mix(in_oklab,var(--color-beige)_35%,transparent)] hover:-translate-y-px"
          >
            <Search className="size-[18px]" strokeWidth={1.4} />
          </Link>
          <Link
            href={showUser ? '/profile' : '/login'}
            aria-label="Account"
            className="grid size-[38px] place-items-center rounded-full text-cocoa transition hover:bg-[color-mix(in_oklab,var(--color-beige)_35%,transparent)] hover:-translate-y-px"
          >
            <UserIcon className="size-[18px]" strokeWidth={1.4} />
          </Link>
          <Link
            href="/cart"
            aria-label="Cart"
            className="relative grid size-[38px] place-items-center rounded-full text-cocoa transition hover:bg-[color-mix(in_oklab,var(--color-beige)_35%,transparent)] hover:-translate-y-px"
          >
            <ShoppingBag className="size-[18px]" strokeWidth={1.4} />
            {totalCount > 0 && (
              <span
                className="absolute right-[5px] top-[5px] grid size-[14px] place-items-center rounded-full text-[9px] font-medium"
                style={{ background: 'var(--color-cocoa)', color: 'var(--color-cream)' }}
              >
                {totalCount}
              </span>
            )}
          </Link>
          {showUser ? (
            <button
              type="button"
              onClick={logout}
              aria-label="Sign out"
              className="ml-1 hidden items-center gap-1.5 rounded-full border border-[color-mix(in_oklab,var(--color-cocoa)_22%,transparent)] px-3 py-1.5 text-[0.82rem] text-cocoa transition hover:bg-cocoa hover:text-cream md:inline-flex"
            >
              <LogOut className="size-3.5" /> Sign out
            </button>
          ) : (
            <Link
              href="/login"
              className="ml-1 hidden items-center gap-1.5 rounded-full border border-[color-mix(in_oklab,var(--color-cocoa)_22%,transparent)] px-3 py-1.5 text-[0.82rem] text-cocoa transition hover:bg-cocoa hover:text-cream md:inline-flex"
            >
              Sign in
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
