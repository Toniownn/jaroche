import { Placeholder } from '@/components/common/Placeholder';

type Tone = 'beige' | 'cream' | 'cocoa' | 'blush' | 'sage';

interface Post {
  t: string;
  c: string;
  d: string;
  read: string;
  img: string;
  tone: Tone;
  body?: string;
}

const POSTS: Post[] = [
  { t: 'How we plant-dye our spring palette', c: 'Process', d: 'March 14, 2026', read: '6 min', img: 'yarn drying outside', tone: 'beige', body: 'Six colors, six plants, one mill in Porto. A walk-through of how marigold becomes Marigold.' },
  { t: 'On finishing — why corners matter most', c: 'Craft', d: 'Feb 28, 2026', read: '4 min', img: 'stitched corner detail', tone: 'cocoa' },
  { t: 'Maria\u2019s grandmother\u2019s stitch journal', c: 'Archive', d: 'Feb 11, 2026', read: '8 min', img: 'old stitch journal', tone: 'cream' },
  { t: 'A weekend in our Alfama studio', c: 'Studio', d: 'Jan 30, 2026', read: '5 min', img: 'studio panorama', tone: 'blush' },
  { t: 'How to wash and care for crochet', c: 'Care', d: 'Jan 16, 2026', read: '3 min', img: 'linen soak', tone: 'sage' },
  { t: 'Slow business, six years in', c: 'Letters', d: 'Jan 04, 2026', read: '7 min', img: 'Joana writing', tone: 'beige' },
  { t: 'The case for one good tote', c: 'Manifesto', d: 'Dec 12, 2025', read: '4 min', img: 'tote on chair', tone: 'cream' },
];

export default function JournalPage() {
  const [feature, ...rest] = POSTS;
  return (
    <div className="page">
      <section className="page-hero">
        <div className="page-hero-inner">
          <span className="kicker">The Journal</span>
          <h1 className="page-hero-title">Letters from <em>the studio.</em></h1>
          <p className="page-hero-sub">
            Notes on craft, slow business, the women who taught us, and the long quiet days at the hook.
          </p>
        </div>
      </section>

      <div className="journal-categories">
        {['All', 'Process', 'Craft', 'Studio', 'Care', 'Letters', 'Archive'].map((c, i) => (
          <button key={c} className={`shop-pill ${i === 0 ? 'is-active' : ''}`} type="button">{c}</button>
        ))}
      </div>

      <article className="journal-feature">
        <div className="feat-img">
          <Placeholder label={feature.img} tone={feature.tone} ratio="4 / 3" />
        </div>
        <div>
          <span className="kicker">Featured · {feature.c}</span>
          <h2><em>{feature.t}</em></h2>
          <div className="journal-meta">
            <span>{feature.d}</span>
            <span className="dot" />
            <span>{feature.read} read</span>
            <span className="dot" />
            <span>by Maria</span>
          </div>
          {feature.body && <p style={{ marginTop: '1.2rem' }}>{feature.body}</p>}
          <a href="#" className="link-arrow" style={{ marginTop: '1.2rem', display: 'inline-flex' }}>
            Read the piece <span>→</span>
          </a>
        </div>
      </article>

      <section className="journal-grid-wrap">
        <div className="section-head" style={{ marginBottom: '2rem' }}>
          <span className="kicker">More entries</span>
          <h2 className="section-title">Recent <em>writings.</em></h2>
        </div>
        <div className="journal-grid">
          {rest.map((p) => (
            <article key={p.t} className="journal-card">
              <div className="card-img">
                <Placeholder label={p.img} tone={p.tone} ratio="4 / 3" />
              </div>
              <div className="journal-meta">
                <span>{p.c}</span>
                <span className="dot" />
                <span>{p.d}</span>
                <span className="dot" />
                <span>{p.read}</span>
              </div>
              <h3>{p.t}</h3>
              <a className="read-more" href="#">Read <span>→</span></a>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
