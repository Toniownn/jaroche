'use client';

import { Icon } from '../Icon';
import { useAdminModal } from '../Modal';

const POSTS = [
  { t: 'How we plant-dye our cotton in Porto', cat: 'Materials', a: 'Joana', s: 'Published', d: 'May 2', v: 2840, tone: 'sage' },
  { t: 'A morning at the studio: making a Marigold tote', cat: 'Process', a: 'Maria', s: 'Published', d: 'Apr 28', v: 4120, tone: 'beige' },
  { t: 'Spring · Loosely tied', cat: 'Collections', a: 'Maria', s: 'Published', d: 'Apr 14', v: 3210, tone: 'blush' },
  { t: 'The mill that taught us patience', cat: 'Stories', a: 'Joana', s: 'Draft', d: '—', v: 0, tone: 'cocoa' },
  { t: 'Care guide: washing your crocheted pieces', cat: 'Care', a: 'Maria', s: 'Published', d: 'Apr 1', v: 1840, tone: 'cream' },
  { t: 'Five years on a kitchen table', cat: 'Stories', a: 'Joana', s: 'Draft', d: '—', v: 0, tone: 'beige' },
];

export function Journal() {
  const m = useAdminModal();
  return (
    <div>
      <div className="page-head">
        <div>
          <h1 className="page-title">Journal</h1>
          <p className="page-sub">Stories from the studio · {POSTS.filter((p) => p.s === 'Published').length} published, {POSTS.filter((p) => p.s === 'Draft').length} drafts</p>
        </div>
        <div className="page-actions">
          <button
            className="btn btn-primary"
            onClick={() => m.info('New article', 'Editor coming soon. v1: design only.')}
          >
            <Icon name="plus" size={14} />
            New article
          </button>
        </div>
      </div>

      <div className="card">
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>Article</th>
                <th>Category</th>
                <th>Author</th>
                <th>Status</th>
                <th>Published</th>
                <th className="num">Views</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {POSTS.map((p) => (
                <tr
                  key={p.t}
                  style={{ cursor: 'pointer' }}
                  onClick={() => m.info(p.t, 'Editor stub — wiring planned for v2.')}
                >
                  <td>
                    <div className="prod-cell">
                      <div
                        className={`prod-thumb prod-thumb-tone-${p.tone}`}
                        style={{ width: 44, height: 44, borderRadius: 4 }}
                      />
                      <div>
                        <div style={{ fontWeight: 500 }}>{p.t}</div>
                        <div className="muted" style={{ fontSize: '0.78rem' }}>
                          4 min read
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="muted">{p.cat}</td>
                  <td>{p.a}</td>
                  <td>
                    <span
                      className={`badge ${p.s === 'Published' ? 'good' : 'warn'} no-dot`}
                    >
                      {p.s}
                    </span>
                  </td>
                  <td className="muted">{p.d}</td>
                  <td className="num">{p.v ? p.v.toLocaleString() : '—'}</td>
                  <td className="actions-cell">
                    <Icon name="chevron" size={14} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {m.modal}
    </div>
  );
}
