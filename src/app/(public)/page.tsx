'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Swords,
  Trophy,
  Shield,
  Users,
  Wallet,
  Zap,
  Flame,
  Target,
  Clock,
  Radio,
  Gamepad2,
  ChevronRight,
  ArrowRight,
  Crosshair,
  Medal,
  CheckCircle2,
  Smartphone,
  Sparkles,
  Award,
  HelpCircle,
  TrendingUp,
  ShieldCheck,
  ChevronDown,
  Globe,
  Lock,
  Scale,
  Ban,
  Eye,
  Check,
  Plus,
} from 'lucide-react';
import { Reveal, Stagger, StaggerItem, LiveIndicator, GlowButton, AnimatedCounter } from '@/components/motion';
import { MobileBattleNav } from '@/components/navigation/mobile-battle-nav';
import { formatCurrency, cn } from '@/lib/utils';

/* ─── 1. BATTLE MODES (CHOOSE YOUR BATTLE) ─── */
const BATTLE_MODES = [
  {
    id: '1v1',
    title: '1V1 ONE-TAP',
    format: '1v1 Duel',
    tag: 'HEADSHOT ONLY',
    desc: 'Desert Eagle & M1887 pure headshot aim battle. Clock Tower & Factory. Winner takes 100% of the prize stake.',
    entry: 'From PKR 50',
    prize: 'PKR 900',
    icon: Crosshair,
    accent: '#00F0FF',
    badgeCls: 'bg-[#00F0FF]/15 text-[#00F0FF] border-[#00F0FF]/40',
    borderCls: 'border-[#00F0FF]/30 hover:border-[#00F0FF]/80 shadow-[0_0_20px_rgba(0,240,255,0.15)]',
  },
  {
    id: '2v2',
    title: '2V2 DUO CLASH',
    format: '2v2 Duo',
    tag: 'COORDINATED RUSH',
    desc: 'Grab your best duo wingman. Coordinated rush tactics across Bermuda industrial zones with double the stakes.',
    entry: 'From PKR 100',
    prize: 'PKR 1,800',
    icon: Swords,
    accent: '#00FF88',
    badgeCls: 'bg-[#00FF88]/15 text-[#00FF88] border-[#00FF88]/40',
    borderCls: 'border-[#00FF88]/30 hover:border-[#00FF88]/80 shadow-[0_0_20px_rgba(0,255,136,0.15)]',
  },
  {
    id: '4v4',
    title: '4V4 SQUAD WAR',
    format: '4v4 Clash Squad',
    tag: 'ESPORTS RULES',
    desc: 'Full 4-man tournament squad warfare. Standard esports room configurations, spectator refereeing & high prestige.',
    entry: 'From PKR 200',
    prize: 'PKR 3,600',
    icon: Users,
    accent: '#8B5CF6',
    badgeCls: 'bg-[#8B5CF6]/15 text-[#8B5CF6] border-[#8B5CF6]/40',
    borderCls: 'border-[#8B5CF6]/30 hover:border-[#8B5CF6]/80 shadow-[0_0_20px_rgba(139,92,246,0.15)]',
  },
  {
    id: 'gvg',
    title: 'GVG SHOWDOWN',
    format: 'Guild vs Guild',
    tag: 'CLAN WAR',
    desc: 'Top Pakistani Free Fire Guilds battle for official clan rank points, Hall of Fame trophies & massive cash stakes.',
    entry: 'From PKR 500',
    prize: 'PKR 9,000',
    icon: Trophy,
    accent: '#FFBE1B',
    badgeCls: 'bg-[#FFBE1B]/15 text-[#FFBE1B] border-[#FFBE1B]/40',
    borderCls: 'border-[#FFBE1B]/30 hover:border-[#FFBE1B]/80 shadow-[0_0_20px_rgba(255,190,27,0.15)]',
  },
  {
    id: 'craftland',
    title: 'CRAFTLAND',
    format: 'Custom Map',
    tag: 'CUSTOM ARENAS',
    desc: 'Custom engineered aim training maps and close-quarters arenas designed specifically for lightning-fast reflexes.',
    entry: 'From PKR 100',
    prize: 'PKR 1,500',
    icon: Gamepad2,
    accent: '#1687FF',
    badgeCls: 'bg-[#1687FF]/15 text-[#1687FF] border-[#1687FF]/40',
    borderCls: 'border-[#1687FF]/30 hover:border-[#1687FF]/80 shadow-[0_0_20px_rgba(22,135,255,0.15)]',
  },
  {
    id: 'br',
    title: 'BATTLE ROYALE',
    format: 'Survival BR',
    tag: 'HIGH STAKES',
    desc: 'Classic survival battle royale across Bermuda & Purgatory. Outlast 48 players for the grand winner payout.',
    entry: 'From PKR 250',
    prize: 'PKR 12,000',
    icon: Globe,
    accent: '#00F0FF',
    badgeCls: 'bg-[#00F0FF]/15 text-[#00F0FF] border-[#00F0FF]/40',
    borderCls: 'border-[#00F0FF]/30 hover:border-[#00F0FF]/80 shadow-[0_0_20px_rgba(0,240,255,0.15)]',
  },
];

/* ─── 2. HOW THE ARENA WORKS (6 STEPS) ─── */
const ARENA_STEPS = [
  {
    step: '01',
    title: 'LOAD CASH',
    desc: 'Deposit PKR directly into your wallet with official Easypaisa or JazzCash accounts. 0% platform deposit fee.',
    color: '#00FF88',
  },
  {
    step: '02',
    title: 'CREATE / ACCEPT FIGHT',
    desc: 'Pick your format (1v1, 2v2, 4v4, GvG) and entry stake. Funds are secured safely in database escrow.',
    color: '#00F0FF',
  },
  {
    step: '03',
    title: 'OFFICIAL ROOM ASSIGNED',
    desc: 'Referee assigns the private Free Fire Custom Room ID and Password directly in your live match lobby.',
    color: '#1687FF',
  },
  {
    step: '04',
    title: 'PLAY & COMPETE',
    desc: 'Join the room within 15 minutes, obey the weapon loadout rules, and battle for the victory screen.',
    color: '#8B5CF6',
  },
  {
    step: '05',
    title: 'RESULT VERIFIED',
    desc: 'Both squads upload end-game victory/defeat screenshots. Referees review and verify match evidence.',
    color: '#FFBE1B',
  },
  {
    step: '06',
    title: 'WINNINGS DELIVERED',
    desc: 'Prize funds credit to the winner instantly. Cash out straight to Easypaisa or JazzCash within 24 hours.',
    color: '#00FF88',
  },
];

/* ─── 3. TOP CHAMPIONS (PODIUM #1, #2, #3) ─── */
const CHAMPIONS = [
  {
    rank: 1,
    name: 'ShadowStriker_PK',
    uid: '184920491',
    rating: 2450,
    winRate: 88.7,
    earnings: 94500,
    tier: 'GRANDMASTER',
    color: '#FFBE1B',
    border: 'border-[#FFBE1B]/60',
    glow: 'shadow-[0_0_35px_rgba(255,190,27,0.35)]',
    badge: '👑 #1 CHAMPION',
  },
  {
    rank: 2,
    name: 'HayatoAim_FF',
    uid: '891048201',
    rating: 2380,
    winRate: 84.2,
    earnings: 78200,
    tier: 'HEROIC IV',
    color: '#C0C0C0',
    border: 'border-[#C0C0C0]/50',
    glow: 'shadow-[0_0_25px_rgba(192,192,192,0.25)]',
    badge: '🥈 #2 CONTENDER',
  },
  {
    rank: 3,
    name: 'Faheem_OneTap',
    uid: '392019481',
    rating: 2290,
    winRate: 83.3,
    earnings: 64800,
    tier: 'HEROIC III',
    color: '#CD7F32',
    border: 'border-[#CD7F32]/50',
    glow: 'shadow-[0_0_25px_rgba(205,127,50,0.25)]',
    badge: '🥉 #3 CONTENDER',
  },
];

/* ─── 4. FAQS ─── */
const FAQS = [
  {
    q: 'How do I receive the Free Fire Custom Room ID and Password?',
    a: 'Once both players confirm a challenge, an official Match Lobby opens on your screen. The referee assigns and posts the Custom Room ID and Password right there with a 15-minute countdown clock.',
  },
  {
    q: 'Can PC / Emulator players participate?',
    a: 'Strictly No. Educated Gamer Arena enforces a 100% Mobile Only rule for competition integrity. Emulator players are detected, disqualified, and their entry fee is forfeited.',
  },
  {
    q: 'How do deposits and cashouts work with Easypaisa and JazzCash?',
    a: 'You send funds to our official verified accounts shown in your wallet panel and submit the transaction ID. Deposits credit in minutes. Withdrawals have 0% platform fee and transfer directly to your registered mobile account.',
  },
  {
    q: 'What happens if an opponent no-shows or cheats?',
    a: 'If an opponent does not join the custom room within 15 minutes, the referee declares a No-Show and your full stake is refunded. If cheating is proven via video/screenshot audit, the offender is permanently banned and winnings are restored.',
  },
  {
    q: 'How do official tournaments work?',
    a: 'Championship tournaments feature 16, 32, or 64 squads in single-elimination brackets. Registered squads receive match schedules, compete in supervised rooms, and share guaranteed cash prize pools.',
  },
];

export default function HomePage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [liveChallenges, setLiveChallenges] = useState<any[]>([]);
  const [loadingChallenges, setLoadingChallenges] = useState(true);

  // Fetch real challenges if available
  useEffect(() => {
    async function fetchChallenges() {
      try {
        const res = await fetch('/api/challenges');
        const json = await res.json();
        if (json.data && Array.isArray(json.data)) {
          setLiveChallenges(json.data.slice(0, 6));
        }
      } catch {
        // Fallback to sample
      } finally {
        setLoadingChallenges(false);
      }
    }
    fetchChallenges();
  }, []);

  return (
    <div className="relative overflow-hidden bg-[#03040B] text-white min-h-screen">
      {/* ─── HERO SECTION (CINEMATIC ESPORTS ARENA) ─── */}
      <section className="relative min-h-[92vh] flex flex-col justify-center py-12 sm:py-20 overflow-hidden">
        {/* Background Artwork */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <img
            src="/images/hero-bg.jpg"
            alt="Free Fire Esports Champions"
            className="w-full h-full object-cover object-center opacity-60 filter contrast-125 brightness-75 scale-105 animate-[pulse_10s_ease-in-out_infinite]"
          />
          {/* Volumetric overlays and vignettes */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#03040B] via-[#03040B]/80 to-[#03040B]/50" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#03040B] via-[#03040B]/85 to-transparent" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,#03040B_80%)]" />
        </div>

        {/* Atmospheric ambient lighting rays */}
        <div className="absolute top-1/4 left-10 w-96 h-96 bg-[#00F0FF]/15 rounded-full blur-[130px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-[#8B5CF6]/20 rounded-full blur-[140px] pointer-events-none" />

        <div className="relative z-20 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Left Hero Content: Dominates Left Viewport */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 bg-[#00F0FF]/10 border border-[#00F0FF]/35 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider text-[#00F0FF] shadow-[0_0_20px_rgba(0,240,255,0.25)]">
              <Sparkles className="w-3.5 h-3.5 text-[#00F0FF] animate-pulse" />
              PAKISTAN&apos;S PREMIER FREE FIRE ESPORTS ARENA
            </div>

            {/* Typography: PLAY FREE FIRE. WIN REAL CASH. */}
            <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black italic tracking-tight leading-[0.92] font-heading">
              <span className="text-white block drop-shadow-[0_0_30px_rgba(255,255,255,0.3)]">
                PLAY FREE FIRE.
              </span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00F0FF] via-[#1687FF] to-[#8B5CF6] block drop-shadow-[0_0_35px_rgba(0,240,255,0.45)]">
                WIN REAL CASH.
              </span>
            </h1>

            {/* Short Scannable Copy */}
            <div className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto lg:mx-0 leading-relaxed font-medium space-y-1">
              <p className="text-white font-bold">
                Challenge real players. Enter verified rooms. Compete. Win. Cash out.
              </p>
              <p className="text-xs text-slate-400">
                1v1 One-Tap Duels, 2v2 Duos &amp; 4v4 Clash Squads with referee supervision. Instant payouts to Easypaisa and JazzCash.
              </p>
            </div>

            {/* Primary & Secondary Action CTAs */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2 max-w-md mx-auto lg:mx-0">
              <Link
                href="/matches"
                className="battle-btn-cyan py-4 px-8 rounded-2xl font-heading font-black text-[#03040B] text-sm uppercase tracking-wider flex items-center justify-center gap-2.5 shadow-[0_0_30px_rgba(0,240,255,0.5)] active:scale-95 transition-all"
              >
                <Swords className="w-5 h-5 stroke-[2.5]" />
                <span>ENTER BATTLE ARENA</span>
                <ChevronRight className="w-4 h-4" />
              </Link>

              <Link
                href="/dashboard/wallet?tab=deposit"
                className="battle-btn-green py-4 px-8 rounded-2xl font-heading font-black text-[#03040B] text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(0,255,136,0.4)] active:scale-95 transition-all"
              >
                <Wallet className="w-5 h-5 stroke-[2.5]" />
                <span>LOAD CASH</span>
              </Link>
            </div>

            {/* Trust Strip */}
            <div className="pt-3 flex flex-wrap items-center justify-center lg:justify-start gap-4 text-xs font-bold text-slate-300 border-t border-white/10">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#00F0FF]" />
                <span>Verified Rooms</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#00FF88]" />
                <span>Fair Play</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#8B5CF6]" />
                <span>PKR Wallet</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#FFBE1B]" />
                <span>Easypaisa + JazzCash</span>
              </div>
            </div>
          </div>

          {/* Right Hero Feature Card: Real Esports Match HUD Interface */}
          <div className="lg:col-span-5 w-full max-w-md mx-auto">
            <div className="cyber-card-3d p-6 space-y-4 border-2 border-[#00F0FF]/30 shadow-[0_0_45px_rgba(0,240,255,0.25)] relative overflow-hidden">
              {/* Scanline texture */}
              <div className="absolute inset-0 hud-scanline pointer-events-none opacity-40" />

              {/* HUD Header */}
              <div className="flex items-center justify-between border-b border-white/10 pb-3 relative z-10">
                <div className="flex items-center gap-2">
                  <LiveIndicator color="red" label="LIVE • ROOM ASSIGNED" />
                </div>
                <span className="text-[10px] font-mono text-[#00F0FF] bg-[#00F0FF]/10 px-2 py-0.5 rounded border border-[#00F0FF]/30 font-bold">
                  MATCH #EG-4082
                </span>
              </div>

              {/* Mode & Map Info */}
              <div className="flex items-center justify-between text-xs relative z-10">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Combat Mode</span>
                  <span className="font-heading font-black text-white text-sm">4v4 Clash Squad</span>
                </div>
                <div className="text-right">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Map</span>
                  <span className="font-bold text-[#00F0FF]">Bermuda Industrial</span>
                </div>
              </div>

              {/* Opponent Face-Off */}
              <div className="p-3.5 rounded-2xl bg-black/60 border border-white/10 flex items-center justify-between relative z-10">
                <div className="text-left">
                  <h4 className="font-heading font-black text-xs text-white">Viper Squad PK</h4>
                  <span className="text-[10px] text-slate-400 font-mono">2,150 ELO</span>
                </div>
                <div className="w-8 h-8 rounded-full bg-[#00F0FF]/15 border border-[#00F0FF]/40 flex items-center justify-center font-heading font-black text-[#00F0FF] text-xs">
                  VS
                </div>
                <div className="text-right">
                  <h4 className="font-heading font-black text-xs text-white">Shadow Ninjas</h4>
                  <span className="text-[10px] text-slate-400 font-mono">2,080 ELO</span>
                </div>
              </div>

              {/* Stakes & Prize in Neon Green */}
              <div className="grid grid-cols-2 gap-3 p-3.5 rounded-2xl bg-black/70 border border-white/10 relative z-10">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Entry Stake</span>
                  <span className="font-bold text-white text-sm">PKR 500</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] uppercase font-black text-[#00FF88] block">Prize Pool</span>
                  <span className="font-heading font-black text-base text-[#00FF88] text-glow-green">
                    PKR 9,000
                  </span>
                </div>
              </div>

              {/* Tactical Progress & Countdown */}
              <div className="space-y-1.5 relative z-10">
                <div className="flex items-center justify-between text-[10px] text-slate-400">
                  <span className="flex items-center gap-1">
                    <Clock size={11} className="text-[#FFBE1B]" /> Room check-in countdown
                  </span>
                  <span className="font-mono font-bold text-white">03:42 remaining</span>
                </div>
                <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
                  <div className="h-full rounded-full bg-gradient-to-r from-[#00F0FF] to-[#00FF88] w-3/4 animate-pulse" />
                </div>
              </div>

              {/* Action Button */}
              <Link
                href="/matches"
                className="w-full battle-btn-cyan py-3.5 rounded-xl font-heading font-black text-xs text-[#03040B] uppercase tracking-wider flex items-center justify-center gap-2 active:scale-95 transition-all relative z-10 shadow-lg"
              >
                <Swords size={15} />
                <span>ACCEPT FIGHT</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 3. CHOOSE YOUR BATTLE SECTION ─── */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <Reveal>
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-[#00F0FF]/35 bg-[#00F0FF]/10 text-xs font-black text-[#00F0FF] mb-3 uppercase tracking-wider">
              <Crosshair size={14} />
              TACTICAL COMBAT MODES
            </div>
            <h2 className="text-3xl sm:text-5xl font-black text-white italic tracking-tight font-heading text-glow">
              CHOOSE YOUR BATTLE
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm max-w-lg mx-auto mt-2">
              Select your specialty, lock in your entry stakes, and enter verified Free Fire custom room lobbies.
            </p>
          </div>
        </Reveal>

        {/* Battle Modes Grid with Mobile Snap Carousel */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {BATTLE_MODES.map((mode) => {
            const Icon = mode.icon;
            return (
              <div
                key={mode.id}
                className={cn(
                  'rounded-3xl bg-[#080C1E]/90 border p-6 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1.5 relative overflow-hidden group',
                  mode.borderCls
                )}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className="w-12 h-12 rounded-2xl flex items-center justify-center border shadow-md"
                      style={{
                        backgroundColor: `${mode.accent}15`,
                        borderColor: `${mode.accent}40`,
                      }}
                    >
                      <Icon size={22} style={{ color: mode.accent }} />
                    </div>
                    <span className={cn('px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider', mode.badgeCls)}>
                      {mode.tag}
                    </span>
                  </div>

                  <h3 className="text-xl font-black text-white font-heading uppercase italic mb-1 group-hover:text-[#00F0FF] transition-colors">
                    {mode.title}
                  </h3>
                  <span className="text-xs font-mono text-slate-400 block mb-3 font-semibold">
                    {mode.format}
                  </span>
                  <p className="text-xs text-slate-300 leading-relaxed mb-6">
                    {mode.desc}
                  </p>
                </div>

                <div>
                  <div className="grid grid-cols-2 gap-2 p-3 rounded-xl bg-black/60 border border-white/5 text-xs mb-4">
                    <div>
                      <span className="text-slate-400 text-[10px] uppercase block font-medium">Entry Stake</span>
                      <span className="font-bold text-white">{mode.entry}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] uppercase font-black text-[#00FF88] block">Prize Pool</span>
                      <span className="font-black text-[#00FF88] font-heading text-sm">{mode.prize}</span>
                    </div>
                  </div>

                  <Link
                    href="/matches"
                    className="w-full py-3 rounded-xl text-xs font-heading font-black uppercase tracking-wider text-black flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition-all"
                    style={{
                      background: `linear-gradient(135deg, ${mode.accent}, #1687FF)`,
                    }}
                  >
                    <Zap size={14} className="fill-black" />
                    ENTER {mode.format.toUpperCase()}
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ─── 4. LIVE ARENA SECTION ─── */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <Reveal>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#00FF88]/40 bg-[#00FF88]/10 text-xs font-black text-[#00FF88] mb-2 uppercase tracking-wider">
                <Flame size={14} className="animate-bounce" />
                ACTIVE CHALLENGES
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-white italic tracking-tight font-heading text-glow-cyan">
                LIVE ARENA BATTLES
              </h2>
            </div>
            <Link
              href="/dashboard/challenges/create"
              className="battle-btn-green py-3 px-6 rounded-xl text-xs font-black uppercase tracking-wider text-black flex items-center gap-2 shrink-0 self-start sm:self-auto"
            >
              <Plus size={15} />
              CREATE A CHALLENGE
            </Link>
          </div>
        </Reveal>

        {loadingChallenges ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-5 rounded-3xl bg-[#080C1E]/90 border border-white/5 flex flex-col justify-between space-y-4 h-[220px]">
                <div>
                  <div className="flex items-center justify-between mb-3 border-b border-white/5 pb-2.5">
                    <div className="w-20 h-4 bg-white/10 rounded animate-pulse" />
                    <div className="w-16 h-4 bg-white/10 rounded-full animate-pulse" />
                  </div>
                  <div className="w-32 h-5 bg-white/10 rounded mb-1 animate-pulse" />
                  <div className="w-24 h-3 bg-white/10 rounded animate-pulse" />
                </div>
                <div>
                  <div className="flex items-center justify-between border-t border-white/5 pt-3 mb-3">
                    <div className="w-16 h-8 bg-white/10 rounded animate-pulse" />
                    <div className="w-20 h-8 bg-white/10 rounded animate-pulse" />
                  </div>
                  <div className="w-full h-12 bg-white/5 rounded-xl animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        ) : liveChallenges.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {liveChallenges.map((c) => (
              <div
                key={c.id}
                className="p-5 rounded-3xl bg-[#080C1E]/90 border border-white/10 hover:border-[#00F0FF]/50 transition-all flex flex-col justify-between space-y-4 group"
              >
                <div>
                  <div className="flex items-center justify-between mb-3 border-b border-white/10 pb-2.5">
                    <span className="text-xs font-mono font-black text-[#00F0FF]">
                      {c.publicId}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-[#00FF88]/15 text-[#00FF88] border border-[#00FF88]/30 uppercase">
                      {c.format}
                    </span>
                  </div>

                  <h3 className="font-bold text-white text-base group-hover:text-cyan-300 transition-colors">
                    {c.creator?.displayName || 'Challenger'}
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {c.gameMode?.name || '1v1 Duel'} • {c.map?.name || 'Bermuda'}
                  </p>
                </div>

                <div>
                  <div className="flex items-center justify-between border-t border-white/10 pt-3 mb-3">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase block">Stake</span>
                      <span className="font-bold text-white text-sm">{formatCurrency(c.entryFee)}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] uppercase font-black text-[#00FF88] block">Prize Pool</span>
                      <span className="font-black text-[#00FF88] text-base font-heading">
                        {formatCurrency(c.prizePool)}
                      </span>
                    </div>
                  </div>

                  <Link
                    href="/dashboard/challenges"
                    className="w-full battle-btn-cyan py-3 rounded-xl text-xs font-black uppercase tracking-wider text-black flex items-center justify-center gap-2 active:scale-95 transition-all"
                  >
                    <Swords size={15} />
                    ACCEPT BATTLE
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Intentional High-Impact Empty State */
          <div className="text-center py-16 px-6 rounded-3xl border border-dashed border-white/15 bg-[#060816] max-w-2xl mx-auto">
            <Gamepad2 size={48} className="text-slate-600 mx-auto mb-3" />
            <h3 className="text-xl font-black text-white font-heading uppercase italic mb-1">
              THE ARENA IS QUIET
            </h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto mb-6 leading-relaxed">
              Be the first warrior to set the stakes! Create a challenge and wait for an opponent to accept.
            </p>
            <Link
              href="/dashboard/challenges/create"
              className="battle-btn-cyan py-3.5 px-8 rounded-xl text-xs font-black uppercase tracking-wider text-black inline-flex items-center gap-2 shadow-lg"
            >
              <Swords size={16} />
              CREATE CHALLENGE
            </Link>
          </div>
        )}
      </section>

      {/* ─── 5. TOURNAMENT SHOWCASE (CHAMPIONSHIP) ─── */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <Reveal>
          <div className="relative rounded-3xl overflow-hidden border-2 border-[#FFBE1B]/40 bg-gradient-to-r from-[#181105] via-[#100C24] to-[#070D22] p-8 sm:p-12 shadow-[0_0_50px_rgba(255,190,27,0.18)]">
            <div className="absolute top-0 right-0 w-96 h-96 bg-[#FFBE1B]/15 rounded-full blur-[120px] pointer-events-none" />

            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-8 space-y-4">
                <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-[#FFBE1B]/50 bg-[#FFBE1B]/15 text-xs font-black text-[#FFBE1B] uppercase tracking-widest shadow-md">
                  <Trophy size={14} className="animate-pulse" />
                  🏆 CHAMPIONSHIP SERIES
                </div>

                <h3 className="text-3xl sm:text-5xl font-black text-white italic tracking-tight font-heading text-glow-gold">
                  SAKURA CUP 2026 • SEASON 3
                </h3>

                <p className="text-slate-300 text-xs sm:text-sm max-w-xl leading-relaxed">
                  Official 32-squad Clash Squad tournament. Refereed custom rooms, live cast finals, and direct PKR cash pool distribution for top-ranking teams.
                </p>

                <div className="grid grid-cols-3 gap-3 p-4 rounded-2xl bg-black/60 border border-white/10 max-w-lg text-xs">
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Prize Pool</span>
                    <span className="font-heading font-black text-[#FFBE1B] text-base">PKR 50,000</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Squad Stake</span>
                    <span className="font-bold text-white text-sm">PKR 1,000</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Slots Open</span>
                    <span className="font-bold text-[#00FF88] text-sm">18 / 32 Teams</span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="max-w-lg space-y-1.5">
                  <div className="flex justify-between text-[10px] text-slate-400">
                    <span>Registration Fill: 56%</span>
                    <span className="font-mono text-[#FFBE1B] font-bold">14 Spots Left</span>
                  </div>
                  <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                    <div className="h-full rounded-full bg-gradient-to-r from-[#FFBE1B] via-[#8B5CF6] to-[#00F0FF] w-[56%]" />
                  </div>
                </div>
              </div>

              <div className="lg:col-span-4 flex flex-col items-center lg:items-end justify-center gap-4">
                <div className="w-24 h-24 rounded-3xl bg-[#FFBE1B]/15 border-2 border-[#FFBE1B]/50 flex items-center justify-center shadow-[0_0_30px_rgba(255,190,27,0.3)]">
                  <Trophy size={48} className="text-[#FFBE1B]" />
                </div>
                <Link
                  href="/tournaments"
                  className="w-full sm:w-auto battle-btn-gold py-4 px-8 rounded-2xl font-heading font-black text-xs uppercase tracking-wider text-black text-center shadow-[0_0_25px_rgba(255,190,27,0.4)] active:scale-95 transition-all"
                >
                  REGISTER NOW
                </Link>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ─── 6. HALL OF CHAMPIONS (LEADERBOARD PODIUM) ─── */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <Reveal>
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-[#FFBE1B]/35 bg-[#FFBE1B]/10 text-xs font-black text-[#FFBE1B] mb-3 uppercase tracking-wider">
              <Medal size={14} />
              HALL OF FAME
            </div>
            <h2 className="text-3xl sm:text-5xl font-black text-white italic tracking-tight font-heading text-glow-gold">
              HALL OF CHAMPIONS
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm max-w-lg mx-auto mt-2">
              Recognizing the most skilled, consistent, and dominant Free Fire competitors in Pakistan.
            </p>
          </div>
        </Reveal>

        {/* 3D Podium Composition (#1 Gold, #2 Silver, #3 Bronze) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end max-w-4xl mx-auto mb-10">
          {/* Rank 2 (Silver) */}
          <div className="order-2 md:order-1">
            <div className="cyber-card-3d p-6 text-center border-slate-400/40">
              <div className="w-16 h-16 rounded-full bg-slate-400/20 border-2 border-slate-300 flex items-center justify-center mx-auto mb-3 text-slate-200 font-black text-xl font-heading shadow-[0_0_20px_rgba(200,200,200,0.3)]">
                2
              </div>
              <span className="text-[10px] font-black text-slate-300 uppercase px-2.5 py-0.5 rounded-full bg-white/5 border border-slate-400/30 inline-block mb-2">
                {CHAMPIONS[1].badge}
              </span>
              <h3 className="text-base font-bold text-white mb-1 font-heading">{CHAMPIONS[1].name}</h3>
              <p className="text-[10px] text-slate-400 font-mono mb-4">UID: {CHAMPIONS[1].uid}</p>

              <div className="grid grid-cols-3 gap-2 p-3 rounded-xl bg-black/60 border border-white/5 text-xs">
                <div>
                  <span className="text-slate-500 block text-[9px] uppercase">Rating</span>
                  <span className="font-bold text-white font-heading">{CHAMPIONS[1].rating}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[9px] uppercase">Win%</span>
                  <span className="font-bold text-[#00FF88]">{CHAMPIONS[1].winRate}%</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[9px] uppercase">Earned</span>
                  <span className="font-black text-[#00FF88]">{formatCurrency(CHAMPIONS[1].earnings)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Rank 1 (Champion Gold) */}
          <div className="order-1 md:order-2">
            <div className="cyber-card-3d p-8 text-center border-2 border-[#FFBE1B]/60 shadow-[0_0_40px_rgba(255,190,27,0.3)] md:scale-105">
              <div className="w-20 h-20 rounded-full bg-[#FFBE1B]/20 border-2 border-[#FFBE1B] flex items-center justify-center mx-auto mb-3 text-[#FFBE1B] font-black text-3xl shadow-[0_0_25px_rgba(255,190,27,0.5)]">
                <Trophy size={32} />
              </div>
              <span className="text-[10px] font-black text-[#FFBE1B] uppercase px-3 py-1 rounded-full bg-[#FFBE1B]/15 border border-[#FFBE1B]/40 inline-block mb-2">
                {CHAMPIONS[0].badge}
              </span>
              <h3 className="text-xl font-black text-white mb-1 font-heading">{CHAMPIONS[0].name}</h3>
              <p className="text-xs text-slate-300 font-mono mb-5">UID: {CHAMPIONS[0].uid}</p>

              <div className="grid grid-cols-3 gap-2 p-3.5 rounded-xl bg-black/70 border border-[#FFBE1B]/20 text-xs">
                <div>
                  <span className="text-slate-400 block text-[9px] uppercase font-bold">Rating</span>
                  <span className="font-black text-white font-heading text-sm">{CHAMPIONS[0].rating}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[9px] uppercase font-bold">Win%</span>
                  <span className="font-bold text-[#00FF88] text-sm">{CHAMPIONS[0].winRate}%</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[9px] uppercase font-bold">Earned</span>
                  <span className="font-black text-[#00FF88] text-sm">{formatCurrency(CHAMPIONS[0].earnings)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Rank 3 (Bronze) */}
          <div className="order-3">
            <div className="cyber-card-3d p-6 text-center border-amber-700/40">
              <div className="w-16 h-16 rounded-full bg-amber-800/20 border-2 border-amber-700 flex items-center justify-center mx-auto mb-3 text-amber-500 font-black text-xl font-heading shadow-[0_0_20px_rgba(205,127,50,0.3)]">
                3
              </div>
              <span className="text-[10px] font-black text-amber-500 uppercase px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 inline-block mb-2">
                {CHAMPIONS[2].badge}
              </span>
              <h3 className="text-base font-bold text-white mb-1 font-heading">{CHAMPIONS[2].name}</h3>
              <p className="text-[10px] text-slate-400 font-mono mb-4">UID: {CHAMPIONS[2].uid}</p>

              <div className="grid grid-cols-3 gap-2 p-3 rounded-xl bg-black/60 border border-white/5 text-xs">
                <div>
                  <span className="text-slate-500 block text-[9px] uppercase">Rating</span>
                  <span className="font-bold text-white font-heading">{CHAMPIONS[2].rating}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[9px] uppercase">Win%</span>
                  <span className="font-bold text-[#00FF88]">{CHAMPIONS[2].winRate}%</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[9px] uppercase">Earned</span>
                  <span className="font-black text-[#00FF88]">{formatCurrency(CHAMPIONS[2].earnings)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center">
          <Link
            href="/leaderboard"
            className="inline-flex items-center gap-2 text-xs font-heading font-black uppercase tracking-widest text-[#00F0FF] hover:text-white transition-colors"
          >
            <span>VIEW FULL LEADERBOARD</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </section>

      {/* ─── 7. HOW THE ARENA WORKS (6-STEP JOURNEY) ─── */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto bg-[#060816]/70 border-y border-white/5">
        <Reveal>
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-[#00F0FF]/35 bg-[#00F0FF]/10 text-xs font-black text-[#00F0FF] mb-3 uppercase tracking-wider">
              <Zap size={14} />
              QUICK PLAYER ROADMAP
            </div>
            <h2 className="text-3xl sm:text-5xl font-black text-white italic tracking-tight font-heading text-glow">
              HOW THE ARENA WORKS
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm max-w-lg mx-auto mt-2">
              From account deposit to room win in 6 straightforward, transparent steps.
            </p>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 relative">
          {ARENA_STEPS.map((s, idx) => (
            <div
              key={s.step}
              className="p-6 rounded-3xl bg-[#080C1E]/90 border border-white/10 relative transition-all duration-300 hover:border-[#00F0FF]/50 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span
                    className="font-heading font-black text-2xl"
                    style={{ color: s.color }}
                  >
                    {s.step}
                  </span>
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: s.color, boxShadow: `0 0 10px ${s.color}` }}
                  />
                </div>

                <h3 className="text-lg font-black text-white font-heading uppercase italic mb-2">
                  {s.title}
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {s.desc}
                </p>
              </div>

              {idx < ARENA_STEPS.length - 1 && (
                <div className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 z-10 text-slate-600">
                  <ChevronRight size={18} />
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ─── 8. WALLET / CASHOUT TRUST SECTION ─── */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="relative rounded-3xl overflow-hidden border-2 border-[#00FF88]/30 bg-gradient-to-r from-[#071911] via-[#080C1E] to-[#071911] p-8 sm:p-12 shadow-[0_0_50px_rgba(0,255,136,0.15)]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-[#00FF88]/40 bg-[#00FF88]/15 text-xs font-black text-[#00FF88] uppercase tracking-wider">
                <Wallet size={14} />
                FAST FINANCIAL CASHOUT
              </div>

              <h2 className="text-3xl sm:text-5xl font-black text-white italic tracking-tight font-heading text-glow-green">
                YOUR WINNINGS. YOUR WALLET.
              </h2>

              <p className="text-slate-300 text-xs sm:text-sm leading-relaxed max-w-xl">
                Cryptographic double-entry ledger bookkeeping. Complete transparent balance tracking with 0% cashout fee to Easypaisa and JazzCash accounts.
              </p>

              <div className="grid grid-cols-3 gap-3 pt-2 max-w-lg">
                <div className="p-3.5 rounded-2xl bg-black/60 border border-[#00FF88]/20">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">💚 Ready to Play</span>
                  <span className="font-bold text-white text-xs">Available PKR</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-black/60 border border-[#00F0FF]/20">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">⚡ In Fights</span>
                  <span className="font-bold text-white text-xs">Escrow Locked</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-black/60 border border-[#FFBE1B]/20">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">🏆 Winnings</span>
                  <span className="font-bold text-[#00FF88] text-xs">Direct Cashout</span>
                </div>
              </div>

              <div className="flex items-center gap-4 pt-2 text-xs font-bold text-slate-300">
                <span className="flex items-center gap-1">
                  <CheckCircle2 size={15} className="text-[#00FF88]" /> Verified Review
                </span>
                <span className="flex items-center gap-1">
                  <CheckCircle2 size={15} className="text-[#00FF88]" /> Fast Processing
                </span>
                <span className="flex items-center gap-1">
                  <CheckCircle2 size={15} className="text-[#00FF88]" /> Transparent Ledger
                </span>
              </div>
            </div>

            <div className="lg:col-span-5 flex flex-col items-center justify-center gap-4">
              <div className="p-6 rounded-3xl bg-black/70 border border-white/10 text-center w-full max-w-sm space-y-4 shadow-xl">
                <h4 className="font-heading font-black text-sm uppercase tracking-wider text-white">
                  Supported Cash Channels
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-4 rounded-2xl bg-[#00c853]/15 border border-[#00c853]/40 text-center">
                    <span className="font-heading font-black text-sm text-[#00c853] block">EASYPAISA</span>
                    <span className="text-[10px] text-slate-300">Direct Mobile Account</span>
                  </div>
                  <div className="p-4 rounded-2xl bg-[#ff2040]/15 border border-[#ff2040]/40 text-center">
                    <span className="font-heading font-black text-sm text-[#ff3b56] block">JAZZCASH</span>
                    <span className="text-[10px] text-slate-300">Direct Mobile Account</span>
                  </div>
                </div>
                <Link
                  href="/dashboard/wallet?tab=deposit"
                  className="w-full battle-btn-green py-3.5 rounded-xl font-heading font-black text-xs text-black uppercase tracking-wider block"
                >
                  DEPOSIT FUNDS (PKR)
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 9. ANTI-CHEAT / FAIR PLAY SECTION ─── */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <Reveal>
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-[#00F0FF]/35 bg-[#00F0FF]/10 text-xs font-black text-[#00F0FF] mb-3 uppercase tracking-wider">
              <ShieldCheck size={14} />
              FAIR PLAY GUARANTEE
            </div>
            <h2 className="text-3xl sm:text-5xl font-black text-white italic tracking-tight font-heading text-glow-cyan">
              PLAY CLEAN. PLAY TO WIN.
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm max-w-lg mx-auto mt-2">
              Zero tolerance policy on hacks, emulator bypassing, and ringers.
            </p>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 rounded-3xl bg-[#080C1E]/90 border border-white/10 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-[#00F0FF]/15 border border-[#00F0FF]/40 flex items-center justify-center mx-auto text-[#00F0FF]">
              <Shield size={24} />
            </div>
            <h3 className="font-heading font-black text-sm uppercase text-white">🛡 Verified Rooms</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Every match is supervised in official Free Fire custom rooms under referee monitoring.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-[#080C1E]/90 border border-white/10 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-[#1687FF]/15 border border-[#1687FF]/40 flex items-center justify-center mx-auto text-[#1687FF]">
              <Eye size={24} />
            </div>
            <h3 className="font-heading font-black text-sm uppercase text-white">👁 Match Review</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Screenshot scoreboards and spectator video recordings are cross-audited before payout.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-[#080C1E]/90 border border-white/10 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-[#EF4444]/15 border border-[#EF4444]/40 flex items-center justify-center mx-auto text-[#EF4444]">
              <Ban size={24} />
            </div>
            <h3 className="font-heading font-black text-sm uppercase text-white">🚫 No Hacks</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Headshot configs, scripts, and wall hacks result in instant permanent hardware bans.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-[#080C1E]/90 border border-white/10 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-[#00FF88]/15 border border-[#00FF88]/40 flex items-center justify-center mx-auto text-[#00FF88]">
              <Scale size={24} />
            </div>
            <h3 className="font-heading font-black text-sm uppercase text-white">⚡ Fair Competition</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Mobile players only. Genuine verified Free Fire UIDs matched against equal tier warriors.
            </p>
          </div>
        </div>
      </section>

      {/* ─── 10. SOCIAL PROOF & COMMUNITY SECTION ─── */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto bg-[#060816]/70 border-y border-white/5">
        <Reveal>
          <div className="text-center mb-10">
            <h3 className="text-2xl sm:text-4xl font-black text-white italic tracking-tight font-heading">
              EDUCATED GAMER ARENA
            </h3>
            <p className="text-xs sm:text-sm text-[#00F0FF] font-mono uppercase tracking-widest mt-1">
              BUILT FOR COMPETITIVE PLAYERS
            </p>
          </div>
        </Reveal>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="p-6 rounded-2xl bg-white/5 border border-white/5">
            <span className="font-heading font-black text-2xl sm:text-4xl text-[#00F0FF] block mb-1">
              1,250+
            </span>
            <span className="text-xs text-slate-400 font-medium uppercase">Active Warriors</span>
          </div>

          <div className="p-6 rounded-2xl bg-white/5 border border-white/5">
            <span className="font-heading font-black text-2xl sm:text-4xl text-[#00FF88] block mb-1">
              4,800+
            </span>
            <span className="text-xs text-slate-400 font-medium uppercase">Completed Matches</span>
          </div>

          <div className="p-6 rounded-2xl bg-white/5 border border-white/5">
            <span className="font-heading font-black text-2xl sm:text-4xl text-[#FFBE1B] block mb-1">
              PKR 50K
            </span>
            <span className="text-xs text-slate-400 font-medium uppercase">Tournament Pools</span>
          </div>

          <div className="p-6 rounded-2xl bg-white/5 border border-white/5">
            <span className="font-heading font-black text-2xl sm:text-4xl text-[#8B5CF6] block mb-1">
              85+
            </span>
            <span className="text-xs text-slate-400 font-medium uppercase">Verified Clans</span>
          </div>
        </div>
      </section>

      {/* ─── 11. FAQ ACCORDION SECTION ─── */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <Reveal>
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-[#00F0FF]/35 bg-[#00F0FF]/10 text-xs font-black text-[#00F0FF] mb-3 uppercase tracking-wider">
              <HelpCircle size={14} />
              FREQUENTLY ASKED QUESTIONS
            </div>
            <h2 className="text-3xl sm:text-5xl font-black text-white italic tracking-tight font-heading text-glow">
              NEED ANSWERS?
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm max-w-lg mx-auto mt-2">
              Everything you need to know about rooms, stakes, payments, and anti-cheat policies.
            </p>
          </div>
        </Reveal>

        <div className="space-y-4">
          {FAQS.map((faq, index) => {
            const isOpen = openFaq === index;
            return (
              <div
                key={index}
                className={cn(
                  'rounded-2xl border transition-all duration-300 overflow-hidden bg-[#080C1E]/80',
                  isOpen
                    ? 'border-[#00F0FF]/60 shadow-[0_0_20px_rgba(0,240,255,0.15)]'
                    : 'border-white/10 hover:border-white/20'
                )}
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : index)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 font-heading font-bold text-sm text-white"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    size={18}
                    className={cn(
                      'text-[#00F0FF] transition-transform duration-300 shrink-0',
                      isOpen && 'rotate-180'
                    )}
                  />
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="px-5 pb-5 text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-white/5 pt-3">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </section>

      {/* ─── 12. FINAL DRAMATIC CTA SECTION ─── */}
      <section className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center relative overflow-hidden">
        <div className="relative rounded-3xl overflow-hidden border-2 border-[#00F0FF]/40 bg-gradient-to-br from-[#060816] via-[#090D20] to-[#060816] p-10 sm:p-16 shadow-[0_0_60px_rgba(0,240,255,0.2)]">
          {/* Background Atmosphere */}
          <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none opacity-30">
            <img
              src="/images/hero-bg.jpg"
              alt="Atmosphere"
              className="w-full h-full object-cover filter contrast-150 brightness-75"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#03040B] via-[#03040B]/80 to-transparent" />
          </div>

          <div className="relative z-10 max-w-2xl mx-auto space-y-6">
            <h2 className="text-3xl sm:text-6xl font-black text-white italic tracking-tight font-heading text-glow">
              READY FOR YOUR NEXT FIGHT?
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm max-w-md mx-auto leading-relaxed">
              Create your account, load your wallet, and step into Pakistan&apos;s most competitive Free Fire arena tonight.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
              <Link
                href="/matches"
                className="battle-btn-cyan py-4 px-8 rounded-2xl font-heading font-black text-[#03040B] text-xs uppercase tracking-wider shadow-[0_0_30px_rgba(0,240,255,0.4)] active:scale-95 transition-all"
              >
                ENTER THE ARENA
              </Link>
              <Link
                href="/dashboard/challenges/create"
                className="battle-btn-green py-4 px-8 rounded-2xl font-heading font-black text-[#03040B] text-xs uppercase tracking-wider shadow-[0_0_25px_rgba(0,255,136,0.35)] active:scale-95 transition-all"
              >
                CREATE A CHALLENGE
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─── MOBILE BATTLE NAVIGATION HUD ─── */}
      <MobileBattleNav isLoggedIn={false} />
    </div>
  );
}
