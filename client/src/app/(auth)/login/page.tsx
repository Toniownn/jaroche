import { Suspense } from 'react';
import { LoginShell } from '@/components/auth/LoginShell';

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="auth-wrap" />}>
      <LoginShell />
    </Suspense>
  );
}
