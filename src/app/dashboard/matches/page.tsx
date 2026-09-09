'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Swords, Eye, Flame, MapPin, Trophy, Shield, Sparkles, CheckCircle2, ChevronRight, Zap } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { Reveal, Stagger, StaggerItem, LiveIndicator } from '@/components/motion';

function MatchesSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="rounded-3xl bg-[#080c1e] border border-white/8 p-6 space-y-4 animate-pulse">
          <div className="flex items-center justify-between">
            <div className="h-4 w-24 rounded-full bg-white/10" />
            <div className="h-5 w-20 rounded-full bg-white/8" />
          </div>
          <div className="h-5 w-3/4 rounded bg-white/10" />
          <div className="grid grid-cols-2 gap-2">
            <div className="h-10 rounded-xl bg-white/5" />
            <div className="h-10 rounded-xl bg-white/5" />
          </div>
          <div className="h-10 rounded-xl bg-white/10 w-full" />
        </div>
      ))}
    </div>
  );
}

export default function UserMatchesPage() {
  const [matches, setMatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadMatches() {
      try {
        const res = await fetch('/api/matches');
        const json = await res.json();
        if (json.data && Array.isArray(json.data)) {
          setMatches(json.data);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadMatches();
  }, []);

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Header Banner */}
      <Reveal>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#060816] via-[#090d22] to-[#060816] border border-[#00f0ff]/30 shadow-[0_0_40px_rgba(0,240,255,0.1)]">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#00f0ff]/10 border border-[#00f0ff]/30 text-[#00f0ff] text-xs font-black uppercase tracking-wider mb-2">
              <Flame className="w-3.5 h-3.5 text-[#00f0ff] animate-pulse" />
              <span>ARENA COMBAT HISTORY</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-white uppercase italic tracking-tight font-heading text-glow-cyan">
              MY MATCHES
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Check live custom room IDs, match codes, opponent UIDs, and victory prize payouts.
            </p>
          </div>

          <Link
            href="/dashboard/challenges"
            className="w-full sm:w-auto battle-btn-cyan py-3.5 px-7 rounded-2xl text-black font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(0,240,255,0.4)] active:scale-95 transition-all shrink-0"
          >
            <Swords className="w-4 h-4" />
            <span>FIND A FIGHT</span>
          </Link>
        </div>
      </Reveal>

      {loading ? (
        <MatchesSkeleton />
      ) : matches.length === 0 ? (
        /* Intentional Empty State */
        <Reveal>
          <div className="p-12 text-center rounded-3xl bg-[#060816] border border-dashed border-white/15 space-y-4 max-w-md mx-auto my-8">
            <div className="w-16 h-16 rounded-3xl bg-[#00f0ff]/10 border border-[#00f0ff]/30 flex items-center justify-center mx-auto text-[#00f0ff] shadow-md">
              <Trophy className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-black text-white uppercase italic font-heading text-glow-cyan">
              NO MATCHES YET
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              You haven&apos;t joined or hosted any matches yet. Browse open fights to stake cash and compete!
            </p>
            <Link
              href="/dashboard/challenges"
              className="w-full battle-btn-green py-3.5 rounded-xl text-black font-black text-xs uppercase tracking-wider inline-flex items-center justify-center gap-2 shadow-lg"
            >
              <Swords size={16} />
              BROWSE OPEN FIGHTS
            </Link>
          </div>
        </Reveal>
      ) : (
        <Stagger className="grid grid-cols-1 md:grid-cols-2 gap-5" staggerDelay={0.08}>
          {matches.map((m) => {
            const isLive = m.status === 'LIVE' || m.status === 'ROOM_ASSIGNED';
            const isCompleted = m.status === 'COMPLETED';

            return (
              <StaggerItem key={m.id}>
                <div className="cyber-card-3d p-6 flex flex-col justify-between space-y-4 border border-white/10 hover:border-[#00f0ff]/50">
                  <div>
                    <div className="flex items-center justify-between mb-3 border-b border-white/10 pb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-black text-[#00f0ff]">
                          {m.publicId}
                        </span>
                        {isLive && <LiveIndicator color="red" label="LIVE" />}
                      </div>
                      <span
                        className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${
                          isCompleted
                            ? 'bg-[#00ff88]/15 text-[#00ff88] border-[#00ff88]/30'
                            : isLive
                            ? 'bg-red-500/15 text-red-400 border-red-500/30'
                            : 'bg-white/5 text-slate-400 border-white/10'
                        }`}
                      >
                        {m.status.replace(/_/g, ' ')}
                      </span>
                    </div>

                    <h3 className="font-bold text-white text-base font-heading mb-1">
                      {m.gameMode?.name || 'Clash Squad'} • {m.format}
                    </h3>
                    <p className="text-xs text-slate-400 flex items-center gap-1.5">
                      <MapPin size={12} className="text-[#00f0ff]" />
                      <span>{m.map?.name || 'Bermuda'}</span>
                    </p>
                  </div>

                  <div>
                    <div className="grid grid-cols-2 gap-2 p-3 rounded-2xl bg-black/60 border border-white/5 text-xs mb-4">
                      <div>
                        <span className="text-[10px] uppercase text-slate-400 block font-medium">Entry Stake</span>
                        <span className="font-bold text-white">{formatCurrency(m.entryFee)}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] uppercase text-[#00ff88] block font-bold">Prize Pool</span>
                        <span className="font-black text-[#00ff88] text-sm font-heading">{formatCurrency(m.prizePool)}</span>
                      </div>
                    </div>

                    <Link
                      href={`/dashboard/matches/${m.id}`}
                      className="w-full battle-btn-cyan py-3 rounded-xl text-xs font-black uppercase tracking-wider text-black flex items-center justify-center gap-2 active:scale-95 transition-all shadow-md"
                    >
                      <Eye size={15} />
                      <span>VIEW MATCH ROOM</span>
                      <ChevronRight size={14} />
                    </Link>
                  </div>
                </div>
              </StaggerItem>
            );
          })}
        </Stagger>
      )}
    </div>
  );
}
