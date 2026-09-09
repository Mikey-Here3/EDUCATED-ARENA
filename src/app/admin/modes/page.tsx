'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Gamepad2, Plus, Edit2, Trash2, CheckCircle2, Shield } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

export default function AdminGameModesPage() {
  const [modes, setModes] = useState([
    {
      id: 'mode-1',
      name: 'Standard Clash Squad',
      slug: 'standard-clash-squad',
      category: 'Mobile Esports',
      allowedFormats: ['1v1', '2v2', '4v4', '6v6', 'GvG'],
      defaultFee: 100,
      defaultPrize: 180,
      isActive: true,
    },
    {
      id: 'mode-2',
      name: 'Desert Eagle Only (One Tap)',
      slug: 'desert-eagle-only',
      category: 'Mobile Esports',
      allowedFormats: ['1v1', '2v2', '4v4'],
      defaultFee: 200,
      defaultPrize: 360,
      isActive: true,
    },
    {
      id: 'mode-3',
      name: 'M590 Shotgun Only',
      slug: 'm590-shotgun-only',
      category: 'Craftland Custom',
      allowedFormats: ['1v1', '2v2', '4v4'],
      defaultFee: 150,
      defaultPrize: 270,
      isActive: true,
    },
  ]);

  const [showAdd, setShowAdd] = useState(false);
  const [newModeName, setNewModeName] = useState('');
  const [newModeCategory, setNewModeCategory] = useState('Mobile Esports');

  function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!newModeName) return;

    const newM = {
      id: `mode-${Date.now()}`,
      name: newModeName,
      slug: newModeName.toLowerCase().replace(/\s+/g, '-'),
      category: newModeCategory,
      allowedFormats: ['1v1', '2v2', '4v4'],
      defaultFee: 200,
      defaultPrize: 360,
      isActive: true,
    };
    setModes([...modes, newM]);
    setNewModeName('');
    setShowAdd(false);
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">Game Modes Management</h1>
          <p className="text-sm text-slate-400">
            Define competitive match rulesets, weapon restrictions, and allowed squad formats.
          </p>
        </div>
        <Button
          onClick={() => setShowAdd(!showAdd)}
          className="bg-violet-600 hover:bg-violet-500 text-white font-bold"
        >
          <Plus className="w-4 h-4 mr-2" /> Add Game Mode
        </Button>
      </div>

      {showAdd && (
        <Card className="bg-zinc-900 border-violet-500/40 p-6">
          <h3 className="text-lg font-bold text-white mb-3">Add Competitive Game Mode</h3>
          <form onSubmit={handleAdd} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                  Mode Name
                </label>
                <Input
                  required
                  value={newModeName}
                  onChange={(e) => setNewModeName(e.target.value)}
                  placeholder="e.g. Sniper Rifles Only"
                  className="bg-black/50 border-zinc-800"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                  Category
                </label>
                <select
                  value={newModeCategory}
                  onChange={(e) => setNewModeCategory(e.target.value)}
                  className="flex h-10 w-full items-center justify-between rounded-md border border-zinc-800 bg-black/50 px-3 py-2 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-500"
                >
                  <option value="Mobile Esports">Mobile Esports</option>
                  <option value="Craftland Custom">Craftland Custom</option>
                  <option value="Battle Royale">Battle Royale</option>
                  <option value="PC League">PC League</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <Button type="button" variant="secondary" onClick={() => setShowAdd(false)}>
                Cancel
              </Button>
              <Button type="submit" className="bg-violet-600 hover:bg-violet-500 text-white font-bold">
                Save Game Mode
              </Button>
            </div>
          </form>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {modes.map((m) => (
          <Card key={m.id} className="bg-zinc-900/50 border-zinc-800 p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-violet-400">{m.category}</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Active
                </span>
              </div>
              <h3 className="text-base font-bold text-white mb-2">{m.name}</h3>

              <div className="flex flex-wrap gap-1.5 mb-4">
                {m.allowedFormats.map((f) => (
                  <span key={f} className="px-2 py-0.5 rounded bg-zinc-800 text-slate-300 text-[10px] font-mono">
                    {f}
                  </span>
                ))}
              </div>
            </div>

            <div className="border-t border-zinc-800 pt-3 flex items-center justify-between text-xs">
              <span className="text-slate-400">Default: {formatCurrency(m.defaultFee)}</span>
              <div className="flex gap-2">
                <button className="text-slate-400 hover:text-white p-1">
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setModes(modes.filter((x) => x.id !== m.id))}
                  className="text-slate-500 hover:text-red-400 p-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
