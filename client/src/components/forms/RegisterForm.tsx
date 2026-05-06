'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { z } from 'zod';
import { registerSchema, type LoginResponse } from '@jaroche/shared';
import { api } from '@/lib/api';
import { useAuthStore } from '@/stores/auth.store';
import { useCartStore } from '@/stores/cart.store';

const formSchema = registerSchema.extend({
  agree: z.literal(true, {
    errorMap: () => ({ message: 'Please accept the terms and privacy policy to continue.' }),
  }),
});
type FormInput = z.infer<typeof formSchema>;

export function RegisterForm() {
  const router = useRouter();
  const setAuth = useAuthStore((s) => s.setAuth);
  const hydrateCart = useCartStore((s) => s.hydrate);
  const [submitting, setSubmitting] = useState(false);
  const [show, setShow] = useState(false);

  const form = useForm<FormInput>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: '', email: '', password: '', agree: true },
  });

  async function onSubmit(data: FormInput) {
    setSubmitting(true);
    try {
      const { agree, ...payload } = data;
      void agree;
      const res = await api.post<LoginResponse>('/auth/register', payload);
      setAuth(res.data.accessToken, res.data.user);
      await hydrateCart();
      const firstName = res.data.user.name.split(' ')[0];
      toast.success('Welcome to the studio.', {
        description: `Lovely to meet you, ${firstName}.`,
      });
      router.push('/');
      router.refresh();
    } catch (err) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        'Registration failed';
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="auth-form" onSubmit={form.handleSubmit(onSubmit)} noValidate>
      <h1>
        Become a <em>studio friend.</em>
      </h1>
      <p>An account saves your basket, addresses, and a small history of pieces.</p>

      <div className="field">
        <label htmlFor="reg-name">Your name</label>
        <input
          id="reg-name"
          type="text"
          placeholder="Élise Moreau"
          autoComplete="name"
          {...form.register('name')}
        />
        {form.formState.errors.name && (
          <span className="field-error">{form.formState.errors.name.message}</span>
        )}
      </div>

      <div className="field">
        <label htmlFor="reg-email">Email</label>
        <input
          id="reg-email"
          type="email"
          placeholder="you@email.com"
          autoComplete="email"
          {...form.register('email')}
        />
        {form.formState.errors.email && (
          <span className="field-error">{form.formState.errors.email.message}</span>
        )}
      </div>

      <div className="field">
        <label htmlFor="reg-password">Password</label>
        <div className="password-wrap">
          <input
            id="reg-password"
            type={show ? 'text' : 'password'}
            placeholder="At least 8 characters"
            autoComplete="new-password"
            minLength={8}
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
          <input type="checkbox" {...form.register('agree')} /> I agree to the <a href="#">terms</a> and <a href="#">privacy</a> policy
        </label>
      </div>
      {form.formState.errors.agree && (
        <p className="field-error" style={{ marginTop: '-1rem', marginBottom: '1rem' }}>
          {form.formState.errors.agree.message}
        </p>
      )}

      <button type="submit" disabled={submitting} className="auth-pill auth-submit">
        <span>{submitting ? 'Creating account…' : 'Create account'}</span>
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.4">
          <path d="M2 7h10M8 3l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      <p className="auth-foot">
        Already have an account? <a href="/login">Sign in</a>
      </p>
    </form>
  );
}
