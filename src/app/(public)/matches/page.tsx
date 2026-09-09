'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import {
  Swords,
  Search,
  Users,
  Trophy,
  Shield,
  Clock,
  ArrowRight,
  Flame,
  Gamepad2,
  CheckCircle2,
  Crosshair,
  Zap,
  Globe,
  Plus,
  RotateCcw,
  ArrowUpDown,
  Filter,
  Sparkles,
  Layers,
} from 'lucide-react';
import { formatCurrency, cn } from '@/lib/utils';
import { MobileBattleNav } from '@/components/navigation/mobile-battle-nav';
import { Reveal, Stagger, StaggerItem, LiveIndicator } from '@/components/motion';

/* ─── 1. FORMAT SELECTORS (EXACT HIERARCHY) ─── */
const FORMAT_OPTIONS = [
  { id: '1v1', label: '1V1', sub: 'DUEL', desc: 'One vs One aim battle', icon: Crosshair, color: '#00F0FF' },
  { id: '2v2', label: '2V2', sub: 'DUO CLASH', desc: 'Duo tactical rush', icon: Swords, color: '#00FF88' },
  { id: '4v4', label: '4V4', sub: 'SQUAD WAR', desc: '4-man Clash Squad', icon: Users, color: '#8B5CF6' },
  { id: '6v6', label: '6V6', sub: 'TEAM WAR', desc: 'Full team showdown', icon: Flame, color: '#1687FF' },
  { id: 'GvG', label: 'GVG', sub: 'GUILD WAR', desc: 'Clan pride & rank', icon: Trophy, color: '#FFBE1B' },
];

/* ─── 2. GAME TYPE CATEGORIES ─── */
const GAME_TYPES = [
  { id: 'ALL', label: 'ALL GAME TYPES' },
  { id: 'BATTLE_ROYALE', label: 'BATTLE ROYALE' },
  { id: 'CRAFTLAND', label: 'CRAFTLAND' },
  { id: 'ESPORTS', label: 'ESPORTS' },
];

/* ─── 3. WEAPON & SPECIAL RULES ─── */
const RULE_FILTERS = [
  { id: 'ALL', label: 'ALL RULES' },
  { id: 'ONE_TAP', label: 'ONE TAP' },
  { id: 'M590', label: 'M590' },
  { id: 'DESERT_EAGLE', label: 'DESERT EAGLE' },
  { id: 'WOODPECKER', label: 'WOODPECKER' },
  { id: 'NADING', label: 'NADING' },
  { id: 'SINGLE_SHOTGUN', label: 'SINGLE SHOTGUN' },
  { id: 'CUSTOM', label: 'CUSTOM' },
];

/* ─── 4. SKELETON LOADERS MATCHING EXACT LAYOUT ─── */
function MatchesPageSkeleton() {
  return (
    <div className="space-y-8 animate-pulse">
      {/* Header Skeleton */}
      <div className="h-44 rounded-3xl bg-[#060816] border border-white/8 p-8 flex flex-col justify-between">
        <div className="space-y-2">
          <div className="h-5 w-36 rounded-full bg-white/10" />
          <div className="h-8 w-64 rounded-lg bg-white/10" />
          <div className="h-4 w-96 rounded bg-white/8" />
        </div>
        <div className="h-8 w-80 rounded-xl bg-white/5" />
      </div>

      {/* Format Selectors Skeleton */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-24 rounded-2xl bg-[#080C1E] border border-white/8 p-4 flex flex-col justify-between" />
        ))}
      </div>

      {/* Filter Rows Skeleton */}
      <div className="space-y-3">
        <div className="h-10 rounded-xl bg-white/5 w-full" />
        <div className="h-10 rounded-xl bg-white/5 w-full" />
        <div className="h-10 rounded-xl bg-white/5 w-full" />
      </div>

      {/* Battle Cards Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="h-72 rounded-3xl bg-[#080C1E] border border-white/8 p-6 flex flex-col justify-between" />
        ))}
      </div>
    </div>
  );
}

export default function PublicMatchesPage() {
  const [challenges, setChallenges] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter States
  const [selectedFormat, setSelectedFormat] = useState<string>('ALL');
  const [selectedGameType, setSelectedGameType] = useState<string>('ALL');
  const [selectedRule, setSelectedRule] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'NEWEST' | 'LOW_ENTRY' | 'HIGH_PRIZE'>('NEWEST');

  useEffect(() => {
    async function loadChallenges() {
      try {
        const res = await fetch('/api/challenges');
        const json = await res.json();
        if (json.data && Array.isArray(json.data)) {
          setChallenges(json.data);
        }
      } catch (err) {
        console.error('Failed to load challenges:', err);
      } finally {
        setLoading(false);
      }
    }
    loadChallenges();
  }, []);

  // Format real challenge counts
  const formatCounts = useMemo(() => {
    const counts: Record<string, number> = { '1v1': 0, '2v2': 0, '4v4': 0, '6v6': 0, GvG: 0 };
    challenges.forEach((c) => {
      const f = c.format;
      if (counts[f] !== undefined) {
        counts[f]++;
      }
    });
    return counts;
  }, [challenges]);

  // Total in-play prize pool
  const totalPrizePool = useMemo(() => {
    return challenges.reduce((sum, c) => sum + (Number(c.prizePool) || 0), 0);
  }, [challenges]);

  // Filter and Sort Logic
  const filteredChallenges = useMemo(() => {
    return challenges
      .filter((c) => {
        // Format filter
        if (selectedFormat !== 'ALL' && c.format !== selectedFormat) return false;

        // Game Type filter (matches category / gameMode)
        if (selectedGameType !== 'ALL') {
          const catName = (c.category?.name || '').toUpperCase().replace(/\s+/g, '_');
          const modeName = (c.gameMode?.name || '').toUpperCase().replace(/\s+/g, '_');
          if (!catName.includes(selectedGameType) && !modeName.includes(selectedGameType)) {
            return false;
          }
        }

        // Rule filter
        if (selectedRule !== 'ALL') {
          const ruleStr = (c.rulesPreview || c.gameMode?.name || '').toUpperCase().replace(/\s+/g, '_');
          if (!ruleStr.includes(selectedRule)) {
            // If rule check is general, allow flexible match
            const mode = (c.gameMode?.name || '').toLowerCase();
            if (!mode.includes(selectedRule.toLowerCase().replace(/_/g, ' '))) {
              return false;
            }
          }
        }

        // Search query (debounced input)
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const pId = (c.publicId || '').toLowerCase();
          const creator = (c.creator?.displayName || '').toLowerCase();
          const mode = (c.gameMode?.name || '').toLowerCase();
          const map = (c.map?.name || '').toLowerCase();
          if (!pId.includes(q) && !creator.includes(q) && !mode.includes(q) && !map.includes(q)) {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'LOW_ENTRY') return Number(a.entryFee) - Number(b.entryFee);
        if (sortBy === 'HIGH_PRIZE') return Number(b.prizePool) - Number(a.prizePool);
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
  }, [challenges, selectedFormat, selectedGameType, selectedRule, searchQuery, sortBy]);

  const hasActiveFilters =
    selectedFormat !== 'ALL' ||
    selectedGameType !== 'ALL' ||
    selectedRule !== 'ALL' ||
    searchQuery !== '';

  function clearAllFilters() {
    setSelectedFormat('ALL');
    setSelectedGameType('ALL');
    setSelectedRule('ALL');
    setSearchQuery('');
  }

  return (
    <div className="min-h-screen py-6 px-2 xs:px-3 sm:px-6 lg:px-8 max-w-7xl mx-auto pt-20 sm:pt-24 pb-32 space-y-6 sm:space-y-8 bg-[#03040B] text-white">
      {/* ─── 1. BATTLE ARENA HEADER & COMPACT STATUS STRIP ─── */}
      <Reveal>
        <div className="relative rounded-3xl overflow-hidden border-2 border-[#00F0FF]/30 bg-gradient-to-r from-[#060816] via-[#090D24] to-[#060816] p-6 sm:p-8 shadow-[0_0_40px_rgba(0,240,255,0.12)]">
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#00F0FF]/12 rounded-full blur-[110px] pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#00FF88]/10 rounded-full blur-[110px] pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#00FF88]/40 bg-[#00FF88]/10 text-xs font-black text-[#00FF88] uppercase tracking-wider">
                  <LiveIndicator color="green" label="LIVE ARENA" />
                </div>
                <span className="text-xs font-mono text-slate-400 font-bold hidden sm:inline">
                  PAKISTAN TIME ZONE (PKT)
                </span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-black text-white italic tracking-tight font-heading text-glow-cyan">
                LIVE BATTLE ARENA
              </h1>

              <p className="text-slate-300 text-xs sm:text-sm max-w-xl leading-relaxed">
                Find an open fight, choose your format, and enter the arena.
              </p>

              {/* Compact Status Strip */}
              <div className="flex flex-wrap items-center gap-4 pt-1 text-xs">
                <div className="flex items-center gap-1.5 font-mono">
                  <span className="text-slate-400">Open Battles:</span>
                  <span className="font-black text-[#00F0FF]">{challenges.length} Active</span>
                </div>
                <span className="text-slate-600 hidden sm:inline">•</span>
                <div className="flex items-center gap-1.5 font-mono">
                  <span className="text-slate-400">Total In Play:</span>
                  <span className="font-black text-[#00FF88]">{formatCurrency(totalPrizePool)}</span>
                </div>
                <span className="text-slate-600 hidden sm:inline">•</span>
                <div className="flex items-center gap-1.5 font-mono">
                  <span className="text-slate-400">Format Modes:</span>
                  <span className="font-black text-[#FFBE1B]">5 Available</span>
                </div>
              </div>
            </div>

            {/* Prominent Action Button (Cyan) */}
            <Link
              href="/dashboard/challenges/create"
              className="battle-btn-cyan py-4 px-8 rounded-2xl font-heading font-black text-[#03040B] text-xs uppercase tracking-wider flex items-center gap-2 shadow-[0_0_25px_rgba(0,240,255,0.4)] active:scale-95 transition-all shrink-0 self-stretch sm:self-auto justify-center"
            >
              <Plus size={16} className="stroke-[3]" />
              <span>+ CREATE CHALLENGE</span>
            </Link>
          </div>
        </div>
      </Reveal>

      {loading ? (
        <MatchesPageSkeleton />
      ) : (
        <>
          {/* ─── 2. QUICK BATTLE FORMAT SELECTOR CARDS ─── */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-widest text-[#00F0FF] flex items-center gap-1.5">
                <Layers size={13} />
                CHOOSE FORMAT
              </span>
              {selectedFormat !== 'ALL' && (
                <button
                  onClick={() => setSelectedFormat('ALL')}
                  className="text-[11px] font-bold text-slate-400 hover:text-white transition-colors"
                >
                  Show All Formats
                </button>
              )}
            </div>

            <div className="grid grid-cols-2 min-[400px]:grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-3">
              {FORMAT_OPTIONS.map((f) => {
                const Icon = f.icon;
                const isSelected = selectedFormat === f.id;
                const count = formatCounts[f.id] || 0;

                return (
                  <button
                    key={f.id}
                    onClick={() => setSelectedFormat(isSelected ? 'ALL' : f.id)}
                    className={cn(
                      'p-4 rounded-2xl border text-left transition-all duration-200 active:scale-[0.98] flex flex-col justify-between group relative overflow-hidden',
                      isSelected
                        ? 'bg-[#00F0FF]/15 border-[#00F0FF] shadow-[0_0_25px_rgba(0,240,255,0.3)]'
                        : 'bg-[#080C1E]/80 border-white/10 hover:border-white/25 hover:bg-[#080C1E]'
                    )}
                    style={{ minHeight: 96 }}
                  >
                    {/* Top Row: Icon + Badge */}
                    <div className="flex items-center justify-between w-full mb-2">
                      <div
                        className="w-8 h-8 rounded-xl flex items-center justify-center border"
                        style={{
                          backgroundColor: `${f.color}15`,
                          borderColor: `${f.color}40`,
                        }}
                      >
                        <Icon size={16} style={{ color: f.color }} />
                      </div>
                      <span
                        className={cn(
                          'text-[9px] font-mono font-bold px-2 py-0.5 rounded-full border',
                          isSelected
                            ? 'bg-[#00F0FF] text-black border-[#00F0FF] font-black'
                            : 'bg-white/5 text-slate-400 border-white/10'
                        )}
                      >
                        {count} OPEN
                      </span>
                    </div>

                    {/* Bottom Row: Title + Subtitle */}
                    <div>
                      <div className="flex items-baseline gap-1.5">
                        <span className="font-heading font-black text-base text-white">{f.label}</span>
                        <span className="text-[10px] font-bold text-slate-400 uppercase">{f.sub}</span>
                      </div>
                      <p className="text-[10px] text-slate-400 truncate">{f.desc}</p>
                    </div>

                    {/* Active Glow Accent */}
                    {isSelected && (
                      <div className="absolute top-0 left-0 right-0 h-[2px] bg-[#00F0FF] shadow-[0_0_10px_#00F0FF]" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* ─── 3. CATEGORY & RULE FILTERS (MULTI-TIERED HIERARCHY) ─── */}
          <div className="space-y-3 p-3 sm:p-5 rounded-2xl sm:rounded-3xl bg-[#060816]/90 border border-white/10 shadow-lg">
            {/* Row 1: GAME TYPE FILTERS */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
                1. GAME TYPE
              </span>
              <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none flex-nowrap">
                {GAME_TYPES.map((gt) => (
                  <button
                    key={gt.id}
                    onClick={() => setSelectedGameType(gt.id)}
                    className={cn(
                      'px-3.5 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap shrink-0 border',
                      selectedGameType === gt.id
                        ? 'bg-[#00F0FF]/20 text-[#00F0FF] border-[#00F0FF] shadow-[0_0_15px_rgba(0,240,255,0.25)]'
                        : 'bg-white/5 border-white/10 text-slate-400 hover:text-white hover:border-white/20'
                    )}
                  >
                    {gt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Row 2: FORMAT PILLS */}
            <div className="space-y-1.5 border-t border-white/5 pt-2.5">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
                2. PRIMARY FORMAT
              </span>
              <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none flex-nowrap">
                <button
                  onClick={() => setSelectedFormat('ALL')}
                  className={cn(
                    'px-3.5 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap shrink-0 border',
                    selectedFormat === 'ALL'
                      ? 'bg-[#00F0FF]/20 text-[#00F0FF] border-[#00F0FF] shadow-[0_0_15px_rgba(0,240,255,0.25)]'
                      : 'bg-white/5 border-white/10 text-slate-400 hover:text-white hover:border-white/20'
                  )}
                >
                  ALL FORMATS
                </button>
                {FORMAT_OPTIONS.map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setSelectedFormat(f.id)}
                    className={cn(
                      'px-3.5 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap shrink-0 border',
                      selectedFormat === f.id
                        ? 'bg-[#00F0FF]/20 text-[#00F0FF] border-[#00F0FF] shadow-[0_0_15px_rgba(0,240,255,0.25)]'
                        : 'bg-white/5 border-white/10 text-slate-400 hover:text-white hover:border-white/20'
                    )}
                  >
                    {f.label} ({f.sub})
                  </button>
                ))}
              </div>
            </div>

            {/* Row 3: WEAPONS & SPECIAL RULES */}
            <div className="space-y-1.5 border-t border-white/5 pt-2.5">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
                3. WEAPON &amp; SPECIAL RULE
              </span>
              <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none flex-nowrap">
                {RULE_FILTERS.map((r) => (
                  <button
                    key={r.id}
                    onClick={() => setSelectedRule(r.id)}
                    className={cn(
                      'px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap shrink-0 border',
                      selectedRule === r.id
                        ? 'bg-[#8B5CF6]/25 text-[#A78BFA] border-[#8B5CF6] shadow-[0_0_15px_rgba(139,92,246,0.25)]'
                        : 'bg-white/5 border-white/10 text-slate-400 hover:text-white hover:border-white/20'
                    )}
                  >
                    {r.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 sm:gap-3 border-t border-white/5 pt-3">
              {/* Search Bar */}
              <div className="relative flex-1 sm:max-w-md">
                <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  placeholder="Search by ID, player, mode or map..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 sm:py-2 rounded-xl border border-white/10 bg-black/60 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-[#00F0FF] transition-colors"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs"
                  >
                    ✕
                  </button>
                )}
              </div>

              {/* Sort & Reset Actions */}
              <div className="flex items-center gap-2 shrink-0">
                <div className="flex items-center gap-1.5 bg-black/60 border border-white/10 px-3 py-2 rounded-xl text-xs flex-1 sm:flex-none">
                  <ArrowUpDown size={13} className="text-[#00F0FF] shrink-0" />
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="bg-transparent text-white text-xs focus:outline-none cursor-pointer w-full sm:w-auto"
                  >
                    <option value="NEWEST" className="bg-[#080C1E] text-white">Newest First</option>
                    <option value="LOW_ENTRY" className="bg-[#080C1E] text-white">Lowest Entry</option>
                    <option value="HIGH_PRIZE" className="bg-[#080C1E] text-white">Highest Prize</option>
                  </select>
                </div>

                {hasActiveFilters && (
                  <button
                    onClick={clearAllFilters}
                    className="px-3 py-2 rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 text-xs font-bold text-slate-300 flex items-center gap-1.5 transition-colors shrink-0"
                  >
                    <RotateCcw size={12} />
                    <span>Reset</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* ─── 4. AVAILABLE BATTLES SECTION ─── */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl sm:text-2xl font-black font-heading uppercase italic text-white flex items-center gap-2">
                  <span>OPEN BATTLES</span>
                  <span className="text-xs font-mono font-bold text-[#00F0FF] bg-[#00F0FF]/10 px-2 py-0.5 rounded-full border border-[#00F0FF]/30">
                    {filteredChallenges.length} AVAILABLE
                  </span>
                </h2>
                <p className="text-xs text-slate-400">Choose your fight.</p>
              </div>
            </div>

            {filteredChallenges.length === 0 ? (
              /* ─── 5. INTENTIONAL EMPTY STATE ─── */
              <div className="text-center py-20 px-6 rounded-3xl border border-dashed border-white/15 bg-[#060816] max-w-xl mx-auto my-6 space-y-4">
                <div className="w-16 h-16 rounded-3xl bg-[#00F0FF]/10 border border-[#00F0FF]/30 flex items-center justify-center mx-auto text-[#00F0FF]">
                  <Gamepad2 size={32} />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-white font-heading uppercase italic mb-1 text-glow-cyan">
                    THE ARENA IS QUIET
                  </h3>
                  <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
                    No fights match these active filters right now. Clear your filters or create a new challenge to set the stakes!
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                  <Link
                    href="/dashboard/challenges/create"
                    className="battle-btn-cyan py-3.5 px-7 rounded-xl text-xs font-black uppercase tracking-wider text-black flex items-center gap-2 shadow-lg"
                  >
                    <Plus size={16} className="stroke-[3]" />
                    CREATE A CHALLENGE
                  </Link>

                  {hasActiveFilters && (
                    <button
                      onClick={clearAllFilters}
                      className="px-6 py-3.5 rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 text-xs font-black uppercase tracking-wider text-slate-300 transition-colors"
                    >
                      CLEAR FILTERS
                    </button>
                  )}
                </div>
              </div>
            ) : (
              /* ─── 6. TACTICAL BATTLE CARDS GRID (ESPORTS HUD CARDS) ─── */
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredChallenges.map((c) => {
                  const is1v1 = c.format === '1v1';
                  const isGvG = c.format === 'GvG';
                  const formatBadgeColor = is1v1
                    ? 'border-[#00F0FF]/40 bg-[#00F0FF]/15 text-[#00F0FF]'
                    : isGvG
                    ? 'border-[#FFBE1B]/40 bg-[#FFBE1B]/15 text-[#FFBE1B]'
                    : 'border-[#8B5CF6]/40 bg-[#8B5CF6]/15 text-[#A78BFA]';

                  return (
                    <div
                      key={c.id}
                      className="rounded-3xl bg-[#080C1E]/95 border border-[#00F0FF]/25 hover:border-[#00F0FF]/60 hover:shadow-[0_0_30px_rgba(0,240,255,0.18)] p-5 sm:p-6 flex flex-col justify-between space-y-4 transition-all duration-300 group relative overflow-hidden"
                    >
                      {/* Scanline overlay */}
                      <div className="absolute inset-0 hud-scanline pointer-events-none opacity-30" />

                      {/* Header Row: Public ID + Status + Format */}
                      <div className="relative z-10 flex items-center justify-between border-b border-white/10 pb-3">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-[#00FF88] animate-pulse" />
                          <span className="text-xs font-mono font-black text-[#00F0FF] tracking-wider">
                            {c.publicId}
                          </span>
                        </div>
                        <span className={cn('px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border', formatBadgeColor)}>
                          {c.format} MATCH
                        </span>
                      </div>

                      {/* Player / Challenger Identity (Privacy Safe) */}
                      <div className="relative z-10 flex items-center gap-3">
                        <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-[#00F0FF] to-[#1687FF] p-0.5 flex items-center justify-center shrink-0 shadow-md">
                          <span className="w-full h-full rounded-[14px] bg-[#050614] flex items-center justify-center text-white font-heading font-black text-xs">
                            {(c.creator?.displayName || 'EG').slice(0, 2).toUpperCase()}
                          </span>
                        </div>
                        <div className="truncate min-w-0">
                          <h3 className="font-heading font-black text-white text-sm truncate group-hover:text-cyan-300 transition-colors">
                            {c.creator?.displayName || 'Challenger'}
                          </h3>
                          <p className="text-[11px] text-slate-400 flex items-center gap-2">
                            <span>Rating: <strong className="text-white font-mono">{c.creator?.profile?.rating || 1000}</strong></span>
                            <span>•</span>
                            <span className="text-[#00FF88] font-semibold">{c.category?.name || 'Mobile'}</span>
                          </p>
                        </div>
                      </div>

                      {/* Mode & Map HUD Box */}
                      <div className="relative z-10 grid grid-cols-2 gap-2 p-3 rounded-2xl bg-black/60 border border-white/5 text-xs">
                        <div>
                          <span className="text-slate-400 text-[10px] uppercase font-bold block">Game Mode</span>
                          <span className="font-bold text-white truncate block">{c.gameMode?.name || 'Clash Squad'}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 text-[10px] uppercase font-bold block">Map</span>
                          <span className="font-bold text-[#00F0FF] truncate block">{c.map?.name || 'Bermuda'}</span>
                        </div>
                      </div>

                      {/* Entry Stake & Prize Pool */}
                      <div className="relative z-10">
                        <div className="flex items-center justify-between border-t border-white/10 pt-3 mb-3">
                          <div>
                            <span className="text-[10px] text-slate-400 uppercase font-medium block">Entry Stake</span>
                            <span className="font-bold text-white text-sm font-mono">{formatCurrency(c.entryFee)}</span>
                          </div>
                          <div className="text-right">
                            <span className="text-[10px] text-[#00FF88] uppercase font-black block">Winner Prize</span>
                            <span className="font-black text-[#00FF88] text-base font-heading text-glow-green">
                              {formatCurrency(c.prizePool)}
                            </span>
                          </div>
                        </div>

                        {/* CTA: ACCEPT FIGHT */}
                        <Link
                          href="/dashboard/challenges"
                          className="w-full battle-btn-cyan py-3.5 rounded-xl text-xs font-heading font-black uppercase tracking-wider text-black flex items-center justify-center gap-2 active:scale-95 transition-all shadow-md"
                        >
                          <Swords size={15} />
                          <span>ACCEPT FIGHT →</span>
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </>
      )}

      {/* Persistent Mobile Bottom Navigation */}
      <MobileBattleNav isLoggedIn={false} />
    </div>
  );
}
