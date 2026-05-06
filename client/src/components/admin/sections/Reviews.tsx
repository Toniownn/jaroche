'use client';

import { KpiCard } from '../KpiCard';
import { useAdminModal } from '../Modal';

const REVIEWS = [
  { n: 'Élise M.', p: 'Marigold Tote', r: 5, t: 'The colour is exactly as photographed and the strap is exactly the right length. So happy.', when: 'May 4', replied: false },
  { n: 'Léa R.', p: 'Soft Wave Throw', r: 5, t: 'Sleeping under it now — feels like it was knit by hand by someone who cared. Because it was.', when: 'May 2', replied: true },
  { n: 'Hana K.', p: 'Petite Crossbody', r: 4, t: 'Beautiful piece, slightly smaller than expected. I&apos;ll get the bigger one next.', when: 'Apr 28', replied: false },
  { n: 'Tomás A.', p: 'Lila Bucket Hat', r: 5, t: 'Wore it every day in Lisbon last week. Only got two compliments though, will demand more.', when: 'Apr 24', replied: true },
];

export function Reviews() {
  const m = useAdminModal();
  return (
    <div>
      <div className="page-head">
        <div>
          <h1 className="page-title">Reviews</h1>
          <p className="page-sub">128 reviews · 4.8 average · 6 awaiting reply</p>
        </div>
      </div>
      <div className="kpis" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
        <KpiCard label="Average rating" value="4.8 ★" delta="+0.1" deltaDir="up" />
        <KpiCard label="Reviews this month" value="14" />
        <KpiCard label="Response rate" value="92%" />
      </div>
      <div className="dash-grid-3" style={{ marginTop: 0, gridTemplateColumns: '1fr 1fr' }}>
        {REVIEWS.map((r) => (
          <div key={r.n + r.p} className="card card-pad">
            <div className="between" style={{ marginBottom: '0.5rem' }}>
              <div className="row">
                <div className="avatar">
                  {r.n
                    .split(' ')
                    .map((s) => s[0])
                    .join('')}
                </div>
                <div>
                  <strong>{r.n}</strong>
                  <div className="muted" style={{ fontSize: '0.78rem' }}>
                    on {r.p} · {r.when}
                  </div>
                </div>
              </div>
              <div style={{ color: 'var(--a-beige-deep)', fontSize: '0.92rem' }}>
                {'★'.repeat(r.r)}
                {'☆'.repeat(5 - r.r)}
              </div>
            </div>
            <p
              style={{
                margin: '0.5rem 0',
                fontStyle: 'italic',
                color: 'var(--a-cocoa-2)',
                lineHeight: 1.6,
              }}
            >
              &ldquo;{r.t}&rdquo;
            </p>
            <div className="row gap-sm" style={{ marginTop: '0.7rem' }}>
              {r.replied ? (
                <span className="badge good no-dot">Replied</span>
              ) : (
                <span className="badge warn no-dot">Awaiting reply</span>
              )}
              <span style={{ flex: 1 }} />
              <button
                className="btn btn-ghost btn-sm"
                onClick={() => m.info('Reply', `Opens a reply draft to ${r.n}.`)}
              >
                Reply
              </button>
            </div>
          </div>
        ))}
      </div>
      {m.modal}
    </div>
  );
}
