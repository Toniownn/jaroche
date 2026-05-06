import Link from 'next/link';
import type { Product } from '@jaroche/shared';
import { JarocheProductCard } from '@/components/shop/JarocheProductCard';
import { Placeholder } from '@/components/common/Placeholder';
import { YarnIcon } from '@/components/icons/YarnIcon';

const API = process.env.API_TARGET ?? 'http://localhost:4000';

async function fetchProducts(): Promise<Product[]> {
  try {
    const res = await fetch(`${API}/api/products`, { cache: 'no-store' });
    if (!res.ok) return [];
    return (await res.json()) as Product[];
  } catch {
    return [];
  }
}

type Tone = 'beige' | 'cream' | 'cocoa' | 'blush' | 'sage';

// Curate the order Landing surfaces categories in (most photogenic first).
const FEATURED_CATEGORIES = [
  'Bouquets',
  'Gift Sets',
  'Amigurumi',
  'Tops',
  'Bags',
  'Home',
];

export default async function LandingPage() {
  const products = await fetchProducts();
  const tagged = products.filter((p) => p.tag === 'Best seller');
  const others = products.filter((p) => p.tag !== 'Best seller');
  const fallback = [...tagged, ...others].slice(0, 4);

  const categoryEntries = FEATURED_CATEGORIES.flatMap((cat) => {
    const inCat = products.filter((p) => p.category === cat);
    if (inCat.length === 0) return [];
    const sample = inCat[0];
    return [
      {
        name: cat,
        count: inCat.length,
        tone: (sample.tone as Tone | undefined) ?? 'beige',
        label: sample.label ?? cat.toLowerCase(),
      },
    ];
  }).slice(0, 6);

  return (
    <div className="page">
      <header className="hero">
        <div className="blob blob-1" aria-hidden="true" />
        <div className="blob blob-2" aria-hidden="true" />

        <div className="hero-grid">
          <div className="hero-copy">
            <div className="hero-eyebrow">
              <span className="eyebrow-line" />
              <span>Atelier no. 04 — Spring Collection</span>
            </div>

            <h1 className="hero-title">
              <span className="hero-title-line">Crafted with love,</span>
              <span className="hero-title-line"><em>worn with joy.</em></span>
            </h1>

            <p className="hero-tag">
              Heirloom-quality crochet — bags, accessories and home pieces, made one stitch at a time
              in a small Lisbon studio.
            </p>

            <div className="hero-cta">
              <Link href="/shop" className="btn btn-primary">
                <span>Shop the collection</span>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.4">
                  <path d="M2 7h10M8 3l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
              <Link href="/about" className="btn btn-ghost">Our story</Link>
            </div>

            <div className="hero-meta">
              <div><strong>02</strong><span>makers</span></div>
              <div className="meta-divider" />
              <div><strong>118</strong><span>pieces this season</span></div>
              <div className="meta-divider" />
              <div><strong>4.9★</strong><span>customer love</span></div>
            </div>
          </div>

          <div className="hero-visual">
            <div className="hero-image-wrap">
              <Placeholder tone="beige" label="marigold tote — sand" ratio="4 / 5" />
              <div className="hero-image-tag">
                <YarnIcon size={16} />
                <span>Hand-stitched in Lisbon</span>
              </div>
            </div>
            <div className="hero-image-sub">
              <Placeholder tone="cocoa" label="crossbody — cocoa" ratio="1 / 1" />
            </div>
          </div>
        </div>

        <div className="hero-marquee" aria-hidden="true">
          <div className="marquee-track">
            {[0, 1].map((k) => (
              <div className="marquee-row" key={k}>
                <span>Free shipping over ₱4,800</span><span>✺</span>
                <span>Made to order</span><span>✺</span>
                <span>100% organic cotton</span><span>✺</span>
                <span>Ships worldwide</span><span>✺</span>
                <span>Crafted in small batches</span><span>✺</span>
              </div>
            ))}
          </div>
        </div>
      </header>

      {categoryEntries.length > 0 && (
        <section className="section">
          <div className="section-head">
            <span className="kicker">Browse by</span>
            <h2 className="section-title">A small, considered <em>catalog.</em></h2>
            <p className="section-sub">A few quiet families of objects, all made by hand from natural fibers.</p>
          </div>
          <div className="cats-grid">
            {categoryEntries.map((c) => (
              <Link key={c.name} href={`/shop?category=${encodeURIComponent(c.name)}`} className="cat-card">
                <div className="cat-img">
                  <Placeholder tone={c.tone} label={c.label} ratio="4 / 5" />
                  <div className="cat-arrow">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.3">
                      <path d="M5 15 L15 5 M8 5h7v7" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                </div>
                <div className="cat-meta">
                  <h3>{c.name}</h3>
                  <span className="cat-count">{c.count} {c.count === 1 ? 'piece' : 'pieces'}</span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {fallback.length > 0 && (
        <section className="section">
          <div className="section-head section-head-row">
            <div>
              <span className="kicker">This week</span>
              <h2 className="section-title">Most loved.</h2>
            </div>
            <Link className="link-arrow" href="/shop">View all <span>→</span></Link>
          </div>
          <div className="prod-grid">
            {fallback.map((p) => (
              <JarocheProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      <section className="section section-story">
        <div className="story-grid">
          <div className="story-images">
            <div className="story-img-a">
              <Placeholder tone="sage" label="maker at work" ratio="4 / 5" />
            </div>
            <div className="story-img-b">
              <Placeholder tone="cream" label="yarn shelf" ratio="1 / 1" />
            </div>
          </div>
          <div className="story-copy">
            <span className="kicker">Our story</span>
            <h2 className="section-title">A studio of <em>two hands,</em><br /> one slow rhythm.</h2>
            <p>
              Jaroché began on a kitchen table in 2019 — a sister, a hook, and a basket of leftover
              cotton. Today we still work in pairs, in a sunlit room above a bakery in Alfama,
              making each piece to order over a few quiet days.
            </p>
            <p>
              We choose plant-dyed yarns from a mill in Porto, design our own patterns, and send
              everything wrapped in unbleached linen. No drops, no algorithms — just objects made
              to soften with use.
            </p>
            <Link href="/about" className="link-arrow" style={{ marginTop: '1.6rem' }}>
              Read the long version <span>→</span>
            </Link>
          </div>
        </div>
      </section>

      <section className="section section-newsletter">
        <div className="newsletter-card">
          <div className="newsletter-deco" aria-hidden="true">
            <YarnIcon size={28} />
          </div>
          <span className="kicker">Letters from the studio</span>
          <h2 className="section-title">A slow newsletter.<br /><em>Once a month.</em></h2>
          <p>New pieces, behind-the-scenes from the atelier, and the occasional discount for early friends.</p>
          <small className="newsletter-fine">We never share your address. Unsubscribe anytime.</small>
        </div>
      </section>
    </div>
  );
}
