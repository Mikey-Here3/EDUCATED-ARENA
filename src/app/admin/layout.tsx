export const dynamic = 'force-dynamic';

import Link from 'next/link';
import { ReactNode } from 'react';
import { requireRole } from '@/lib/auth/guard';
import { 
  LayoutDashboard, Users, UserCog, Swords, Trophy, 
  Gamepad2, Settings2, Map, ShieldAlert, Wallet, Settings, Activity
} from 'lucide-react';

export default async function AdminLayout({ children }: { children: ReactNode }) {
  await requireRole('ADMIN');
  
  const navItems = [
    { href: '/admin', icon: LayoutDashboard, label: 'Overview' },
    { href: '/admin/users', icon: Users, label: 'Users' },
    { href: '/admin/managers', icon: UserCog, label: 'Managers' },
    { href: '/admin/matches', icon: Swords, label: 'Matches' },
    { href: '/admin/tournaments', icon: Trophy, label: 'Tournaments' },
    { href: '/admin/categories', icon: Gamepad2, label: 'Categories' },
    { href: '/admin/modes', icon: Settings2, label: 'Modes' },
    { href: '/admin/maps', icon: Map, label: 'Maps' },
    { href: '/admin/rules', icon: ShieldAlert, label: 'Rules' },
    { href: '/admin/wallet', icon: Wallet, label: 'Wallet & Ledger' },
    { href: '/admin/settings', icon: Settings, label: 'Settings' },
    { href: '/admin/audit', icon: Activity, label: 'Audit Logs' },
  ];

  return (
    <div className="flex min-h-screen bg-gray-950 text-white">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 border-r border-gray-800 hidden md:flex flex-col">
        <div className="p-6 border-b border-gray-800">
          <h2 className="text-xl font-black text-rose-500 uppercase tracking-wider">Admin Ops</h2>
        </div>
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <Link 
              key={item.href} 
              href={item.href} 
              className="flex items-center gap-3 px-4 py-2.5 text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-colors text-sm font-medium"
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="h-16 bg-gray-900 border-b border-gray-800 flex items-center justify-between px-6">
          <h1 className="text-lg font-semibold">System Administration</h1>
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 rounded-full bg-rose-600 flex items-center justify-center text-xs font-bold">
              AD
            </div>
          </div>
        </header>
        <div className="flex-1 overflow-auto p-6">
          {children}
        </div>
      </main>
    </div>
  );
}
