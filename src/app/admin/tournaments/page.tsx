'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Trophy, Plus, Calendar, Users, Zap, CheckCircle2 } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

export default function AdminTournamentsPage() {
  const [tournaments, setTournaments] = useState([
    {
      id: 'tour-1',
      publicId: 'EG-T-1001',
      name: 'Free Fire Karachi Masters Cup',
      entryFee: 500,
      prizePool: 25000,
      maxTeams: 32,
      registeredTeams: 18,
      status: 'REGISTRATION_OPEN',
    },
    {
      id: 'tour-2',
      publicId: 'EG-T-1002',
      name: 'All-Pakistan Clash Squad League',
      entryFee: 1000,
      prizePool: 50000,
      maxTeams: 16,
      registeredTeams: 12,
      status: 'REGISTRATION_OPEN',
    },
  ]);

  const [showCreate, setShowCreate] = useState(false);
  const [name, setName] = useState('');
  const [prize, setPrize] = useState('20000');
  const [entry, setEntry] = useState('500');

  function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!name) return;
    setTournaments([
      ...tournaments,
      {
        id: `tour-${Date.now()}`,
        publicId: `EG-T-${Math.floor(1000 + Math.random() * 9000)}`,
        name,
        entryFee: parseFloat(entry),
        prizePool: parseFloat(prize),
        maxTeams: 32,
        registeredTeams: 0,
        status: 'REGISTRATION_OPEN',
      },
    ]);
    setName('');
    setShowCreate(false);
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">Tournaments Control Center</h1>
          <p className="text-sm text-slate-400">
            Create multi-team brackets, set prize distributions, and oversee tournament matches.
          </p>
        </div>
        <Button
          onClick={() => setShowCreate(!showCreate)}
          className="bg-violet-600 hover:bg-violet-500 text-white font-bold"
        >
          <Plus className="w-4 h-4 mr-2" /> Launch Tournament
        </Button>
      </div>

      {showCreate && (
        <Card className="bg-zinc-900 border-violet-500/40 p-6">
          <h3 className="text-base font-bold text-white mb-4">Create Bracket Tournament</h3>
          <form onSubmit={handleCreate} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Tournament Title
              </label>
              <Input
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Lahore Invitational Championship"
                className="bg-black/50 border-zinc-800"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                  Prize Pool (PKR)
                </label>
                <Input
                  type="number"
                  required
                  value={prize}
                  onChange={(e) => setPrize(e.target.value)}
                  className="bg-black/50 border-zinc-800"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                  Entry Fee Per Team (PKR)
                </label>
                <Input
                  type="number"
                  required
                  value={entry}
                  onChange={(e) => setEntry(e.target.value)}
                  className="bg-black/50 border-zinc-800"
                />
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <Button type="button" variant="secondary" onClick={() => setShowCreate(false)}>
                Cancel
              </Button>
              <Button type="submit" className="bg-violet-600 hover:bg-violet-500 text-white font-bold">
                Create & Open Registration
              </Button>
            </div>
          </form>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {tournaments.map((t) => (
          <Card key={t.id} className="bg-zinc-900/50 border-zinc-800 p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-mono font-bold text-violet-400">{t.publicId}</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                {t.status}
              </span>
            </div>
            <h3 className="text-base font-bold text-white mb-3">{t.name}</h3>

            <div className="grid grid-cols-3 gap-2 p-3 rounded-lg bg-black/40 border border-zinc-800 text-xs mb-4">
              <div>
                <span className="text-slate-500 block">Prize Pool</span>
                <span className="font-bold text-amber-400">{formatCurrency(t.prizePool)}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Entry Fee</span>
                <span className="font-semibold text-white">{formatCurrency(t.entryFee)}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Rosters</span>
                <span className="font-semibold text-white">{t.registeredTeams} / {t.maxTeams}</span>
              </div>
            </div>

            <Button size="sm" variant="secondary" className="w-full text-xs font-bold">
              Manage Brackets & Fixtures
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
}
