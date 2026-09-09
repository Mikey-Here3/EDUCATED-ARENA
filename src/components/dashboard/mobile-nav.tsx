'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Menu,
  X,
  PlusCircle,
  Flame,
} from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { Sidebar } from './sidebar';
import { MobileBattleNav } from '@/components/navigation/mobile-battle-nav';
import { Logo } from '@/components/ui/logo';

export function MobileNav() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [balance, setBalance] = useState<number | null>(null);

  useEffect(() => {
    async function fetchBalance() {
      try {
        const res = await fetch('/api/wallet/summary');
        if (res.ok) {
          const data = await res.json();
          setBalance(data.available);
        }
      } catch { /* fallback */ }
    }
    fetchBalance();
  }, [pathname]);

  // Close drawer on route change
  useEffect(() => { setIsOpen(false); }, [pathname]);

  return (
    <>
      {/* Top Mobile Header Bar */}
      <div className="lg:hidden flex items-center justify-between px-4 py-3 border-b border-[#00f0ff]/15 bg-[#050614]/97 backdrop-blur-xl sticky top-0 z-40">
        {/* Logo */}
        <Logo size="sm" href="/dashboard" />

        {/* Right: Wallet + Menu */}
        <div className="flex items-center gap-2">
          <Link
            href="/dashboard/wallet?tab=deposit"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#00ff88]/10 border border-[#00ff88]/40 hover:bg-[#00ff88]/20 transition-all shadow-[0_0_12px_rgba(0,255,136,0.2)]"
          >
            <span className="text-[11px] font-bold text-[#00ff88]">
              {balance !== null ? formatCurrency(balance) : 'PKR ...'}
            </span>
            <PlusCircle className="w-3.5 h-3.5 text-[#00ff88]" />
          </Link>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 text-white rounded-xl bg-white/5 border border-white/10 hover:bg-[#00f0ff]/10 hover:border-[#00f0ff]/30 active:scale-95 transition-all"
            aria-label="Toggle menu"
          >
            {isOpen
              ? <X className="w-5 h-5 text-[#00f0ff]" />
              : <Menu className="w-5 h-5 text-gray-300" />}
          </button>
        </div>
      </div>

      {/* Slide-over Drawer */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 z-50 bg-black/85 backdrop-blur-md"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="fixed inset-y-0 left-0 w-80 max-w-[85vw] bg-[#060714] border-r border-[#00f0ff]/15 overflow-y-auto shadow-[4px_0_40px_rgba(0,240,255,0.1)] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drawer Header */}
            <div className="p-4 flex justify-between items-center border-b border-[#00f0ff]/15">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-5 rounded-full bg-gradient-to-b from-[#00f0ff] to-[#00ff88]" />
                <span className="font-heading font-black text-white text-sm tracking-wider">WAR ROOM</span>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 text-gray-400 hover:text-[#00f0ff] rounded-lg bg-white/5 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="flex-1" onClick={() => setIsOpen(false)}>
              <Sidebar />
            </div>
          </div>
        </div>
      )}

      {/* Shared Unified Mobile HUD Bottom Bar */}
      <MobileBattleNav isLoggedIn={true} />
    </>
  );
}
