'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Swords, ArrowLeft, ArrowRight, Shield, Zap, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { formatCurrency } from '@/lib/utils';

export default function CreateChallengePage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [categories, setCategories] = useState<any[]>([
    { id: 'cat-esports', name: 'Mobile Esports', platform: 'MOBILE', desc: 'Official competitive Clash Squad' },
    { id: 'cat-craftland', name: 'Craftland Custom', platform: 'MOBILE', desc: 'Custom maps & specialized duels' },
    { id: 'cat-br', name: 'Battle Royale', platform: 'MOBILE', desc: 'Classic survival lobbies' },
    { id: 'cat-pc', name: 'PC Emulator League', platform: 'PC', desc: 'Isolated PC/Emulator only queue' },
  ]);

  const [modes, setModes] = useState<any[]>([
    { id: 'mode-cs', name: 'Standard Clash Squad', desc: 'Standard 4v4 format' },
    { id: 'mode-deagle', name: 'Desert Eagle Only (One Tap)', desc: 'Pure headshot challenge' },
    { id: 'mode-m590', name: 'M590 Shotgun Only', desc: 'Close-quarters shotgun duel' },
  ]);

  const [maps, setMaps] = useState<any[]>([
    { id: 'map-bermuda', name: 'Bermuda' },
    { id: 'map-purgatory', name: 'Purgatory' },
    { id: 'map-kalahari', name: 'Kalahari' },
    { id: 'map-nextera', name: 'Next Era' },
  ]);

  const [formData, setFormData] = useState({
    categoryId: 'cat-esports',
    format: '1v1',
    gameModeId: 'mode-deagle',
    mapId: 'map-bermuda',
    platform: 'MOBILE',
    entryFee: '200',
    visibility: 'PUBLIC',
  });

  const entryFeeNum = parseFloat(formData.entryFee) || 0;
  const prizePool = entryFeeNum * 2;
  const platformFee = prizePool * 0.1;
  const estimatedPrize = prizePool - platformFee;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/challenges', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          categoryId: formData.categoryId,
          gameModeId: formData.gameModeId,
          mapId: formData.mapId,
          format: formData.format,
          platform: formData.platform,
          entryFee: entryFeeNum,
          visibility: formData.visibility,
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

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/dashboard/challenges" className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-slate-400 hover:text-white">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">Create New Challenge</h1>
          <p className="text-xs sm:text-sm text-slate-400">Configure game settings, rules, and entry stake</p>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          {error}
        </div>
      )}

      {/* Wizard Progress */}
      <div className="flex items-center justify-between border-b border-zinc-800 pb-4 text-xs font-semibold">
        {[
          { num: 1, label: 'Mode & Format' },
          { num: 2, label: 'Map & Stakes' },
          { num: 3, label: 'Review & Confirm' },
        ].map((s) => (
          <div
            key={s.num}
            className={`flex items-center gap-2 ${step >= s.num ? 'text-violet-400' : 'text-slate-500'}`}
          >
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                step >= s.num ? 'bg-violet-600 text-white' : 'bg-zinc-800 text-slate-500'
              }`}
            >
              {s.num}
            </div>
            <span className="hidden sm:inline">{s.label}</span>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit}>
        {/* Step 1 */}
        {step === 1 && (
          <Card className="bg-zinc-900/50 border-zinc-800">
            <CardHeader>
              <CardTitle>Select Game Category & Format</CardTitle>
              <CardDescription>Choose how you want to challenge opponents.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Category
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {categories.map((c) => (
                    <div
                      key={c.id}
                      onClick={() => {
                        setFormData({ ...formData, categoryId: c.id, platform: c.platform });
                      }}
                      className={`p-4 rounded-xl border cursor-pointer transition-all ${
                        formData.categoryId === c.id
                          ? 'border-violet-500 bg-violet-500/10'
                          : 'border-zinc-800 bg-black/40 hover:border-zinc-700'
                      }`}
                    >
                      <h4 className="font-bold text-white text-sm">{c.name}</h4>
                      <p className="text-xs text-slate-400 mt-1">{c.desc}</p>
                      <span className="inline-block mt-2 px-2 py-0.5 rounded text-[10px] font-bold bg-zinc-800 text-slate-300">
                        {c.platform}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Match Format
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
                  {['1v1', '2v2', '4v4', '6v6', 'GvG'].map((fmt) => (
                    <button
                      type="button"
                      key={fmt}
                      onClick={() => setFormData({ ...formData, format: fmt })}
                      className={`py-3 rounded-xl font-bold text-xs border transition-all ${
                        formData.format === fmt
                          ? 'border-violet-500 bg-violet-500/20 text-white glow-purple-sm'
                          : 'border-zinc-800 bg-black/40 text-slate-400 hover:text-white'
                      }`}
                    >
                      {fmt}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Game Mode
                </label>
                <div className="space-y-2">
                  {modes.map((m) => (
                    <div
                      key={m.id}
                      onClick={() => setFormData({ ...formData, gameModeId: m.id })}
                      className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                        formData.gameModeId === m.id
                          ? 'border-violet-500 bg-violet-500/10'
                          : 'border-zinc-800 bg-black/40 hover:border-zinc-700'
                      }`}
                    >
                      <div>
                        <h5 className="font-bold text-white text-sm">{m.name}</h5>
                        <p className="text-xs text-slate-400">{m.desc}</p>
                      </div>
                      {formData.gameModeId === m.id && <CheckCircle2 className="w-5 h-5 text-violet-400 shrink-0" />}
                    </div>
                  ))}
                </div>
              </div>

              <Button
                type="button"
                onClick={() => setStep(2)}
                className="w-full bg-violet-600 hover:bg-violet-500 text-white font-bold"
              >
                Continue to Stakes <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Step 2 */}
        {step === 2 && (
          <Card className="bg-zinc-900/50 border-zinc-800">
            <CardHeader>
              <CardTitle>Map & Entry Stakes</CardTitle>
              <CardDescription>Specify the arena map and entry fee in PKR.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Map
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {maps.map((map) => (
                    <div
                      key={map.id}
                      onClick={() => setFormData({ ...formData, mapId: map.id })}
                      className={`p-4 rounded-xl border cursor-pointer text-center transition-all ${
                        formData.mapId === map.id
                          ? 'border-violet-500 bg-violet-500/20 text-white font-bold'
                          : 'border-zinc-800 bg-black/40 text-slate-400 hover:text-white'
                      }`}
                    >
                      {map.name}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Entry Fee (PKR)
                </label>
                <div className="grid grid-cols-4 gap-2 mb-3">
                  {['100', '200', '500', '1000'].map((val) => (
                    <button
                      type="button"
                      key={val}
                      onClick={() => setFormData({ ...formData, entryFee: val })}
                      className={`py-2 rounded-lg text-xs font-semibold border ${
                        formData.entryFee === val
                          ? 'border-emerald-500 bg-emerald-500/20 text-emerald-400 font-bold'
                          : 'border-zinc-800 bg-black/40 text-slate-400'
                      }`}
                    >
                      PKR {val}
                    </button>
                  ))}
                </div>
                <Input
                  type="number"
                  min="50"
                  step="50"
                  required
                  value={formData.entryFee}
                  onChange={(e) => setFormData({ ...formData, entryFee: e.target.value })}
                  className="bg-black/50 border-zinc-800"
                  placeholder="Custom entry amount"
                />
              </div>

              <div className="p-4 rounded-xl bg-violet-900/20 border border-violet-800/40 space-y-2 text-xs">
                <div className="flex justify-between text-slate-300">
                  <span>Total Match Stakes (2x Entry)</span>
                  <span className="font-bold text-white">{formatCurrency(prizePool)}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Platform Fee (10%)</span>
                  <span>{formatCurrency(platformFee)}</span>
                </div>
                <div className="flex justify-between border-t border-violet-800/40 pt-2 text-sm">
                  <span className="font-bold text-violet-300">Winner Prize Pool</span>
                  <span className="font-extrabold text-amber-400">{formatCurrency(estimatedPrize)}</span>
                </div>
              </div>

              <div className="flex gap-3">
                <Button type="button" variant="secondary" onClick={() => setStep(1)} className="flex-1">
                  Back
                </Button>
                <Button type="button" onClick={() => setStep(3)} className="flex-1 bg-violet-600 hover:bg-violet-500 text-white font-bold">
                  Review & Publish <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 3 */}
        {step === 3 && (
          <Card className="bg-zinc-900/50 border-zinc-800">
            <CardHeader>
              <CardTitle>Confirm Challenge Publication</CardTitle>
              <CardDescription>
                Upon publishing, PKR {entryFeeNum} will be reserved from your available wallet balance.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="p-5 rounded-2xl bg-black/60 border border-zinc-800 space-y-3 text-sm">
                <div className="flex justify-between pb-2 border-b border-zinc-800">
                  <span className="text-slate-400">Format & Platform</span>
                  <span className="font-bold text-white">{formData.format} ({formData.platform})</span>
                </div>
                <div className="flex justify-between pb-2 border-b border-zinc-800">
                  <span className="text-slate-400">Mode & Map</span>
                  <span className="font-bold text-white">
                    {modes.find((m) => m.id === formData.gameModeId)?.name} • {maps.find((m) => m.id === formData.mapId)?.name}
                  </span>
                </div>
                <div className="flex justify-between pb-2 border-b border-zinc-800">
                  <span className="text-slate-400">Your Entry Fee</span>
                  <span className="font-bold text-emerald-400">{formatCurrency(entryFeeNum)}</span>
                </div>
                <div className="flex justify-between pt-1">
                  <span className="font-bold text-violet-300">Total Winner Prize</span>
                  <span className="font-extrabold text-amber-400 text-base">{formatCurrency(estimatedPrize)}</span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300 flex items-start gap-3">
                <Shield className="w-5 h-5 shrink-0 mt-0.5" />
                <p>
                  You can cancel this challenge at any time before an opponent accepts it to receive a full instant refund to your wallet balance.
                </p>
              </div>

              <div className="flex gap-3">
                <Button type="button" variant="secondary" onClick={() => setStep(2)} className="flex-1">
                  Back
                </Button>
                <Button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-gradient-to-r from-violet-600 to-indigo-600 hover:opacity-90 text-white font-bold glow-purple"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Publishing...
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4 mr-2" /> Publish Challenge
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </form>
    </div>
  );
}
