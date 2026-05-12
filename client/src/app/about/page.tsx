import { Placeholder } from '@/components/common/Placeholder';

const VALUES = [
  { n: '01', t: 'Slow & small', p: 'Every piece is made to order in 7–14 days. Nothing is made beyond what one pair of hands can finish.' },
  { n: '02', t: 'Natural fibers', p: 'Soft cotton, linen, raffia and merino wool — chosen for how they feel after years of use, not just the first wear.' },
  { n: '03', t: 'Made to last', p: 'Heirloom-grade stitching, reinforced corners, free repairs for life. Soften, don’t replace.' },
];

const TIMELINE = [
  { y: '2020', t: 'A hook and a window', p: 'Kathlyn Jarocan picks up a crochet hook in Yati, Liloan, Cebu — a quiet way to keep busy through a long, rainy season.' },
  { y: '2021', t: 'First small market', p: 'A few bouquets, a few totes, a small stall at a barangay weekend market. The first set of regulars find us.' },
  { y: '2023', t: 'The studio at home', p: 'A sunlit room becomes the studio — yarn baskets along the wall, an old table for cutting, a board for finished pieces.' },
  { y: '2025', t: 'Online & by appointment', p: 'Jaroché goes online — and the studio stays open by appointment for friends, neighbours, and curious passersby.' },
  { y: '2026', t: 'Today', p: 'One maker, small batches, each piece signed and shipped from Yati. Still the same table, still the same pace.' },
];

export default function AboutPage() {
  return (
    <div className="page">
      <section className="page-hero">
        <div className="page-hero-inner">
          <span className="kicker">Our story</span>
          <h1 className="page-hero-title">A studio of <em>one pair</em> of hands.</h1>
          <p className="page-hero-sub">
            Jaroché is a small arts &amp; crafts studio in Yati, Liloan, Cebu, run by Kathlyn Jarocan.
            Every piece is designed and crocheted by hand, in small considered batches.
          </p>
        </div>
      </section>

      <section className="about-intro">
        <div>
          <p className="lead">
            &ldquo;I started Jaroché at home in Yati — a hook, a basket of yarn, and the slow
            rhythm of one stitch after another.&rdquo;
          </p>
          <p>
            What began as a way to keep my hands busy became, slowly and almost accidentally,
            a small business. The first bouquet went to a friend. The second to her sister.
            The third to a stranger who&apos;d seen the second on Facebook.
          </p>
          <p>
            Today I still work alone in the same sunlit room — choosing soft cottons and linens,
            designing my own patterns, and sending everything wrapped with care and a hand-written note.
          </p>
          <p>
            No drops, no algorithms, no seasonal anxiety. Just objects made by hand, to soften with use.
          </p>
        </div>
        <div className="about-image-stack">
          <div>
            <img
              src="/products/cmp2l38ns001p44yo54i8duem.jpg"
              alt="A single-stem tulip and carnation pair from the studio"
              loading="lazy"
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
          </div>
          <div>
            <img
              src="/products/cmp2l38nm001o44yo5tnnemz3.jpg"
              alt="A carnation cluster bouquet, hand-finished"
              loading="lazy"
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
          </div>
        </div>
      </section>

      <section className="values">
        <div className="section-head section-head-center" style={{ marginBottom: '3rem' }}>
          <span className="kicker">What we believe</span>
          <h2 className="section-title">Three small <em>promises.</em></h2>
        </div>
        <div className="values-grid">
          {VALUES.map((v) => (
            <div key={v.n} className="value">
              <span className="value-num">{v.n}</span>
              <h3>{v.t}</h3>
              <p>{v.p}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="timeline">
        <div className="section-head section-head-center" style={{ marginBottom: '2rem' }}>
          <span className="kicker">Six years</span>
          <h2 className="section-title">A small <em>chronology.</em></h2>
        </div>
        {TIMELINE.map((e) => (
          <div key={e.y} className="timeline-item">
            <div className="timeline-year">{e.y}</div>
            <div className="timeline-body">
              <h3>{e.t}</h3>
              <p>{e.p}</p>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
