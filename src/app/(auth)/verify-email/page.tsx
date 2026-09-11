'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle2, XCircle, Loader2, Mail } from 'lucide-react';

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const urlToken = searchParams.get('token');
  const email = searchParams.get('email') || '';

  const [otp, setOtp] = useState(urlToken || '');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (urlToken && status === 'idle') {
      handleVerify(urlToken);
    }
  }, [urlToken]);

  async function handleVerify(tokenToVerify: string) {
    if (!tokenToVerify) return;
    setStatus('loading');
    
    try {
      const res = await fetch('/api/auth/verify-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: tokenToVerify }),
      });

      const data = await res.json();

      if (res.ok) {
        setStatus('success');
        setMessage(data.message || 'Email verified successfully!');
        setTimeout(() => router.push('/login'), 3000);
      } else {
        setStatus('error');
        setMessage(data.error || 'Verification failed. The code may be incorrect or expired.');
      }
    } catch {
      setStatus('error');
      setMessage('Network error during verification.');
    }
  }

  const [resending, setResending] = useState(false);
  const [resendMsg, setResendMsg] = useState('');
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  async function handleResend() {
    if (!email || countdown > 0) return;
    setResending(true);
    setResendMsg('');
    try {
      const res = await fetch('/api/auth/resend-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok) {
        setResendMsg(data.message || 'Verification code resent! Check your inbox.');
        if (data.code) {
          setOtp(data.code);
        }
        setCountdown(60);
      } else {
        setResendMsg(data.error || 'Failed to resend code');
      }
    } catch {
      setResendMsg('Network error requesting resend');
    } finally {
      setResending(false);
    }
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    handleVerify(otp);
  }

  return (
    <div className="w-full max-w-md mx-auto text-center p-6 bg-black/80 border border-[#a855f7]/30 rounded-2xl shadow-[0_0_40px_rgba(168,85,247,0.1)]">
      {status === 'loading' && (
        <div className="py-8">
          <Loader2 size={48} className="animate-spin text-[#a855f7] mx-auto mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">Verifying Your Code</h2>
          <p className="text-sm text-slate-400">Please wait a moment...</p>
        </div>
      )}

      {status === 'success' && (
        <div className="py-8">
          <CheckCircle2 size={48} className="text-[#00f59b] mx-auto mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">Email Verified!</h2>
          <p className="text-sm text-slate-400 mb-6">{message}</p>
          <p className="text-xs text-slate-500 mb-4">Redirecting to login in 3 seconds...</p>
          <Link
            href="/login"
            className="inline-block px-6 py-2.5 rounded-lg text-sm font-semibold text-black bg-[#00f59b] hover:bg-[#00c853] transition-colors"
          >
            Go to Login
          </Link>
        </div>
      )}

      {status === 'error' && (
        <div className="py-8">
          <XCircle size={48} className="text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">Verification Failed</h2>
          <p className="text-sm text-red-400 mb-6">{message}</p>
          <button
            onClick={() => setStatus('idle')}
            className="inline-block px-6 py-2.5 rounded-lg text-sm font-semibold text-white border border-white/20 hover:border-[#a855f7] transition-colors"
          >
            Try Again
          </button>
        </div>
      )}

      {status === 'idle' && (
        <div className="py-4">
          <div className="w-16 h-16 rounded-2xl bg-[#a855f7]/10 flex items-center justify-center mx-auto mb-6 border border-[#a855f7]/30">
            <Mail size={32} className="text-[#a855f7]" />
          </div>
          <h2 className="text-2xl font-black text-white mb-2 uppercase tracking-wide">Enter Verification Code</h2>
          <p className="text-sm text-slate-400 mb-6 leading-relaxed">
            We sent a 6-digit verification code to{' '}
            <span className="text-[#00f0ff] font-bold">{email || 'your email'}</span>.
            Enter it below to activate your account.
          </p>
          
          <form onSubmit={onSubmit} className="space-y-4 max-w-xs mx-auto">
            <input
              type="text"
              maxLength={6}
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ''))}
              placeholder="000000"
              className="w-full text-center text-3xl tracking-[0.5em] font-mono font-black py-4 rounded-xl bg-black/60 border border-white/20 focus:border-[#a855f7] focus:ring-1 focus:ring-[#a855f7] text-white outline-none transition-all"
              required
            />
            <button
              type="submit"
              disabled={otp.length !== 6}
              className="w-full py-3 rounded-xl font-bold text-sm bg-gradient-to-r from-[#a855f7] to-[#7e22ce] text-white hover:from-[#9333ea] hover:to-[#6b21a8] transition-all disabled:opacity-50 disabled:cursor-not-allowed uppercase cursor-pointer"
            >
              Verify Account
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-white/10 text-xs text-slate-400 space-y-3">
            <p>Didn't receive the code?</p>
            {email ? (
              <button
                type="button"
                onClick={handleResend}
                disabled={resending || countdown > 0}
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-[#00f0ff] font-bold text-xs transition-all disabled:opacity-50 cursor-pointer"
              >
                {resending ? 'Sending...' : countdown > 0 ? `Resend Code in ${countdown}s` : 'Resend Verification Code'}
              </button>
            ) : null}
            {resendMsg && (
              <p className="text-emerald-400 font-semibold">{resendMsg}</p>
            )}
            <p className="text-[11px] text-slate-500">
              Check your spam/junk folder. Codes are sent via Educated Gamer security servers.
            </p>
          </div>
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
