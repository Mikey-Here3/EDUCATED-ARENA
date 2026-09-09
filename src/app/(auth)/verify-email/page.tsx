'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle2, XCircle, Loader2, Mail } from 'lucide-react';

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token');
  const email = searchParams.get('email');

  const [status, setStatus] = useState<'loading' | 'success' | 'error' | 'pending'>(
    token ? 'loading' : 'pending'
  );
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!token) return;

    async function verify() {
      try {
        const res = await fetch('/api/auth/verify-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token }),
        });

        const data = await res.json();

        if (res.ok) {
          setStatus('success');
          setMessage(data.message || 'Email verified successfully!');
          setTimeout(() => router.push('/login'), 3000);
        } else {
          setStatus('error');
          setMessage(data.error || 'Verification failed. The link may have expired.');
        }
      } catch {
        setStatus('error');
        setMessage('Network error during verification.');
      }
    }

    verify();
  }, [token, router]);

  return (
    <div className="text-center">
      {status === 'loading' && (
        <div className="py-8">
          <Loader2 size={48} className="animate-spin text-purple-primary mx-auto mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">Verifying Your Email</h2>
          <p className="text-sm text-text-secondary">Please wait a moment...</p>
        </div>
      )}

      {status === 'success' && (
        <div className="py-8">
          <CheckCircle2 size={48} className="text-success mx-auto mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">Email Verified!</h2>
          <p className="text-sm text-text-secondary mb-6">{message}</p>
          <p className="text-xs text-text-muted mb-4">Redirecting to login in 3 seconds...</p>
          <Link
            href="/login"
            className="inline-block px-6 py-2.5 rounded-lg text-sm font-semibold text-white gradient-purple"
          >
            Go to Login
          </Link>
        </div>
      )}

      {status === 'error' && (
        <div className="py-8">
          <XCircle size={48} className="text-danger mx-auto mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">Verification Failed</h2>
          <p className="text-sm text-danger mb-6">{message}</p>
          <Link
            href="/login"
            className="inline-block px-6 py-2.5 rounded-lg text-sm font-semibold text-white border border-border-secondary hover:border-purple-primary"
          >
            Return to Login
          </Link>
        </div>
      )}

      {status === 'pending' && (
        <div className="py-8">
          <div className="w-16 h-16 rounded-2xl gradient-purple-subtle flex items-center justify-center mx-auto mb-6">
            <Mail size={32} className="text-purple-primary" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Check Your Inbox</h2>
          <p className="text-sm text-text-secondary mb-4 leading-relaxed">
            We sent a verification link to{' '}
            <span className="text-white font-medium">{email || 'your email'}</span>.
            Click the link in that email to activate your account.
          </p>
          <div className="p-4 rounded-xl border border-border-primary bg-bg-card/50 text-xs text-text-muted mb-6 text-left">
            <p className="font-semibold text-text-secondary mb-1">Didn&apos;t receive it?</p>
            <p>Check your spam/junk folder. In local development mode, the verification link is logged in your server console.</p>
          </div>
          <Link
            href="/login"
            className="text-sm text-purple-primary hover:underline font-medium"
          >
            Back to Login
          </Link>
        </div>
      )}
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <div className="py-8 text-center">
          <Loader2 size={32} className="animate-spin text-purple-primary mx-auto" />
        </div>
      }
    >
      <VerifyEmailContent />
    </Suspense>
  );
}
