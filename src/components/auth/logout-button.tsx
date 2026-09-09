'use client';

import { useState } from 'react';
import { LogOut, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LogoutButtonProps {
  className?: string;
  variant?: 'icon' | 'full' | 'sidebar';
  label?: string;
}

export function LogoutButton({ className, variant = 'icon', label = 'Log Out' }: LogoutButtonProps) {
  const [loading, setLoading] = useState(false);

  async function handleLogout() {
    if (loading) return;
    setLoading(true);
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (err) {
      console.error('Logout fetch error:', err);
    } finally {
      // Force hard reload to /login to completely bust router cache and reset state
      window.location.href = '/login';
    }
  }

  if (variant === 'sidebar') {
    return (
      <button
        onClick={handleLogout}
        disabled={loading}
        className={cn(
          "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold text-red-400 hover:text-red-300 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 transition-all duration-200 disabled:opacity-50 active:scale-95",
          className
        )}
      >
        {loading ? (
          <Loader2 className="w-5 h-5 animate-spin text-red-400" />
        ) : (
          <LogOut className="w-5 h-5" />
        )}
        <span>{loading ? 'Signing out...' : label}</span>
      </button>
    );
  }

  if (variant === 'full') {
    return (
      <button
        onClick={handleLogout}
        disabled={loading}
        className={cn(
          "flex items-center justify-center gap-2 px-4 py-2 bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 hover:text-rose-200 border border-rose-500/30 rounded-xl text-xs font-bold transition-all disabled:opacity-50 active:scale-95",
          className
        )}
      >
        {loading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <LogOut className="w-4 h-4" />
        )}
        <span>{loading ? 'Signing out...' : label}</span>
      </button>
    );
  }

  return (
    <button 
      onClick={handleLogout} 
      disabled={loading}
      title="Log out"
      aria-label="Log out"
      className={cn(
        "w-9 h-9 rounded-xl bg-gray-900 border border-gray-800 hover:border-rose-500/40 hover:bg-rose-500/10 text-gray-400 hover:text-rose-400 flex items-center justify-center transition-all disabled:opacity-50 active:scale-95",
        className
      )}
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin text-rose-400" />
      ) : (
        <LogOut className="w-4 h-4" />
      )}
    </button>
  );
}

