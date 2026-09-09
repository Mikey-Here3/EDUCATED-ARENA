'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { 
  Swords, Plus, Trash2, Flame, Shield, MapPin, 
  Trophy, Loader2, Sparkles, User, CheckCircle2, AlertCircle, RefreshCw
} from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { Reveal } from '@/components/motion';

export default function ChallengesDashboardPage() {
  const router = useRouter();
  const [challenges, setChallenges] = useState<any[]>([]);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [acceptingId, setAcceptingId] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Active filter tab: 'all' | 'my'
  const [activeTab, setActiveTab] = useState<'all' | 'my'>('all');

  async function loadChallenges() {
    try {
      const res = await fetch('/api/challenges');
      const json = await res.json();
      if (json.data) {
        setChallenges(json.data);
      }
      if (json.currentUserId) {
        setCurrentUserId(json.currentUserId);
      }
    } catch (e) {
      console.error(e);
      setError('Failed to fetch live challenges');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadChallenges();
  }, []);

  async function handleCancel(challenge: any) {
    if (!confirm(`Cancel challenge ${challenge.publicId}? Your stake of PKR ${challenge.entryFee} will be instantly refunded to your wallet.`)) {
      return;
    }
    setCancellingId(challenge.id);
    setError('');
    setSuccessMsg('');

    try {
      const res = await fetch(`/api/challenges/${challenge.id}/cancel`, { method: 'POST' });
      const json = await res.json();
      if (res.ok) {
        setSuccessMsg(`Challenge ${challenge.publicId} cancelled. PKR ${challenge.entryFee} refunded to your available balance.`);
        loadChallenges();
      } else {
        setError(json.error || 'Failed to cancel challenge');
      }
    } catch {
      setError('Network error while cancelling challenge');
    } finally {
      setCancellingId(null);
    }
  }

  async function handleAccept(challenge: any) {
    if (!confirm(`Accept battle against ${challenge.creator.displayName}?\n\nEntry Stake: PKR ${challenge.entryFee}\nWinner Prize: PKR ${challenge.prizePool}\n\nYour stake will be locked in escrow and the private match room will be created.`)) {
      return;
    }
    setAcceptingId(challenge.id);
    setError('');
    setSuccessMsg('');

    try {
      const res = await fetch(`/api/challenges/${challenge.id}/accept`, { method: 'POST' });
      const json = await res.json();
      if (res.ok) {
        router.push(`/dashboard/matches/${json.matchId}`);
      } else {
        setError(json.error || 'Failed to accept challenge');
      }
    } catch {
      setError('Network error while accepting challenge');
    } finally {
      setAcceptingId(null);
    }
  }

  // Filtered challenges based on tab
  const myChallenges = challenges.filter(c => currentUserId && c.creator.id === currentUserId);
  const openOpponentChallenges = challenges.filter(c => !currentUserId || c.creator.id !== currentUserId);
  const displayedChallenges = activeTab === 'my' ? myChallenges : openOpponentChallenges;

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-red-950/40 via-[#12071f] to-[#05020c] border border-red-500/20 shadow-[0_0_30px_rgba(255,32,64,0.15)]">
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

      {/* Notifications */}
      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-xs text-red-400 font-semibold flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <AlertCircle size={16} className="shrink-0" />
            <span>{error}</span>
          </div>
          <button onClick={() => setError('')} className="text-red-400 hover:text-white text-xs">Dismiss</button>
        </div>
      )}

      {successMsg && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-400 font-semibold flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={16} className="shrink-0" />
            <span>{successMsg}</span>
          </div>
          <button onClick={() => setSuccessMsg('')} className="text-emerald-400 hover:text-white text-xs">Dismiss</button>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
              activeTab === 'all'
                ? 'bg-red-500/20 text-red-400 border border-red-500/40 shadow-[0_0_15px_rgba(255,32,64,0.2)]'
                : 'text-slate-400 hover:text-white bg-white/5 border border-transparent'
            }`}
          >
            🔥 Open Fights ({openOpponentChallenges.length})
          </button>
          <button
            onClick={() => setActiveTab('my')}
            className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
              activeTab === 'my'
                ? 'bg-[#00f0ff]/20 text-[#00f0ff] border border-[#00f0ff]/40 shadow-[0_0_15px_rgba(0,240,255,0.2)]'
                : 'text-slate-400 hover:text-white bg-white/5 border border-transparent'
            }`}
          >
            🎯 My Posted Fights ({myChallenges.length})
          </button>
        </div>

        <button
          onClick={() => { setLoading(true); loadChallenges(); }}
          className="p-2 rounded-lg bg-white/5 border border-white/10 text-slate-400 hover:text-white transition-colors"
          title="Refresh challenges"
        >
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
        </button>
      </div>

      {/* Challenge Cards Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-24 text-red-500">
          <Loader2 className="w-10 h-10 animate-spin" />
        </div>
      ) : displayedChallenges.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-black/40 border border-white/10 space-y-4 max-w-md mx-auto">
          <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto text-red-400">
            <Swords className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-black text-white uppercase italic">
            {activeTab === 'my' ? 'NO ACTIVE FIGHTS POSTED BY YOU' : 'NO OPPONENT FIGHTS WAITING'}
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            {activeTab === 'my'
              ? 'You have not created any open challenges yet. Click "POST A FIGHT" to configure your rules and entry stake.'
              : 'No challengers are currently online with open stakes. Post your custom rules and take the first challenger!'}
          </p>
          <Link href="/dashboard/challenges/create">
            <Button className="w-full h-12 battle-btn-red text-white font-black text-xs uppercase tracking-wider">
              POST A FIGHT NOW
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {displayedChallenges.map((c) => {
            const isCreator = currentUserId && c.creator.id === currentUserId;

            return (
              <div
                key={c.id}
                className={`p-5 rounded-3xl border transition-all flex flex-col justify-between group shadow-lg ${
                  isCreator
                    ? 'bg-[#0f0a1c]/90 border-[#00f0ff]/30 hover:border-[#00f0ff]/60 hover:shadow-[0_0_25px_rgba(0,240,255,0.15)]'
                    : 'bg-[#0e0717]/90 border-white/10 hover:border-red-500/50 hover:shadow-[0_0_25px_rgba(255,32,64,0.2)]'
                }`}
              >
                <div>
                  {/* Top ID & Status Badge */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-[11px] font-mono font-black text-red-400 bg-red-950/50 px-2.5 py-0.5 rounded-lg border border-red-500/30">
                      {c.publicId}
                    </span>
                    
                    {isCreator ? (
                      <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-[#00f0ff]/15 text-[#00f0ff] border border-[#00f0ff]/40">
                        YOUR FIGHT POST
                      </span>
                    ) : (
                      <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                        OPEN
                      </span>
                    )}
                  </div>

                  {/* Creator Gamer Tag */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-red-600 to-purple-800 border border-red-400/40 flex items-center justify-center font-black text-white text-sm shadow-[0_0_10px_rgba(255,32,64,0.3)]">
                      {c.creator.displayName.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h4 className="font-black text-white text-sm uppercase">
                          {c.creator.displayName}
                        </h4>
                        {isCreator && (
                          <span className="text-[9px] px-1.5 py-0.2 rounded bg-[#00f0ff]/20 text-[#00f0ff] font-bold">
                            YOU
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-400 font-medium">
                        Rating: <span className="text-amber-400 font-bold">{c.creator.rating}</span> • <span className="text-white font-bold">{c.format}</span>
                        {c.platform && <span className="text-slate-500 ml-1">({c.platform})</span>}
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
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">
                        {isCreator ? 'Your Locked Stake' : 'Entry Stake'}
                      </span>
                      <span className="font-black text-white text-base">{formatCurrency(c.entryFee)}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-amber-400 uppercase font-black block flex items-center justify-end gap-1">
                        <Trophy className="w-3 h-3" /> Winner Prize
                      </span>
                      <span className="font-black text-amber-400 text-lg">{formatCurrency(c.prizePool)}</span>
                    </div>
                  </div>

                  {/* Action Buttons: Strictly separated based on whether you are Creator or Opponent */}
                  {isCreator ? (
                    /* Creator sees CANCEL & REFUND button */
                    <Button
                      variant="secondary"
                      onClick={() => handleCancel(c)}
                      disabled={cancellingId === c.id}
                      className="w-full h-11 bg-red-950/40 hover:bg-red-900/60 text-red-300 hover:text-white border border-red-500/30 rounded-xl font-bold text-xs uppercase flex items-center justify-center gap-2 transition-all shadow-[0_0_15px_rgba(239,68,68,0.15)]"
                    >
                      {cancellingId === c.id ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Cancelling Stake...</span>
                        </>
                      ) : (
                        <>
                          <Trash2 className="w-4 h-4 text-red-400" />
                          <span>Cancel &amp; Refund Stake</span>
                        </>
                      )}
                    </Button>
                  ) : (
                    /* Opponent sees ACCEPT FIGHT button (NO CANCEL BUTTON) */
                    <Button
                      onClick={() => handleAccept(c)}
                      disabled={acceptingId === c.id}
                      className="w-full h-11 battle-btn-red text-white font-black text-xs uppercase tracking-wide flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(255,32,64,0.3)]"
                    >
                      {acceptingId === c.id ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Entering Battle...</span>
                        </>
                      ) : (
                        <>
                          <Swords className="w-4 h-4" />
                          <span>ACCEPT FIGHT ({formatCurrency(c.entryFee)})</span>
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
