'use client';

import { useState } from 'react';
import { Shield, Plus, Users, Swords, Trophy, Crown, Zap, X, CheckCircle2 } from 'lucide-react';
import { Reveal, Stagger, StaggerItem } from '@/components/motion';

const INITIAL_GUILDS = [
  {
    id: 'guild-1',
    name: 'Alpha Legion PK',
    tag: 'ALPHA',
    leader: 'SniperKing_PK',
    rating: 2300,
    memberCount: 38,
    maxCapacity: 50,
    gvgWins: 19,
    gvgLosses: 3,
    desc: 'Premier Pakistani guild focusing on 4v4 Guild vs Guild high-stakes clan wars.',
  },
];

export default function GuildsDashboardPage() {
  const [guilds, setGuilds] = useState(INITIAL_GUILDS);
  const [showCreate, setShowCreate] = useState(false);
  const [guildName, setGuildName] = useState('');
  const [guildTag, setGuildTag] = useState('');
  const [guildDesc, setGuildDesc] = useState('');

  function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!guildName.trim()) return;
    setGuilds(prev => [...prev, {
      id: `guild-${Date.now()}`,
      name: guildName,
      tag: (guildTag || guildName.slice(0, 5)).toUpperCase(),
      leader: 'You',
      rating: 1000,
      memberCount: 1,
      maxCapacity: 50,
      gvgWins: 0,
      gvgLosses: 0,
      desc: guildDesc || 'New competitive guild',
    }]);
    setGuildName(''); setGuildTag(''); setGuildDesc('');
    setShowCreate(false);
  }

  const inputCls = 'w-full px-4 py-3 rounded-xl border border-white/10 bg-white/5 text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#ffbe1a]/50 transition-all text-sm';

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-8">

      {/* Header */}
      <Reveal>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#ffbe1a]/30 bg-[#ffbe1a]/10 text-[10px] font-black text-[#ffbe1a] mb-3 uppercase tracking-widest">
              <Shield size={12} />Guild Wars
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-white font-heading text-glow-cyan">
              Guilds &amp; GvG Wars
            </h1>
            <p className="text-sm text-gray-400 mt-1">
              Form a guild, pick your 4v4 war squad, and battle rival clans for permanent GvG dominance.
            </p>
          </div>
          <button
            onClick={() => setShowCreate(true)}
            className="battle-btn-gold flex items-center gap-2 px-5 py-3 text-sm whitespace-nowrap"
          >
            <Plus size={16} /> Register Guild
          </button>
        </div>
      </Reveal>

      {/* Create Form */}
      {showCreate && (
        <Reveal>
          <div className="rounded-2xl border border-[#ffbe1a]/40 bg-black/80 backdrop-blur-xl p-6 shadow-[0_0_40px_rgba(255,190,26,0.12)]">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-black text-white font-heading text-glow-cyan">Register New Guild</h3>
              <button onClick={() => setShowCreate(false)} className="text-gray-500 hover:text-white transition-colors">
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-2">Guild Name</label>
                  <input required value={guildName} onChange={e => setGuildName(e.target.value)} className={inputCls} placeholder="e.g. Shadow Warriors" />
                </div>
                <div>
                  <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-2">Tag (3-5 chars)</label>
                  <input value={guildTag} onChange={e => setGuildTag(e.target.value.toUpperCase())} className={inputCls + ' font-mono'} placeholder="e.g. SHDW" maxLength={5} />
                </div>
              </div>
              <div>
                <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-2">Guild Description</label>
                <input value={guildDesc} onChange={e => setGuildDesc(e.target.value)} className={inputCls} placeholder="Your guild's mission, region, or specialty" />
              </div>
              <div className="flex gap-3 justify-end">
                <button type="button" onClick={() => setShowCreate(false)} className="px-5 py-2.5 rounded-xl border border-white/15 text-sm font-bold text-gray-400 hover:border-white/30 hover:text-white transition-all">
                  Cancel
                </button>
                <button type="submit" className="battle-btn-gold px-6 py-2.5 text-sm flex items-center gap-2">
                  <CheckCircle2 size={15} /> Found Guild
                </button>
              </div>
            </form>
          </div>
        </Reveal>
      )}

      {/* Guild Cards */}
      <Stagger className="space-y-5" staggerDelay={0.1}>
        {guilds.map((g) => {
          const winRate = g.gvgWins + g.gvgLosses > 0
            ? Math.round((g.gvgWins / (g.gvgWins + g.gvgLosses)) * 100)
            : 0;
          const fillPct = Math.round((g.memberCount / g.maxCapacity) * 100);

          return (
            <StaggerItem key={g.id}>
              <div className="rounded-2xl border border-[#ffbe1a]/25 bg-black/70 backdrop-blur-sm p-6 hover:border-[#ffbe1a]/45 hover:shadow-[0_0_30px_rgba(255,190,26,0.12)] transition-all group">

                {/* Guild Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 mb-5 border-b border-white/10">
                  <div className="flex items-center gap-4">
                    {/* Guild Emblem */}
                    <div className="w-14 h-14 rounded-2xl bg-[#ffbe1a]/10 border border-[#ffbe1a]/40 flex items-center justify-center shadow-[0_0_15px_rgba(255,190,26,0.25)]">
                      <Shield size={28} className="text-[#ffbe1a]" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-lg font-black text-white font-heading group-hover:text-glow-cyan transition-all">{g.name}</h3>
                        <span className="px-2 py-0.5 rounded-full bg-[#ffbe1a]/15 text-[#ffbe1a] text-[10px] font-black border border-[#ffbe1a]/40 font-mono">
                          [{g.tag}]
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                        <Crown size={11} className="text-[#ffbe1a]" />{g.leader}
                      </p>
                    </div>
                  </div>

                  {/* Quick Stats */}
                  <div className="flex items-center gap-5 text-xs">
                    <div className="text-center">
                      <span className="text-gray-600 block text-[9px] uppercase font-bold mb-1">ELO</span>
                      <span className="font-black text-white font-heading">{g.rating}</span>
                    </div>
                    <div className="text-center">
                      <span className="text-gray-600 block text-[9px] uppercase font-bold mb-1">GvG W/L</span>
                      <span className="font-bold text-[#00ff88]">{g.gvgWins}W / {g.gvgLosses}L</span>
                    </div>
                    <div className="text-center">
                      <span className="text-gray-600 block text-[9px] uppercase font-bold mb-1">Win%</span>
                      <span className="font-bold text-[#00f0ff]">{winRate}%</span>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <p className="text-xs text-gray-400 mb-5 leading-relaxed">{g.desc}</p>

                {/* Member Bar */}
                <div className="mb-5">
                  <div className="flex justify-between text-[10px] text-gray-500 mb-1.5">
                    <span className="flex items-center gap-1"><Users size={10} />{g.memberCount} / {g.maxCapacity} members</span>
                    <span className="text-[#ffbe1a] font-bold">{g.maxCapacity - g.memberCount} slots open</span>
                  </div>
                  <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-[#ffbe1a] to-[#f59e0b] transition-all"
                      style={{ width: `${fillPct}%` }}
                    />
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3">
                  <button className="battle-btn-gold flex items-center gap-2 px-5 py-2.5 text-xs">
                    <Swords size={13} /> Start GvG War
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/10 text-xs font-bold text-gray-400 hover:border-white/25 hover:text-white transition-all">
                    <Users size={13} /> Invite Members
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/10 text-xs font-bold text-gray-400 hover:border-white/25 hover:text-white transition-all">
                    <Trophy size={13} /> View History
                  </button>
                </div>
              </div>
            </StaggerItem>
          );
        })}
      </Stagger>

      {/* Info Banner */}
      <Reveal delay={0.3}>
        <div className="rounded-xl border border-[#00f0ff]/20 bg-[#00f0ff]/5 p-4 flex items-start gap-3">
          <Zap size={16} className="text-[#00f0ff] shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-black text-[#00f0ff] mb-0.5">What is a Guild?</p>
            <p className="text-xs text-gray-400 leading-relaxed">
              Guilds are persistent competitive clans. Your guild ELO tracks across all GvG wars — build it high to appear on the Guild Leaderboard and unlock exclusive seasonal prizes.
            </p>
          </div>
        </div>
      </Reveal>
    </div>
  );
}
