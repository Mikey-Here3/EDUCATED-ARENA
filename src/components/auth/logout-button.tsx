'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';

export function LogoutButton({ className, variant = 'icon' }: { className?: string, variant?: 'icon' | 'full' }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleLogout() {
    setLoading(true);
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/login');
      router.refresh();
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  }

  return (
    <button 
      onClick={handleLogout} 
      disabled={loading}
      title="Log out"
      className={cn(
        "flex items-center justify-center transition-colors disabled:opacity-50",
        variant === 'icon' ? "w-8 h-8 rounded-lg bg-gray-800 hover:bg-rose-600 hover:text-white text-gray-400" : "gap-2 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-sm font-medium",
        className
      )}
    >
      <LogOut className="w-4 h-4" />
      {variant === 'full' && <span>{loading ? 'Logging out...' : 'Log out'}</span>}
    </button>
  );
}
