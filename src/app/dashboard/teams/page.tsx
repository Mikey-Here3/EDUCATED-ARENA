'use client';

import { useState, useEffect } from 'react';
import { 
  Users, Plus, Shield, Crown, Swords, X, CheckCircle2, 
  AlertCircle, Loader2, Trophy, LogOut, UserPlus, Flame
} from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { Reveal, Stagger, StaggerItem } from '@/components/motion';
import { BattleConfirmModal } from '@/components/ui/battle-confirm-modal';

const ROLE_COLORS: Record<string, string> = {
  LEADER: 'bg-[#ffbe1a]/15 text-[#ffbe1a] border-[#ffbe1a]/40',
  ACTING_LEADER: 'bg-[#00f0ff]/15 text-[#00f0ff] border-[#00f0ff]/40',
  OFFICER: 'bg-[#a855f7]/15 text-[#a855f7] border-[#a855f7]/40',
  MEMBER: 'bg-white/10 text-gray-300 border-white/20',
};

export default function TeamsDashboardPage() {
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const [teams, setTeams] = useState<any[]>([]);
  const [myTeam, setMyTeam] = useState<any | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  const [showCreate, setShowCreate] = useState(false);
  const [teamName, setTeamName] = useState('');
  const [teamDesc, setTeamDesc] = useState('');

  // Fetch real data from API
  async function loadTeams() {
    try {
      const res = await fetch('/api/teams');
      if (res.ok) {
        const json = await res.json();
        setTeams(json.data || []);
        setMyTeam(json.myTeam || null);
        setCurrentUserId(json.currentUserId || null);
      }
    } catch {
      setError('Failed to load teams. Please check your connection.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadTeams();
  }, []);

  // Handle squad creation
  async function handleCreateTeam(e: React.FormEvent) {
    e.preventDefault();
    if (!teamName.trim()) return;
    setActionLoading(true);
    setError('');
    setSuccessMsg('');

    try {
      const res = await fetch('/api/teams', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: teamName.trim(), description: teamDesc.trim() || undefined }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Failed to create squad');
        return;
      }

      setSuccessMsg(`Squad "${teamName}" created successfully!`);
      setTeamName('');
      setTeamDesc('');
      setShowCreate(false);
      await loadTeams();
    } catch {
      setError('Network error while creating squad.');
    } finally {
      setActionLoading(false);
    }
  }

  // Handle joining an existing squad
  async function handleJoinTeam(teamId: string, teamTitle: string) {
    if (myTeam) {
      setError('You are already in a squad! A player can only join 1 squad.');
      return;
    }
    setActionLoading(true);
    setError('');
    setSuccessMsg('');

    try {
      const res = await fetch(`/api/teams/${teamId}/members`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Failed to join squad');
        return;
      }

      setSuccessMsg(`Successfully joined ${teamTitle}!`);
      await loadTeams();
    } catch {
      setError('Network error while joining squad.');
    } finally {
      setActionLoading(false);
    }
  }

  const [leaveModalOpen, setLeaveModalOpen] = useState(false);

  // Handle leaving current squad
  async function executeLeaveTeam() {
    if (!myTeam) return;
    setActionLoading(true);
    setError('');
    setSuccessMsg('');

    try {
      const res = await fetch(`/api/teams/${myTeam.id}/members`, {
        method: 'DELETE',
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Failed to leave squad');
        setLeaveModalOpen(false);
        return;
      }

      setSuccessMsg('You have successfully left the squad.');
      setLeaveModalOpen(false);
      await loadTeams();
    } catch {
      setError('Network error while leaving squad.');
      setLeaveModalOpen(false);
    } finally {
      setActionLoading(false);
    }
  }

  const inputCls = 'w-full px-4 py-3 rounded-xl border border-white/10 bg-white/5 text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#a855f7]/50 transition-all text-sm';

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto py-20 flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-[#00f0ff]" />
        <p className="text-xs text-slate-400 font-semibold tracking-wider uppercase">Loading arena squads...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-12">

      {/* Header */}
      <Reveal>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#00f0ff]/30 bg-[#00f0ff]/10 text-[10px] font-black text-[#00f0ff] mb-3 uppercase tracking-widest">
              <Shield size={12} /> Competitive Esports Squads
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-white font-heading text-glow-purple uppercase tracking-tight">
              Teams &amp; Rosters
            </h1>
            <p className="text-sm text-gray-400 mt-1">
              Join or form a competitive squad (1 squad per player limit), manage your lineup, and compete for real PKR prizes.
            </p>
          </div>

          {!myTeam && (
            <button
              onClick={() => { setError(''); setSuccessMsg(''); setShowCreate(true); }}
              className="battle-btn-purple flex items-center gap-2 px-5 py-3 text-sm whitespace-nowrap"
            >
              <Plus size={16} /> Create Squad
            </button>
          )}
        </div>
      </Reveal>

      {/* Notifications */}
      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-xs text-red-400 font-semibold flex items-center gap-2">
          <AlertCircle size={16} className="shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {successMsg && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-400 font-semibold flex items-center gap-2">
          <CheckCircle2 size={16} className="shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Modal: Create Squad */}
      {showCreate && (
        <Reveal>
          <div className="rounded-2xl border border-[#a855f7]/40 bg-black/90 backdrop-blur-2xl p-6 shadow-[0_0_40px_rgba(168,85,247,0.2)]">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#a855f7]/20 border border-[#a855f7]/40 flex items-center justify-center">
                  <Users size={16} className="text-[#a855f7]" />
                </div>
                <h3 className="text-lg font-black text-white font-heading uppercase">Create New Squad</h3>
              </div>
              <button 
                onClick={() => setShowCreate(false)} 
                className="p-1.5 text-gray-500 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateTeam} className="space-y-4">
              <div>
                <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-2">
                  Squad Name <span className="text-[#a855f7]">*</span>
                </label>
                <input 
                  required 
                  minLength={3}
                  maxLength={30}
                  value={teamName} 
                  onChange={e => setTeamName(e.target.value)} 
                  className={inputCls} 
                  placeholder="e.g. Apex Predators PK" 
                />
              </div>

              <div>
                <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-2">
                  Description / Motto (Optional)
                </label>
                <input 
                  value={teamDesc} 
                  onChange={e => setTeamDesc(e.target.value)} 
                  className={inputCls} 
                  placeholder="e.g. 4v4 Clash Squad Specialists" 
                />
              </div>

              <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-[11px] text-slate-400 leading-relaxed">
                ℹ️ As founder, you will automatically become the <strong>Leader</strong>. A player can only belong to <strong>1 team</strong> at a time.
              </div>

              <div className="flex gap-3 justify-end pt-2">
                <button 
                  type="button" 
                  onClick={() => setShowCreate(false)} 
                  className="px-5 py-2.5 rounded-xl border border-white/15 text-xs font-bold text-gray-400 hover:border-white/30 hover:text-white transition-all"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={actionLoading || !teamName.trim()}
                  className="battle-btn-purple px-6 py-2.5 text-xs flex items-center gap-2 disabled:opacity-50"
                >
                  {actionLoading ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle2 size={14} />}
                  Found Squad
                </button>
              </div>
            </form>
          </div>
        </Reveal>
      )}

      {/* ── SECTION 1: USER'S OWN SQUAD ── */}
      {myTeam ? (
        <Reveal>
          <div className="rounded-2xl border border-[#00f0ff]/40 bg-black/80 backdrop-blur-xl p-6 shadow-[0_0_35px_rgba(0,240,255,0.12)]">
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-5">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-[#00f0ff]/15 border border-[#00f0ff]/40 text-[10px] font-black text-[#00f0ff] uppercase tracking-widest">
                  YOUR ACTIVE SQUAD
                </span>
              </div>
              
              {/* Leave Squad Button */}
              <button
                onClick={() => setLeaveModalOpen(true)}
                disabled={actionLoading}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg border border-red-500/30 bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-bold transition-all disabled:opacity-50 active:scale-95"
              >
                <LogOut size={13} />
                <span>Leave Squad</span>
              </button>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-[#00f0ff]/10 border border-[#00f0ff]/40 flex items-center justify-center shadow-[0_0_15px_rgba(0,240,255,0.3)]">
                  <Shield size={28} className="text-[#00f0ff]" />
                </div>
                <div>
                  <h2 className="text-xl font-black text-white font-heading tracking-wide text-glow-cyan">{myTeam.name}</h2>
                  <p className="text-xs text-slate-400 mt-0.5">{myTeam.description || 'Competitive Free Fire Squad'}</p>
                  <p className="text-[11px] text-[#ffbe1a] font-bold flex items-center gap-1 mt-1">
                    <Crown size={12} /> Leader: {myTeam.leader?.displayName || myTeam.leader?.username}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-5 text-xs bg-white/5 border border-white/10 rounded-xl p-3">
                <div className="text-center px-2">
                  <span className="text-gray-500 block text-[9px] uppercase font-bold">Rating</span>
                  <span className="font-black text-white font-heading text-sm">{Number(myTeam.rating) || 1000}</span>
                </div>
                <div className="text-center px-2 border-l border-white/10">
                  <span className="text-gray-500 block text-[9px] uppercase font-bold">W / L</span>
                  <span className="font-bold text-[#00ff88] text-sm">{myTeam.wins || 0}W / {myTeam.losses || 0}L</span>
                </div>
                <div className="text-center px-2 border-l border-white/10">
                  <span className="text-gray-500 block text-[9px] uppercase font-bold">Earnings</span>
                  <span className="font-bold text-[#ffbe1a] text-sm">{formatCurrency(myTeam.totalEarnings || 0)}</span>
                </div>
              </div>
            </div>

            {/* Roster List */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-black text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Users size={14} className="text-[#00f0ff]" /> Squad Roster ({myTeam.members?.length || 0} / {myTeam.maxMembers || 30})
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {myTeam.members?.map((m: any) => {
                  const isLeader = m.role === 'LEADER';
                  const isYou = m.user?.id === currentUserId;
                  const ign = m.user?.profile?.inGameName || m.user?.displayName || m.user?.username;
                  const uid = m.user?.profile?.freeFireUid;

                  return (
                    <div 
                      key={m.id}
                      className="p-3.5 rounded-xl border border-white/10 bg-white/5 flex items-center justify-between hover:border-white/20 transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center font-bold text-xs text-white">
                          {isLeader ? <Crown size={15} className="text-[#ffbe1a]" /> : <Users size={14} className="text-slate-400" />}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-black text-white">{ign}</span>
                            {isYou && <span className="text-[9px] px-1.5 py-0.2 rounded bg-[#00f0ff]/20 text-[#00f0ff] font-bold">YOU</span>}
                          </div>
                          <span className="text-[10px] text-slate-400 block font-mono">UID: {uid || 'Unset'}</span>
                        </div>
                      </div>

                      <span className={`px-2 py-0.5 rounded text-[9px] font-black border ${ROLE_COLORS[m.role] || ROLE_COLORS.MEMBER}`}>
                        {m.role}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </Reveal>
      ) : (
        /* Empty State: User has no squad */
        <Reveal>
          <div className="rounded-2xl border border-dashed border-white/15 bg-black/40 p-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-[#00f0ff]/10 border border-[#00f0ff]/30 flex items-center justify-center mx-auto text-[#00f0ff]">
              <Users size={32} />
            </div>
            <div className="max-w-md mx-auto">
              <h3 className="text-lg font-black text-white uppercase tracking-wide">You are not in a Squad</h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Join an active arena squad below to participate in 4v4 team battles and tournaments, or found your own squad as team leader.
              </p>
            </div>
            <button
              onClick={() => { setError(''); setSuccessMsg(''); setShowCreate(true); }}
              className="battle-btn-purple inline-flex items-center gap-2 px-6 py-3 text-xs uppercase tracking-wider"
            >
              <Plus size={16} /> Create Your Squad
            </button>
          </div>
        </Reveal>
      )}

      {/* ── SECTION 2: ALL ARENA SQUADS ── */}
      <div className="space-y-4 pt-4">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <h2 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
            <Flame size={16} className="text-[#ffbe1a]" /> All Registered Arena Squads ({teams.length})
          </h2>
          <span className="text-xs text-slate-500 font-bold">1 Team Limit per Player</span>
        </div>

        {teams.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-black/40 p-10 text-center text-slate-400 text-xs">
            <p className="font-semibold text-white mb-1">No squads found in the Arena.</p>
            <p>Click "Create Squad" above to register the first official team!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {teams.map((t) => {
              const isMyTeam = myTeam?.id === t.id;
              const memberCount = t.members?.length ?? t._count?.members ?? 0;
              const maxCap = t.maxMembers || 30;
              const isFull = memberCount >= maxCap;

              return (
                <div 
                  key={t.id}
                  className={`rounded-2xl border p-5 transition-all ${
                    isMyTeam 
                      ? 'border-[#00f0ff]/40 bg-[#00f0ff]/5 shadow-[0_0_20px_rgba(0,240,255,0.08)]' 
                      : 'border-white/10 bg-black/60 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[#00f0ff]">
                        <Shield size={20} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-white text-sm">{t.name}</h4>
                          {isMyTeam && (
                            <span className="px-1.5 py-0.2 rounded bg-[#00f0ff]/20 text-[#00f0ff] text-[9px] font-black">
                              YOURS
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-400">
                          Leader: {t.leader?.displayName || t.leader?.username}
                        </p>
                      </div>
                    </div>

                    <span className="text-xs font-black text-white px-2 py-1 rounded bg-white/5 border border-white/10 font-mono">
                      {Number(t.rating) || 1000} ELO
                    </span>
                  </div>

                  {t.description && (
                    <p className="text-xs text-slate-400 line-clamp-2 mb-4">
                      {t.description}
                    </p>
                  )}

                  <div className="flex items-center justify-between pt-3 border-t border-white/10 text-xs">
                    <span className="text-slate-500 text-[11px] flex items-center gap-1">
                      <Users size={12} /> {memberCount} / {maxCap} members
                    </span>

                    {!myTeam && !isFull && (
                      <button
                        onClick={() => handleJoinTeam(t.id, t.name)}
                        disabled={actionLoading}
                        className="px-3.5 py-1.5 rounded-lg border border-[#00f0ff]/30 bg-[#00f0ff]/10 hover:bg-[#00f0ff]/20 text-[#00f0ff] text-xs font-bold transition-all disabled:opacity-50 flex items-center gap-1.5"
                      >
                        <UserPlus size={13} /> Join Squad
                      </button>
                    )}

                    {isFull && !isMyTeam && (
                      <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                        Squad Full
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── LEAVE SQUAD CYBER DIALOG MODAL ── */}
      <BattleConfirmModal
        isOpen={leaveModalOpen}
        onClose={() => setLeaveModalOpen(false)}
        onConfirm={executeLeaveTeam}
        title="LEAVE SQUAD"
        subtitle={myTeam ? `Are you sure you want to leave ${myTeam.name}?` : undefined}
        confirmText="Yes, Leave Squad"
        cancelText="Stay with Squad"
        variant="danger"
        loading={actionLoading}
      >
        <div className="p-4 rounded-2xl bg-black/60 border border-rose-500/20 text-xs space-y-2">
          <p className="text-slate-300">
            You will forfeit your roster spot in <strong>{myTeam?.name}</strong> and any upcoming team tournaments registered with this squad.
          </p>
          <p className="text-slate-500 text-[11px]">
            You can join or create another squad immediately after leaving.
          </p>
        </div>
      </BattleConfirmModal>
    </div>
  );
}
