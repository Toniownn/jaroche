'use client';

import { Icon } from '../Icon';
import { KpiCard } from '../KpiCard';
import { useAdminModal } from '../Modal';

const CODES = [
  { code: 'STUDIO10', off: '10% off', uses: 184, max: '—', status: 'Active', expires: 'Dec 31, 2026' },
  { code: 'WELCOME15', off: '15% off first order', uses: 92, max: '500', status: 'Active', expires: '—' },
  { code: 'SUMMER25', off: '25% off summer collection', uses: 0, max: '200', status: 'Scheduled', expires: 'Jul 15, 2026' },
  { code: 'FRIENDS', off: 'Free shipping', uses: 41, max: '100', status: 'Active', expires: '—' },
  { code: 'SPRING24', off: '20% off', uses: 248, max: '250', status: 'Expired', expires: 'Apr 30, 2026' },
];

export function Discounts() {
  const m = useAdminModal();
  async function askDelete(c: string) {
    const ok = await m.confirm(
      `Delete code ${c}?`,
      'Existing customers who saved this code will see an error at checkout.',
      'Delete',
      'Cancel',
      true
    );
    if (ok) await m.success('Deleted.', `${c} has been removed.`);
  }

  return (
    <div>
      <div className="page-head">
        <div>
          <h1 className="page-title">Discounts</h1>
          <p className="page-sub">Promo codes &amp; automatic discounts</p>
        </div>
        <div className="page-actions">
          <button
            className="btn btn-primary"
            onClick={() => m.info('New discount', 'Discount builder is design-only in v1.')}
          >
            <Icon name="plus" size={14} />
            New discount
          </button>
        </div>
      </div>
      <div className="kpis" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
        <KpiCard label="Active codes" value="3" />
        <KpiCard label="Total redemptions (30d)" value="184" delta="+24%" deltaDir="up" />
        <KpiCard label="Discount revenue (30d)" value="₱42,840" />
      </div>
      <div className="card">
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>Code</th>
                <th>Discount</th>
                <th className="num">Uses</th>
                <th className="num">Limit</th>
                <th>Status</th>
                <th>Expires</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {CODES.map((c) => (
                <tr key={c.code}>
                  <td>
                    <span
                      style={{
                        fontFamily: 'var(--mono)',
                        fontWeight: 500,
                        background: 'var(--a-line-2)',
                        padding: '2px 8px',
                        borderRadius: 4,
                      }}
                    >
                      {c.code}
                    </span>
                  </td>
                  <td>{c.off}</td>
                  <td className="num">{c.uses}</td>
                  <td className="num muted">{c.max}</td>
                  <td>
                    <span
                      className={`badge ${
                        c.status === 'Active' ? 'good' : c.status === 'Scheduled' ? 'info' : 'neutral'
                      } no-dot`}
                    >
                      {c.status}
                    </span>
                  </td>
                  <td className="muted">{c.expires}</td>
                  <td className="actions-cell">
                    <button
                      className="btn btn-quiet btn-icon"
                      onClick={() => m.info('Edit', 'Stubbed for v1.')}
                    >
                      <Icon name="edit" size={14} />
                    </button>
                    <button className="btn btn-quiet btn-icon" onClick={() => void askDelete(c.code)}>
                      <Icon name="trash" size={14} />
                    </button>
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
