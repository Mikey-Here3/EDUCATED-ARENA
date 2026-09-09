export const dynamic = 'force-dynamic';

import Link from 'next/link';
import { ReactNode } from 'react';
import { requireRole } from '@/lib/auth/guard';
import { LayoutDashboard, Swords, CheckSquare, HandCoins, ArrowDownToLine } from 'lucide-react';
import { LogoutButton } from '@/components/auth/logout-button';
import { Logo } from '@/components/ui/logo';

export default async function ManagerLayout({ children }: { children: ReactNode }) {
  await requireRole('MANAGER');

  return (
    <div className="flex min-h-screen bg-gray-950 text-white">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 border-r border-gray-800 hidden md:flex flex-col">
        <div className="p-5 border-b border-gray-800 space-y-2">
          <Logo size="sm" href="/manager" />
          <span className="inline-block px-2 py-0.5 rounded bg-amber-500/20 border border-amber-500/40 text-[9px] font-black text-amber-400 tracking-widest uppercase">
            MANAGER OPERATIONS
          </span>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <Link href="/manager" className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-colors">
            <LayoutDashboard className="w-5 h-5" />
            Overview
          </Link>
          <Link href="/manager/matches" className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-colors">
            <Swords className="w-5 h-5" />
            Match Operations
          </Link>
          <Link href="/manager/deposits" className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-colors">
            <HandCoins className="w-5 h-5" />
            Deposits Review
          </Link>
          <Link href="/manager/withdrawals" className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-colors">
            <ArrowDownToLine className="w-5 h-5" />
            Withdrawals Review
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="h-16 bg-gray-900 border-b border-gray-800 flex items-center justify-between px-6">
          <h1 className="text-lg font-semibold">Educated Gamer Arena - Manager</h1>
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 rounded-full bg-amber-600 flex items-center justify-center font-bold text-xs">
              M
            </div>
            <LogoutButton variant="icon" />
          </div>
        </header>
        <div className="flex-1 overflow-auto p-6">
          {children}
        </div>
      </main>
    </div>
  );
}
