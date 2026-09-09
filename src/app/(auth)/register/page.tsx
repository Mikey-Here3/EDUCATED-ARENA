'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Mail, Lock, User, Phone, Calendar, Loader2, Gamepad2, CheckCircle } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [generalError, setGeneralError] = useState('');

  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
    displayName: '',
    phone: '',
    dateOfBirth: '',
    termsAccepted: false,
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErrors({});
    setGeneralError('');

    const newErrors: Record<string, string> = {};
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.username) newErrors.username = 'Username is required';
    else if (formData.username.length < 3) newErrors.username = 'At least 3 characters';
    else if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) newErrors.username = 'Letters, numbers, underscores only';
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 8) newErrors.password = 'Min 8 characters';
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    if (!formData.displayName) newErrors.displayName = 'Display name is required';
    if (!formData.phone) newErrors.phone = 'Phone number is required';
    if (!formData.dateOfBirth) newErrors.dateOfBirth = 'Date of birth is required';
    if (!formData.termsAccepted) newErrors.termsAccepted = 'You must accept the Terms & Conditions';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.errors) {
          setErrors(data.errors);
        } else {
          setGeneralError(data.error || 'Registration failed. Please try again.');
        }
        setLoading(false);
        return;
      }

      router.push('/verify-email?email=' + encodeURIComponent(formData.email));
    } catch {
      setGeneralError('Network error. Please check your connection and try again.');
      setLoading(false);
    }
  }

  const inputClass = (field: string) =>
    `w-full pl-10 pr-4 py-3 rounded-xl border ${errors[field] ? 'border-red-500/50 bg-red-500/5' : 'border-white/10 bg-white/5'} text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#a855f7]/50 focus:border-[#a855f7]/40 transition-all text-sm`;

  return (
    <div className="w-full max-w-lg mx-auto">
      <div className="rounded-2xl border border-[#a855f7]/25 bg-black/80 backdrop-blur-xl p-7 shadow-[0_0_40px_rgba(168,85,247,0.1)]">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#a855f7]/10 border border-[#a855f7]/30 mb-4">
            <Gamepad2 size={26} className="text-[#a855f7]" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white font-heading uppercase tracking-tight text-glow-purple">
            JOIN THE ARENA
          </h1>
          <p className="text-xs text-slate-400 mt-1.5">
            Free account · Real PKR prizes · Pakistan&apos;s #1 Free Fire platform
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {generalError && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-xs text-red-400 font-semibold">
              {generalError}
            </div>
          )}

          {/* Row: Email & Username */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Email */}
            <div>
              <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-2">Email</label>
              <div className="relative">
                <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  name="email" type="email" autoComplete="email"
                  value={formData.email} onChange={handleChange}
                  className={inputClass('email')} placeholder="you@example.com"
                />
              </div>
              {errors.email && <p className="text-[11px] text-red-400 mt-1">{errors.email}</p>}
            </div>

            {/* Username */}
            <div>
              <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-2">Username</label>
              <div className="relative">
                <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  name="username" type="text" autoComplete="username"
                  value={formData.username} onChange={handleChange}
                  className={inputClass('username')} placeholder="your_tag"
                />
              </div>
              {errors.username && <p className="text-[11px] text-red-400 mt-1">{errors.username}</p>}
            </div>
          </div>

          {/* Display Name */}
          <div>
            <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-2">
              Display Name <span className="text-gray-600 normal-case font-normal">(shown in rankings)</span>
            </label>
            <input
              name="displayName" type="text" autoComplete="name"
              value={formData.displayName} onChange={handleChange}
              className={`w-full px-4 py-3 rounded-xl border ${errors.displayName ? 'border-red-500/50 bg-red-500/5' : 'border-white/10 bg-white/5'} text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#a855f7]/50 transition-all text-sm`}
              placeholder="Your in-game display name"
            />
            {errors.displayName && <p className="text-[11px] text-red-400 mt-1">{errors.displayName}</p>}
          </div>

          {/* Row: Password & Confirm */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-2">Password</label>
              <div className="relative">
                <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  name="password" type={showPassword ? 'text' : 'password'} autoComplete="new-password"
                  value={formData.password} onChange={handleChange}
                  className={inputClass('password')} placeholder="Min 8 chars"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#a855f7] transition-colors">
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              {errors.password && <p className="text-[11px] text-red-400 mt-1">{errors.password}</p>}
            </div>

            <div>
              <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-2">Confirm</label>
              <div className="relative">
                <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  name="confirmPassword" type={showPassword ? 'text' : 'password'} autoComplete="new-password"
                  value={formData.confirmPassword} onChange={handleChange}
                  className={inputClass('confirmPassword')} placeholder="Repeat password"
                />
              </div>
              {errors.confirmPassword && <p className="text-[11px] text-red-400 mt-1">{errors.confirmPassword}</p>}
            </div>
          </div>

          {/* Row: Phone & DOB */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-2">Phone Number</label>
              <div className="relative">
                <Phone size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  name="phone" type="tel" autoComplete="tel"
                  value={formData.phone} onChange={handleChange}
                  className={inputClass('phone')} placeholder="03XX-XXXXXXX"
                />
              </div>
              {errors.phone && <p className="text-[11px] text-red-400 mt-1">{errors.phone}</p>}
            </div>

            <div>
              <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-2">Date of Birth</label>
              <div className="relative">
                <Calendar size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  name="dateOfBirth" type="date"
                  value={formData.dateOfBirth} onChange={handleChange}
                  className={`${inputClass('dateOfBirth')} [color-scheme:dark]`}
                />
              </div>
              {errors.dateOfBirth && <p className="text-[11px] text-red-400 mt-1">{errors.dateOfBirth}</p>}
            </div>
          </div>

          {/* Terms */}
          <div className="flex items-start gap-3 pt-1">
            <input
              id="termsAccepted"
              name="termsAccepted"
              type="checkbox"
              checked={formData.termsAccepted}
              onChange={handleChange}
              className="mt-1 h-4 w-4 rounded border-white/20 bg-black/60 text-[#a855f7] focus:ring-[#a855f7] focus:ring-offset-0 accent-[#a855f7]"
            />
            <label htmlFor="termsAccepted" className="text-xs text-gray-400 leading-relaxed">
              I agree to the{' '}
              <Link href="/terms" className="text-[#a855f7] hover:text-white transition-colors">Terms & Conditions</Link>{' '}
              and{' '}
              <Link href="/privacy" className="text-[#a855f7] hover:text-white transition-colors">Privacy Policy</Link>.
              I confirm I am 13+ years old.
            </label>
          </div>
          {errors.termsAccepted && <p className="text-[11px] text-red-400">{errors.termsAccepted}</p>}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="battle-btn-purple w-full py-3.5 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed mt-2"
          >
            {loading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Creating Account...
              </>
            ) : (
              <>
                <CheckCircle size={16} />
                Create Account &amp; Enter Arena
              </>
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-6 pt-5 border-t border-white/10 text-center">
          <p className="text-xs text-gray-500">
            Already have an account?{' '}
            <Link href="/login" className="text-[#00f0ff] hover:text-white font-black transition-colors">
              Log In →
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
