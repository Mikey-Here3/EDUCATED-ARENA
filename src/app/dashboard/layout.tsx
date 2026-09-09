export const dynamic = 'force-dynamic';

import { ReactNode } from 'react';
import Link from 'next/link';
import { Sidebar } from '@/components/dashboard/sidebar';
import { MobileNav } from '@/components/dashboard/mobile-nav';
import { Bell, Wallet, PlusCircle } from 'lucide-react';
import { getSession } from '@/lib/auth/session';
import prisma from '@/lib/db';
import { formatCurrency } from '@/lib/utils';

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const session = await getSession();

  let availableBalance = 0;
  if (session?.id) {
    const wallet = await prisma.wallet.findUnique({
      where: { userId: session.id },
      select: { availableBalance: true },
    });
    if (wallet) {
      availableBalance = Number(wallet.availableBalance);
    }
  }

  const displayName = session?.displayName || 'Gamer';

  return (
    <div className="flex min-h-screen bg-[#050614] text-slate-200 selection:bg-cyan-500/30">
      <Sidebar />
      <div className="flex-1 flex flex-col max-w-full overflow-hidden relative">
        <MobileNav />
        {/* Desktop Top Header Bar */}
        <header className="hidden lg:flex items-center justify-between p-6 border-b border-cyan-500/20 bg-[#07091d]/85 backdrop-blur-xl sticky top-0 z-30">
          <div>
            <h1 className="text-xl font-heading font-black text-white uppercase italic tracking-tight">
              WAR ROOM COMMAND
            </h1>
            <p className="text-xs text-slate-400">
              Welcome back, <span className="text-cyan-400 font-bold">{displayName}</span>
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard/wallet?tab=deposit"
              className="flex items-center gap-2.5 px-4 py-2 rounded-2xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/25 transition-all shadow-[0_0_15px_rgba(0,255,136,0.2)]"
            >
              <Wallet className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-bold text-slate-300">Battle Cash:</span>
              <span className="text-sm font-black text-emerald-400">
                {formatCurrency(availableBalance)}
              </span>
              <PlusCircle className="w-3.5 h-3.5 text-emerald-400" />
            </Link>

            <Link
              href="/dashboard/notifications"
              className="relative p-2.5 text-slate-400 hover:text-white rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full shadow-[0_0_8px_#ff0055]" />
            </Link>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 custom-scrollbar pb-24 lg:pb-8">
          {children}
        </main>
      </div>
    </div>
  );
}

