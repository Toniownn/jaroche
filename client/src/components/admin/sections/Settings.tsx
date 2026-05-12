'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import type { PublicUser } from '@jaroche/shared';
import { Icon } from '../Icon';
import { useAdminModal } from '../Modal';
import { useAuthStore } from '@/stores/auth.store';

const SECTIONS = [
  { id: 'account', label: 'Account', icon: 'settings' as const },
  { id: 'studio', label: 'Studio profile', icon: 'yarn' as const },
  { id: 'notify', label: 'Notifications', icon: 'bell' as const },
  { id: 'integrations', label: 'Integrations', icon: 'discounts' as const },
];

export function Settings() {
  const m = useAdminModal();
  const setAuth = useAuthStore((s) => s.setAuth);
  const accessToken = useAuthStore((s) => s.accessToken);
  const [section, setSection] = useState<string>('account');

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api
      .get<PublicUser>('/users/profile')
      .then((r) => {
        setName(r.data.name);
        setEmail(r.data.email);
      })
      .finally(() => setLoading(false));
  }, []);

  async function save() {
    setSaving(true);
    try {
      const r = await api.put<PublicUser>('/users/profile', { name });
      if (accessToken) setAuth(accessToken, r.data);
      await m.success('Saved.', 'Your profile has been updated.');
    } catch {
      await m.error('Could not save', 'Try again or check the server logs.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <div className="page-head">
        <div>
          <h1 className="page-title">Settings</h1>
          <p className="page-sub">Configure your studio.</p>
        </div>
      </div>
      <div
        style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: 'var(--gap)', alignItems: 'start' }}
      >
        <div className="card" style={{ padding: '0.5rem' }}>
          {SECTIONS.map((s) => (
            <button
              key={s.id}
              className={`sb-link ${section === s.id ? 'is-active' : ''}`}
              style={{
                color: section === s.id ? 'var(--a-cocoa)' : 'var(--a-cocoa-2)',
                background: section === s.id ? 'var(--a-line-2)' : 'transparent',
              }}
              onClick={() => setSection(s.id)}
            >
              <Icon name={s.icon} size={16} />
              <span>{s.label}</span>
            </button>
          ))}
        </div>
        <div className="card card-pad">
          {section === 'account' && (
            <div>
              <h3
                style={{
                  marginTop: 0,
                  fontFamily: 'var(--serif)',
                  fontWeight: 400,
                  fontSize: '1.4rem',
                }}
              >
                Account
              </h3>
              {loading ? (
                <p className="muted">Loading…</p>
              ) : (
                <>
                  <div className="ad-field-row">
                    <div className="ad-field">
                      <label>Display name</label>
                      <input value={name} onChange={(e) => setName(e.target.value)} />
                    </div>
                    <div className="ad-field">
                      <label>Email</label>
                      <input value={email} disabled />
                    </div>
                  </div>
                  <div className="row" style={{ marginTop: '1rem' }}>
                    <button className="btn btn-primary" disabled={saving} onClick={() => void save()}>
                      <Icon name="save" size={14} />
                      {saving ? 'Saving…' : 'Save changes'}
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
          {section === 'studio' && (
            <div>
              <h3
                style={{
                  marginTop: 0,
                  fontFamily: 'var(--serif)',
                  fontWeight: 400,
                  fontSize: '1.4rem',
                }}
              >
                Studio profile
              </h3>
              <div className="ad-field-row">
                <div className="ad-field">
                  <label>Store name</label>
                  <input defaultValue="Jaroché" />
                </div>
                <div className="ad-field">
                  <label>Contact email</label>
                  <input defaultValue="jaroche@jaroche.ph" />
                </div>
              </div>
              <div className="ad-field">
                <label>Studio address</label>
                <textarea
                  rows={3}
                  defaultValue={'Yati, Liloan\nCebu, Philippines'}
                />
              </div>
              <div className="row" style={{ marginTop: '1rem' }}>
                <button
                  className="btn btn-primary"
                  onClick={() => m.success('Saved.', 'Studio profile updated.')}
                >
                  <Icon name="save" size={14} />
                  Save changes
                </button>
              </div>
              <p className="muted" style={{ fontSize: '0.78rem', marginTop: '0.6rem' }}>
                Studio profile is design-only in v1.
              </p>
            </div>
          )}
          {section === 'notify' && (
            <div className="empty-state" style={{ padding: '3rem 1rem' }}>
              <div className="empty-state-icon">
                <Icon name="bell" size={24} />
              </div>
              <h3>Notifications</h3>
              <p>Email/SMS notification settings will live here in v2.</p>
            </div>
          )}
          {section === 'integrations' && (
            <div className="empty-state" style={{ padding: '3rem 1rem' }}>
              <div className="empty-state-icon">
                <Icon name="discounts" size={24} />
              </div>
              <h3>Integrations</h3>
              <p>Stripe is wired in production. Other integrations are stubbed for v1.</p>
            </div>
          )}
        </div>
      </div>
      {m.modal}
    </div>
  );
}
