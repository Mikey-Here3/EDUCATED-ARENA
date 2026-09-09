'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, Swords, Target, Wallet, Users, 
  Shield, Trophy, Bell, Settings, LogOut 
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

const navItems = [
  { href: '/dashboard', label: 'Overview', icon: LayoutDashboard },
  { href: '/dashboard/challenges', label: 'Challenges', icon: Target },
  { href: '/dashboard/matches', label: 'Matches', icon: Swords },
  { href: '/dashboard/wallet', label: 'Wallet', icon: Wallet },
  { href: '/dashboard/teams', label: 'Teams', icon: Users },
  { href: '/dashboard/guilds', label: 'Guilds', icon: Shield },
  { href: '/dashboard/tournaments', label: 'Tournaments', icon: Trophy },
  { href: '/dashboard/notifications', label: 'Notifications', icon: Bell },
  { href: '/dashboard/settings', label: 'Settings', icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex flex-col w-64 border-r border-violet-900/30 bg-black/50 backdrop-blur-xl sticky top-0 h-screen">
      <div className="p-6">
        <h2 className="text-xl font-black italic tracking-wider text-violet-400 drop-shadow-[0_0_10px_rgba(139,92,246,0.5)]">
          EGA DASHBOARD
        </h2>
      </div>

      <div className="flex-1 px-4 space-y-1 overflow-y-auto custom-scrollbar">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`) && item.href !== '/dashboard';
          // special check for dashboard root
          const isReallyActive = item.href === '/dashboard' ? pathname === '/dashboard' : isActive;
          return (
            <Link key={item.href} href={item.href}>
              <span
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 mt-1",
                  isReallyActive 
                    ? "bg-violet-600/20 text-violet-400 border border-violet-500/30 shadow-[inset_0_0_15px_rgba(139,92,246,0.1)]" 
                    : "text-slate-400 hover:text-slate-200 hover:bg-white/5 border border-transparent"
                )}
              >
                <Icon className={cn("w-5 h-5", isReallyActive ? "text-violet-400" : "text-slate-500")} />
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>

      <div className="p-4 border-t border-violet-900/30">
        <div className="flex items-center gap-3 p-3 mb-4 rounded-lg bg-zinc-900/50 border border-zinc-800">
          <div className="w-10 h-10 rounded-full bg-violet-900 flex items-center justify-center text-violet-200 font-bold border-2 border-violet-500/50">
            AG
          </div>
          <div>
            <p className="text-sm font-bold text-slate-200">AshanGaming</p>
            <p className="text-xs text-violet-400 font-medium">PKR 4,500.00</p>
          </div>
        </div>
        <Button variant="ghost" className="w-full justify-start text-red-400 hover:text-red-300 hover:bg-red-400/10">
          <LogOut className="w-5 h-5 mr-3" />
          Logout
        </Button>
      </div>
    </aside>
  );
}
