'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Swords, Plus, X, Flame, Shield, MapPin, Trophy, Loader2, Sparkles } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

export default function ChallengesDashboardPage() {
  const router = useRouter();
  const [challenges, setChallenges] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [acceptingId, setAcceptingId] = useState<string | null>(null);

  async function loadChallenges() {
    try {
      const res = await fetch('/api/challenges');
      const json = await res.json();
      if (json.data) {
        setChallenges(json.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadChallenges();
  }, []);

  async function handleCancel(id: string) {
    if (!confirm('Cancel this battle stake? Your entry cash will be refunded to your wallet immediately.')) {
      return;
    }
    setCancellingId(id);
    try {
      const res = await fetch(`/api/challenges/${id}/cancel`, { method: 'POST' });
      if (res.ok) {
        loadChallenges();
      } else {
        const err = await res.json();
        alert(err.error || 'Failed to cancel challenge');
      }
    } catch {
      alert('Network error');
    } finally {
      setCancellingId(null);
    }
  }

  async function handleAccept(id: string) {
    if (!confirm('Accept this battle? Your entry stake will be reserved and your match room created!')) {
      return;
    }
    setAcceptingId(id);
    try {
      const res = await fetch(`/api/challenges/${id}/accept`, { method: 'POST' });
      const json = await res.json();
      if (res.ok) {
        router.push(`/dashboard/matches/${json.matchId}`);
      } else {
        alert(json.error || 'Failed to accept challenge');
      }
    } catch {
      alert('Network error');
    } finally {
      setAcceptingId(null);
    }
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-red-950/40 via-[#12071f] to-[#05020c] border border-red-500/20">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-black uppercase tracking-wider mb-2">
            <Flame className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            <span>LIVE BATTLE MARKETPLACE</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white uppercase italic tracking-tight">
            OPEN FIGHTS
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Pick an opponent, lock your entry stake, and jump into the Free Fire room to win cash!
          </p>
        </div>

        <Link href="/dashboard/challenges/create">
          <Button className="w-full sm:w-auto h-12 px-6 battle-btn-red text-white font-black text-xs uppercase tracking-wide shadow-[0_0_20px_rgba(255,32,64,0.4)]">
            <Plus className="w-4 h-4 mr-2 stroke-[3]" /> POST A FIGHT
          </Button>
        </Link>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-24 text-red-500">
          <Loader2 className="w-10 h-10 animate-spin" />
        </div>
      ) : challenges.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-black/40 border border-white/10 space-y-4 max-w-md mx-auto">
          <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto text-red-400">
            <Swords className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-black text-white uppercase italic">NO FIGHTS WAITING</h3>
          <p className="text-xs text-slate-400">
            No challengers are currently online with open stakes. Post your custom rules and take the first challenger!
          </p>
          <Link href="/dashboard/challenges/create">
            <Button className="w-full h-12 battle-btn-red text-white font-black text-xs uppercase tracking-wider">
              CREATE THE FIRST FIGHT
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {challenges.map((c) => (
            <div
              key={c.id}
              className="p-5 rounded-3xl bg-[#0e0717]/90 border border-white/10 hover:border-red-500/50 transition-all flex flex-col justify-between group shadow-lg hover:shadow-[0_0_25px_rgba(255,32,64,0.2)]"
            >
              <div>
                {/* Top Public ID & Status */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-[11px] font-mono font-black text-red-400 bg-red-950/50 px-2.5 py-0.5 rounded-lg border border-red-500/30">
                    {c.publicId}
                  </span>
                  <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                    OPEN
                  </span>
                </div>

                {/* Creator Gamer Tag */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-red-600 to-purple-800 border border-red-400/40 flex items-center justify-center font-black text-white text-sm shadow-[0_0_10px_rgba(255,32,64,0.3)]">
                    {c.creator.displayName.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h4 className="font-black text-white text-sm group-hover:text-red-400 transition-colors uppercase">
                      {c.creator.displayName}
                    </h4>
                    <p className="text-[11px] text-slate-400 font-medium">
                      Rating: <span className="text-amber-400 font-bold">{c.creator.rating}</span> • <span className="text-white font-bold">{c.format}</span>
                    </p>
                  </div>
                </div>

                {/* Match Settings Specs */}
                <div className="grid grid-cols-2 gap-2 p-3 rounded-2xl bg-black/50 border border-white/5 mb-4 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase font-bold block">Game Mode</span>
                    <span className="font-bold text-white truncate block">{c.gameMode?.name || 'Standard'}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase font-bold block">Map</span>
                    <span className="font-bold text-white truncate block flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-cyan-400" />
                      {c.map?.name || 'Bermuda'}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                {/* Stakes & Prize Display */}
                <div className="flex items-center justify-between border-t border-white/10 pt-3 mb-4">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Your Stake</span>
                    <span className="font-black text-white text-base">{formatCurrency(c.entryFee)}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-amber-400 uppercase font-black block flex items-center justify-end gap-1">
                      <Trophy className="w-3 h-3" /> Winner Prize
                    </span>
                    <span className="font-black text-amber-400 text-lg">{formatCurrency(c.prizePool)}</span>
                  </div>
                </div>

                {/* Big Action Buttons */}
                <div className="flex items-center gap-2">
                  <Button
                    onClick={() => handleAccept(c.id)}
                    disabled={acceptingId === c.id}
                    className="flex-1 h-11 battle-btn-red text-white font-black text-xs uppercase tracking-wide"
                  >
                    {acceptingId === c.id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      'ACCEPT FIGHT'
                    )}
                  </Button>

                  <Button
                    variant="secondary"
                    onClick={() => handleCancel(c.id)}
                    disabled={cancellingId === c.id}
                    className="h-11 px-3 bg-red-950/30 hover:bg-red-900/40 text-red-400 border border-red-500/20 rounded-xl"
                    title="Cancel your stake"
                  >
                    {cancellingId === c.id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <X className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

