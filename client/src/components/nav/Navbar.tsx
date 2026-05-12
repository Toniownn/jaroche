'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Search, User as UserIcon, ShoppingBag, Menu, X } from 'lucide-react';
import { useAuthStore } from '@/stores/auth.store';
import { useCartStore } from '@/stores/cart.store';

const links = [
  { href: '/shop', label: 'Shop', match: (p: string) => p === '/shop' || p.startsWith('/products') },
  { href: '/about', label: 'About', match: (p: string) => p.startsWith('/about') },
  { href: '/journal', label: 'Journal', match: (p: string) => p.startsWith('/journal') },
  { href: '/contact', label: 'Contact', match: (p: string) => p.startsWith('/contact') },
];

export function Navbar() {
  const pathname = usePathname();
  const user = useAuthStore((s) => s.user);
  const items = useCartStore((s) => s.items);

  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (menuOpen) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [menuOpen]);

  const totalCount = mounted ? items.reduce((s, i) => s + i.quantity, 0) : 0;
  const showUser = mounted ? user : null;

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
      <div className="mx-auto flex max-w-[1380px] items-center justify-between gap-2 md:grid md:grid-cols-[1fr_auto_1fr] md:gap-8">
        <div className="flex items-center gap-1 md:contents">
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
            className="grid size-[38px] place-items-center rounded-full text-cocoa transition hover:bg-[color-mix(in_oklab,var(--color-beige)_35%,transparent)] md:hidden"
          >
            <Menu className="size-[20px]" strokeWidth={1.4} />
          </button>
          <Link href="/" className="text-cocoa">
            <span className="font-serif text-[1.6rem] font-medium italic tracking-[-0.01em] leading-none md:text-[1.85rem]">
              Jaroché
            </span>
          </Link>
        </div>

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
          {!showUser && (
            <Link
              href="/login"
              className="ml-1 hidden items-center gap-1.5 rounded-full border border-[color-mix(in_oklab,var(--color-cocoa)_22%,transparent)] px-3 py-1.5 text-[0.82rem] text-cocoa transition hover:bg-cocoa hover:text-cream md:inline-flex"
            >
              Sign in
            </Link>
          )}
        </div>
      </div>

      {mounted && createPortal(
        <MobileDrawer
          menuOpen={menuOpen}
          onClose={() => setMenuOpen(false)}
          pathname={pathname}
          showUser={showUser}
        />,
        document.body
      )}
    </nav>
  );
}

interface DrawerProps {
  menuOpen: boolean;
  onClose: () => void;
  pathname: string;
  showUser: ReturnType<typeof useAuthStore.getState>['user'];
}

function MobileDrawer({ menuOpen, onClose, pathname, showUser }: DrawerProps) {
  return (
    <div
      className={`fixed inset-0 z-[60] md:hidden ${menuOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}
      aria-hidden={!menuOpen}
    >
        <button
          type="button"
          aria-label="Close menu"
          onClick={onClose}
          className={`absolute inset-0 bg-cocoa/40 transition-opacity duration-200 ${
            menuOpen ? 'opacity-100' : 'opacity-0'
          }`}
        />
        <aside
          className={`absolute left-0 top-0 flex h-full w-[82vw] max-w-[320px] flex-col gap-6 p-6 shadow-2xl transition-transform duration-[280ms] ease-[cubic-bezier(.2,.7,.2,1)] ${
            menuOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
          style={{ background: 'var(--color-blush)' }}
        >
          <div className="flex items-center justify-between">
            <span className="font-serif text-[1.6rem] font-medium italic leading-none text-cocoa">
              Jaroché
            </span>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close menu"
              className="grid size-[36px] place-items-center rounded-full text-cocoa transition hover:bg-[color-mix(in_oklab,var(--color-beige)_35%,transparent)]"
            >
              <X className="size-[18px]" strokeWidth={1.4} />
            </button>
          </div>
          <ul className="flex flex-col gap-1 list-none p-0">
            {links.map((l) => {
              const active = l.match(pathname);
              return (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className={`block rounded-md px-3 py-3 font-serif text-[1.4rem] italic tracking-[-0.01em] ${
                      active ? 'text-cocoa' : 'text-cocoa/80'
                    }`}
                  >
                    {l.label}
                  </Link>
                </li>
              );
            })}
          </ul>
          <div className="mt-auto border-t border-[color-mix(in_oklab,var(--color-cocoa)_12%,transparent)] pt-5">
            {!showUser && (
              <Link
                href="/login"
                className="inline-flex items-center gap-1.5 rounded-full border border-[color-mix(in_oklab,var(--color-cocoa)_22%,transparent)] px-4 py-2 text-[0.88rem] text-cocoa transition hover:bg-cocoa hover:text-cream"
              >
                Sign in
              </Link>
            )}
          </div>
      </aside>
    </div>
  );
}
