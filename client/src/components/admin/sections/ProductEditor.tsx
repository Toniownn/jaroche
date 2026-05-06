'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { formatPHP } from '@/lib/utils';
import type { Product } from '@jaroche/shared';
import { Icon } from '../Icon';
import { useAdminModal } from '../Modal';

interface FormState {
  name: string;
  description: string;
  price: number;
  stock: number;
  imageUrl: string;
  category: string;
  tone: string;
  material: string;
  madeBy: string;
  label: string;
  tag: string;
}

const TONES = ['beige', 'cream', 'blush', 'cocoa', 'sage'];
const MATERIALS = ['Organic cotton', 'Linen', 'Raffia', 'Merino wool'];
const MAKERS = ['Maria', 'Joana', 'Both makers'];
const TAGS = ['', 'Best seller', 'New', 'Limited'];

const empty: FormState = {
  name: '',
  description: '',
  price: 0,
  stock: 0,
  imageUrl: '',
  category: '',
  tone: 'beige',
  material: 'Organic cotton',
  madeBy: 'Maria',
  label: '',
  tag: '',
};

interface Props {
  id?: string; // omitted for "new"
}

export function ProductEditor({ id }: Props) {
  const router = useRouter();
  const isNew = !id;
  const [form, setForm] = useState<FormState>(empty);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const m = useAdminModal();

  useEffect(() => {
    if (isNew) return;
    api
      .get<Product>(`/products/${id}`)
      .then((r) => {
        const p = r.data;
        setForm({
          name: p.name,
          description: p.description,
          price: Number(p.price),
          stock: p.stock,
          imageUrl: p.imageUrl ?? '',
          category: p.category,
          tone: p.tone ?? 'beige',
          material: p.material ?? 'Organic cotton',
          madeBy: p.madeBy ?? 'Maria',
          label: p.label ?? '',
          tag: p.tag ?? '',
        });
      })
      .finally(() => setLoading(false));
  }, [id, isNew]);

  function update<K extends keyof FormState>(k: K, v: FormState[K]) {
    setForm((s) => ({ ...s, [k]: v }));
  }

  async function save() {
    setError(null);
    setSaving(true);
    try {
      const payload = {
        name: form.name,
        description: form.description || ' ',
        price: Number(form.price),
        stock: Number(form.stock),
        imageUrl:
          form.imageUrl ||
          'https://images.unsplash.com/photo-1517059224940-d4af9eec41b7?w=800',
        category: form.category || 'General',
        tone: form.tone || undefined,
        material: form.material || undefined,
        madeBy: form.madeBy || undefined,
        label: form.label || undefined,
        tag: form.tag || undefined,
      };
      if (isNew) {
        await api.post('/products', payload);
        await m.success('Created.', 'Your product is live.');
      } else {
        await api.put(`/products/${id}`, payload);
        await m.success('Saved.', 'Product updated.');
      }
      router.push('/admin/products');
    } catch (err) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        'Save failed';
      setError(msg);
      await m.error('Could not save', msg);
    } finally {
      setSaving(false);
    }
  }

  async function remove() {
    if (!id) return;
    const ok = await m.confirm(
      'Delete this product?',
      'It will be removed from the storefront. This cannot be undone.',
      'Delete',
      'Cancel',
      true
    );
    if (!ok) return;
    try {
      await api.delete(`/products/${id}`);
      await m.success('Deleted.', 'Product removed.');
      router.push('/admin/products');
    } catch {
      await m.error('Could not delete', 'Try again or check the server logs.');
    }
  }

  if (loading) return <p className="muted">Loading product…</p>;

  return (
    <div>
      <div className="page-head">
        <div>
          <button
            className="btn btn-quiet"
            onClick={() => router.push('/admin/products')}
            style={{ marginBottom: '0.4rem', paddingLeft: 0, fontSize: '0.82rem' }}
          >
            <Icon name="chevronLeft" size={14} /> Products
          </button>
          <h1 className="page-title">
            {isNew ? (
              <>
                Add <em>a new piece.</em>
              </>
            ) : (
              form.name || 'Untitled'
            )}
          </h1>
          {!isNew && <p className="page-sub">Editing existing product</p>}
        </div>
        <div className="page-actions">
          {!isNew && (
            <button className="btn btn-danger" onClick={() => void remove()}>
              <Icon name="trash" size={14} /> Delete
            </button>
          )}
          <button className="btn btn-primary" onClick={() => void save()} disabled={saving}>
            <Icon name="save" size={14} />
            {saving ? 'Saving…' : isNew ? 'Publish' : 'Save changes'}
          </button>
        </div>
      </div>

      {error && (
        <div
          className="card card-pad"
          style={{ marginBottom: 'var(--gap)', borderColor: 'var(--a-bad)', color: 'var(--a-bad)' }}
        >
          {error}
        </div>
      )}

      <div className="detail-grid">
        <div>
          <div className="card" style={{ marginBottom: 'var(--gap)' }}>
            <div className="card-head">
              <h3 className="card-title">Basics</h3>
            </div>
            <div className="card-pad" style={{ paddingTop: 0 }}>
              <div className="ad-field">
                <label>Name</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => update('name', e.target.value)}
                  placeholder="Marigold Tote"
                />
              </div>
              <div className="ad-field">
                <label>Description</label>
                <textarea
                  rows={4}
                  value={form.description}
                  onChange={(e) => update('description', e.target.value)}
                />
              </div>
              <div className="ad-field-row">
                <div className="ad-field">
                  <label>Category</label>
                  <input
                    type="text"
                    value={form.category}
                    onChange={(e) => update('category', e.target.value)}
                    placeholder="Bags, Accessories, Home…"
                  />
                </div>
                <div className="ad-field">
                  <label>Tag (optional)</label>
                  <select value={form.tag} onChange={(e) => update('tag', e.target.value)}>
                    {TAGS.map((t) => (
                      <option key={t} value={t}>
                        {t || '— None —'}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="ad-field">
                <label>Stripe label (optional)</label>
                <input
                  type="text"
                  value={form.label}
                  onChange={(e) => update('label', e.target.value)}
                  placeholder="Hand-finished · Lisbon"
                />
              </div>
            </div>
          </div>

          <div className="card" style={{ marginBottom: 'var(--gap)' }}>
            <div className="card-head">
              <h3 className="card-title">Photo</h3>
            </div>
            <div className="card-pad" style={{ paddingTop: 0 }}>
              <div className="ad-field">
                <label>Image URL</label>
                <input
                  type="text"
                  value={form.imageUrl}
                  onChange={(e) => update('imageUrl', e.target.value)}
                  placeholder="https://…"
                />
              </div>
              {form.imageUrl && (
                <div
                  className={`prod-thumb prod-thumb-tone-${form.tone}`}
                  style={{
                    width: 160,
                    height: 200,
                    borderRadius: 8,
                    backgroundImage: `url(${form.imageUrl})`,
                  }}
                />
              )}
            </div>
          </div>

          <div className="card">
            <div className="card-head">
              <h3 className="card-title">Materials</h3>
            </div>
            <div className="card-pad" style={{ paddingTop: 0 }}>
              <div className="ad-field-row">
                <div className="ad-field">
                  <label>Tone</label>
                  <select value={form.tone} onChange={(e) => update('tone', e.target.value)}>
                    {TONES.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="ad-field">
                  <label>Material</label>
                  <select
                    value={form.material}
                    onChange={(e) => update('material', e.target.value)}
                  >
                    {MATERIALS.map((mat) => (
                      <option key={mat} value={mat}>
                        {mat}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="ad-field">
                <label>Made by</label>
                <select value={form.madeBy} onChange={(e) => update('madeBy', e.target.value)}>
                  {MAKERS.map((m2) => (
                    <option key={m2} value={m2}>
                      {m2}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className="card" style={{ marginBottom: 'var(--gap)' }}>
            <div className="card-head">
              <h3 className="card-title">Pricing</h3>
            </div>
            <div className="card-pad" style={{ paddingTop: 0 }}>
              <div className="ad-field">
                <label>Price (₱)</label>
                <input
                  type="number"
                  step={1}
                  value={form.price}
                  onChange={(e) => update('price', Number(e.target.value))}
                />
                <div className="ad-field-help">Display: {formatPHP(form.price)}</div>
              </div>
            </div>
          </div>
          <div className="card">
            <div className="card-head">
              <h3 className="card-title">Inventory</h3>
            </div>
            <div className="card-pad" style={{ paddingTop: 0 }}>
              <div className="ad-field">
                <label>Stock</label>
                <input
                  type="number"
                  step={1}
                  value={form.stock}
                  onChange={(e) => update('stock', Number(e.target.value))}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      {m.modal}
    </div>
  );
}
