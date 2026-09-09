'use client';

import { useState } from 'react';
import { Users, Plus, Shield, Crown, Swords, X, CheckCircle2, Zap, Trophy } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { Reveal, Stagger, StaggerItem } from '@/components/motion';

const ROLE_COLORS: Record<string, string> = {
  LEADER: 'bg-[#ffbe1a]/15 text-[#ffbe1a] border-[#ffbe1a]/40',
  ACTING_LEADER: 'bg-[#00f0ff]/15 text-[#00f0ff] border-[#00f0ff]/40',
  OFFICER: 'bg-[#a855f7]/15 text-[#a855f7] border-[#a855f7]/40',
  MEMBER: 'bg-white/10 text-gray-300 border-white/20',
};

export default function TeamsDashboardPage() {
  const [showCreate, setShowCreate] = useState(false);
  const [teamName, setTeamName] = useState('');
  const [teamDesc, setTeamDesc] = useState('');

  const [teams, setTeams] = useState<any[]>([
    {
      id: 'team-1',
      name: 'Viper Squad Esports',
      description: 'Official Pakistani 4v4 competitive squad.',
      rating: 2150, wins: 48, losses: 12,
      matchesPlayed: 60, totalEarnings: 132000, memberCount: 6,
      members: [
        { name: 'SniperKing_PK',  role: 'LEADER',  uid: '184920491' },
        { name: 'ShadowNinja_99', role: 'OFFICER', uid: '891048201' },
        { name: 'Faheem_OneTap',  role: 'MEMBER',  uid: '392019481' },
        { name: 'Khan_Destroyer', role: 'MEMBER',  uid: '749201942' },
      ],
    },
  ]);

  function handleCreateTeam(e: React.FormEvent) {
    e.preventDefault();
    if (!teamName.trim()) return;
    setTeams(prev => [...prev, {
      id: `team-${Date.now()}`,
      name: teamName,
      description: teamDesc || 'New competitive esports squad',
      rating: 1000, wins: 0, losses: 0,
      matchesPlayed: 0, totalEarnings: 0, memberCount: 1,
      members: [{ name: 'You (Leader)', role: 'LEADER', uid: '—' }],
    }]);
    setTeamName('');
    setTeamDesc('');
    setShowCreate(false);
  }

  const inputCls = 'w-full px-4 py-3 rounded-xl border border-white/10 bg-white/5 text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#a855f7]/50 transition-all text-sm';

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-8">

      {/* Header */}
      <Reveal>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#a855f7]/30 bg-[#a855f7]/10 text-[10px] font-black text-[#a855f7] mb-3 uppercase tracking-widest">
              <Shield size={12} />Squad Manager
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-white font-heading text-glow-purple">
              Teams &amp; Rosters
            </h1>
            <p className="text-sm text-gray-400 mt-1">
              Build your squad (up to 30 members), manage rosters, and enter team battles.
            </p>
          </div>
          <button
            onClick={() => setShowCreate(true)}
            className="battle-btn-purple flex items-center gap-2 px-5 py-3 text-sm whitespace-nowrap"
          >
            <Plus size={16} />
            Create Team
          </button>
        </div>
      </Reveal>

      {/* Create Team Modal */}
      {showCreate && (
        <Reveal>
          <div className="rounded-2xl border border-[#a855f7]/40 bg-black/80 backdrop-blur-xl p-6 shadow-[0_0_40px_rgba(168,85,247,0.15)]">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-black text-white font-heading text-glow-purple">Create New Squad</h3>
              <button onClick={() => setShowCreate(false)} className="text-gray-500 hover:text-white transition-colors">
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleCreateTeam} className="space-y-4">
              <div>
                <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-2">Squad Name</label>
                <input required value={teamName} onChange={e => setTeamName(e.target.value)} className={inputCls} placeholder="e.g. Apex Predators PK" />
              </div>
              <div>
                <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-2">Description (optional)</label>
                <input value={teamDesc} onChange={e => setTeamDesc(e.target.value)} className={inputCls} placeholder="Your squad motto or region" />
              </div>
              <div className="flex gap-3 justify-end pt-2">
                <button type="button" onClick={() => setShowCreate(false)} className="px-5 py-2.5 rounded-xl border border-white/15 text-sm font-bold text-gray-400 hover:border-white/30 hover:text-white transition-all">
                  Cancel
                </button>
                <button type="submit" className="battle-btn-purple px-6 py-2.5 text-sm flex items-center gap-2">
                  <CheckCircle2 size={15} /> Create Squad
                </button>
              </div>
            </form>
          </div>
        </Reveal>
      )}

      {/* Teams List */}
      <Stagger className="space-y-6" staggerDelay={0.1}>
        {teams.map((t) => {
          const winRate = t.wins + t.losses > 0 ? Math.round((t.wins / (t.wins + t.losses)) * 100) : 0;
          return (
            <StaggerItem key={t.id}>
              <div className="rounded-2xl border border-[#a855f7]/25 bg-black/70 backdrop-blur-sm p-6 hover:border-[#a855f7]/45 transition-all group">

                {/* Team Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 mb-5 border-b border-white/10">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-[#a855f7]/15 border border-[#a855f7]/40 flex items-center justify-center text-[#a855f7] font-black text-lg font-heading shadow-[0_0_15px_rgba(168,85,247,0.25)]">
                      {t.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="text-lg font-black text-white font-heading group-hover:text-glow-purple transition-all">
                        {t.name}
                        <span className="text-xs font-normal text-[#a855f7] font-mono ml-2">({t.memberCount}/30)</span>
                      </h3>
                      <p className="text-xs text-gray-500 mt-0.5">{t.description}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-5 text-xs">
                    <div className="text-center">
                      <span className="text-gray-600 block text-[9px] uppercase font-bold mb-1">ELO</span>
                      <span className="font-black text-white font-heading">{t.rating}</span>
                    </div>
                    <div className="text-center">
                      <span className="text-gray-600 block text-[9px] uppercase font-bold mb-1">Record</span>
                      <span className="font-bold text-[#00ff88]">{t.wins}W / {t.losses}L</span>
                    </div>
                    <div className="text-center">
                      <span className="text-gray-600 block text-[9px] uppercase font-bold mb-1">Win%</span>
                      <span className="font-bold text-[#00f0ff]">{winRate}%</span>
                    </div>
                    <div className="text-center">
                      <span className="text-gray-600 block text-[9px] uppercase font-bold mb-1">Earned</span>
                      <span className="font-black text-[#ffbe1a]">{formatCurrency(t.totalEarnings)}</span>
                    </div>
                  </div>
                </div>

                {/* Roster */}
                <div>
                  <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                    <Users size={12} className="text-[#a855f7]" /> Active Roster
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {t.members.map((m: any, i: number) => (
                      <div
                        key={i}
                        className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all text-xs group/member"
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-full bg-[#a855f7]/20 border border-[#a855f7]/40 flex items-center justify-center text-[#a855f7] font-black text-[10px]">
                            {m.name.slice(0, 1).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-bold text-white text-xs">{m.name}</p>
                            <p className="text-[10px] text-gray-600 font-mono">UID: {m.uid}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-0.5 rounded-full text-[9px] font-black border ${ROLE_COLORS[m.role] || ROLE_COLORS.MEMBER} uppercase tracking-wider`}>
                            {m.role === 'LEADER' ? '👑' : m.role === 'OFFICER' ? '⚡' : ''} {m.role}
                          </span>
                        </div>
                      </div>
                    ))}

                    {/* Add Member Slot */}
                    <button className="flex items-center justify-center gap-2 p-3 rounded-xl border border-dashed border-white/15 text-gray-600 hover:border-[#a855f7]/40 hover:text-[#a855f7] transition-all text-xs">
                      <Plus size={14} /> Invite Player
                    </button>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3 mt-5 pt-4 border-t border-white/10">
                  <button className="battle-btn-purple flex items-center gap-2 px-4 py-2.5 text-xs">
                    <Swords size={13} /> Enter Team Battle
                  </button>
                  <button className="px-4 py-2.5 rounded-xl border border-white/10 text-xs font-bold text-gray-400 hover:border-white/25 hover:text-white transition-all flex items-center gap-2">
                    <Trophy size={13} /> Tournament Register
                  </button>
                </div>
              </div>
            </StaggerItem>
          );
        })}
      </Stagger>

      {teams.length === 0 && (
        <div className="text-center py-20 border border-dashed border-white/10 rounded-2xl">
          <Users size={48} className="mx-auto mb-4 text-gray-700" />
          <p className="text-sm font-bold text-gray-500">No teams yet</p>
          <p className="text-xs text-gray-600 mt-1">Create your first squad to start team battles</p>
        </div>
      )}
    </div>
  );
}
