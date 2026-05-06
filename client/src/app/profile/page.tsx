'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import type { Order, OrderStatus, PublicUser } from '@jaroche/shared';
import { useAuthStore } from '@/stores/auth.store';
import { useCartStore } from '@/stores/cart.store';
import { api } from '@/lib/api';
import { Placeholder } from '@/components/common/Placeholder';
import { PageHero } from '@/components/common/PageHero';
import { formatPHP } from '@/lib/utils';

const STATUS_CLASS: Record<OrderStatus, string> = {
  PENDING: 'crafting',
  PAID: 'crafting',
  SHIPPED: 'transit',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
};

const STATUS_LABEL: Record<OrderStatus, string> = {
  PENDING: 'Pending',
  PAID: 'On the hook',
  SHIPPED: 'In transit',
  DELIVERED: 'Delivered',
  CANCELLED: 'Cancelled',
};

type TabId = 'orders' | 'wishlist' | 'addresses' | 'details' | 'rewards';

const WISHLIST = [
  { name: 'Soft Wave Throw', price: 10080, tone: 'sage', label: 'throw 130×170' },
  { name: 'Daphne Shoulder Bag', price: 6720, tone: 'beige', label: 'shoulder bag' },
  { name: 'Linen Table Runner', price: 3480, tone: 'sage', label: 'table runner' },
  { name: 'Olive Throw Cushion', price: 5760, tone: 'blush', label: 'cushion 40×40' },
  { name: 'Lila Bucket Hat', price: 2520, tone: 'cream', label: 'bucket hat' },
  { name: 'Petite Crossbody', price: 3840, tone: 'cocoa', label: 'crossbody' },
  { name: 'Ribbon Scrunchie Set', price: 1080, tone: 'blush', label: 'scrunchie set' },
  { name: 'Mini Coin Pouch', price: 1680, tone: 'cocoa', label: 'coin pouch' },
];

export default function ProfilePage() {
  const router = useRouter();
  const isHydrated = useAuthStore((s) => s.isHydrated);
  const user = useAuthStore((s) => s.user);
  const clearAuth = useAuthStore((s) => s.clear);
  const clearCart = useCartStore((s) => s.clear);
  const [orders, setOrders] = useState<Order[] | null>(null);
  const [profile, setProfile] = useState<PublicUser | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [tab, setTab] = useState<TabId>('orders');

  // Account details form state
  const [first, setFirst] = useState('');
  const [last, setLast] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [newsletter, setNewsletter] = useState('Monthly');
  const [savingDetails, setSavingDetails] = useState(false);

  useEffect(() => {
    if (!isHydrated) return;
    if (!user) {
      router.replace('/login?next=/profile');
      return;
    }
    void Promise.all([
      api.get<Order[]>('/orders').then((r) => setOrders(r.data)),
      api.get<PublicUser>('/users/profile').then((r) => {
        setProfile(r.data);
        const parts = r.data.name.trim().split(/\s+/);
        setFirst(parts[0] ?? '');
        setLast(parts.slice(1).join(' '));
        setEmail(r.data.email);
      }),
    ]).catch(() => setError('Could not load your account. Try again in a moment.'));
  }, [isHydrated, user, router]);

  async function signOut() {
    try {
      await api.post('/auth/logout', {});
    } catch {
      // ignore
    }
    clearAuth();
    await clearCart();
    toast.success('Signed out.', { description: 'See you again soon.' });
    router.push('/');
  }

  async function saveDetails() {
    setSavingDetails(true);
    try {
      const fullName = `${first} ${last}`.trim();
      const { data } = await api.put<PublicUser>('/users/profile', { name: fullName });
      setProfile(data);
      toast.success('Saved.', { description: 'Your account details are up to date.' });
    } catch {
      toast.error('Could not save', { description: 'Please try again in a moment.' });
    } finally {
      setSavingDetails(false);
    }
  }

  if (!isHydrated) {
    return (
      <div className="page">
        <PageHero kicker="Welcome back" title="One moment…" />
      </div>
    );
  }

  if (!user) return null;

  const display = profile ?? user;
  const firstName = display.name.trim().split(/\s+/)[0] ?? display.name;
  const initial = firstName.charAt(0).toUpperCase();
  const joinedYear = new Date((display as PublicUser & { createdAt?: string }).createdAt ?? Date.now()).getFullYear();
  const orderCount = orders?.length ?? 0;

  const TABS: Array<{ id: TabId; label: string; count?: number }> = [
    { id: 'orders', label: 'Orders', count: orderCount },
    { id: 'wishlist', label: 'Wishlist', count: 8 },
    { id: 'addresses', label: 'Addresses' },
    { id: 'details', label: 'Account details' },
    { id: 'rewards', label: 'Studio rewards' },
  ];

  return (
    <div className="page">
      <PageHero
        kicker="Welcome back"
        title={<>Hello again, <em>{firstName}.</em></>}
        sub="Two pieces are on the hook for you right now. We'll send a note when they go in the linen wrap."
      />

      <section className="profile-grid">
        <aside className="profile-aside">
          <div className="avatar">{initial}</div>
          <h3>{display.name}</h3>
          <p className="email">{display.email}</p>
          <span className="kicker" style={{ fontSize: '0.68rem' }}>
            Studio friend since {joinedYear}
          </span>

          <ul className="profile-tabs">
            {TABS.map((t) => (
              <li key={t.id}>
                <button
                  type="button"
                  className={`profile-tab ${tab === t.id ? 'is-active' : ''}`}
                  onClick={() => setTab(t.id)}
                >
                  <span>{t.label}</span>
                  {t.count !== undefined && <span className="count">{t.count}</span>}
                </button>
              </li>
            ))}
            <li
              style={{
                marginTop: '0.6rem',
                borderTop: '1px solid color-mix(in oklab, var(--color-cocoa) 10%, transparent)',
                paddingTop: '0.6rem',
              }}
            >
              <button type="button" className="profile-tab" onClick={signOut}>
                <span>Sign out</span>
              </button>
            </li>
          </ul>
        </aside>

        <main className="profile-main">
          {error && <p style={{ color: 'var(--color-destructive)' }}>{error}</p>}

          {tab === 'orders' && (
            <>
              <h2>Your <em>orders.</em></h2>
              <p>A small history of pieces that have travelled from our studio to your door.</p>

              {orders === null && !error && (
                <p style={{ color: 'var(--color-cocoa-soft)' }}>Loading…</p>
              )}

              {orders && orders.length === 0 && (
                <div className="order-card" style={{ textAlign: 'center' }}>
                  <p style={{ margin: '0 0 1rem' }}>No orders yet — your shelf is waiting.</p>
                  <Link href="/shop" className="btn btn-primary">Browse the shop</Link>
                </div>
              )}

              {orders && orders.length > 0 && orders.map((o) => {
                const statusClass = STATUS_CLASS[o.status] ?? 'pending';
                const label = STATUS_LABEL[o.status] ?? o.status;
                const placed = new Date(o.createdAt).toLocaleDateString(undefined, {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                });
                const idShort = o.id.slice(-8).toUpperCase();
                return (
                  <div key={o.id} className="order-card">
                    <div className="order-head">
                      <div className="left">
                        <span className="num">#JR-{idShort}</span>
                        <span className="date">Placed {placed}</span>
                      </div>
                      <span className={`order-status ${statusClass}`}>{label}</span>
                    </div>
                    {o.items && o.items.length > 0 && (
                      <div className="order-items">
                        {o.items.map((item) => (
                          <div key={item.id} className="order-thumb">
                            <Placeholder
                              label={item.product?.label ?? item.product?.name?.toLowerCase() ?? 'piece'}
                              tone={item.product?.tone ?? 'beige'}
                              ratio="1 / 1"
                            />
                          </div>
                        ))}
                      </div>
                    )}
                    <div className="order-foot">
                      <span className="total">{formatPHP(o.total)}</span>
                      <div className="order-actions">
                        <button
                          type="button"
                          className="btn-mini"
                          onClick={() =>
                            toast.success(`Tracking JR-${idShort}`, {
                              description: "Your parcel is moving — we'll send a note when it's nearby. Carrier: DPD.",
                            })
                          }
                        >
                          Track
                        </button>
                        <button
                          type="button"
                          className="btn-mini"
                          onClick={() =>
                            toast.success('Added to basket.', {
                              description: 'All pieces from this order are now in your basket.',
                            })
                          }
                        >
                          Reorder
                        </button>
                        <button
                          type="button"
                          className="btn-mini"
                          onClick={() =>
                            toast.success(`Order JR-${idShort}`, {
                              description: 'Full receipt and shipping timeline coming soon.',
                            })
                          }
                        >
                          View details
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </>
          )}

          {tab === 'wishlist' && (
            <>
              <h2>Saved <em>for later.</em></h2>
              <p>Eight pieces you&apos;ve fallen for. We&apos;ll let you know when any go on quiet sale.</p>
              <div className="wishlist-grid" style={{ marginTop: '1.5rem' }}>
                {WISHLIST.map((p) => (
                  <article key={p.name} className="prod-card">
                    <div className="prod-img">
                      <Placeholder label={p.label} tone={p.tone} ratio="4 / 5" />
                      <button
                        type="button"
                        className="prod-add"
                        onClick={() =>
                          toast.success('Added to basket.', {
                            description: `${p.name} is on its way to your basket.`,
                          })
                        }
                      >
                        + Add to cart
                      </button>
                    </div>
                    <div className="prod-meta">
                      <div>
                        <h3>{p.name}</h3>
                      </div>
                      <span className="prod-price">{formatPHP(p.price)}</span>
                    </div>
                    <button
                      type="button"
                      className="btn-mini"
                      style={{ marginTop: '0.6rem', alignSelf: 'flex-start' }}
                      onClick={() =>
                        toast.success('Removed.', {
                          description: `${p.name} is no longer in your wishlist.`,
                        })
                      }
                    >
                      Remove
                    </button>
                  </article>
                ))}
              </div>
            </>
          )}

          {tab === 'addresses' && (
            <>
              <h2>Saved <em>addresses.</em></h2>
              <p>Where your linen-wrapped parcels go home to.</p>
              <div className="address-grid" style={{ marginTop: '1.5rem' }}>
                <div className="address-card is-default">
                  <h4>Home</h4>
                  <p>
                    {display.name}
                    <br />14 rue de Belleville, Apt 3B
                    <br />75020 Paris, France
                    <br />+33 6 12 34 56 78
                  </p>
                  <button
                    type="button"
                    className="btn-mini"
                    style={{ marginTop: '0.8rem' }}
                    onClick={() =>
                      toast.success('Edit Home', {
                        description: 'Address editor coming soon.',
                      })
                    }
                  >
                    Edit
                  </button>
                </div>
                <div className="address-card">
                  <h4>Mum&apos;s house</h4>
                  <p>
                    Sophie Moreau
                    <br />22 chemin du Lavoir
                    <br />13100 Aix-en-Provence, France
                  </p>
                  <button
                    type="button"
                    className="btn-mini"
                    style={{ marginTop: '0.8rem' }}
                    onClick={() =>
                      toast.success("Edit Mum's house", {
                        description: 'Address editor coming soon.',
                      })
                    }
                  >
                    Edit
                  </button>
                </div>
              </div>
              <button
                type="button"
                className="btn btn-ghost"
                style={{ marginTop: '1.4rem' }}
                onClick={() =>
                  toast.success('New address', {
                    description: 'This will open the address form in a future update.',
                  })
                }
              >
                + Add new address
              </button>
            </>
          )}

          {tab === 'details' && (
            <>
              <h2>Account <em>details.</em></h2>
              <p>Update what we know about you.</p>
              <div className="field-row" style={{ marginTop: '1.5rem' }}>
                <div className="field">
                  <label>First name</label>
                  <input value={first} onChange={(e) => setFirst(e.target.value)} />
                </div>
                <div className="field">
                  <label>Last name</label>
                  <input value={last} onChange={(e) => setLast(e.target.value)} />
                </div>
              </div>
              <div className="field">
                <label>Email</label>
                <input value={email} onChange={(e) => setEmail(e.target.value)} disabled />
              </div>
              <div className="field">
                <label>Phone</label>
                <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+63 ..." />
              </div>
              <div className="field">
                <label>Newsletter</label>
                <select value={newsletter} onChange={(e) => setNewsletter(e.target.value)}>
                  <option>Monthly</option>
                  <option>Major releases only</option>
                  <option>Unsubscribe</option>
                </select>
              </div>
              <button
                type="button"
                className="btn btn-primary"
                style={{ marginTop: '0.6rem' }}
                onClick={saveDetails}
                disabled={savingDetails}
              >
                {savingDetails ? 'Saving…' : 'Save changes'}
              </button>
            </>
          )}

          {tab === 'rewards' && (
            <>
              <h2>Studio <em>rewards.</em></h2>
              <p>Small thanks for being one of our oldest friends.</p>
              <div className="order-card" style={{ marginTop: '1.5rem' }}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1.5rem',
                    flexWrap: 'wrap',
                  }}
                >
                  <div
                    style={{
                      fontFamily: 'var(--font-serif)',
                      fontStyle: 'italic',
                      fontSize: '3rem',
                      color: 'var(--color-beige-deep)',
                    }}
                  >
                    240
                  </div>
                  <div>
                    <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', margin: 0 }}>
                      stitch points
                    </h3>
                    <p style={{ color: 'var(--color-cocoa-soft)', margin: '0.4rem 0 0' }}>
                      60 more until your next free linen pouch.
                    </p>
                  </div>
                </div>
              </div>
              <h3
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: '0.8rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.18em',
                  color: 'var(--color-cocoa-soft)',
                  margin: '2rem 0 1rem',
                }}
              >
                How to earn more
              </h3>
              <ul
                style={{
                  paddingLeft: '1.2rem',
                  lineHeight: 1.9,
                  color: 'var(--color-cocoa-soft)',
                }}
              >
                <li>1 point for every ₱10 spent</li>
                <li>50 points for sharing a photo of your piece</li>
                <li>100 points for referring a studio friend</li>
                <li>200 points on your birthday</li>
              </ul>
            </>
          )}
        </main>
      </section>
    </div>
  );
}
