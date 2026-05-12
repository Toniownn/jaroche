'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import type { Product } from '@jaroche/shared';
import { useCartStore } from '@/stores/cart.store';
import { useAuthStore } from '@/stores/auth.store';
import { YarnIcon } from '@/components/icons/YarnIcon';
import { Placeholder } from '@/components/common/Placeholder';
import { PageHero } from '@/components/common/PageHero';
import { formatPHP } from '@/lib/utils';
import { JarocheProductCard } from '@/components/shop/JarocheProductCard';

const API = process.env.NEXT_PUBLIC_API_BASE ?? '/api';

function capitalize(s: string) {
  if (!s) return s;
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export default function CartPage() {
  const router = useRouter();
  const items = useCartStore((s) => s.items);
  const setQuantity = useCartStore((s) => s.setQuantity);
  const remove = useCartStore((s) => s.remove);
  const totalPrice = useCartStore((s) => s.totalPrice());
  const user = useAuthStore((s) => s.user);

  const [promo, setPromo] = useState('');
  const [suggestions, setSuggestions] = useState<Product[]>([]);

  useEffect(() => {
    let active = true;
    fetch(`${API}/products`)
      .then((r) => (r.ok ? r.json() : []))
      .then((all: Product[]) => {
        if (!active) return;
        const cartIds = new Set(items.map((i) => i.productId));
        const pool = all.filter((p) => !cartIds.has(p.id));
        const shuffled = [...pool].sort(() => Math.random() - 0.5).slice(0, 4);
        setSuggestions(shuffled);
      })
      .catch(() => {
        if (active) setSuggestions([]);
      });
    return () => {
      active = false;
    };
  }, [items]);

  const totalQty = items.reduce((s, i) => s + i.quantity, 0);
  const shipping = totalPrice >= 4800 || totalPrice === 0 ? 0 : 540;
  const total = totalPrice + shipping;

  function checkout() {
    if (items.length === 0) {
      toast.error('Your basket is empty', {
        description: 'Add a piece or two before heading to checkout.',
      });
      return;
    }
    if (!user) {
      router.push('/login?next=/checkout');
      return;
    }
    router.push('/checkout');
  }

  function applyPromo() {
    if (!promo.trim()) {
      toast.error('Empty code', { description: 'Please enter a promo code first.' });
      return;
    }
    if (promo.trim().toUpperCase() === 'STUDIO10') {
      toast.success('Code applied.', {
        description: '10% off your subtotal — a small thanks.',
      });
      return;
    }
    toast.error("That code didn't work", {
      description: `"${promo}" isn't valid or has expired. Double-check and try again.`,
    });
  }

  function saveLater(name: string) {
    toast.success('Saved for later.', {
      description: `${name} is now in your wishlist. We'll be quiet about it.`,
    });
  }

  function giftNote() {
    toast.success('Gift note added.', {
      description: "We'll include a hand-written card with your order at no charge.",
    });
  }

  return (
    <div className="page">
      <PageHero
        kicker={
          totalQty === 0
            ? 'Nothing here yet'
            : `${totalQty} ${totalQty === 1 ? 'piece' : 'pieces'} in your basket`
        }
        title={<>Your <em>basket.</em></>}
        sub="Each piece is made to order in our Cebu studio. Allow 7–14 days from checkout to dispatch."
      />

      <section className="cart-grid">
        <div className="cart-items">
          {items.length === 0 ? (
            <div className="cart-empty-state">
              <YarnIcon size={36} color="#B98A5C" />
              <p
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontStyle: 'italic',
                  fontSize: '1.5rem',
                  margin: '1rem 0 0.4rem',
                  color: 'var(--color-cocoa)',
                }}
              >
                Your basket is empty.
              </p>
              <Link href="/shop" className="btn btn-primary" style={{ marginTop: '1rem' }}>
                Browse the shop
              </Link>
            </div>
          ) : (
            items.map((it) => {
              const tone = it.product.tone ?? 'beige';
              const label = it.product.label ?? it.product.name.toLowerCase();
              return (
                <div key={it.productId} className="cart-row">
                  <div className="cart-img">
                    {it.product.imageUrl ? (
                      <img
                        src={it.product.imageUrl}
                        alt={it.product.name}
                        loading="lazy"
                        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', aspectRatio: '1 / 1' }}
                      />
                    ) : (
                      <Placeholder label={label} ratio="1 / 1" tone={tone} />
                    )}
                  </div>
                  <div className="cart-info">
                    <h3>{it.product.name}</h3>
                    <p className="meta">
                      Color · {capitalize(tone)}
                      <br />
                      Size · Standard
                      <br />
                      Made-to-order · ships in 7–14 days
                    </p>
                    <div className="cart-actions">
                      <span className="qty">
                        <button
                          type="button"
                          onClick={() => setQuantity(it.productId, Math.max(1, it.quantity - 1))}
                          aria-label="Decrease"
                        >
                          −
                        </button>
                        <span>{it.quantity}</span>
                        <button
                          type="button"
                          onClick={() => setQuantity(it.productId, it.quantity + 1)}
                          aria-label="Increase"
                        >
                          +
                        </button>
                      </span>
                      <button
                        type="button"
                        className="cart-link"
                        onClick={() => saveLater(it.product.name)}
                      >
                        Save for later
                      </button>
                      <button
                        type="button"
                        className="cart-link"
                        onClick={() => remove(it.productId)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                  <div className="cart-price">
                    {formatPHP(Number(it.product.price) * it.quantity)}
                  </div>
                </div>
              );
            })
          )}

          {items.length > 0 && (
            <div style={{ marginTop: '2rem', display: 'flex', gap: '0.7rem', flexWrap: 'wrap' }}>
              <Link href="/shop" className="btn btn-ghost">← Keep shopping</Link>
              <button type="button" className="btn btn-ghost" onClick={giftNote}>
                Add a gift note (free)
              </button>
            </div>
          )}
        </div>

        {items.length > 0 && (
          <aside className="cart-summary">
            <h3>Order summary</h3>
            <div className="summary-row">
              <span>Subtotal</span>
              <span>{formatPHP(totalPrice)}</span>
            </div>
            <div className="summary-row muted">
              <span>Shipping (PH, free over ₱4,800)</span>
              <span>{shipping === 0 ? 'Free' : formatPHP(shipping)}</span>
            </div>
            <div className="summary-row muted">
              <span>Linen wrap</span>
              <span>Included</span>
            </div>
            <div className="summary-row muted">
              <span>Estimated dispatch</span>
              <span>7–14 days</span>
            </div>

            <div className="promo">
              <input
                placeholder="Promo code"
                value={promo}
                onChange={(e) => setPromo(e.target.value)}
              />
              <button type="button" onClick={applyPromo}>
                Apply
              </button>
            </div>

            <div className="summary-row total">
              <span>Total</span>
              <span>{formatPHP(total)}</span>
            </div>

            <button type="button" onClick={checkout} className="btn btn-primary summary-checkout">
              <span>{user ? 'Proceed to checkout' : 'Sign in to check out'}</span>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth={1.4}>
                <path d="M2 7h10M8 3l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <small className="summary-fine">
              <YarnIcon size={12} /> Secure checkout · 30-day returns
            </small>
          </aside>
        )}
      </section>

      {suggestions.length > 0 && (
        <section className="cart-suggestions">
          <div className="section-head" style={{ marginBottom: '1.6rem' }}>
            <span className="kicker">Quiet pairings</span>
            <h2 className="section-title">You might also <em>like.</em></h2>
          </div>
          <div className="prod-grid">
            {suggestions.map((p) => (
              <JarocheProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
