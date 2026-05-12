'use client';

import { useState } from 'react';
import Link from 'next/link';
import { LoginForm } from '@/components/forms/LoginForm';
import { ForgotForm } from '@/components/forms/ForgotForm';
import { YarnIcon } from '@/components/icons/YarnIcon';

type Mode = 'signin' | 'forgot';

export function LoginShell() {
  const [mode, setMode] = useState<Mode>('signin');

  return (
    <div className="auth-wrap">
      <aside className="auth-side">
        <Link href="/" className="auth-side-logo">
          Jaroché
        </Link>

        <div>
          <p className="auth-side-quote">
            Made slowly, one stitch at a time. We hope your pieces soften with the years and
            outlast every season.
            <span className="auth-side-attr">— Kathlyn Jarocan, founder</span>
          </p>
        </div>

        <div className="auth-side-stamp" aria-hidden="true">
          <YarnIcon size={48} color="#3D2F2F" />
        </div>
      </aside>

      <section className="auth-form-wrap">
        <div style={{ width: '100%', maxWidth: 440 }}>
          {mode !== 'forgot' && (
            <div className="auth-tabs" role="tablist" aria-label="Account">
              <button
                type="button"
                role="tab"
                aria-selected={mode === 'signin'}
                className={`auth-tab ${mode === 'signin' ? 'is-active' : ''}`}
                onClick={() => setMode('signin')}
              >
                Sign in
              </button>
              <Link href="/register" className="auth-tab" role="tab" aria-selected={false}>
                Create account
              </Link>
            </div>
          )}

          {mode === 'signin' && <LoginForm onForgot={() => setMode('forgot')} />}
          {mode === 'forgot' && <ForgotForm onBack={() => setMode('signin')} />}
        </div>
      </section>
    </div>
  );
}
