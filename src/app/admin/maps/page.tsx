'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Map, Plus, Trash2, Edit2, CheckCircle2 } from 'lucide-react';

export default function AdminMapsPage() {
  const [maps, setMaps] = useState([
    { id: 'map-1', name: 'Bermuda', slug: 'bermuda', sortOrder: 1, isActive: true },
    { id: 'map-2', name: 'Purgatory', slug: 'purgatory', sortOrder: 2, isActive: true },
    { id: 'map-3', name: 'Kalahari', slug: 'kalahari', sortOrder: 3, isActive: true },
    { id: 'map-4', name: 'Next Era', slug: 'next-era', sortOrder: 4, isActive: true },
    { id: 'map-5', name: 'Solara', slug: 'solara', sortOrder: 5, isActive: true },
  ]);

  const [newMap, setNewMap] = useState('');

  function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!newMap) return;
    setMaps([
      ...maps,
      {
        id: `map-${Date.now()}`,
        name: newMap,
        slug: newMap.toLowerCase().replace(/\s+/g, '-'),
        sortOrder: maps.length + 1,
        isActive: true,
      },
    ]);
    setNewMap('');
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">Maps Management</h1>
          <p className="text-sm text-slate-400">Configure battleground maps available for match selection.</p>
        </div>
      </div>

      <Card className="bg-zinc-900/50 border-zinc-800 p-6">
        <form onSubmit={handleAdd} className="flex gap-3">
          <Input
            required
            value={newMap}
            onChange={(e) => setNewMap(e.target.value)}
            placeholder="Enter new map name (e.g. Alpine)"
            className="bg-black/50 border-zinc-800 flex-1"
          />
          <Button type="submit" className="bg-violet-600 hover:bg-violet-500 text-white font-bold">
            <Plus className="w-4 h-4 mr-2" /> Add Map
          </Button>
        </form>
      </Card>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {maps.map((m) => (
          <Card key={m.id} className="bg-zinc-900/50 border-zinc-800 p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-zinc-800 flex items-center justify-center text-violet-400 font-bold">
                <Map className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-white text-sm">{m.name}</h4>
                <span className="text-[10px] text-slate-500 font-mono">Order: #{m.sortOrder}</span>
              </div>
            </div>
            <button
              onClick={() => setMaps(maps.filter((x) => x.id !== m.id))}
              className="text-slate-600 hover:text-red-400 p-1"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </Card>
        ))}
      </div>
    </div>
  );
}
