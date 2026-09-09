'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  Trophy, Calendar, Users, Zap, Flame, Star, Crown,
  CheckCircle2, Clock, ChevronRight, Wifi
} from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { MobileBattleNav } from '@/components/navigation/mobile-battle-nav';

/* ─── Sample Data ─── */
const SAMPLE_TOURNAMENTS = [
  {
    id: 'tour-1',
    publicId: 'EG-T-101',
    name: 'Free Fire Karachi Masters Cup',
    description: '32-team single-elimination squad championship of Sindh. Verified rosters. Official referee. Guaranteed prize payout.',
    platform: 'MOBILE ONLY',
    format: '4v4 Clash Squad',
    entryFee: 500,
    prizePool: 25000,
    maxTeams: 32,
    registeredTeams: 18,
    status: 'REGISTRATION_OPEN',
    startAt: '2026-10-15T18:00:00Z',
    badge: 'HOT',
    color: 'cyan',
  },
  {
    id: 'tour-2',
    publicId: 'EG-T-102',
    name: 'All-Pakistan Clash Squad League',
    description: 'Competitive 4v4 Clash Squad series. Best of 5 series finals. Live streamed on EGA official channel.',
    platform: 'MOBILE ONLY',
    format: '4v4 Clash Squad',
    entryFee: 1000,
    prizePool: 50000,
    maxTeams: 16,
    registeredTeams: 12,
    status: 'REGISTRATION_OPEN',
    startAt: '2026-10-25T19:00:00Z',
    badge: 'MEGA',
    color: 'gold',
  },
  {
    id: 'tour-3',
    publicId: 'EG-T-103',
    name: 'Craftland One-Tap Invitational',
    description: 'High-stakes 1v1 Craftland tournament with custom weapon challenges. Desert Eagle duels only.',
    platform: 'MOBILE ONLY',
    format: '1v1 Duels',
    entryFee: 250,
    prizePool: 10000,
    maxTeams: 64,
    registeredTeams: 64,
    status: 'IN_PROGRESS',
    startAt: '2026-09-20T17:00:00Z',
    badge: 'LIVE',
    color: 'green',
  },
];

const colorMap: Record<string, {
  border: string; glow: string; badge: string; bar: string;
  iconColor: string; pulse: string;
}> = {
  cyan:  { border: 'border-[#00f0ff]/30', glow: 'hover:shadow-[0_0_35px_rgba(0,240,255,0.2)]',   badge: 'bg-[#00f0ff]/15 text-[#00f0ff] border-[#00f0ff]/50',   bar: 'from-[#00f0ff] to-[#0088ff]', iconColor: 'text-[#00f0ff]', pulse: '#00f0ff' },
  gold:  { border: 'border-[#ffbe1a]/30', glow: 'hover:shadow-[0_0_35px_rgba(255,190,26,0.2)]',   badge: 'bg-[#ffbe1a]/15 text-[#ffbe1a] border-[#ffbe1a]/50',   bar: 'from-[#ffbe1a] to-[#f59e0b]', iconColor: 'text-[#ffbe1a]', pulse: '#ffbe1a' },
  green: { border: 'border-[#00ff88]/30', glow: 'hover:shadow-[0_0_35px_rgba(0,255,136,0.2)]',    badge: 'bg-[#00ff88]/15 text-[#00ff88] border-[#00ff88]/50',   bar: 'from-[#00ff88] to-[#00cc66]', iconColor: 'text-[#00ff88]', pulse: '#00ff88' },
};

/* ─── Skeleton Card ─── */
function TournamentSkeleton() {
  return (
    <div className="rounded-2xl border border-white/8 bg-black/60 p-6 animate-pulse">
      <div className="flex items-center justify-between mb-4">
        <div className="h-4 w-24 rounded-full bg-white/10" />
        <div className="h-5 w-20 rounded-full bg-white/8" />
      </div>
      <div className="h-5 w-3/4 rounded-lg bg-white/10 mb-2" />
      <div className="h-3 w-full rounded-lg bg-white/8 mb-1" />
      <div className="h-3 w-5/6 rounded-lg bg-white/8 mb-5" />
      <div className="grid grid-cols-2 gap-2 mb-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-10 rounded-xl bg-white/8" />
        ))}
      </div>
      <div className="h-2 rounded-full bg-white/8 mb-5" />
      <div className="h-11 rounded-2xl bg-white/10" />
    </div>
  );
}

/* ─── Stat Box ─── */
function StatBox({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="p-3 rounded-xl bg-white/5 border border-white/5 text-center">
      <span className="block text-[9px] uppercase font-bold text-gray-600 mb-1 tracking-wider">{label}</span>
      <span className="font-black text-sm" style={{ color }}>{value}</span>
    </div>
  );
}

/* ─── Main Page ─── */
export default function PublicTournamentsPage() {
  const [filter, setFilter] = useState<'ALL' | 'OPEN' | 'LIVE' | 'CUPS'>('ALL');
  const [loading, setLoading] = useState(true);
  const [tournaments, setTournaments] = useState<typeof SAMPLE_TOURNAMENTS>([]);
  const [mounted, setMounted] = useState(false);

  // Simulate initial data load
  const loadData = useCallback(() => {
    setLoading(true);
    setMounted(false);
    const t = setTimeout(() => {
      setTournaments(SAMPLE_TOURNAMENTS);
      setLoading(false);
      // Stagger mount animation
      setTimeout(() => setMounted(true), 50);
    }, 900);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    return loadData();
  }, [loadData]);

  // Reload on filter change (simulated)
  useEffect(() => {
    if (!loading) {
      setMounted(false);
      const t = setTimeout(() => setMounted(true), 150);
      return () => clearTimeout(t);
    }
  }, [filter]);

  const filtered = tournaments.filter((t) => {
    if (filter === 'OPEN') return t.status === 'REGISTRATION_OPEN';
    if (filter === 'LIVE') return t.status === 'IN_PROGRESS';
    if (filter === 'CUPS') return t.format.toLowerCase().includes('4v4') || t.format.toLowerCase().includes('squad');
    return true;
  });

  const LIVE_COUNT = tournaments.filter(t => t.status === 'IN_PROGRESS').length;
  const OPEN_COUNT = tournaments.filter(t => t.status === 'REGISTRATION_OPEN').length;

  return (
    <div className="min-h-screen pb-32 lg:pb-16 pt-20 bg-[#050614] relative overflow-hidden">

      {/* Ambient background orbs */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-[#00f0ff]/6 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/3 -right-32 w-96 h-96 bg-[#a855f7]/6 rounded-full blur-[120px]" />
        <div className="absolute top-2/3 left-1/2 -translate-x-1/2 w-64 h-64 bg-[#ffbe1a]/5 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-3 sm:px-6">

        {/* ─── Hero Banner ─── */}
        <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden border border-[#00f0ff]/25 bg-gradient-to-br from-[#0a1628] via-[#060d20] to-[#080d24] p-5 sm:p-10 mb-6 sm:mb-8 shadow-[0_0_60px_rgba(0,240,255,0.12)] transition-all duration-700">
          {/* Decorative glows */}
          <div className="absolute -top-16 -right-16 w-80 h-80 bg-[#00f0ff]/10 rounded-full blur-[80px] pointer-events-none" />
          <div className="absolute -bottom-8 -left-8  w-48 h-48 bg-[#a855f7]/10 rounded-full blur-[60px] pointer-events-none" />

          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#ffbe1a]/40 bg-[#ffbe1a]/10 text-xs font-black text-[#ffbe1a] mb-4 uppercase tracking-widest">
                <Crown size={13} className="animate-pulse" />
                Championship Series
              </div>
              <h1 className="text-3xl sm:text-5xl font-black text-white italic tracking-tight font-heading mb-3"
                style={{ textShadow: '0 0 30px rgba(0,240,255,0.25)' }}>
                FREE FIRE<br className="sm:hidden" /> TOURNAMENTS
              </h1>
              <p className="text-gray-400 max-w-lg text-xs sm:text-sm leading-relaxed">
                Official bracket cups with verified rosters, EGA referees, live-stream casts, and guaranteed PKR payouts straight to your wallet.
              </p>
            </div>

            {/* Live Stats Badges */}
            <div className="flex sm:flex-col gap-3 shrink-0">
              <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[#00ff88]/30 bg-[#00ff88]/10">
                <span className="w-2 h-2 rounded-full bg-[#00ff88] animate-pulse" />
                <span className="text-xs font-black text-[#00ff88]">{LIVE_COUNT} LIVE NOW</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[#00f0ff]/30 bg-[#00f0ff]/10">
                <Wifi size={13} className="text-[#00f0ff]" />
                <span className="text-xs font-black text-[#00f0ff]">{OPEN_COUNT} OPEN REG</span>
              </div>
            </div>
          </div>
        </div>

        {/* ─── Filter Tabs ─── */}
        <div className="flex items-center gap-2 mb-6 sm:mb-8 overflow-x-auto pb-1 scrollbar-none">
          {[
            { id: 'ALL',  label: 'All Cups',           icon: Star,    count: tournaments.length },
            { id: 'CUPS', label: '🏆 Cup Series',      icon: Trophy,  count: tournaments.filter(t => t.format.toLowerCase().includes('4v4')).length },
            { id: 'OPEN', label: 'Registration Open',  icon: Clock,   count: OPEN_COUNT },
            { id: 'LIVE', label: '🔴 Live Now',        icon: Flame,   count: LIVE_COUNT },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id as any)}
              className={`flex items-center gap-1.5 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl text-[10px] sm:text-xs font-black uppercase tracking-wider transition-all duration-200 whitespace-nowrap border ${
                filter === tab.id
                  ? 'bg-[#00f0ff]/15 text-[#00f0ff] border-[#00f0ff]/50 shadow-[0_0_15px_rgba(0,240,255,0.25)]'
                  : 'bg-white/5 text-gray-500 border-white/10 hover:text-white hover:border-white/25 hover:bg-white/8'
              }`}
            >
              <tab.icon size={11} />
              {tab.label}
              <span className={`px-1.5 py-0.5 rounded-full text-[9px] font-black ${filter === tab.id ? 'bg-[#00f0ff]/30 text-[#00f0ff]' : 'bg-white/10 text-gray-500'}`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* ─── Tournament Cards ─── */}
        {loading ? (
          /* Loading Skeletons */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <TournamentSkeleton key={i} />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          /* Empty State */
          <div className="text-center py-24 border border-dashed border-white/10 rounded-2xl">
            <Trophy size={48} className="mx-auto mb-4 text-gray-700" />
            <p className="text-sm font-bold text-gray-500">No tournaments in this category</p>
            <p className="text-xs text-gray-600 mt-1">Check back soon — new cups are announced every week</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((t, idx) => {
              const cfg = colorMap[t.color] || colorMap.cyan;
              const fillPct = Math.round((t.registeredTeams / t.maxTeams) * 100);
              const isLive = t.status === 'IN_PROGRESS';
              const spotsLeft = t.maxTeams - t.registeredTeams;

              return (
                <div
                  key={t.id}
                  className={`rounded-2xl border ${cfg.border} bg-black/70 backdrop-blur-sm p-4 sm:p-6 flex flex-col justify-between transition-all duration-500 ${cfg.glow} group ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
                  style={{ transitionDelay: `${idx * 100}ms` }}
                >
                  {/* Card Header */}
                  <div className="flex items-start justify-between gap-2 mb-4">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[10px] font-mono font-black text-gray-500 bg-white/8 px-2 py-0.5 rounded-lg border border-white/10">
                        {t.publicId}
                      </span>
                      <span className={`text-[9px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full border ${cfg.badge}`}>
                        {t.badge}
                        {isLive && <span className="ml-1 inline-block w-1.5 h-1.5 rounded-full bg-current animate-ping" />}
                      </span>
                    </div>
                    <span className="text-[10px] text-gray-500 font-mono bg-white/5 px-2 py-0.5 rounded-lg shrink-0">
                      {t.format}
                    </span>
                  </div>

                  {/* Title & Desc */}
                  <h3 className="text-base font-black text-white font-heading mb-2 group-hover:text-glow-cyan transition-all uppercase italic leading-tight">
                    {t.name}
                  </h3>
                  <p className="text-xs text-gray-400 mb-5 leading-relaxed line-clamp-2">{t.description}</p>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 gap-2 mb-4">
                    <StatBox label="Prize Pool" value={formatCurrency(t.prizePool)} color="#ffbe1a" />
                    <StatBox label="Entry Stake" value={formatCurrency(t.entryFee)} color="white" />
                    <StatBox label="Starts" value={new Date(t.startAt).toLocaleDateString('en-PK', { day: 'numeric', month: 'short' })} color="#00f0ff" />
                    <StatBox label="Platform" value="📱 Mobile" color="#00ff88" />
                  </div>

                  {/* Slot Fill Bar */}
                  <div className="mb-5">
                    <div className="flex justify-between text-[10px] mb-1.5">
                      <span className="text-gray-600 flex items-center gap-1">
                        <Users size={10} /> {t.registeredTeams} / {t.maxTeams} teams
                      </span>
                      <span className={`font-bold ${spotsLeft <= 4 ? 'text-red-400' : cfg.iconColor}`}>
                        {isLive ? 'Full · In Progress' : `${spotsLeft} spots left`}
                      </span>
                    </div>
                    <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                      <div
                        className={`h-full rounded-full bg-gradient-to-r ${cfg.bar} transition-all duration-1000`}
                        style={{ width: mounted ? `${fillPct}%` : '0%' }}
                      />
                    </div>
                  </div>

                  {/* CTA Button */}
                  {isLive ? (
                    <div className="flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-[#00ff88]/10 border border-[#00ff88]/30 text-[#00ff88] text-xs font-black">
                      <span className="w-2 h-2 rounded-full bg-[#00ff88] animate-pulse" />
                      Tournament In Progress
                    </div>
                  ) : (
                    <Link
                      href="/dashboard/tournaments"
                      className="group/btn relative w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl text-xs font-black uppercase tracking-wider overflow-hidden transition-all duration-200 hover:scale-[1.02] active:scale-95"
                      style={{
                        background: t.color === 'gold'
                          ? 'linear-gradient(135deg, #ffbe1a, #f59e0b)'
                          : t.color === 'green'
                            ? 'linear-gradient(135deg, #00ff88, #00cc66)'
                            : 'linear-gradient(135deg, #00f0ff, #0088ff)',
                        color: t.color === 'gold' ? '#000' : '#000',
                        boxShadow: `0 0 20px ${cfg.pulse}40`,
                      }}
                    >
                      <Zap size={14} className="fill-black" />
                      Register Squad
                      <ChevronRight size={14} className="transition-transform group-hover/btn:translate-x-1" />
                      {/* Shimmer effect */}
                      <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 translate-x-[-200%] group-hover/btn:translate-x-[200%] transition-transform duration-700" />
                    </Link>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* ─── Bottom CTA ─── */}
        {!loading && (
          <div
            className={`mt-10 rounded-2xl border border-[#ffbe1a]/25 bg-gradient-to-r from-[#ffbe1a]/8 via-black/60 to-[#00f0ff]/8 p-8 text-center transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
            style={{ transitionDelay: '400ms' }}
          >
            <CheckCircle2 className="w-10 h-10 mx-auto mb-3 text-[#ffbe1a]" />
            <h2 className="text-xl font-black text-white mb-2 font-heading">Want to Host a Tournament?</h2>
            <p className="text-gray-400 text-sm mb-6 max-w-sm mx-auto">
              Community cups, guild wars, and college leagues — contact us to run your own official EGA-backed bracket.
            </p>
            <Link href="/register" className="battle-btn-gold inline-flex items-center gap-2 px-8 py-3">
              <Crown size={16} />
              Get Started Free
            </Link>
          </div>
        )}
      </div>

      <MobileBattleNav isLoggedIn={false} />
    </div>
  );
}
