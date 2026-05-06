'use client';

import { useState } from 'react';
import { toast } from 'sonner';

interface Props {
  onBack: () => void;
}

export function ForgotForm({ onBack }: Props) {
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      toast.error("Hmm, that doesn't look right", {
        description: 'Please use a valid email address.',
      });
      return;
    }
    setSubmitting(true);
    try {
      // Server endpoint not implemented in v1 — show the design's success copy.
      await new Promise((r) => setTimeout(r, 600));
      toast.success('Check your inbox.', {
        description: `If an account exists for ${email}, a reset link is on its way. It usually arrives within a minute.`,
      });
      onBack();
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="auth-form" onSubmit={onSubmit} noValidate>
      <h1>
        Forgot your <em>password?</em>
      </h1>
      <p>Tell us your email and we&apos;ll send a quiet note with a reset link.</p>

      <div className="field">
        <label htmlFor="reset-email">Email</label>
        <input
          id="reset-email"
          type="email"
          placeholder="you@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      <button type="submit" disabled={submitting} className="auth-pill auth-submit">
        <span>{submitting ? 'Sending…' : 'Send reset link'}</span>
      </button>

      <p className="auth-foot">
        <button type="button" onClick={onBack}>
          ← Back to sign in
        </button>
      </p>
    </form>
  );
}
