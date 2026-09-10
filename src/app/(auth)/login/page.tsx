'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Mail, Lock, Loader2, Zap, Shield } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [unverifiedEmail, setUnverifiedEmail] = useState('');

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) {
      setError('');
      setUnverifiedEmail('');
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    setUnverifiedEmail('');

    if (!formData.email || !formData.password) {
      setError('Please enter your email and password.');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.emailVerified === false) {
          setUnverifiedEmail(formData.email);
        }
        setError(data.error || 'Login failed. Please try again.');
        setLoading(false);
        return;
      }

      if (data.user?.role === 'ADMIN') {
        router.push('/admin');
      } else if (data.user?.role === 'MANAGER') {
        router.push('/manager');
      } else {
        router.push('/dashboard');
      }

      router.refresh();
    } catch {
      setError('Network error. Please check your connection.');
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Card */}
      <div className="rounded-2xl border border-[#00f0ff]/25 bg-black/80 backdrop-blur-xl p-7 shadow-[0_0_40px_rgba(0,240,255,0.1)]">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#00f0ff]/10 border border-[#00f0ff]/30 mb-4">
            <Zap size={26} className="text-[#00f0ff]" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white font-heading uppercase tracking-tight text-glow-cyan">
            WELCOME BACK, WARRIOR
          </h1>
          <p className="text-xs text-slate-400 mt-1.5">
            Log in and jump back into the arena
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-xs text-red-400 font-semibold space-y-2">
              <div className="flex items-center gap-2">
                <Shield size={14} className="shrink-0" />
                <span>{error}</span>
              </div>
              {unverifiedEmail && (
                <div className="pt-1">
                  <Link
                    href={`/verify-email?email=${encodeURIComponent(unverifiedEmail)}`}
                    className="inline-block px-3 py-1.5 rounded-lg bg-[#00f0ff] hover:bg-[#00d0df] text-black font-black text-[11px] uppercase transition-colors"
                  >
                    Enter 6-Digit Code to Activate →
                  </Link>
                </div>
              )}
            </div>
          )}

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-white/10 bg-white/5 text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#00f0ff]/50 focus:border-[#00f0ff]/40 transition-all text-sm"
                placeholder="you@example.com"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label htmlFor="password" className="text-[11px] font-black text-gray-400 uppercase tracking-widest">
                Password
              </label>
              <Link
                href="/forgot-password"
                className="text-[11px] text-[#00f0ff] hover:text-white transition-colors"
              >
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                value={formData.password}
                onChange={handleChange}
                className="w-full pl-10 pr-10 py-3 rounded-xl border border-white/10 bg-white/5 text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#00f0ff]/50 focus:border-[#00f0ff]/40 transition-all text-sm"
                placeholder="Your password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#00f0ff] transition-colors"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="battle-btn-cyan w-full py-3.5 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Logging in...
              </>
            ) : (
              <>
                <Zap size={16} />
                Enter the Arena
              </>
            )}
          </button>
        </form>

        {/* Footer Links */}
        <div className="mt-6 pt-5 border-t border-white/10 text-center">
          <p className="text-xs text-gray-500">
            No account yet?{' '}
            <Link href="/register" className="text-[#a855f7] hover:text-white font-black transition-colors">
              Sign Up Free →
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
