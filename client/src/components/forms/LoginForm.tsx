'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { loginSchema, type LoginInput, type LoginResponse } from '@jaroche/shared';
import { api } from '@/lib/api';
import { useAuthStore } from '@/stores/auth.store';
import { useCartStore } from '@/stores/cart.store';

interface Props {
  onForgot: () => void;
}

export function LoginForm({ onForgot }: Props) {
  const router = useRouter();
  const params = useSearchParams();
  const setAuth = useAuthStore((s) => s.setAuth);
  const hydrateCart = useCartStore((s) => s.hydrate);
  const [submitting, setSubmitting] = useState(false);
  const [show, setShow] = useState(false);

  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  async function onSubmit(data: LoginInput) {
    setSubmitting(true);
    try {
      const res = await api.post<LoginResponse>('/auth/login', data);
      setAuth(res.data.accessToken, res.data.user);
      await hydrateCart();
      toast.success(`Welcome back, ${res.data.user.name}.`);
      const next = params.get('next') ?? '/';
      router.push(next);
      router.refresh();
    } catch (err) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        "We couldn't match those credentials. Double-check and try again.";
      toast.error('Sign-in failed', { description: message });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="auth-form" onSubmit={form.handleSubmit(onSubmit)} noValidate>
      <h1>
        Welcome <em>back.</em>
      </h1>
      <p>Pick up where you left off — your basket and saved pieces are waiting.</p>

      <div className="field">
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          placeholder="you@email.com"
          autoComplete="email"
          aria-invalid={!!form.formState.errors.email}
          {...form.register('email')}
        />
        {form.formState.errors.email && (
          <span className="field-error">{form.formState.errors.email.message}</span>
        )}
      </div>

      <div className="field">
        <label htmlFor="password">Password</label>
        <div className="password-wrap">
          <input
            id="password"
            type={show ? 'text' : 'password'}
            placeholder="••••••••"
            autoComplete="current-password"
            aria-invalid={!!form.formState.errors.password}
            {...form.register('password')}
          />
          <button
            type="button"
            className="password-toggle"
            onClick={() => setShow((s) => !s)}
            aria-label={show ? 'Hide password' : 'Show password'}
          >
            {show ? 'Hide' : 'Show'}
          </button>
        </div>
        {form.formState.errors.password && (
          <span className="field-error">{form.formState.errors.password.message}</span>
        )}
      </div>

      <div className="auth-row">
        <label>
          <input type="checkbox" defaultChecked /> Remember me
        </label>
        <button type="button" onClick={onForgot}>
          Forgot password?
        </button>
      </div>

      <button type="submit" disabled={submitting} className="auth-pill auth-submit">
        <span>{submitting ? 'Signing in…' : 'Sign in'}</span>
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.4">
          <path d="M2 7h10M8 3l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      <div className="auth-divider">or continue with</div>
      <div className="auth-socials">
        <button
          type="button"
          className="auth-social"
          onClick={() => toast.info('Google sign-in is not enabled yet.')}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.99.66-2.25 1.06-3.71 1.06-2.86 0-5.29-1.93-6.15-4.53H2.18v2.84A11 11 0 0 0 12 23z" />
            <path fill="#FBBC05" d="M5.85 14.1A6.6 6.6 0 0 1 5.5 12c0-.73.13-1.44.35-2.1V7.07H2.18a11 11 0 0 0 0 9.86l3.67-2.83z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.67 2.83C6.71 7.31 9.14 5.38 12 5.38z" />
          </svg>
          Continue with Google
        </button>
        <button
          type="button"
          className="auth-social"
          onClick={() => toast.info('Apple sign-in is not enabled yet.')}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M16.36 1.43c-1.13.07-2.45.79-3.22 1.72-.7.85-1.27 2.1-1.05 3.31 1.23.04 2.5-.7 3.24-1.65.7-.88 1.22-2.1 1.03-3.38zM21 17.36c-.55 1.27-.81 1.83-1.52 2.95-.99 1.56-2.4 3.5-4.13 3.51-1.55.02-1.94-1-4.04-.99-2.1.01-2.54 1.01-4.09.99-1.74-.01-3.07-1.76-4.06-3.32-2.78-4.37-3.07-9.5-1.36-12.23 1.22-1.94 3.14-3.07 4.95-3.07 1.84 0 3 1.01 4.52 1.01 1.47 0 2.37-1.01 4.5-1.01 1.6 0 3.31.88 4.52 2.4-3.97 2.18-3.32 7.85.71 9.76z" />
          </svg>
          Continue with Apple
        </button>
      </div>

      <p className="auth-foot">
        New to Jaroché?{' '}
        <a href="/register">Create an account</a>
      </p>
    </form>
  );
}
