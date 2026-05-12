'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { YarnIcon } from '@/components/icons/YarnIcon';

export default function ContactPage() {
  const [sent, setSent] = useState(false);

  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSent(true);
    toast.success('Note received. We\u2019ll write back within two studio days.');
  }

  return (
    <div className="page">
      <section className="page-hero">
        <div className="page-hero-inner">
          <span className="kicker">Say hello</span>
          <h1 className="page-hero-title">Drop us <em>a line.</em></h1>
          <p className="page-hero-sub">
            I answer every message by hand, usually within two studio days. For urgent things,
            send a message on Facebook or Instagram — Tue–Sat, 9am–5pm Philippine time.
          </p>
        </div>
      </section>

      <section className="contact-grid">
        <div className="contact-info">
          <div className="info-block">
            <h3>The studio</h3>
            <p>Yati, Liloan<br />Cebu, Philippines</p>
            <p className="small">By appointment only — send a message first and we&apos;ll set a time.</p>
          </div>
          <div className="info-block">
            <h3>Message</h3>
            <p>Facebook: Jaroché</p>
            <p className="small">Instagram: @jaroche_</p>
          </div>
          <div className="info-block">
            <h3>Hours</h3>
            <p>Tue–Sat, 9am–5pm</p>
            <p className="small">Philippine time (PHT). Kathlyn answers personally.</p>
          </div>
          <div className="info-block">
            <h3>Find us elsewhere</h3>
            <div className="socials" style={{ marginTop: '0.6rem' }}>
              <a href="https://www.facebook.com/jaroche" target="_blank" rel="noopener noreferrer">Facebook</a>
              <a href="https://www.instagram.com/jaroche_" target="_blank" rel="noopener noreferrer">Instagram</a>
            </div>
          </div>
        </div>

        <form className="contact-form" onSubmit={submit}>
          <h2>Send a <em>note.</em></h2>
          <p>We read every one. Promise.</p>

          {!sent ? (
            <>
              <div className="field-row">
                <div className="field">
                  <label>Your name</label>
                  <input type="text" placeholder="Élise Moreau" required />
                </div>
                <div className="field">
                  <label>Email</label>
                  <input type="email" placeholder="you@email.com" required />
                </div>
              </div>
              <div className="field">
                <label>What&apos;s it about?</label>
                <select defaultValue="">
                  <option value="" disabled>Choose a topic</option>
                  <option>Order question</option>
                  <option>Custom commission</option>
                  <option>Wholesale</option>
                  <option>Press / collaboration</option>
                  <option>Just saying hello</option>
                </select>
              </div>
              <div className="field">
                <label>Your note</label>
                <textarea rows={5} placeholder="Tell us a little about what you're looking for…" required />
              </div>
              <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                <span>Send note</span>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.4">
                  <path d="M2 7h10M8 3l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </>
          ) : (
            <div style={{ padding: '2rem 0', textAlign: 'center' }}>
              <YarnIcon size={36} />
              <p style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: '1.6rem', margin: '1rem 0 0.4rem' }}>
                Thank you.
              </p>
              <p style={{ color: 'var(--color-cocoa-soft)' }}>
                We&apos;ll be in touch within two studio days.
              </p>
            </div>
          )}
        </form>
      </section>
    </div>
  );
}
