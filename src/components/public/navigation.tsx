'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import {
  Menu,
  X,
  Swords,
  Trophy,
  BarChart3,
  BookOpen,
  Shield,
  LogIn,
  Zap,
  Flame,
  Home,
  Users,
  ArrowDownToLine,
  ArrowUpFromLine,
  LayoutGrid,
} from 'lucide-react';
import { cn } from '@/lib/utils';

import { LiveIndicator } from '@/components/motion';

const publicNavItems = [
  { label: 'Live Battles', href: '/matches',      icon: Swords,    color: '#00f0ff', primary: true },
  { label: 'Tournaments',  href: '/tournaments',  icon: Trophy,    color: '#ffbe1a', primary: true },
  { label: 'Leaderboard',  href: '/leaderboard',  icon: BarChart3, color: '#00ff88', primary: true },
  { label: 'Teams',        href: '/teams',        icon: Users,     color: '#a855f7', primary: true },
  { label: 'How It Works', href: '/how-it-works', icon: BookOpen,  color: '#00f0ff', primary: false },
  { label: 'Rules',        href: '/rules',        icon: Shield,    color: '#00ff88', primary: false },
];

export function PublicHeader() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // close drawer on route change
  useEffect(() => { setMobileMenuOpen(false); }, [pathname]);

  return (
    <header className="sticky top-0 left-0 right-0 z-50 bg-[#030014]/95 backdrop-blur-xl border-b border-[#00f0ff]/15 shadow-[0_4px_30px_rgba(0,0,0,0.8)]">
      {/* ─── 1. TOP LIVE ARENA ANNOUNCEMENT TICKER ─── */}
      <div className="bg-[#050714] border-b border-white/5 py-1.5 px-4 overflow-hidden relative">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-xs gap-3">
          <div className="flex items-center gap-2 shrink-0">
            <LiveIndicator color="green" label="ARENA LIVE" />
          </div>

          <div className="overflow-hidden whitespace-nowrap text-[11px] text-slate-300 font-medium flex-1 mx-2">
            <span className="inline-block animate-[marquee_28s_linear_infinite]">
              🏆 ShadowStriker_PK won <strong className="text-[#00FF88]">PKR 1,800</strong> in 1v1 One-Tap • ⚡ Instant payout sent to Easypaisa 0345-XXXX912 • 🔥 4v4 Clash Squad Custom Room filling now • 🛡️ 100% Escrow Protection • ⚔️ Sakura Cup PKR 50,000 Registration Open!
            </span>
          </div>

          <div className="hidden sm:flex items-center gap-2.5 shrink-0 text-[10px] font-bold text-slate-400">
            <span>Cashout:</span>
            <span className="text-[#00FF88]">Easypaisa</span>
            <span className="text-slate-600">•</span>
            <span className="text-[#FFBE1B]">JazzCash</span>
          </div>
        </div>
      </div>

      {/* Top neon accent line */}
      <div className="h-[1px] w-full bg-gradient-to-r from-[#00f0ff]/60 via-[#00ff88]/40 to-[#a855f7]/60" />

      {/* ─── 2. MAIN NAVIGATION BAR ─── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-14 sm:h-16 gap-2">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0 group">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#00f0ff] via-[#0088ff] to-[#a855f7] p-0.5 flex items-center justify-center shadow-[0_0_15px_rgba(0,240,255,0.4)] group-hover:scale-105 transition-transform">
              <span className="w-full h-full rounded-[9px] bg-[#050614] flex items-center justify-center text-[#00f0ff] font-black text-xs tracking-wider font-heading">EG</span>
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="font-heading font-black text-base sm:text-lg tracking-wider text-white whitespace-nowrap" style={{ textShadow: '0 0 20px rgba(0,240,255,0.4)' }}>
                EDUCATED GAMER
              </span>
              <span className="px-1.5 py-0.5 rounded bg-[#00f0ff]/15 border border-[#00f0ff]/40 text-[8px] font-black text-[#00f0ff] tracking-widest uppercase hidden md:inline">
                ARENA
              </span>
            </div>
          </Link>

          {/* Desktop Nav: Shows 4 core on lg, all 6 on 2xl */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-1.5">
            {publicNavItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'relative flex items-center gap-1.5 px-2 xl:px-2.5 py-1.5 rounded-lg text-[11px] font-black uppercase tracking-wider transition-all duration-200 whitespace-nowrap',
                    !item.primary && 'hidden 2xl:flex',
                    isActive
                      ? 'text-white bg-white/8'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  )}
                  style={isActive ? { color: item.color } : undefined}
                >
                  <item.icon size={12} style={isActive ? { color: item.color } : undefined} />
                  <span>{item.label}</span>
                  {/* Animated underline */}
                  <span
                    className="absolute bottom-0.5 left-2 right-2 h-[1.5px] rounded-full transition-all duration-300"
                    style={{
                      background: item.color,
                      opacity: isActive ? 1 : 0,
                      boxShadow: isActive ? `0 0 8px ${item.color}` : 'none',
                      transform: isActive ? 'scaleX(1)' : 'scaleX(0)',
                    }}
                  />
                </Link>
              );
            })}
          </nav>

          {/* Desktop Auth CTAs */}
          <div className="hidden lg:flex items-center gap-2 shrink-0">
            <Link
              href="/login"
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white/5 border border-[#00f0ff]/20 text-[#00f0ff] text-xs font-bold hover:bg-[#00f0ff]/10 hover:border-[#00f0ff]/40 transition-all whitespace-nowrap"
            >
              <LogIn size={12} />
              <span>Sign In</span>
            </Link>
            <Link
              href="/register"
              className="relative flex items-center gap-1.5 px-3.5 xl:px-4 py-1.5 sm:py-2 rounded-lg text-black font-black text-xs uppercase tracking-wider overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(0,240,255,0.4)] whitespace-nowrap shrink-0"
              style={{ background: 'linear-gradient(135deg, #00f0ff, #00ff88)' }}
            >
              <Zap size={12} className="fill-black" />
              <span>Enter Arena</span>
            </Link>
          </div>

          {/* Mobile/Tablet Hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg text-gray-300 hover:text-white hover:bg-white/5 border border-white/10 transition-colors shrink-0"
            aria-label="Toggle navigation"
          >
            {mobileMenuOpen
              ? <X size={20} className="text-[#00f0ff]" />
              : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      <div
        className={cn(
          'xl:hidden overflow-hidden transition-all duration-300 ease-in-out',
          mobileMenuOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
        )}
      >
        <div className="border-t border-[#00f0ff]/15 bg-[#050614]/98 backdrop-blur-2xl">
          {/* Nav links */}
          <nav className="px-4 py-4 space-y-1">
            {publicNavItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    'flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all border',
                    isActive
                      ? 'bg-white/8 border-white/20'
                      : 'border-transparent text-gray-400 hover:text-white hover:bg-white/5'
                  )}
                  style={isActive ? { color: item.color, borderColor: `${item.color}40` } : undefined}
                >
                  <item.icon size={16} style={isActive ? { color: item.color } : { color: '#4b5563' }} />
                  {item.label}
                  {isActive && (
                    <span
                      className="ml-auto w-1.5 h-1.5 rounded-full animate-pulse"
                      style={{ background: item.color }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Auth buttons */}
          <div className="px-4 pb-5 pt-2 border-t border-white/10 grid grid-cols-2 gap-2">
            <Link
              href="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 py-3 rounded-xl border border-[#00f0ff]/30 bg-[#00f0ff]/10 text-xs font-black text-[#00f0ff] transition-all hover:bg-[#00f0ff]/20"
            >
              <LogIn size={15} />
              Sign In
            </Link>
            <Link
              href="/register"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-black uppercase tracking-wider text-black shadow-[0_0_20px_rgba(0,240,255,0.3)] transition-all hover:scale-[1.02] active:scale-95"
              style={{ background: 'linear-gradient(135deg, #00f0ff, #00ff88)' }}
            >
              <Zap size={15} className="fill-black" />
              Enter Arena
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}

export function PublicFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-[#00f0ff]/15 bg-[#050614] relative z-20">
      {/* Top neon glow line */}
      <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-[#00f0ff]/40 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-10">
          <div className="md:col-span-1 space-y-3">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#00f0ff] via-[#0088ff] to-[#a855f7] p-0.5 flex items-center justify-center">
                <span className="w-full h-full rounded-md bg-[#050614] flex items-center justify-center font-black text-[10px] text-[#00f0ff]">EG</span>
              </div>
              <span className="font-heading font-bold text-base text-white" style={{ textShadow: '0 0 15px rgba(0,240,255,0.3)' }}>
                EDUCATED GAMER
              </span>
            </Link>
            <p className="text-xs text-gray-500 leading-relaxed pt-1">
              Pakistan&apos;s premier competitive Free Fire platform. Create stakes, join verified custom room lobbies, and prove your team in the arena.
            </p>
            <div className="flex items-center gap-2 pt-2">
              <span className="text-[10px] uppercase tracking-widest text-gray-600 font-bold">One Team · One Goal</span>
              <span className="px-2 py-0.5 rounded border border-[#00f0ff]/30 text-[9px] font-black text-[#00f0ff] tracking-widest uppercase">EGA</span>
            </div>
          </div>

          <div>
            <h3 className="text-xs font-black uppercase tracking-widest text-[#00f0ff] mb-4 font-heading">Arena Platform</h3>
            <ul className="space-y-2.5 text-xs text-gray-500">
              <li><Link href="/matches"     className="hover:text-[#00f0ff] transition-colors">1v1 to 6v6 Challenges</Link></li>
              <li><Link href="/tournaments" className="hover:text-[#ffbe1a] transition-colors">Championship Series</Link></li>
              <li><Link href="/leaderboard" className="hover:text-[#00ff88] transition-colors">Global ELO Rankings</Link></li>
              <li><Link href="/teams"       className="hover:text-[#a855f7] transition-colors">Esports Teams Directory</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-black uppercase tracking-widest text-[#00ff88] mb-4 font-heading">Integrity &amp; Rules</h3>
            <ul className="space-y-2.5 text-xs text-gray-500">
              <li><Link href="/how-it-works"  className="hover:text-[#00ff88] transition-colors">How Arena Works</Link></li>
              <li><Link href="/rules"         className="hover:text-[#00ff88] transition-colors">Competition Rulebook</Link></li>
              <li><Link href="/fair-play"     className="hover:text-[#00f0ff] transition-colors">Fair Play &amp; Anti-Cheat</Link></li>
              <li><Link href="/wallet-policy" className="hover:text-[#ffbe1a] transition-colors">Financial Ledger Policy</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-black uppercase tracking-widest text-[#a855f7] mb-4 font-heading">Legal &amp; Support</h3>
            <ul className="space-y-2.5 text-xs text-gray-500">
              <li><Link href="/terms"        className="hover:text-[#a855f7] transition-colors">Terms of Service</Link></li>
              <li><Link href="/privacy"      className="hover:text-[#a855f7] transition-colors">Privacy Protection</Link></li>
              <li><Link href="/refund-policy" className="hover:text-[#00f0ff] transition-colors">Refund &amp; Cancellation</Link></li>
              <li><Link href="/contact" className="hover:text-[#00ff88] transition-colors">Contact Support HQ</Link></li>
              <li><Link href="/social" className="hover:text-[#00f0ff] transition-colors">Community Network</Link></li>
            </ul>
          </div>
        </div>

        <div className="pt-6 border-t border-white/8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-gray-600">
          <p>&copy; {currentYear} Educated Gamer Arena. All rights reserved.</p>
          <p className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00ff88] animate-pulse" />
            Skill-based competitive digital sports platform · Pakistan
          </p>
        </div>
      </div>
    </footer>
  );
}
