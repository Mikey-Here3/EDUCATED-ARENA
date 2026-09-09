'use client';

import Link from 'next/link';
import {
  Swords,
  Trophy,
  Award,
  Users,
  Shield,
  ArrowDownToLine,
  ArrowUpFromLine,
  Wallet,
  BookOpen,
  FileText,
  Scale,
  RotateCcw,
  Settings,
  Bell,
  Lock,
  ChevronRight,
  Flame,
  Zap,
  LayoutGrid,
} from 'lucide-react';
import { Reveal } from '@/components/motion';
import { MobileBattleNav } from '@/components/navigation/mobile-battle-nav';

const CATEGORIES = [
  {
    title: '⚔️ BATTLE MODES & COMBAT',
    color: '#00f0ff',
    badge: 'FIGHT',
    items: [
      { label: 'Live Battles Lobby', href: '/matches', icon: Swords, sub: '1v1, 2v2, 4v4 open player challenges with cash prizes' },
      { label: 'Championship Series', href: '/tournaments', icon: Trophy, sub: 'Official single-elimination bracket cups & cash pool' },
      { label: 'Hall of Champions', href: '/leaderboard', icon: Award, sub: 'Global ELO ratings & top earning Pakistani warriors' },
      { label: 'My Battle Matches', href: '/dashboard/matches', icon: Flame, sub: 'Assigned rooms, match referee status & chat' },
    ],
  },
  {
    title: '🛡️ SQUADS, CLANS & GUILDS',
    color: '#00ff88',
    badge: 'ROSTER',
    items: [
      { label: 'Competitive Teams Directory', href: '/teams', icon: Users, sub: 'Browse registered Free Fire squads & clan stats' },
      { label: 'Guilds & GvG Wars', href: '/dashboard/guilds', icon: Shield, sub: '4v4 Guild vs Guild high-stakes war room' },
      { label: 'Team Management', href: '/dashboard/teams', icon: Users, sub: 'Build your squad, invite members & assign leaders' },
    ],
  },
  {
    title: '💰 CASH, WALLET & LEDGER',
    color: '#00ff88',
    badge: 'FINANCE',
    items: [
      { label: 'Deposit PKR (Fast Cashier)', href: '/dashboard/wallet?tab=deposit', icon: ArrowDownToLine, sub: 'Easypaisa & JazzCash instant account funding' },
      { label: 'Cash Out / Withdraw', href: '/dashboard/wallet?tab=withdraw', icon: ArrowUpFromLine, sub: 'Direct disbursements with 0% platform withdrawal fee' },
      { label: 'Financial Ledger Policy', href: '/wallet-policy', icon: Wallet, sub: 'Immutable double-entry ledger & audit compliance' },
    ],
  },
  {
    title: '📜 RULES, INTEGRITY & SUPPORT',
    color: '#00f0ff',
    badge: 'RULES',
    items: [
      { label: 'How Arena Works', href: '/how-it-works', icon: BookOpen, sub: '6-step guide from account creation to cash out' },
      { label: 'Official Competition Rulebook', href: '/rules', icon: FileText, sub: 'Approved weapons, clash format rules & limits' },
      { label: 'Fair Play & Anti-Cheat', href: '/fair-play', icon: Scale, sub: 'Zero-tolerance policy on hacks & third-party tools' },
      { label: 'Refund & Cancellation Policy', href: '/refund-policy', icon: RotateCcw, sub: '100% money-back guarantee for unaccepted stakes' },
    ],
  },
  {
    title: '⚙️ ACCOUNT, IDENTITY & SECURITY',
    color: '#ffbe1a',
    badge: 'SYSTEM',
    items: [
      { label: 'Free Fire UID & IGN Profile', href: '/dashboard/settings', icon: Settings, sub: 'Update verified gamer identity & mobile number' },
      { label: 'Notifications Feed', href: '/dashboard/notifications', icon: Bell, sub: 'Real-time challenge invites & result updates' },
      { label: 'Terms of Service', href: '/terms', icon: Lock, sub: 'Platform competition legal terms' },
      { label: 'Privacy Protection', href: '/privacy', icon: Shield, sub: 'Security protocols & account confidentiality' },
    ],
  },
];

export default function MorePage() {
  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto pt-24 pb-32">
      {/* Banner */}
      <Reveal>
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#00f0ff]/40 bg-[#00f0ff]/10 text-xs font-black text-[#00f0ff] mb-3 uppercase tracking-wider shadow-[0_0_15px_rgba(0,240,255,0.2)]">
            <LayoutGrid size={14} />
            Command Center Directory
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white italic tracking-tight font-heading text-glow-cyan">
            ARENA SITEMAP &amp; ROUTES
          </h1>
          <p className="text-slate-300 mt-2 max-w-lg mx-auto text-xs sm:text-sm leading-relaxed">
            Quickly jump to any combat mode, squad roster, wallet cashier, or competitive guideline.
          </p>
        </div>
      </Reveal>

      {/* Directory Sections */}
      <div className="space-y-8">
        {CATEGORIES.map((cat, idx) => (
          <div
            key={cat.title}
            className="p-5 sm:p-7 rounded-3xl bg-[#06081c]/80 border border-white/10 shadow-xl relative overflow-hidden"
          >
            {/* Ambient edge glow */}
            <div
              className="absolute top-0 left-0 right-0 h-[2px]"
              style={{
                background: `linear-gradient(90deg, transparent, ${cat.color}, transparent)`,
              }}
            />

            <div className="flex items-center justify-between gap-2 mb-4 pb-3 border-b border-white/10">
              <h2 className="text-xs sm:text-sm font-black tracking-wider uppercase font-heading text-white flex items-center gap-2">
                <span>{cat.title}</span>
              </h2>
              <span
                className="text-[9px] font-black px-2.5 py-0.5 rounded-full border uppercase"
                style={{
                  color: cat.color,
                  borderColor: `${cat.color}50`,
                  backgroundColor: `${cat.color}15`,
                }}
              >
                {cat.badge}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {cat.items.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    className="p-3.5 rounded-2xl bg-white/5 border border-white/5 hover:border-white/20 hover:bg-white/10 transition-all flex items-center justify-between group active:scale-[0.98]"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border shadow-md"
                        style={{
                          backgroundColor: `${cat.color}15`,
                          borderColor: `${cat.color}40`,
                        }}
                      >
                        <Icon size={18} style={{ color: cat.color }} />
                      </div>
                      <div className="truncate">
                        <h3 className="text-xs sm:text-sm font-bold text-white group-hover:text-cyan-300 transition-colors truncate">
                          {item.label}
                        </h3>
                        <p className="text-[10px] text-slate-400 truncate mt-0.5">{item.sub}</p>
                      </div>
                    </div>

                    <ChevronRight
                      size={16}
                      className="text-slate-500 group-hover:text-white group-hover:translate-x-1 transition-all shrink-0 ml-2"
                    />
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <MobileBattleNav />
    </div>
  );
}
