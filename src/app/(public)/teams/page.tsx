'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Shield, Swords, Users, Trophy, TrendingUp, Crown, Zap } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { Reveal, Stagger, StaggerItem } from '@/components/motion';
import { MobileBattleNav } from '@/components/navigation/mobile-battle-nav';

const TEAMS = [
  {
    id: 'team-1',
    name: 'Viper Squad Esports',
    tag: 'VSE',
    leader: 'SniperKing_PK',
    rating: 2150,
    wins: 48,
    losses: 12,
    totalEarnings: 132000,
    memberCount: 6,
    maxMembers: 30,
    desc: 'Premier Pakistani 4v4 competitive squad. Clash Squad specialists.',
    color: 'cyan',
  },
  {
    id: 'team-2',
    name: 'Alpha Legion Clan',
    tag: 'ALC',
    leader: 'ShadowNinja_99',
    rating: 2080,
    wins: 42,
    losses: 16,
    totalEarnings: 98500,
    memberCount: 8,
    maxMembers: 30,
    desc: 'Craftland One-Tap and Clash Squad specialists from Lahore.',
    color: 'purple',
  },
  {
    id: 'team-3',
    name: 'Falcon Warriors PK',
    tag: 'FWP',
    leader: 'Khan_Destroyer',
    rating: 1980,
    wins: 35,
    losses: 18,
    totalEarnings: 69000,
    memberCount: 5,
    maxMembers: 30,
    desc: 'Sindh regional tournament finalists. Known for aggressive rush plays.',
    color: 'green',
  },
  {
    id: 'team-4',
    name: 'Desert Storm Squad',
    tag: 'DSS',
    leader: 'Bullet_Storm',
    rating: 1890,
    wins: 28,
    losses: 22,
    totalEarnings: 47000,
    memberCount: 4,
    maxMembers: 30,
    desc: 'Islamabad-based squad with precision sniping style.',
    color: 'gold',
  },
];

const colorMap: Record<string, { border: string; glow: string; badge: string; btn: string; icon: string }> = {
  cyan:   { border: 'border-[#00f0ff]/30', glow: 'hover:shadow-[0_0_25px_rgba(0,240,255,0.2)]',   badge: 'bg-[#00f0ff]/10 text-[#00f0ff] border-[#00f0ff]/30',   btn: 'battle-btn-cyan',   icon: 'text-[#00f0ff]' },
  purple: { border: 'border-[#a855f7]/30', glow: 'hover:shadow-[0_0_25px_rgba(168,85,247,0.2)]', badge: 'bg-[#a855f7]/10 text-[#a855f7] border-[#a855f7]/30', btn: 'battle-btn-purple', icon: 'text-[#a855f7]' },
  green:  { border: 'border-[#00ff88]/30', glow: 'hover:shadow-[0_0_25px_rgba(0,255,136,0.2)]',  badge: 'bg-[#00ff88]/10 text-[#00ff88] border-[#00ff88]/30',  btn: 'battle-btn-green',  icon: 'text-[#00ff88]' },
  gold:   { border: 'border-[#ffbe1a]/30', glow: 'hover:shadow-[0_0_25px_rgba(255,190,26,0.2)]', badge: 'bg-[#ffbe1a]/10 text-[#ffbe1a] border-[#ffbe1a]/30', btn: 'battle-btn-gold',   icon: 'text-[#ffbe1a]' },
};

export default function PublicTeamsPage() {
  const [search, setSearch] = useState('');
  const filtered = TEAMS.filter(t =>
    t.name.toLowerCase().includes(search.toLowerCase()) ||
    t.tag.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen pb-32 pt-6 px-4 sm:px-6 max-w-6xl mx-auto">

      {/* Header */}
      <Reveal>
        <div className="text-center mb-10 pt-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#a855f7]/40 bg-[#a855f7]/10 text-xs font-black text-[#a855f7] mb-4 uppercase tracking-widest">
            <Shield size={14} />
            Verified Clan Rosters
          </div>
          <h1 className="text-4xl sm:text-6xl font-black text-white italic tracking-tight font-heading text-glow-purple mb-3">
            BATTLE SQUADS
          </h1>
          <p className="text-gray-400 max-w-md mx-auto text-sm">
            Explore Pakistan&apos;s top Free Fire clans, track their records &amp; challenge them to epic squad battles.
          </p>
        </div>
      </Reveal>

      {/* Search */}
      <Reveal delay={0.1}>
        <div className="max-w-sm mx-auto mb-10">
          <input
            type="text"
            placeholder="Search clans by name or tag..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full px-5 py-3 rounded-xl border border-white/10 bg-black/60 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#a855f7]/60 transition-all text-sm"
          />
        </div>
      </Reveal>

      {/* Team Cards Grid */}
      <Stagger className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6" staggerDelay={0.1}>
        {filtered.map((t) => {
          const cfg = colorMap[t.color];
          const winRate = t.wins + t.losses > 0 ? Math.round((t.wins / (t.wins + t.losses)) * 100) : 0;
          return (
            <StaggerItem key={t.id}>
              <div className={`rounded-2xl border ${cfg.border} bg-black/70 backdrop-blur-sm p-6 flex flex-col h-full transition-all duration-300 ${cfg.glow} group`}>

                {/* Team Header */}
                <div className="flex items-center gap-4 mb-5">
                  <div className={`w-14 h-14 rounded-2xl bg-black/80 border ${cfg.border} flex items-center justify-center font-black text-xl font-heading ${cfg.icon} shadow-inner`}>
                    {t.tag}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-black text-white font-heading leading-tight truncate group-hover:text-glow-cyan transition-all">{t.name}</h3>
                    <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                      <Crown size={11} className={cfg.icon} />
                      {t.leader}
                    </p>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-black border ${cfg.badge} uppercase tracking-wider shrink-0`}>
                    ACTIVE
                  </span>
                </div>

                <p className="text-xs text-gray-400 mb-5 leading-relaxed">{t.desc}</p>

                {/* Stats Grid */}
                <div className="grid grid-cols-4 gap-2 p-3 rounded-xl bg-white/5 border border-white/5 text-xs mb-5">
                  <div className="text-center">
                    <span className="text-gray-600 block text-[9px] uppercase font-bold mb-0.5">ELO</span>
                    <span className="font-black text-white font-heading">{t.rating}</span>
                  </div>
                  <div className="text-center">
                    <span className="text-gray-600 block text-[9px] uppercase font-bold mb-0.5">W/L</span>
                    <span className="font-bold text-[#00ff88]">{t.wins}/{t.losses}</span>
                  </div>
                  <div className="text-center">
                    <span className="text-gray-600 block text-[9px] uppercase font-bold mb-0.5">Win%</span>
                    <span className="font-bold text-[#00f0ff]">{winRate}%</span>
                  </div>
                  <div className="text-center">
                    <span className="text-gray-600 block text-[9px] uppercase font-bold mb-0.5">Members</span>
                    <span className="font-semibold text-white">{t.memberCount}</span>
                  </div>
                </div>

                {/* Earnings Bar */}
                <div className="flex items-center justify-between mb-5 text-xs">
                  <span className="text-gray-500 flex items-center gap-1"><Trophy size={11} className="text-[#ffbe1a]" />Total Earned</span>
                  <span className="font-black text-[#ffbe1a]">{formatCurrency(t.totalEarnings)}</span>
                </div>

                {/* Members Progress */}
                <div className="mb-5">
                  <div className="flex items-center justify-between text-[10px] text-gray-500 mb-1.5">
                    <span className="flex items-center gap-1"><Users size={10} />Roster</span>
                    <span>{t.memberCount} / {t.maxMembers} slots</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
                    <div
                      className={`h-full rounded-full bg-gradient-to-r ${t.color === 'cyan' ? 'from-[#00f0ff] to-[#0088ff]' : t.color === 'purple' ? 'from-[#a855f7] to-[#7c3aed]' : t.color === 'green' ? 'from-[#00ff88] to-[#00cc66]' : 'from-[#ffbe1a] to-[#f59e0b]'}`}
                      style={{ width: `${(t.memberCount / t.maxMembers) * 100}%` }}
                    />
                  </div>
                </div>

                {/* CTA */}
                <Link
                  href="/dashboard/challenges/create"
                  className={`${cfg.btn} w-full flex items-center justify-center gap-2 py-3 mt-auto`}
                >
                  <Swords size={14} />
                  Challenge This Squad
                </Link>
              </div>
            </StaggerItem>
          );
        })}
      </Stagger>

      {filtered.length === 0 && (
        <div className="text-center py-20 text-gray-500">
          <Shield size={48} className="mx-auto mb-4 opacity-20" />
          <p className="text-sm">No squads found for &quot;{search}&quot;</p>
        </div>
      )}

      {/* CTA Banner */}
      <Reveal delay={0.4}>
        <div className="mt-12 rounded-2xl border border-[#a855f7]/30 bg-gradient-to-r from-[#a855f7]/10 via-black/60 to-[#00f0ff]/10 p-8 text-center">
          <Zap className="w-10 h-10 mx-auto mb-3 text-[#a855f7]" />
          <h2 className="text-xl font-black text-white mb-2 font-heading">Build Your Own Squad</h2>
          <p className="text-gray-400 text-sm mb-6 max-w-sm mx-auto">
            Create a team, recruit players, and dominate Pakistan&apos;s competitive Free Fire scene.
          </p>
          <Link href="/register" className="battle-btn-purple inline-flex items-center gap-2 px-8 py-3">
            <Users size={16} />
            Create Free Account
          </Link>
        </div>
      </Reveal>

      <MobileBattleNav />
    </div>
  );
}
