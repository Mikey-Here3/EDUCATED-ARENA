'use client';

import { useState, useEffect } from 'react';
import { Trophy, Crown, Flame, Star, Zap, Target, TrendingUp, Medal } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { Reveal, Stagger, StaggerItem } from '@/components/motion';
import { MobileBattleNav } from '@/components/navigation/mobile-battle-nav';

const TABS = [
  { key: 'RATING', label: 'ELO Rating', icon: Star },
  { key: 'EARNINGS', label: 'Earnings', icon: TrendingUp },
  { key: 'WIN_RATE', label: 'Win Rate', icon: Target },
];

const SAMPLE: any[] = [
  { rank: 1, name: 'SniperKing_PK',     rating: 2450, earnings: 85400, wins: 142, losses: 18, winRate: 88.7, ffUid: '184920491' },
  { rank: 2, name: 'ShadowNinja_99',    rating: 2380, earnings: 64200, wins: 128, losses: 24, winRate: 84.2, ffUid: '891048201' },
  { rank: 3, name: 'Faheem_OneTap',     rating: 2290, earnings: 51900, wins: 110, losses: 22, winRate: 83.3, ffUid: '392019481' },
  { rank: 4, name: 'Khan_Destroyer',    rating: 2180, earnings: 42000, wins: 98,  losses: 30, winRate: 76.5, ffUid: '749201942' },
  { rank: 5, name: 'ViperSquad_Leader', rating: 2110, earnings: 38500, wins: 89,  losses: 31, winRate: 74.1, ffUid: '629104812' },
  { rank: 6, name: 'Falcon_FreeFire',   rating: 2040, earnings: 31000, wins: 80,  losses: 35, winRate: 69.5, ffUid: '519204810' },
  { rank: 7, name: 'GhostRider_Lahore', rating: 1980, earnings: 28000, wins: 75,  losses: 38, winRate: 66.3, ffUid: '482019401' },
  { rank: 8, name: 'Bullet_Storm',      rating: 1940, earnings: 24500, wins: 68,  losses: 40, winRate: 62.9, ffUid: '910482019' },
  { rank: 9, name: 'Desert_Eagle_PK',   rating: 1900, earnings: 21000, wins: 62,  losses: 42, winRate: 59.6, ffUid: '371920481' },
  { rank: 10, name: 'Rush_B_Karachi',   rating: 1870, earnings: 18500, wins: 58,  losses: 45, winRate: 56.3, ffUid: '204810391' },
];

export default function PublicLeaderboardPage() {
  const [tab, setTab] = useState<'RATING' | 'EARNINGS' | 'WIN_RATE'>('RATING');
  const [category, setCategory] = useState<'1v1' | '2v2' | '4v4' | 'GvG' | 'OVERALL'>('OVERALL');
  const [players, setPlayers] = useState<any[]>(SAMPLE);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        let apiType = 'PLAYER';
        if (category === '2v2' || category === '4v4') apiType = 'TEAM';
        if (category === 'GvG') apiType = 'GUILD';
        
        const res = await fetch(`/api/leaderboard?type=${apiType}`);
        const data = await res.json();
        
        if (data?.data?.length > 0) {
          setPlayers(data.data.map((p: any, i: number) => ({
            rank: i + 1,
            name: p.inGameName || p.name || p.user?.displayName || p.user?.username || 'Unknown',
            rating: Number(p.rating),
            earnings: Number(p.totalEarnings),
            wins: p.wins,
            losses: p.losses,
            winRate: p.matchesPlayed > 0 ? Math.round((p.wins / p.matchesPlayed) * 1000) / 10 : 0,
            ffUid: p.freeFireUid || p.slug || 'N/A',
          })));
        } else {
          setPlayers([]);
        }
      } catch {
        // use sample data if api fails
        setPlayers(SAMPLE);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [category]);

  const sorted = [...players].sort((a, b) => {
    if (tab === 'EARNINGS') return b.earnings - a.earnings;
    if (tab === 'WIN_RATE') return b.winRate - a.winRate;
    return b.rating - a.rating;
  });

  const top3 = sorted.slice(0, 3);
  const rest = sorted.slice(3);

  const PODIUM_ORDER = [top3[1], top3[0], top3[2]]; // Silver, Gold, Bronze display

  const podiumConfig = [
    { border: 'border-[#b0bec5]', glow: 'shadow-[0_0_25px_rgba(176,190,197,0.35)]', ring: 'ring-2 ring-[#b0bec5]/60', badge: '🥈 #2', label: 'text-[#b0bec5]', height: 'h-20' },
    { border: 'border-[#ffbe1a]', glow: 'shadow-[0_0_40px_rgba(255,190,26,0.5)]', ring: 'ring-2 ring-[#ffbe1a]/70', badge: '👑 Champion', label: 'text-[#ffbe1a]', height: 'h-24' },
    { border: 'border-[#cd7f32]', glow: 'shadow-[0_0_20px_rgba(205,127,50,0.35)]', ring: 'ring-2 ring-[#cd7f32]/60', badge: '🥉 #3', label: 'text-[#cd7f32]', height: 'h-16' },
  ];

  return (
    <div className="min-h-screen pb-32 pt-6 px-4 sm:px-6 max-w-5xl mx-auto">

      {/* Header */}
      <Reveal>
        <div className="text-center mb-10 pt-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#ffbe1a]/40 bg-[#ffbe1a]/10 text-xs font-black text-[#ffbe1a] mb-4 uppercase tracking-widest">
            <Crown size={14} />
            Hall of Champions
          </div>
          <h1 className="text-4xl sm:text-6xl font-black text-white italic tracking-tight font-heading text-glow-cyan mb-3">
            LIVE RANKINGS
          </h1>
          <p className="text-gray-400 max-w-md mx-auto text-sm">
            Pakistan&apos;s fiercest Free Fire players ranked by skill, wins &amp; battle earnings.
          </p>
        </div>
      </Reveal>

      {/* Filter Tabs */}
      <Reveal delay={0.1}>
        <div className="flex flex-col items-center gap-4 mb-10">
          {/* Category Tabs */}
          <div className="flex items-center justify-center gap-2 flex-wrap">
            {['OVERALL', '1v1', '2v2', '4v4', 'GvG'].map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat as any)}
                className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider transition-all border ${
                  category === cat
                    ? 'bg-white text-black border-white shadow-[0_0_15px_rgba(255,255,255,0.4)]'
                    : 'border-white/10 bg-transparent text-gray-400 hover:border-white/30 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Sorting Tabs */}
          <div className="flex items-center justify-center gap-2 flex-wrap">
            {TABS.map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setTab(key as any)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-black uppercase tracking-wider transition-all border ${
                  tab === key
                    ? 'bg-[#00f0ff]/15 border-[#00f0ff]/60 text-[#00f0ff] shadow-[0_0_15px_rgba(0,240,255,0.3)]'
                    : 'border-white/10 bg-white/5 text-gray-400 hover:border-white/25 hover:text-white'
                }`}
              >
                <Icon size={13} />
                {label}
              </button>
            ))}
          </div>
        </div>
      </Reveal>

      {/* Podium Top 3 */}
      {top3.length >= 3 && (
        <Reveal delay={0.15}>
          <div className="flex items-end justify-center gap-4 mb-12">
            {PODIUM_ORDER.map((p, idx) => {
              const cfg = podiumConfig[idx];
              if (!p) return null;
              return (
                <div
                  key={p.rank}
                  className={`flex-1 max-w-[180px] rounded-2xl border ${cfg.border} ${cfg.glow} bg-black/70 backdrop-blur-sm p-5 text-center flex flex-col items-center gap-2 transition-transform hover:-translate-y-1`}
                >
                  <div className={`${cfg.height} w-16 rounded-full border-2 ${cfg.border} flex items-center justify-center bg-black/80 text-2xl font-black font-heading ${cfg.label} ${cfg.ring}`}>
                    {p.rank}
                  </div>
                  <div className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/5 border ${cfg.border} ${cfg.label}`}>
                    {cfg.badge}
                  </div>
                  <h3 className="text-sm font-black text-white font-heading leading-tight">{p.name}</h3>
                  <p className="text-[10px] text-gray-500 font-mono">UID: {p.ffUid}</p>
                  <div className="w-full grid grid-cols-1 gap-1 text-xs mt-1">
                    <div className="flex justify-between px-2 py-1 rounded-lg bg-white/5">
                      <span className="text-gray-500">ELO</span>
                      <span className="font-black text-white font-heading">{p.rating}</span>
                    </div>
                    <div className="flex justify-between px-2 py-1 rounded-lg bg-white/5">
                      <span className="text-gray-500">Earned</span>
                      <span className="font-black text-[#ffbe1a]">{formatCurrency(p.earnings)}</span>
                    </div>
                    <div className="flex justify-between px-2 py-1 rounded-lg bg-white/5">
                      <span className="text-gray-500">Win%</span>
                      <span className="font-bold text-[#00ff88]">{p.winRate}%</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Reveal>
      )}

      {/* Ranks 4–10 Table */}
      <Reveal delay={0.25}>
        <div className="rounded-2xl border border-[#00f0ff]/20 bg-black/60 backdrop-blur-sm overflow-hidden shadow-[0_0_30px_rgba(0,240,255,0.08)]">
          <div className="px-5 py-4 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Flame size={16} className="text-[#00f0ff]" />
              <h3 className="text-xs font-black uppercase tracking-widest text-white font-heading">Elite Contenders</h3>
            </div>
            <span className="flex items-center gap-1 text-[11px] text-[#00ff88] font-mono font-bold">
              <Zap size={11} />LIVE
            </span>
          </div>

          {loading ? (
            <div className="p-8 text-center text-gray-500 text-sm">Loading rankings...</div>
          ) : (
            <div className="divide-y divide-white/5">
              {rest.map((p) => (
                <div
                  key={p.rank}
                  className="px-5 py-4 flex items-center justify-between hover:bg-[#00f0ff]/5 transition-colors group"
                >
                  <div className="flex items-center gap-4">
                    <span className="w-8 h-8 rounded-lg bg-black/60 border border-white/10 flex items-center justify-center font-heading font-black text-gray-300 text-xs group-hover:border-[#00f0ff]/40 transition-colors">
                      {p.rank}
                    </span>
                    <div>
                      <h4 className="font-black text-white text-sm font-heading group-hover:text-[#00f0ff] transition-colors">{p.name}</h4>
                      <p className="text-[10px] text-gray-600 font-mono">UID: {p.ffUid}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-6 text-right text-xs">
                    <div className="hidden sm:block">
                      <span className="text-gray-600 text-[10px] block uppercase">Record</span>
                      <span className="font-bold text-white">{p.wins}W / {p.losses}L</span>
                    </div>
                    <div>
                      <span className="text-gray-600 text-[10px] block uppercase">Win%</span>
                      <span className="font-bold text-[#00ff88]">{p.winRate}%</span>
                    </div>
                    <div>
                      <span className="text-gray-600 text-[10px] block uppercase">Earned</span>
                      <span className="font-black text-[#ffbe1a]">{formatCurrency(p.earnings)}</span>
                    </div>
                    <div className="min-w-[50px]">
                      <span className="text-gray-600 text-[10px] block uppercase">ELO</span>
                      <span className="font-black text-white font-heading text-sm">{p.rating}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </Reveal>

      {/* CTA */}
      <Reveal delay={0.35}>
        <div className="mt-10 text-center">
          <p className="text-gray-500 text-xs mb-4">Your rank appears here after your first battle win.</p>
          <a
            href="/dashboard/challenges/create"
            className="battle-btn-cyan inline-flex items-center gap-2 px-8 py-3"
          >
            <Trophy size={16} />
            Enter the Arena
          </a>
        </div>
      </Reveal>

      <MobileBattleNav />
    </div>
  );
}
