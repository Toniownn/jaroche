import { Placeholder } from '@/components/common/Placeholder';

const VALUES = [
  { n: '01', t: 'Slow & small', p: 'Every piece is made to order in 7–14 days. We never make more than we can finish by hand.' },
  { n: '02', t: 'Natural fibers', p: 'Plant-dyed organic cotton, Portuguese linen, raffia from Madagascar — all traceable, all biodegradable.' },
  { n: '03', t: 'Made to last', p: 'Heirloom-grade stitching, reinforced corners, a free repair service for life. Soften, don’t replace.' },
];

const TIMELINE = [
  { y: '2019', t: 'A kitchen table', p: 'Maria and Joana — sisters, both newly out of design school — start crocheting on a rainy Sunday in Alfama.' },
  { y: '2020', t: 'First small market', p: 'We sell out our first batch of 12 totes at a craft fair in LX Factory. The bakery downstairs lets us use their basement for shipping.' },
  { y: '2022', t: 'The atelier', p: 'We move into a sunlit room above the bakery. Sandra joins as our third pair of hands. We hand-write 600 thank-you notes that year.' },
  { y: '2024', t: 'Our own yarn', p: 'Plant-dyed in collaboration with Têxtil Marina, a fourth-generation mill in Porto. Six house colors, all named after the women in our family.' },
  { y: '2026', t: 'Today', p: 'Three makers, 118 pieces a season, shipping to 31 countries. Still on the same kitchen table for design days.' },
];

export default function AboutPage() {
  return (
    <div className="page">
      <section className="page-hero">
        <div className="page-hero-inner">
          <span className="kicker">Our story</span>
          <h1 className="page-hero-title">A studio of <em>two hands,</em> one slow rhythm.</h1>
          <p className="page-hero-sub">
            Jaroché is a tiny atelier above a bakery in Alfama, Lisboa. We design and crochet
            every piece ourselves, in small considered batches, the way our grandmothers did.
          </p>
        </div>
      </section>

      <section className="about-intro">
        <div>
          <p className="lead">
            &ldquo;We started Jaroché on a kitchen table in 2019 — a sister, a hook, and a basket of
            leftover cotton from our grandmother&apos;s chest.&rdquo;
          </p>
          <p>
            What began as a way to keep our hands busy through a long winter became, slowly and
            almost accidentally, a small business. Our first tote went to a friend. The second to
            her sister. The third to a stranger in Berlin who&apos;d seen the second on the metro.
          </p>
          <p>
            Six years on, we still work in pairs in the same sunlit room. We choose plant-dyed yarns
            from a family mill in Porto, design our own patterns at the kitchen table, and send
            everything wrapped in unbleached linen and a hand-written note.
          </p>
          <p>
            We don&apos;t do drops, algorithms, or seasonal anxiety. Just objects made to soften with use.
          </p>
        </div>
        <div className="about-image-stack">
          <div>
            <Placeholder label="studio window light" tone="cream" ratio="3 / 4" />
          </div>
          <div>
            <Placeholder label="hands at work" tone="beige" ratio="3 / 4" />
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
