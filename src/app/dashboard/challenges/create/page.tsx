'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Swords, ArrowLeft, ArrowRight, Shield, Zap, CheckCircle2, AlertCircle, Loader2, Monitor, Smartphone, ChevronDown } from 'lucide-react';
import Link from 'next/link';
import { formatCurrency } from '@/lib/utils';

// ── Types ──────────────────────────────────────────────────────────────────
interface Category { id: string; name: string; slug: string; platform: string; description?: string }
interface GameMode { id: string; name: string; slug: string; description?: string; allowedFormats: string[] }
interface MapItem { id: string; name: string; slug: string }

interface StakePreview {
  entryFee: number;
  opponentEntryFee: number;
  totalPot: number;
  platformFee: number;
  loserRefund: number;
  winnerPrize: number;
  platformFeePercent: number;
}

function calcStakes(entryFee: number): StakePreview {
  const fee = Math.round(entryFee);
  const totalPot = fee * 2;
  const platformFee = Math.round(totalPot * 0.10);
  const loserRefund = 10;
  const winnerPrize = totalPot - platformFee - loserRefund;
  return { entryFee: fee, opponentEntryFee: fee, totalPot, platformFee, loserRefund, winnerPrize, platformFeePercent: 10 };
}

// ── Category → Valid formats (client-side reflection of server config) ──────
const CATEGORY_FORMAT_MAP: Record<string, string[]> = {
  'mobile-esports': ['1v1', '2v2', '4v4'],
  'craftland-custom': ['1v1', '2v2', '3v3', '4v4', '5v5', '6v6'],
  'battle-royale': ['1v1', '2v2', '4v4', '20 Players', '32 Players', '48 Players'],
  'pc-emulator-league': ['1v1', '2v2', '4v4'],
};

const MIN_EXPIRY_MINUTES = 30;

export default function CreateChallengePage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [optionsLoading, setOptionsLoading] = useState(true);

  // Data from server
  const [categories, setCategories] = useState<Category[]>([]);
  const [gameModes, setGameModes] = useState<GameMode[]>([]);
  const [maps, setMaps] = useState<MapItem[]>([]);

  // Wizard state
  const [categoryId, setCategoryId] = useState('');
  const [categorySlug, setCategorySlug] = useState('');
  const [platform, setPlatform] = useState<'MOBILE' | 'PC'>('MOBILE');
  const [format, setFormat] = useState('');
  const [gameModeId, setGameModeId] = useState('');
  const [mapId, setMapId] = useState('');
  const [entryFee, setEntryFee] = useState('200');
  const [visibility, setVisibility] = useState<'PUBLIC' | 'PRIVATE' | 'DIRECT'>('PUBLIC');
  const [expiryHours, setExpiryHours] = useState('24');

  const validFormats = CATEGORY_FORMAT_MAP[categorySlug] || [];
  const stakes = calcStakes(Number(entryFee) || 0);

  // ── Load initial categories ──────────────────────────────────────────────
  useEffect(() => {
    fetch('/api/game-options')
      .then((r) => r.json())
      .then((d) => {
        setCategories(d.categories || []);
        setMaps(d.maps || []);
        // Auto-select first category
        if (d.categories?.length > 0) {
          const first = d.categories[0];
          setCategoryId(first.id);
          setCategorySlug(first.slug);
          setPlatform(first.platform as 'MOBILE' | 'PC');
        }
      })
      .finally(() => setOptionsLoading(false));
  }, []);

  // ── Reload game modes when category or format changes ───────────────────
  useEffect(() => {
    if (!categoryId) return;
    const params = new URLSearchParams({ categoryId });
    if (format) params.set('format', format);
    
    setGameModeId(''); // Reset mode when category/format changes

    fetch(`/api/game-options?${params}`)
      .then((r) => r.json())
      .then((d) => {
        setGameModes(d.gameModes || []);
      });
  }, [categoryId, format]);

  // ── Reload maps when game mode changes ──────────────────────────────────
  useEffect(() => {
    if (!gameModeId) return;
    setMapId(''); // Reset map when mode changes

    fetch(`/api/game-options?gameModeId=${gameModeId}`)
      .then((r) => r.json())
      .then((d) => {
        setMaps(d.maps || []);
        if (d.maps?.length === 1) setMapId(d.maps[0].id); // Auto-select single map
      });
  }, [gameModeId]);

  // ── When category changes ────────────────────────────────────────────────
  const handleCategorySelect = (cat: Category) => {
    setCategoryId(cat.id);
    setCategorySlug(cat.slug);
    setPlatform(cat.platform as 'MOBILE' | 'PC');
    // Clear dependent selections
    setFormat('');
    setGameModeId('');
    setMapId('');
  };

  // ── When format changes ──────────────────────────────────────────────────
  const handleFormatSelect = (fmt: string) => {
    setFormat(fmt);
    // Clear dependent selections
    setGameModeId('');
    setMapId('');
  };

  // ── Validate step 1 ──────────────────────────────────────────────────────
  const step1Valid = categoryId && format && gameModeId;
  const step2Valid = mapId && Number(entryFee) >= 100;

  // ── Submit ───────────────────────────────────────────────────────────────
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!step1Valid || !step2Valid) return;
    setLoading(true);
    setError('');

    // Validate expiry client-side
    const expiryMins = Number(expiryHours) * 60;
    if (expiryMins < MIN_EXPIRY_MINUTES) {
      setError('Challenge must be open for at least 30 minutes.');
      setLoading(false);
      return;
    }

    const expiresAt = new Date(Date.now() + expiryMins * 60 * 1000).toISOString();

    try {
      const res = await fetch('/api/challenges', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          categoryId,
          gameModeId,
          mapId,
          format,
          platform,
          entryFee: Math.round(Number(entryFee)),
          visibility,
          expiresAt,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Failed to create challenge');
        setLoading(false);
        return;
      }

      router.push('/dashboard/challenges');
    } catch {
      setError('Network error submitting challenge');
      setLoading(false);
    }
  }

  const selectedCategory = categories.find((c) => c.id === categoryId);
  const selectedMode = gameModes.find((m) => m.id === gameModeId);
  const selectedMap = maps.find((m) => m.id === mapId);

  if (optionsLoading) {
    return (
      <div className="max-w-3xl mx-auto flex items-center justify-center min-h-64">
        <Loader2 className="w-8 h-8 animate-spin text-violet-400" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-16">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link href="/dashboard/challenges" className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-slate-400 hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">Post a Fight</h1>
          <p className="text-xs sm:text-sm text-slate-400">Configure game settings, rules, and your entry stake</p>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          {error}
        </div>
      )}

      {/* Progress Steps */}
      <div className="flex items-center gap-2 text-xs font-bold">
        {[
          { num: 1, label: 'Category & Mode' },
          { num: 2, label: 'Map & Stakes' },
          { num: 3, label: 'Review & Publish' },
        ].map((s, i) => (
          <div key={s.num} className="flex items-center gap-2 flex-1">
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black shrink-0 transition-all ${
              step >= s.num ? 'bg-violet-600 text-white shadow-[0_0_12px_rgba(124,58,237,0.5)]' : 'bg-zinc-800 text-slate-500'
            }`}>
              {step > s.num ? <CheckCircle2 className="w-4 h-4" /> : s.num}
            </div>
            <span className={`hidden sm:inline transition-colors ${step >= s.num ? 'text-violet-300' : 'text-slate-500'}`}>{s.label}</span>
            {i < 2 && <div className="h-px flex-1 bg-zinc-800 hidden sm:block" />}
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit}>
        {/* ─── STEP 1: Category, Format, Game Mode ─────────────────────── */}
        {step === 1 && (
          <div className="space-y-5">
            {/* Category */}
            <div className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-4">
              <h3 className="text-sm font-black text-white uppercase tracking-wider">1. Select Category</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => handleCategorySelect(cat)}
                    className={`p-4 rounded-xl border text-left transition-all ${
                      categoryId === cat.id
                        ? 'border-violet-500 bg-violet-500/10 shadow-[0_0_15px_rgba(124,58,237,0.2)]'
                        : 'border-zinc-800 bg-black/40 hover:border-zinc-600'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      {cat.platform === 'PC' ? (
                        <Monitor className="w-4 h-4 text-cyan-400" />
                      ) : (
                        <Smartphone className="w-4 h-4 text-emerald-400" />
                      )}
                      <h4 className="font-bold text-white text-sm">{cat.name}</h4>
                    </div>
                    <p className="text-xs text-slate-400">{cat.description}</p>
                    <span className={`inline-block mt-2 px-2 py-0.5 rounded text-[10px] font-bold ${
                      cat.platform === 'PC' ? 'bg-cyan-900/60 text-cyan-300' : 'bg-emerald-900/60 text-emerald-300'
                    }`}>
                      {cat.platform === 'PC' ? '💻 PC / Emulator' : '📱 Mobile'}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Format — only shows valid formats for selected category */}
            <div className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-black text-white uppercase tracking-wider">2. Match Format</h3>
                <span className="text-xs text-slate-500">{selectedCategory?.name || 'Select a category'}</span>
              </div>
              {validFormats.length === 0 ? (
                <p className="text-xs text-slate-500 italic">Select a category above to see available formats.</p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {validFormats.map((fmt) => (
                    <button
                      key={fmt}
                      type="button"
                      onClick={() => handleFormatSelect(fmt)}
                      className={`px-4 py-2.5 rounded-xl font-bold text-xs border transition-all ${
                        format === fmt
                          ? 'border-violet-500 bg-violet-500/20 text-white shadow-[0_0_10px_rgba(124,58,237,0.3)]'
                          : 'border-zinc-700 bg-black/40 text-slate-400 hover:text-white hover:border-zinc-600'
                      }`}
                    >
                      {fmt}
                    </button>
                  ))}
                </div>
              )}
              {format && (
                <p className="text-[11px] text-violet-400">
                  ✓ {format} selected
                </p>
              )}
            </div>

            {/* Game Mode — filtered by category + format */}
            <div className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-3">
              <h3 className="text-sm font-black text-white uppercase tracking-wider">3. Game Mode</h3>
              {!format ? (
                <p className="text-xs text-slate-500 italic">Select a format above to see compatible game modes.</p>
              ) : gameModes.length === 0 ? (
                <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300">
                  No game modes available for <strong>{format}</strong> in <strong>{selectedCategory?.name}</strong>. 
                  Contact an admin to add modes for this combination.
                </div>
              ) : (
                <div className="space-y-2">
                  {gameModes.map((mode) => (
                    <button
                      key={mode.id}
                      type="button"
                      onClick={() => setGameModeId(mode.id)}
                      className={`w-full p-3 rounded-xl border text-left transition-all flex items-center justify-between ${
                        gameModeId === mode.id
                          ? 'border-violet-500 bg-violet-500/10'
                          : 'border-zinc-800 bg-black/40 hover:border-zinc-600'
                      }`}
                    >
                      <div>
                        <h5 className="font-bold text-white text-sm">{mode.name}</h5>
                        <p className="text-xs text-slate-400">{mode.description}</p>
                      </div>
                      {gameModeId === mode.id && <CheckCircle2 className="w-5 h-5 text-violet-400 shrink-0" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={() => setStep(2)}
              disabled={!step1Valid}
              className="w-full py-4 rounded-xl font-black text-sm bg-gradient-to-r from-violet-600 to-indigo-600 text-white hover:opacity-90 transition-all flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(124,58,237,0.3)]"
            >
              Continue to Map & Stakes <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* ─── STEP 2: Map, Entry Fee, Visibility, Expiry ──────────────── */}
        {step === 2 && (
          <div className="space-y-5">
            {/* Map */}
            <div className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-3">
              <h3 className="text-sm font-black text-white uppercase tracking-wider">Select Map</h3>
              {maps.length === 0 ? (
                <p className="text-xs text-slate-500 italic">No maps configured for this game mode.</p>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {maps.map((map) => (
                    <button
                      key={map.id}
                      type="button"
                      onClick={() => setMapId(map.id)}
                      className={`p-4 rounded-xl border text-center font-bold text-sm transition-all ${
                        mapId === map.id
                          ? 'border-violet-500 bg-violet-500/20 text-white shadow-[0_0_12px_rgba(124,58,237,0.3)]'
                          : 'border-zinc-800 bg-black/40 text-slate-400 hover:text-white hover:border-zinc-600'
                      }`}
                    >
                      {map.name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Entry Fee */}
            <div className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-4">
              <h3 className="text-sm font-black text-white uppercase tracking-wider">Entry Stake (PKR)</h3>
              <div className="grid grid-cols-4 gap-2">
                {['100', '200', '500', '1000'].map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setEntryFee(val)}
                    className={`py-3 rounded-xl text-xs font-bold border transition-all ${
                      entryFee === val
                        ? 'border-emerald-500 bg-emerald-500/20 text-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.2)]'
                        : 'border-zinc-800 bg-black/40 text-slate-400 hover:border-zinc-600 hover:text-white'
                    }`}
                  >
                    PKR {val}
                  </button>
                ))}
              </div>
              <input
                type="number"
                min="100"
                step="10"
                value={entryFee}
                onChange={(e) => setEntryFee(e.target.value)}
                className="w-full bg-black/50 border border-zinc-700 rounded-xl px-4 py-3 text-white text-sm focus:border-violet-500 focus:outline-none transition-all"
                placeholder="Custom amount (min PKR 100)"
              />

              {/* Stakes Preview — from the same server-side calculation */}
              {Number(entryFee) >= 100 && (
                <div className="rounded-xl bg-gradient-to-br from-violet-900/20 to-indigo-900/20 border border-violet-800/40 p-4 space-y-2 text-xs">
                  <p className="text-[10px] text-violet-400 font-bold uppercase tracking-wider mb-3">💰 Match Financials Preview</p>
                  <div className="flex justify-between text-slate-300">
                    <span>Your Entry Fee</span>
                    <span className="font-bold text-white">{formatCurrency(stakes.entryFee)}</span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>Opponent Entry Fee</span>
                    <span className="font-bold text-white">{formatCurrency(stakes.opponentEntryFee)}</span>
                  </div>
                  <div className="flex justify-between text-slate-400 border-t border-violet-800/30 pt-2">
                    <span>Total Match Stakes</span>
                    <span className="font-bold text-white">{formatCurrency(stakes.totalPot)}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Platform Fee ({stakes.platformFeePercent}%)</span>
                    <span className="text-red-400">- {formatCurrency(stakes.platformFee)}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Losing Side Refund</span>
                    <span className="text-blue-400">- {formatCurrency(stakes.loserRefund)}</span>
                  </div>
                  <div className="flex justify-between border-t border-violet-800/40 pt-2">
                    <span className="font-black text-violet-300 uppercase text-[11px]">🏆 Winner Prize</span>
                    <span className="font-extrabold text-amber-400 text-sm">{formatCurrency(stakes.winnerPrize)}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Visibility */}
            <div className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-3">
              <h3 className="text-sm font-black text-white uppercase tracking-wider">Visibility</h3>
              <div className="grid grid-cols-3 gap-3">
                {(['PUBLIC', 'PRIVATE', 'DIRECT'] as const).map((v) => (
                  <button
                    key={v}
                    type="button"
                    onClick={() => setVisibility(v)}
                    className={`py-3 rounded-xl text-xs font-bold border transition-all ${
                      visibility === v
                        ? 'border-violet-500 bg-violet-500/20 text-white'
                        : 'border-zinc-800 bg-black/40 text-slate-400 hover:border-zinc-600'
                    }`}
                  >
                    {v === 'PUBLIC' ? '🌐 Public' : v === 'PRIVATE' ? '🔒 Private' : '🎯 Direct'}
                  </button>
                ))}
              </div>
            </div>

            {/* Expiry */}
            <div className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-3">
              <h3 className="text-sm font-black text-white uppercase tracking-wider">Challenge Expiry</h3>
              <select
                value={expiryHours}
                onChange={(e) => setExpiryHours(e.target.value)}
                className="w-full bg-black/50 border border-zinc-700 rounded-xl px-4 py-3 text-white text-sm focus:border-violet-500 focus:outline-none transition-all appearance-none"
              >
                <option value="1">1 Hour</option>
                <option value="2">2 Hours</option>
                <option value="6">6 Hours</option>
                <option value="12">12 Hours</option>
                <option value="24">24 Hours (Default)</option>
                <option value="48">48 Hours</option>
              </select>
              <p className="text-[11px] text-slate-500">Minimum expiry is 30 minutes. After this time, the challenge auto-cancels and funds are refunded.</p>
            </div>

            <div className="flex gap-3">
              <button type="button" onClick={() => setStep(1)} className="flex-1 py-4 rounded-xl font-bold text-sm border border-zinc-700 text-slate-300 hover:text-white transition-all">
                ← Back
              </button>
              <button
                type="button"
                onClick={() => setStep(3)}
                disabled={!step2Valid}
                className="flex-1 py-4 rounded-xl font-black text-sm bg-gradient-to-r from-violet-600 to-indigo-600 text-white hover:opacity-90 transition-all flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Review & Publish <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ─── STEP 3: Review ──────────────────────────────────────────── */}
        {step === 3 && (
          <div className="space-y-5">
            <div className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-0">
              <h3 className="text-sm font-black text-white uppercase tracking-wider mb-4">Challenge Summary</h3>

              {[
                { label: 'Category', value: selectedCategory?.name || '—' },
                { label: 'Platform', value: platform === 'PC' ? '💻 PC / Emulator' : '📱 Mobile' },
                { label: 'Format', value: format },
                { label: 'Game Mode', value: selectedMode?.name || '—' },
                { label: 'Map', value: selectedMap?.name || '—' },
                { label: 'Visibility', value: visibility },
                { label: 'Expiry', value: `${expiryHours} hour(s)` },
              ].map((row) => (
                <div key={row.label} className="flex justify-between items-center py-2.5 border-b border-zinc-800 text-sm">
                  <span className="text-slate-400">{row.label}</span>
                  <span className="font-bold text-white text-right">{row.value}</span>
                </div>
              ))}

              {/* Financial breakdown */}
              <div className="pt-3 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-400">Your Entry Fee</span>
                  <span className="font-bold text-emerald-400">{formatCurrency(stakes.entryFee)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Total Match Stakes</span>
                  <span className="font-bold text-white">{formatCurrency(stakes.totalPot)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Platform Fee ({stakes.platformFeePercent}%)</span>
                  <span className="text-red-400">- {formatCurrency(stakes.platformFee)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Losing Side Refund</span>
                  <span className="text-blue-400">- {formatCurrency(stakes.loserRefund)}</span>
                </div>
                <div className="flex justify-between border-t border-zinc-700 pt-2">
                  <span className="font-black text-violet-300 uppercase text-xs">🏆 Winner Prize</span>
                  <span className="font-extrabold text-amber-400 text-lg">{formatCurrency(stakes.winnerPrize)}</span>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300 flex items-start gap-3">
              <Shield className="w-5 h-5 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold mb-1">Publishing this challenge will reserve PKR {stakes.entryFee} from your wallet.</p>
                <p>You can cancel before an opponent accepts for a full instant refund. After a match is fixed, only a Manager/Admin can cancel.</p>
              </div>
            </div>

            <div className="flex gap-3">
              <button type="button" onClick={() => setStep(2)} className="flex-1 py-4 rounded-xl font-bold text-sm border border-zinc-700 text-slate-300 hover:text-white transition-all">
                ← Back
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 py-4 rounded-xl font-black text-sm bg-gradient-to-r from-violet-600 to-indigo-600 text-white hover:opacity-90 transition-all flex items-center justify-center gap-2 disabled:opacity-60 shadow-[0_0_20px_rgba(124,58,237,0.4)]"
              >
                {loading ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Publishing...</>
                ) : (
                  <><Zap className="w-4 h-4" /> Publish Challenge</>
                )}
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}
