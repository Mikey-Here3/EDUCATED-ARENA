'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Shield, Plus, Lock, Trash2, Edit2 } from 'lucide-react';

export default function AdminRulesPage() {
  const [rules, setRules] = useState([
    {
      id: 'rule-1',
      title: 'Mandatory Verified Free Fire UID',
      content: 'All players must join using the registered UID linked on their profile. Unregistered players will cause an instant match forfeit.',
      isLocked: true,
    },
    {
      id: 'rule-2',
      title: 'Strict Weapon Restrictions',
      content: 'In weapon-locked modes (e.g. Desert Eagle Only), firing any other firearm results in immediate disqualification.',
      isLocked: true,
    },
    {
      id: 'rule-3',
      title: 'End-Game Scoreboard Screenshot',
      content: 'Winning and losing sides must submit an uncropped screenshot of the end-game scoreboard.',
      isLocked: false,
    },
  ]);

  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');

  function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!newTitle) return;
    setRules([
      ...rules,
      {
        id: `rule-${Date.now()}`,
        title: newTitle,
        content: newContent,
        isLocked: false,
      },
    ]);
    setNewTitle('');
    setNewContent('');
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold text-white mb-1">Standard Competition Rules</h1>
        <p className="text-sm text-slate-400">
          Manage system-wide locked and default competition rules enforced across matches.
        </p>
      </div>

      <Card className="bg-zinc-900/50 border-zinc-800 p-6">
        <h3 className="text-base font-bold text-white mb-4">Add Global Match Rule</h3>
        <form onSubmit={handleAdd} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
              Rule Title
            </label>
            <Input
              required
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="e.g. Character Skill Restrictions"
              className="bg-black/50 border-zinc-800"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
              Rule Content & Penalty Description
            </label>
            <Input
              required
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
              placeholder="Detailed explanation of the rule..."
              className="bg-black/50 border-zinc-800"
            />
          </div>
          <Button type="submit" className="bg-violet-600 hover:bg-violet-500 text-white font-bold">
            <Plus className="w-4 h-4 mr-2" /> Save Global Rule
          </Button>
        </form>
      </Card>

      <div className="space-y-4">
        {rules.map((r) => (
          <Card key={r.id} className="bg-zinc-900/50 border-zinc-800 p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-bold text-white text-base">{r.title}</h4>
                  {r.isLocked && (
                    <span className="flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                      <Lock className="w-3 h-3" /> System Locked
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">{r.content}</p>
              </div>

              {!r.isLocked && (
                <button
                  onClick={() => setRules(rules.filter((x) => x.id !== r.id))}
                  className="text-slate-600 hover:text-red-400 p-1 shrink-0"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
