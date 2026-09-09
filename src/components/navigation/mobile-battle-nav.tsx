'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  Swords,
  Trophy,
  ArrowDownToLine,
  ArrowUpFromLine,
  LayoutGrid,
  X,
  Users,
  Shield,
  BookOpen,
  Award,
  Wallet,
  Settings,
  Bell,
  Scale,
  FileText,
  RotateCcw,
  Zap,
  ChevronRight,
  Flame,
  CheckCircle2,
  Lock,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface MobileBattleNavProps {
  isLoggedIn?: boolean;
}

export function MobileBattleNav({ isLoggedIn = false }: MobileBattleNavProps) {
  const pathname = usePathname();
  const [moreOpen, setMoreOpen] = useState(false);

  // Close sheet on route change
  useEffect(() => {
    setMoreOpen(false);
  }, [pathname]);

  // Lock body scroll when "More" modal is open
  useEffect(() => {
    if (moreOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [moreOpen]);

  const navItems = [
    {
      id: 'home',
      label: 'Home',
      href: isLoggedIn ? '/dashboard' : '/',
      icon: Home,
      color: '#00f0ff',
      activeBorder: 'border-[#00f0ff]/60',
      activeBg: 'bg-[#00f0ff]/15',
      glow: 'shadow-[0_0_14px_rgba(0,240,255,0.35)]',
      dot: 'bg-[#00f0ff]',
    },
    {
      id: 'challenges',
      label: 'Battles',
      href: isLoggedIn ? '/dashboard/challenges' : '/matches',
      icon: Swords,
      color: '#00ff88',
      activeBorder: 'border-[#00ff88]/60',
      activeBg: 'bg-[#00ff88]/15',
      glow: 'shadow-[0_0_14px_rgba(0,255,136,0.35)]',
      dot: 'bg-[#00ff88]',
    },
    {
      id: 'tournaments',
      label: 'Cups',
      href: '/tournaments',
      icon: Trophy,
      color: '#ffbe1a',
      activeBorder: 'border-[#ffbe1a]/60',
      activeBg: 'bg-[#ffbe1a]/15',
      glow: 'shadow-[0_0_14px_rgba(255,190,26,0.35)]',
      dot: 'bg-[#ffbe1a]',
    },
    {
      id: 'deposit',
      label: 'Deposit',
      href: isLoggedIn ? '/dashboard/wallet?tab=deposit' : '/login',
      icon: ArrowDownToLine,
      color: '#00ff88',
      activeBorder: 'border-[#00ff88]/60',
      activeBg: 'bg-[#00ff88]/15',
      glow: 'shadow-[0_0_14px_rgba(0,255,136,0.4)]',
      dot: 'bg-[#00ff88]',
      badge: '+PKR',
      badgeCls: 'bg-[#00ff88] text-black shadow-[0_0_10px_rgba(0,255,136,0.8)]',
    },
    {
      id: 'withdraw',
      label: 'Cash Out',
      href: isLoggedIn ? '/dashboard/wallet?tab=withdraw' : '/login',
      icon: ArrowUpFromLine,
      color: '#00f0ff',
      activeBorder: 'border-[#00f0ff]/60',
      activeBg: 'bg-[#00f0ff]/15',
      glow: 'shadow-[0_0_14px_rgba(0,240,255,0.35)]',
      dot: 'bg-[#00f0ff]',
    },
    {
      id: 'more',
      label: 'More',
      isAction: true,
      onClick: () => setMoreOpen(!moreOpen),
      icon: LayoutGrid,
      color: '#00f0ff',
      activeBorder: 'border-[#00f0ff]/60',
      activeBg: 'bg-[#00f0ff]/15',
      glow: 'shadow-[0_0_14px_rgba(0,240,255,0.35)]',
      dot: 'bg-[#00f0ff]',
    },
  ];

  // All organized platform routes for the "More" drawer
  const moreCategories = [
    {
      title: '⚔️ BATTLE MODES & ACTION',
      color: '#00f0ff',
      items: [
        { label: 'Live Battles Lobby', href: '/matches', icon: Swords, sub: '1v1, 2v2, 4v4 open player challenges' },
        { label: 'Championship Series', href: '/tournaments', icon: Trophy, sub: 'Official single-elimination bracket cups' },
        { label: 'Hall of Champions', href: '/leaderboard', icon: Award, sub: 'Global ELO ratings & top Pakistani earners' },
        { label: 'My Active Matches', href: '/dashboard/matches', icon: Flame, sub: 'Live rooms, referee scores & chat' },
      ],
    },
    {
      title: '🛡️ SQUADS, CLANS & GUILDS',
      color: '#00ff88',
      items: [
        { label: 'Competitive Teams', href: '/teams', icon: Users, sub: 'Registered squads, rosters & clan stats' },
        { label: 'Guilds & GvG Wars', href: '/dashboard/guilds', icon: Shield, sub: '4v4 Guild vs Guild high-stakes wars' },
        { label: 'My Squad Roster', href: '/dashboard/teams', icon: Users, sub: 'Manage team invites, leader & officers' },
      ],
    },
    {
      title: '💰 CASH, WALLET & LEDGER',
      color: '#00ff88',
      items: [
        { label: 'Deposit PKR Instantly', href: isLoggedIn ? '/dashboard/wallet?tab=deposit' : '/login', icon: ArrowDownToLine, sub: 'Easypaisa & JazzCash official channels' },
        { label: 'Cash Out / Withdraw', href: isLoggedIn ? '/dashboard/wallet?tab=withdraw' : '/login', icon: ArrowUpFromLine, sub: 'Fast disbursements directly to your mobile' },
        { label: 'Financial Ledger Policy', href: '/wallet-policy', icon: Wallet, sub: 'Double-entry audit & security rules' },
      ],
    },
    {
      title: '📜 RULES, INTEGRITY & SUPPORT',
      color: '#00f0ff',
      items: [
        { label: 'How Arena Works', href: '/how-it-works', icon: BookOpen, sub: '6-step beginner to winner guide' },
        { label: 'Official Rulebook', href: '/rules', icon: FileText, sub: 'Weapons, glitch restrictions & room rules' },
        { label: 'Anti-Cheat & Fair Play', href: '/fair-play', icon: Scale, sub: 'Zero-tolerance hack detection policy' },
        { label: 'Refund & Cancellations', href: '/refund-policy', icon: RotateCcw, sub: '100% money-back rules for unaccepted battles' },
      ],
    },
    {
      title: '⚙️ ACCOUNT & SETTINGS',
      color: '#ffbe1a',
      items: [
        { label: 'Free Fire UID & Profile', href: isLoggedIn ? '/dashboard/settings' : '/login', icon: Settings, sub: 'Verify your in-game nickname and UID' },
        { label: 'System Notifications', href: isLoggedIn ? '/dashboard/notifications' : '/login', icon: Bell, sub: 'Match reminders & cash alerts' },
        { label: 'Terms of Service', href: '/terms', icon: Lock, sub: 'Platform competition agreement' },
        { label: 'Privacy Policy', href: '/privacy', icon: Shield, sub: 'Data safety and encryption standard' },
      ],
    },
  ];

  return (
    <>
      {/* ─── Expandable "More" Slide-up Modal Drawer ─── */}
      {moreOpen && (
        <div
          className="lg:hidden fixed inset-0 z-50 bg-black/80 backdrop-blur-md transition-opacity duration-300 flex flex-col justify-end"
          onClick={() => setMoreOpen(false)}
        >
          <div
            className="w-full max-h-[85vh] bg-[#050614] border-t-2 border-[#00f0ff] rounded-t-3xl overflow-hidden flex flex-col shadow-[0_-10px_40px_rgba(0,240,255,0.2)] animate-in slide-in-from-bottom duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Sheet Handle & Header */}
            <div className="pt-3 pb-4 px-5 border-b border-white/10 bg-[#07091e] shrink-0">
              <div className="w-12 h-1 rounded-full bg-white/20 mx-auto mb-3" />
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-[#00f0ff]/15 border border-[#00f0ff]/40 flex items-center justify-center">
                    <LayoutGrid size={16} className="text-[#00f0ff]" />
                  </div>
                  <div>
                    <h2 className="text-sm font-black text-white font-heading uppercase tracking-wider text-glow-cyan">
                      Arena Command Directory
                    </h2>
                    <p className="text-[10px] text-slate-400">Quickly navigate to any platform route</p>
                  </div>
                </div>

                <button
                  onClick={() => setMoreOpen(false)}
                  className="w-8 h-8 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 active:scale-95 transition-all"
                  aria-label="Close directory"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Scrollable Categories Body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-thin">
              {moreCategories.map((cat) => (
                <div key={cat.title}>
                  <div
                    className="text-[10px] font-black uppercase tracking-widest mb-2.5 px-2 flex items-center gap-2"
                    style={{ color: cat.color }}
                  >
                    <span>{cat.title}</span>
                    <div className="h-[1px] flex-1 bg-white/10" />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {cat.items.map((item) => {
                      const Icon = item.icon;
                      const isActive = pathname === item.href;

                      return (
                        <Link
                          key={item.label}
                          href={item.href}
                          onClick={() => setMoreOpen(false)}
                          className={cn(
                            'flex items-center justify-between p-3 rounded-2xl border transition-all duration-200 group active:scale-[0.98]',
                            isActive
                              ? 'bg-[#00f0ff]/15 border-[#00f0ff]/50 shadow-[0_0_15px_rgba(0,240,255,0.2)]'
                              : 'bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/15'
                          )}
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div
                              className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 border"
                              style={{
                                backgroundColor: `${cat.color}15`,
                                borderColor: `${cat.color}40`,
                              }}
                            >
                              <Icon size={16} style={{ color: cat.color }} />
                            </div>
                            <div className="truncate">
                              <h4
                                className={cn(
                                  'text-xs font-bold leading-tight truncate',
                                  isActive ? 'text-white' : 'text-slate-200 group-hover:text-white'
                                )}
                              >
                                {item.label}
                              </h4>
                              <p className="text-[10px] text-slate-500 truncate mt-0.5">{item.sub}</p>
                            </div>
                          </div>

                          <ChevronRight
                            size={14}
                            className="text-slate-500 group-hover:text-white group-hover:translate-x-0.5 transition-all shrink-0 ml-2"
                          />
                        </Link>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom Quick Action */}
            <div className="p-3 border-t border-white/10 bg-[#07091e] shrink-0 flex items-center gap-2">
              <Link
                href="/dashboard/challenges/create"
                onClick={() => setMoreOpen(false)}
                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-[#00f0ff] to-[#00ff88] text-black font-black text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-[0_0_15px_rgba(0,240,255,0.3)] active:scale-95 transition-transform"
              >
                <Zap size={14} className="fill-black" />
                Host Challenge
              </Link>
              <Link
                href={isLoggedIn ? '/dashboard/wallet' : '/login'}
                onClick={() => setMoreOpen(false)}
                className="flex-1 py-2.5 rounded-xl border border-[#00ff88]/40 bg-[#00ff88]/10 text-[#00ff88] font-black text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 active:scale-95 transition-transform"
              >
                <Wallet size={14} />
                PKR Wallet
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* ─── Bottom HUD Bar ─── */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 pointer-events-auto">
        {/* Neon laser top border with Green & Blue theme */}
        <div className="h-[2px] w-full bg-gradient-to-r from-[#00f0ff] via-[#00ff88] to-[#00f0ff] opacity-90 shadow-[0_0_8px_#00f0ff]" />

        {/* Ambient glow behind nav */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#00f0ff]/5 to-transparent pointer-events-none" />

        <nav
          aria-label="Mobile Battle Navigation"
          className="bg-[#050614]/98 backdrop-blur-3xl px-1 pt-1.5 border-t border-white/5"
          style={{ paddingBottom: 'max(10px, env(safe-area-inset-bottom))' }}
        >
          <div className="grid grid-cols-6 items-center gap-0.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isMoreActive = item.id === 'more' && moreOpen;
              const isActive =
                item.isAction
                  ? isMoreActive
                  : item.href === '/' || item.href === '/dashboard'
                    ? pathname === item.href
                    : pathname === item.href ||
                      (item.href && pathname.startsWith(item.href.split('?')[0]) && item.href !== '/');

              const content = (
                <div
                  className={cn(
                    'relative flex flex-col items-center justify-center py-1.5 px-0.5 rounded-xl transition-all duration-200 select-none group border',
                    isActive
                      ? `${item.activeBg} ${item.activeBorder} ${item.glow}`
                      : 'border-transparent hover:bg-white/5'
                  )}
                  style={{ minHeight: 48 }}
                >
                  {/* Floating badge */}
                  {'badge' in item && item.badge && (
                    <span
                      className={cn(
                        'absolute -top-1.5 right-0.5 px-1 py-0 rounded-full text-[7px] font-black uppercase tracking-tight',
                        item.badgeCls
                      )}
                    >
                      {item.badge}
                    </span>
                  )}

                  {/* Active dot */}
                  {isActive && (
                    <span className={cn('absolute top-1 w-1 h-1 rounded-full animate-pulse', item.dot)} />
                  )}

                  {/* Icon */}
                  <Icon
                    className={cn(
                      'w-[18px] h-[18px] transition-all duration-200',
                      isActive ? 'scale-110 drop-shadow-[0_0_8px_currentColor]' : 'text-slate-400 group-hover:text-slate-200'
                    )}
                    style={isActive ? { color: item.color } : undefined}
                  />

                  {/* Label */}
                  <span
                    className={cn(
                      'text-[8.5px] font-black tracking-tight mt-0.5 uppercase leading-none truncate max-w-full',
                      isActive ? '' : 'text-slate-400 group-hover:text-slate-200'
                    )}
                    style={isActive ? { color: item.color } : undefined}
                  >
                    {item.label}
                  </span>
                </div>
              );

              if (item.isAction) {
                return (
                  <button
                    key={item.id}
                    onClick={item.onClick}
                    type="button"
                    className="flex-1 active:scale-90 transition-transform"
                    aria-label="Open directory"
                  >
                    {content}
                  </button>
                );
              }

              return (
                <Link
                  key={item.id}
                  href={item.href!}
                  className="flex-1 active:scale-90 transition-transform"
                >
                  {content}
                </Link>
              );
            })}
          </div>
        </nav>
      </div>
    </>
  );
}
