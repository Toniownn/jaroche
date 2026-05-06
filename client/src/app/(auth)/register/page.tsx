import Link from 'next/link';
import { RegisterForm } from '@/components/forms/RegisterForm';
import { YarnIcon } from '@/components/icons/YarnIcon';

export default function RegisterPage() {
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
            <span className="auth-side-attr">— Maria &amp; Joana, founders</span>
          </p>
        </div>

        <div className="auth-side-stamp" aria-hidden="true">
          <YarnIcon size={48} color="#3D2F2F" />
        </div>
      </aside>

      <section className="auth-form-wrap">
        <div style={{ width: '100%', maxWidth: 440 }}>
          <div className="auth-tabs" role="tablist" aria-label="Account">
            <Link href="/login" className="auth-tab" role="tab" aria-selected={false}>
              Sign in
            </Link>
            <button
              type="button"
              role="tab"
              aria-selected
              className="auth-tab is-active"
            >
              Create account
            </button>
          </div>

          <RegisterForm />
        </div>
      </section>
    </div>
  );
}
