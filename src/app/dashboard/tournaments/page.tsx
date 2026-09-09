'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Trophy,
  Calendar,
  Users,
  Zap,
  CheckCircle2,
  Swords,
  Crown,
  Star,
  Clock,
  ChevronRight,
  Wifi,
  Loader2,
} from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { Reveal, Stagger, StaggerItem } from '@/components/motion';

const TOURNAMENTS = [
  {
    id: 'tour-101',
    publicId: 'EG-T-101',
    name: 'Free Fire Karachi Masters Cup',
    desc: '32-team single-elimination squad championship of Sindh. Best of 3 matches. Official referee oversight.',
    format: '4v4 Clash Squad',
    entryFee: 500,
    prizePool: 25000,
    slotsUsed: 18,
    slotsTotal: 32,
    startAt: 'Oct 15, 2026',
    color: 'cyan',
    badge: 'OPEN',
  },
  {
    id: 'tour-102',
    publicId: 'EG-T-102',
    name: 'All-Pakistan Clash Squad League',
    desc: 'Competitive 4v4 Clash Squad series across all regions. Finals are Best of 5 on live stream.',
    format: '4v4 Clash Squad',
    entryFee: 1000,
    prizePool: 50000,
    slotsUsed: 12,
    slotsTotal: 16,
    startAt: 'Oct 25, 2026',
    color: 'gold',
    badge: 'HOT',
  },
  {
    id: 'tour-103',
    publicId: 'EG-T-103',
    name: 'Sakura Cup 2026 — Season 3',
    desc: '1v1 & 2v2 speed tournament bracket. Fast-paced, high payout rate. Mobile only.',
    format: '1v1 / 2v2 Duels',
    entryFee: 200,
    prizePool: 10000,
    slotsUsed: 28,
    slotsTotal: 64,
    startAt: 'Nov 1, 2026',
    color: 'green',
    badge: 'NEW',
  },
];

const colorMap: Record<
  string,
  { border: string; glow: string; badge: string; btn: string; icon: string; bar: string; pulse: string }
> = {
  cyan: {
    border: 'border-[#00f0ff]/30',
    glow: 'hover:shadow-[0_0_35px_rgba(0,240,255,0.2)]',
    badge: 'bg-[#00f0ff]/15 text-[#00f0ff] border-[#00f0ff]/40',
    btn: 'battle-btn-cyan',
    icon: 'text-[#00f0ff]',
    bar: 'from-[#00f0ff] to-[#0088ff]',
    pulse: '#00f0ff',
  },
  gold: {
    border: 'border-[#ffbe1a]/30',
    glow: 'hover:shadow-[0_0_35px_rgba(255,190,26,0.2)]',
    badge: 'bg-[#ffbe1a]/15 text-[#ffbe1a] border-[#ffbe1a]/40',
    btn: 'battle-btn-gold',
    icon: 'text-[#ffbe1a]',
    bar: 'from-[#ffbe1a] to-[#f59e0b]',
    pulse: '#ffbe1a',
  },
  green: {
    border: 'border-[#00ff88]/30',
    glow: 'hover:shadow-[0_0_35px_rgba(0,255,136,0.2)]',
    badge: 'bg-[#00ff88]/15 text-[#00ff88] border-[#00ff88]/40',
    btn: 'battle-btn-green',
    icon: 'text-[#00ff88]',
    bar: 'from-[#00ff88] to-[#00cc66]',
    pulse: '#00ff88',
  },
};

/* ─── Shimmer Skeleton Card ─── */
function DashboardTournamentSkeleton() {
  return (
    <div className="rounded-2xl border border-white/8 bg-black/60 p-6 animate-pulse space-y-4">
      <div className="flex items-center justify-between">
        <div className="h-4 w-28 rounded-full bg-white/10" />
        <div className="h-5 w-20 rounded-full bg-white/8" />
      </div>
      <div className="h-5 w-2/3 rounded-lg bg-white/10" />
      <div className="h-3 w-full rounded bg-white/8" />
      <div className="grid grid-cols-3 gap-2">
        <div className="h-12 rounded-xl bg-white/5" />
        <div className="h-12 rounded-xl bg-white/5" />
        <div className="h-12 rounded-xl bg-white/5" />
      </div>
      <div className="h-2 rounded-full bg-white/10" />
      <div className="h-10 rounded-xl bg-white/10 w-full" />
    </div>
  );
}

export default function UserTournamentsPage() {
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [registered, setRegistered] = useState<string[]>([]);
  const [registeringId, setRegisteringId] = useState<string | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
      setTimeout(() => setMounted(true), 50);
    }, 700);
    return () => clearTimeout(timer);
  }, []);

  function handleRegister(id: string) {
    setRegisteringId(id);
    setTimeout(() => {
      setRegistered((prev) => [...prev, id]);
      setRegisteringId(null);
      setToastMsg('🎉 Your squad is officially registered! Check notifications for room credentials.');
      setTimeout(() => setToastMsg(null), 4000);
    }, 800);
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-12">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed top-20 right-4 sm:right-8 z-50 p-4 rounded-2xl bg-[#00ff88]/15 border border-[#00ff88]/50 text-[#00ff88] text-xs sm:text-sm font-bold flex items-center gap-2.5 shadow-[0_0_30px_rgba(0,255,136,0.3)] animate-in slide-in-from-top-4 duration-300">
          <CheckCircle2 size={18} className="shrink-0" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Header */}
      <Reveal>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#00f0ff]/30 bg-[#00f0ff]/10 text-[10px] font-black text-[#00f0ff] mb-3 uppercase tracking-widest shadow-[0_0_12px_rgba(0,240,255,0.2)]">
              <Crown size={12} />
              Tournament Mode
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-white font-heading text-glow-cyan">
              Official Tournaments
            </h1>
            <p className="text-sm text-gray-400 mt-1">
              Register your squad &amp; compete for massive PKR prize pools.
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs text-[#00ff88] font-bold font-mono px-3.5 py-1.5 rounded-full border border-[#00ff88]/30 bg-[#00ff88]/10 shadow-[0_0_12px_rgba(0,255,136,0.2)]">
            <Zap size={12} className="text-[#00ff88] animate-pulse" />
            Live Registrations
          </div>
        </div>
      </Reveal>

      {/* Tournament Cards */}
      {loading ? (
        <div className="grid grid-cols-1 gap-5">
          <DashboardTournamentSkeleton />
          <DashboardTournamentSkeleton />
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5">
          {TOURNAMENTS.map((t, idx) => {
            const cfg = colorMap[t.color] || colorMap.cyan;
            const isReg = registered.includes(t.id);
            const isPending = registeringId === t.id;
            const fillPct = Math.round((t.slotsUsed / t.slotsTotal) * 100);
            const spotsLeft = t.slotsTotal - t.slotsUsed;

            return (
              <div
                key={t.id}
                className={`rounded-2xl border ${cfg.border} bg-black/70 backdrop-blur-sm p-6 transition-all duration-500 ${cfg.glow} group ${
                  mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                }`}
                style={{ transitionDelay: `${idx * 120}ms` }}
              >
                <div className="flex flex-col sm:flex-row sm:items-start gap-5">
                  {/* Trophy Icon */}
                  <div
                    className={`w-14 h-14 rounded-2xl border ${cfg.border} bg-black/80 flex items-center justify-center shrink-0 shadow-lg`}
                  >
                    <Trophy size={26} className={cfg.icon} />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black border ${cfg.badge} uppercase tracking-wider`}>
                        {t.badge}
                      </span>
                      <span className="text-[11px] font-mono text-gray-400 border border-white/10 px-2 py-0.5 rounded-full bg-white/5">
                        {t.format}
                      </span>
                      <span className="text-[10px] font-mono text-[#00f0ff] ml-auto sm:ml-0">
                        {t.publicId}
                      </span>
                    </div>

                    <h3 className="text-lg font-black text-white font-heading mb-1 group-hover:text-glow-cyan transition-all">
                      {t.name}
                    </h3>
                    <p className="text-xs text-gray-400 mb-4 leading-relaxed">{t.desc}</p>

                    {/* Stats Row */}
                    <div className="grid grid-cols-3 gap-3 p-3.5 rounded-xl bg-white/5 border border-white/5 text-xs mb-4">
                      <div>
                        <span className="text-gray-500 block text-[9px] uppercase font-bold mb-1">Prize Pool</span>
                        <span className="font-black text-[#ffbe1a] text-sm">{formatCurrency(t.prizePool)}</span>
                      </div>
                      <div>
                        <span className="text-gray-500 block text-[9px] uppercase font-bold mb-1">Entry Stake</span>
                        <span className="font-bold text-white">{formatCurrency(t.entryFee)}</span>
                      </div>
                      <div>
                        <span className="text-gray-500 block text-[9px] uppercase font-bold mb-1">Starts</span>
                        <span className="font-bold text-white flex items-center gap-1 truncate">
                          <Calendar size={11} className={cfg.icon} />
                          {t.startAt}
                        </span>
                      </div>
                    </div>

                    {/* Slots Bar */}
                    <div className="mb-4">
                      <div className="flex justify-between text-[10px] text-gray-500 mb-1.5">
                        <span className="flex items-center gap-1">
                          <Users size={10} />
                          {t.slotsUsed + (isReg ? 1 : 0)} / {t.slotsTotal} teams registered
                        </span>
                        <span className={`font-bold ${spotsLeft <= 5 ? 'text-red-400' : cfg.icon}`}>
                          {spotsLeft - (isReg ? 1 : 0)} spots left
                        </span>
                      </div>
                      <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                        <div
                          className={`h-full rounded-full bg-gradient-to-r ${cfg.bar} transition-all duration-1000`}
                          style={{
                            width: mounted ? `${fillPct}%` : '0%',
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col items-end gap-3 shrink-0 sm:min-w-[140px]">
                    {isReg ? (
                      <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-[#00ff88]/15 border border-[#00ff88]/40 text-[#00ff88] text-xs font-black shadow-[0_0_15px_rgba(0,255,136,0.25)]">
                        <CheckCircle2 size={15} />
                        Registered!
                      </div>
                    ) : (
                      <button
                        onClick={() => handleRegister(t.id)}
                        disabled={isPending}
                        className={`${cfg.btn} flex items-center gap-2 px-5 py-3 text-xs w-full sm:w-auto justify-center active:scale-95 transition-transform disabled:opacity-50`}
                      >
                        {isPending ? (
                          <>
                            <Loader2 size={14} className="animate-spin" />
                            Registering...
                          </>
                        ) : (
                          <>
                            <Swords size={14} />
                            Register Squad
                          </>
                        )}
                      </button>
                    )}
                    <span className="text-[10px] text-gray-500 text-right">
                      Fee: {formatCurrency(t.entryFee)} / squad
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Coming Soon Box */}
      <Reveal delay={0.2}>
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-center">
          <Star size={28} className="mx-auto mb-3 text-gray-500 opacity-50" />
          <p className="text-sm font-bold text-gray-400">More tournaments coming soon</p>
          <p className="text-xs text-gray-600 mt-1">New weekly tournaments announced every Monday at 12:00 PM</p>
        </div>
      </Reveal>
    </div>
  );
}
