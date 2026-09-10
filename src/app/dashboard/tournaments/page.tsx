'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
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
  Wallet,
  AlertCircle,
  X,
  ShieldCheck,
  Flame,
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
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [registered, setRegistered] = useState<string[]>([]);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // User details & live wallet balance
  const [walletBalance, setWalletBalance] = useState<number>(0);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [userTeam, setUserTeam] = useState<any>(null);

  // Modal registration state
  const [selectedTournament, setSelectedTournament] = useState<typeof TOURNAMENTS[0] | null>(null);
  const [regTeamName, setRegTeamName] = useState('');
  const [regLeaderUid, setRegLeaderUid] = useState('');
  const [regLeaderIgn, setRegLeaderIgn] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [regError, setRegError] = useState<string | null>(null);

  useEffect(() => {
    async function loadUserData() {
      try {
        const [meRes, walletRes, teamsRes] = await Promise.all([
          fetch('/api/auth/me', { cache: 'no-store' }),
          fetch('/api/wallet/summary', { cache: 'no-store' }),
          fetch('/api/teams', { cache: 'no-store' }),
        ]);

        if (meRes.ok) {
          const meData = await meRes.json();
          if (meData.user) {
            setCurrentUser(meData.user);
            setRegLeaderUid(meData.user.profile?.freeFireUid || '');
            setRegLeaderIgn(meData.user.profile?.inGameName || meData.user.displayName || '');
          }
        }

        if (walletRes.ok) {
          const wData = await walletRes.json();
          setWalletBalance(wData.available || 0);
        }

        if (teamsRes.ok) {
          const tData = await teamsRes.json();
          if (Array.isArray(tData.data) && tData.data.length > 0) {
            // Pick first team where user is leader or member
            setUserTeam(tData.data[0]);
            setRegTeamName(tData.data[0].name || '');
          }
        }
      } catch (err) {
        console.error('Failed to load user tournament context:', err);
      } finally {
        setLoading(false);
        setMounted(true);
      }
    }

    loadUserData();
  }, []);

  function handleOpenRegisterModal(t: typeof TOURNAMENTS[0]) {
    setSelectedTournament(t);
    setRegError(null);
    if (!regTeamName && userTeam?.name) {
      setRegTeamName(userTeam.name);
    } else if (!regTeamName && currentUser?.displayName) {
      setRegTeamName(`${currentUser.displayName}'s Squad`);
    }
    if (!regLeaderUid && currentUser?.profile?.freeFireUid) {
      setRegLeaderUid(currentUser.profile.freeFireUid);
    }
    if (!regLeaderIgn && (currentUser?.profile?.inGameName || currentUser?.displayName)) {
      setRegLeaderIgn(currentUser.profile.inGameName || currentUser.displayName);
    }
  }

  async function handleConfirmRegistration(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedTournament) return;

    if (!regTeamName.trim()) {
      setRegError('Please provide a squad or team name');
      return;
    }

    if (!regLeaderUid.trim()) {
      setRegError('Please enter the IGL / Leader Free Fire UID');
      return;
    }

    if (walletBalance < selectedTournament.entryFee) {
      setRegError(`Insufficient Battle Cash. You need PKR ${selectedTournament.entryFee} to enter.`);
      return;
    }

    setSubmitting(true);
    setRegError(null);

    try {
      const res = await fetch(`/api/tournaments/${selectedTournament.id}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          teamName: regTeamName.trim(),
          leaderUid: regLeaderUid.trim(),
          leaderIgn: regLeaderIgn.trim(),
          teamId: userTeam?.id || undefined,
        }),
      });

      const json = await res.json();
      if (res.ok) {
        setRegistered((prev) => [...prev, selectedTournament.id]);
        setWalletBalance((prev) => Math.max(0, prev - selectedTournament.entryFee));
        setSelectedTournament(null);
        setToastMsg(json.message || `🎉 Squad "${regTeamName}" registered! PKR ${selectedTournament.entryFee} auto-deducted.`);
        router.refresh();
        setTimeout(() => setToastMsg(null), 5000);
      } else {
        setRegError(json.error || 'Failed to complete tournament registration');
      }
    } catch {
      setRegError('Network error registering for tournament');
    } finally {
      setSubmitting(false);
    }
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

                    <h3 className="text-lg sm:text-xl font-black text-white group-hover:text-glow-cyan transition-colors mb-1">
                      {t.name}
                    </h3>
                    <p className="text-xs text-gray-400 mb-4 line-clamp-2 leading-relaxed">
                      {t.desc}
                    </p>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-3 gap-3 p-3 rounded-xl bg-white/5 border border-white/5 mb-4 text-center">
                      <div>
                        <span className="text-[10px] text-gray-500 uppercase font-mono block">Prize Pool</span>
                        <span className="text-xs sm:text-sm font-black text-[#ffbe1a] font-mono">
                          {formatCurrency(t.prizePool)}
                        </span>
                      </div>
                      <div className="border-x border-white/10">
                        <span className="text-[10px] text-gray-500 uppercase font-mono block">Entry Stake</span>
                        <span className="text-xs sm:text-sm font-black text-white font-mono">
                          {formatCurrency(t.entryFee)}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-gray-500 uppercase font-mono block">Starts</span>
                        <span className="text-xs sm:text-sm font-bold text-gray-300 flex items-center justify-center gap-1">
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
                        onClick={() => handleOpenRegisterModal(t)}
                        className={`${cfg.btn} flex items-center gap-2 px-5 py-3 text-xs w-full sm:w-auto justify-center active:scale-95 transition-transform cursor-pointer`}
                      >
                        <Swords size={14} />
                        Register Squad
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

      {/* ─── Registration Modal ─── */}
      {selectedTournament && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-[#0d0718] border border-cyan-500/40 rounded-3xl p-6 shadow-[0_0_50px_rgba(0,240,255,0.2)] overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                  <Crown size={20} />
                </div>
                <div>
                  <h3 className="text-base font-black text-white uppercase tracking-tight">
                    Squad Registration
                  </h3>
                  <p className="text-xs text-slate-400">{selectedTournament.name}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedTournament(null)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Error Message */}
            {regError && (
              <div className="mb-4 p-3 rounded-xl bg-red-500/15 border border-red-500/30 text-red-400 text-xs flex items-center gap-2 font-semibold">
                <AlertCircle size={15} className="shrink-0" />
                <span>{regError}</span>
              </div>
            )}

            {/* Balance & Auto-Deduct Check */}
            <div className="p-4 rounded-2xl bg-black/60 border border-white/10 mb-4 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                  <Wallet size={14} className="text-emerald-400" /> Your Battle Cash:
                </span>
                <span className="font-black text-emerald-400 text-sm">
                  {formatCurrency(walletBalance)}
                </span>
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400 font-bold uppercase tracking-wider">
                  Entry Fee (Auto-Deducted):
                </span>
                <span className="font-black text-amber-400 text-sm">
                  {formatCurrency(selectedTournament.entryFee)}
                </span>
              </div>

              {walletBalance >= selectedTournament.entryFee ? (
                <div className="pt-2 border-t border-white/10 flex items-center gap-2 text-[11px] text-emerald-300 font-medium">
                  <ShieldCheck size={14} className="shrink-0 text-emerald-400" />
                  <span>Sufficient balance! PKR {selectedTournament.entryFee} will be auto-deducted and held safely in escrow.</span>
                </div>
              ) : (
                <div className="pt-2 border-t border-red-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <span className="text-[11px] text-red-400 font-bold">
                    Need PKR {selectedTournament.entryFee - walletBalance} more to enter.
                  </span>
                  <Link
                    href="/dashboard/wallet?tab=deposit"
                    className="px-3 py-1 bg-emerald-500 hover:bg-emerald-600 text-black font-black text-[11px] rounded-lg text-center transition-colors"
                  >
                    + Add Cash Now
                  </Link>
                </div>
              )}
            </div>

            {/* Registration Form */}
            <form onSubmit={handleConfirmRegistration} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-bold uppercase mb-1.5 text-[11px]">
                  Team / Squad Name <span className="text-cyan-400">*</span>
                </label>
                <input
                  type="text"
                  value={regTeamName}
                  onChange={(e) => setRegTeamName(e.target.value)}
                  placeholder="e.g. Mikey X or Shadow Warriors"
                  className="w-full bg-black/60 border border-white/15 focus:border-cyan-400 rounded-xl px-3.5 py-2.5 text-white outline-none font-semibold transition-all text-xs"
                  required
                />
                <p className="text-[10px] text-slate-500 mt-1">
                  Auto-detected from your team profile. You can edit this name for this tournament cup.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold uppercase mb-1.5 text-[11px]">
                    Leader / IGL Free Fire UID <span className="text-cyan-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={regLeaderUid}
                    onChange={(e) => setRegLeaderUid(e.target.value)}
                    placeholder="e.g. 184920491"
                    className="w-full bg-black/60 border border-white/15 focus:border-cyan-400 rounded-xl px-3.5 py-2.5 text-white outline-none font-mono font-semibold transition-all text-xs"
                    required
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-bold uppercase mb-1.5 text-[11px]">
                    Leader In-Game Name (IGN)
                  </label>
                  <input
                    type="text"
                    value={regLeaderIgn}
                    onChange={(e) => setRegLeaderIgn(e.target.value)}
                    placeholder="e.g. EG_SniperKing"
                    className="w-full bg-black/60 border border-white/15 focus:border-cyan-400 rounded-xl px-3.5 py-2.5 text-white outline-none font-semibold transition-all text-xs"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10 mt-6">
                <button
                  type="button"
                  onClick={() => setSelectedTournament(null)}
                  className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white font-bold text-xs transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting || walletBalance < selectedTournament.entryFee || !regTeamName.trim() || !regLeaderUid.trim()}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-black text-xs uppercase tracking-wide transition-all shadow-[0_0_20px_rgba(0,240,255,0.3)] disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2 cursor-pointer"
                >
                  {submitting ? (
                    <>
                      <Loader2 size={14} className="animate-spin" />
                      Registering...
                    </>
                  ) : (
                    <>
                      <Swords size={14} />
                      1-Click Register ({formatCurrency(selectedTournament.entryFee)})
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
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
