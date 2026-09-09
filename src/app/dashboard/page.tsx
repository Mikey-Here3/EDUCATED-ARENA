import Link from 'next/link';
import { getSession } from '@/lib/auth/session';
import prisma from '@/lib/db';
import {
  Wallet,
  Swords,
  Trophy,
  Flame,
  Plus,
  ArrowRight,
  Sparkles,
  Award,
  Zap,
  Gamepad2
} from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { Button } from '@/components/ui/button';

export default async function DashboardOverview() {
  const session = await getSession();

  let wallet = null;
  let profile = null;
  let activeChallenges: any[] = [];
  let userMatches: any[] = [];
  let openChallengesCount = 0;

  if (session?.id) {
    [wallet, profile, activeChallenges, userMatches, openChallengesCount] = await Promise.all([
      prisma.wallet.findUnique({
        where: { userId: session.id },
      }),
      prisma.profile.findUnique({
        where: { userId: session.id },
      }),
      prisma.challenge.findMany({
        where: { status: 'OPEN' },
        take: 4,
        orderBy: { createdAt: 'desc' },
        include: {
          creator: {
            select: { id: true, displayName: true, username: true },
          },
          gameMode: { select: { name: true } },
          map: { select: { name: true } },
        },
      }),
      prisma.match.findMany({
        where: {
          participants: {
            some: { userId: session.id },
          },
        },
        take: 3,
        orderBy: { createdAt: 'desc' },
        include: {
          gameMode: { select: { name: true } },
          map: { select: { name: true } },
          room: true,
          participants: {
            include: {
              user: { select: { id: true, displayName: true, username: true } },
            },
          },
        },
      }),
      prisma.challenge.count({
        where: { status: 'OPEN' },
      }),
    ]);
  }

  const availableCash = Number(wallet?.availableBalance ?? 0);
  const lockedInFights = Number(wallet?.reservedBalance ?? 0);
  const totalWinnings = Number(wallet?.totalWinnings ?? 0);

  const matchesPlayed = profile?.matchesPlayed ?? 0;
  const wins = profile?.wins ?? 0;
  const winRate = matchesPlayed > 0 ? Math.round((wins / matchesPlayed) * 100) : 0;
  const inGameName = profile?.inGameName || session?.displayName || 'Gamer';
  const freeFireUid = profile?.freeFireUid || 'NOT SET';

  return (
    <div className="space-y-6 md:space-y-8 max-w-7xl mx-auto pb-12">
      {/* High-Impact Gamer Command Hero Banner */}
      <div className="relative rounded-3xl overflow-hidden border border-red-500/30 bg-gradient-to-br from-[#12071f] via-[#0d0714] to-[#05020c] p-5 sm:p-7 shadow-[0_0_40px_rgba(255,32,64,0.15)]">
        <div className="absolute -top-24 -right-24 w-72 h-72 bg-gradient-to-br from-red-600/20 to-amber-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-gradient-to-tr from-cyan-600/15 to-purple-600/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/15 border border-red-500/30 text-red-400 text-xs font-black tracking-widest uppercase">
              <Flame className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
              <span>BATTLE HEADQUARTERS</span>
            </div>

            <div>
              <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white uppercase italic">
                WELCOME BACK, <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-amber-400 to-yellow-300">{inGameName}</span>
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 mt-1 font-medium">
                Free Fire Pakistan Pro Arena • Ready to win real PKR cash today?
              </p>
            </div>

            {/* In-Game Credentials Strip */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs pt-1">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-black/60 border border-white/10 text-slate-300">
                <Gamepad2 className="w-3.5 h-3.5 text-cyan-400" />
                <span className="text-slate-400">FF UID:</span>
                <span className="font-mono font-bold text-white">{freeFireUid}</span>
                {freeFireUid === 'NOT SET' && (
                  <Link href="/dashboard/settings" className="ml-1 text-red-400 underline text-[11px] font-bold">
                    Link UID
                  </Link>
                )}
              </div>

              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-black/60 border border-white/10 text-slate-300">
                <Award className="w-3.5 h-3.5 text-amber-400" />
                <span className="text-slate-400">Rating:</span>
                <span className="font-bold text-amber-400">{Number(profile?.rating ?? 1000)} pts</span>
              </div>

              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-black/60 border border-white/10 text-slate-300">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-slate-400">Win Rate:</span>
                <span className="font-bold text-emerald-400">{winRate}% ({wins}W / {profile?.losses ?? 0}L)</span>
              </div>
            </div>
          </div>

          {/* Quick Action Buttons for Gamer Fingers */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <Link href="/dashboard/challenges/create" className="flex-1 sm:flex-none">
              <Button className="w-full h-12 px-6 battle-btn-red text-white font-black tracking-wide uppercase text-sm shadow-[0_0_20px_rgba(255,32,64,0.4)]">
                <Plus className="w-4 h-4 mr-2 stroke-[3]" /> POST A FIGHT
              </Button>
            </Link>

            <Link href="/dashboard/wallet" className="flex-1 sm:flex-none">
              <Button className="w-full h-12 px-6 battle-btn-green text-black font-black tracking-wide uppercase text-sm shadow-[0_0_20px_rgba(0,245,155,0.3)]">
                <Wallet className="w-4 h-4 mr-2 stroke-[2.5]" /> LOAD CASH
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Live Financial & Battle Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Ready Cash */}
        <div className="p-4 sm:p-5 rounded-2xl bg-[#0e0717]/80 border border-emerald-500/20 relative overflow-hidden group hover:border-emerald-500/40 transition-all">
          <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
            <span>READY TO PLAY</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-3xl font-black text-emerald-400 tracking-tight">
            {formatCurrency(availableCash)}
          </div>
          <p className="text-[11px] text-slate-500 mt-1.5 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Instant entry ready
          </p>
        </div>

        {/* Locked In Fights */}
        <div className="p-4 sm:p-5 rounded-2xl bg-[#0e0717]/80 border border-amber-500/20 relative overflow-hidden group hover:border-amber-500/40 transition-all">
          <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
            <span>IN ACTIVE FIGHTS</span>
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <Swords className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-3xl font-black text-amber-400 tracking-tight">
            {formatCurrency(lockedInFights)}
          </div>
          <p className="text-[11px] text-slate-500 mt-1.5">
            Safely held in match escrow
          </p>
        </div>

        {/* Total Cash Won */}
        <div className="p-4 sm:p-5 rounded-2xl bg-[#0e0717]/80 border border-yellow-500/20 relative overflow-hidden group hover:border-yellow-500/40 transition-all">
          <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
            <span>TOTAL WON</span>
            <div className="w-8 h-8 rounded-xl bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center text-yellow-400">
              <Trophy className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-3xl font-black text-yellow-400 tracking-tight">
            {formatCurrency(totalWinnings)}
          </div>
          <p className="text-[11px] text-slate-500 mt-1.5">
            Lifetime arena prize money
          </p>
        </div>

        {/* Active Market Battles */}
        <div className="p-4 sm:p-5 rounded-2xl bg-[#0e0717]/80 border border-red-500/20 relative overflow-hidden group hover:border-red-500/40 transition-all">
          <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
            <span>OPEN BATTLES</span>
            <div className="w-8 h-8 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400">
              <Flame className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-3xl font-black text-red-400 tracking-tight">
            {openChallengesCount}
          </div>
          <p className="text-[11px] text-slate-500 mt-1.5">
            Awaiting challengers right now
          </p>
        </div>
      </div>

      {/* Main Two-Column Battle Command Center */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Side: Open Community Battles (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Swords className="w-5 h-5 text-red-400" />
              <h2 className="text-lg font-black text-white uppercase tracking-wide">
                FIGHT MARKETPLACE
              </h2>
            </div>
            <Link
              href="/dashboard/challenges"
              className="text-xs font-bold text-red-400 hover:text-red-300 flex items-center gap-1 transition-colors"
            >
              See All ({openChallengesCount}) <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {activeChallenges.length === 0 ? (
            <div className="p-8 text-center rounded-2xl bg-black/40 border border-white/5 space-y-3">
              <Swords className="w-10 h-10 text-slate-600 mx-auto" />
              <p className="text-sm text-slate-400 font-medium">No open battles waiting right now.</p>
              <Link href="/dashboard/challenges/create">
                <Button className="battle-btn-red text-white font-bold text-xs uppercase px-4 py-2">
                  Create First Challenge
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3">
              {activeChallenges.map((c) => (
                <div
                  key={c.id}
                  className="p-4 rounded-2xl bg-gradient-to-r from-[#12071f]/90 to-[#0c0414]/90 border border-white/10 hover:border-red-500/40 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono font-black text-red-400 bg-red-950/60 px-2 py-0.5 rounded border border-red-500/30">
                        {c.publicId}
                      </span>
                      <span className="text-xs font-bold text-white uppercase tracking-wide">
                        {c.format} • {c.gameMode?.name}
                      </span>
                      <span className="text-[11px] text-slate-400">
                        ({c.map?.name || 'Bermuda'})
                      </span>
                    </div>

                    <div className="text-xs text-slate-400 flex items-center gap-2">
                      <span>By: <strong className="text-slate-200">{c.creator.displayName}</strong></span>
                      <span>•</span>
                      <span className="text-emerald-400 font-bold">Stake: {formatCurrency(Number(c.entryFee))}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-white/5">
                    <div className="text-left sm:text-right">
                      <span className="text-[10px] text-amber-400 font-bold uppercase block">Prize Money</span>
                      <span className="text-base font-black text-amber-400">{formatCurrency(Number(c.prizePool))}</span>
                    </div>

                    <Link href={`/dashboard/challenges`}>
                      <Button size="sm" className="battle-btn-red text-white font-black text-xs px-4 uppercase">
                        FIGHT
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Side: Your Active / Recent Matches (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-400" />
              <h2 className="text-lg font-black text-white uppercase tracking-wide">
                YOUR MATCHES
              </h2>
            </div>
            <Link
              href="/dashboard/matches"
              className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1 transition-colors"
            >
              Match History <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {userMatches.length === 0 ? (
            <div className="p-8 text-center rounded-2xl bg-black/40 border border-white/5 space-y-3">
              <Trophy className="w-10 h-10 text-slate-600 mx-auto" />
              <p className="text-sm text-slate-400 font-medium">No match history yet.</p>
              <p className="text-xs text-slate-500">Accept an open challenge or post your own to start earning.</p>
              <Link href="/dashboard/challenges">
                <Button className="battle-btn-gold text-black font-bold text-xs uppercase px-4 py-2">
                  Browse Fights
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {userMatches.map((m) => {
                const isLiveOrReady = ['READY', 'LIVE', 'ROOM_ASSIGNED'].includes(m.status);
                return (
                  <div
                    key={m.id}
                    className={`p-4 rounded-2xl border transition-all ${
                      isLiveOrReady
                        ? 'bg-red-950/20 border-red-500/50 shadow-[0_0_20px_rgba(255,32,64,0.2)]'
                        : 'bg-[#0e0717]/80 border-white/10'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-mono font-bold text-slate-400">{m.publicId}</span>
                      <span
                        className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full border ${
                          isLiveOrReady
                            ? 'bg-red-500/20 text-red-300 border-red-500/40 animate-pulse'
                            : m.status === 'COMPLETED'
                            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                            : 'bg-zinc-800 text-slate-300 border-zinc-700'
                        }`}
                      >
                        {m.status.replace('_', ' ')}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs text-slate-300 mb-3">
                      <div>
                        <span className="text-white font-bold">{m.format}</span> • {m.gameMode?.name}
                      </div>
                      <div className="font-bold text-amber-400">
                        Prize: {formatCurrency(Number(m.prizePool))}
                      </div>
                    </div>

                    <Link href={`/dashboard/matches/${m.id}`}>
                      <Button
                        size="sm"
                        className={`w-full text-xs font-black uppercase ${
                          isLiveOrReady
                            ? 'battle-btn-red text-white'
                            : 'bg-white/10 hover:bg-white/20 text-white'
                        }`}
                      >
                        {isLiveOrReady ? 'ENTER MATCH ROOM NOW' : 'VIEW MATCH LOBBY'}
                      </Button>
                    </Link>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
