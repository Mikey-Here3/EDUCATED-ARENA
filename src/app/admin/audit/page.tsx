'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Shield, Search, Filter, Clock, UserCheck, AlertTriangle } from 'lucide-react';

export default function AdminAuditLogPage() {
  const [logs] = useState([
    {
      id: 'audit-1',
      actor: 'arena_admin',
      role: 'ADMIN',
      action: 'MATCH_SETTLED',
      targetType: 'MATCH',
      targetId: 'EG-M-1024',
      metadata: { prizePool: 1000, platformFee: 100, winner: 'SniperKing_PK', amountPaid: 900 },
      timestamp: '15 mins ago',
      ip: '192.168.1.1',
    },
    {
      id: 'audit-2',
      actor: 'match_manager_01',
      role: 'MANAGER',
      action: 'ROOM_ASSIGNED',
      targetType: 'MATCH_ROOM',
      targetId: 'EG-M-1025',
      metadata: { roomId: '81920491', isRevealed: true },
      timestamp: '1 hour ago',
      ip: '192.168.1.5',
    },
    {
      id: 'audit-3',
      actor: 'arena_admin',
      role: 'ADMIN',
      action: 'DEPOSIT_APPROVED',
      targetType: 'WALLET',
      targetId: 'dep-9821',
      metadata: { amount: 2000, method: 'EASYPAISA', user: 'ShadowNinja_99' },
      timestamp: '2 hours ago',
      ip: '192.168.1.1',
    },
    {
      id: 'audit-4',
      actor: 'arena_admin',
      role: 'ADMIN',
      action: 'SETTINGS_UPDATE',
      targetType: 'PLATFORM_SETTING',
      targetId: 'finance.minimum_withdrawal',
      metadata: { oldValue: 150, newValue: 200 },
      timestamp: '5 hours ago',
      ip: '192.168.1.1',
    },
  ]);

  const [filter, setFilter] = useState('');

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold text-white mb-1">System Audit Trail</h1>
        <p className="text-sm text-slate-400">
          Immutable logging of all administrative actions, financial approvals, match overrides, and security events.
        </p>
      </div>

      <Card className="bg-zinc-900/50 border-zinc-800">
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <CardTitle className="text-base font-bold text-white">Event Log Feed</CardTitle>
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <Input
                placeholder="Filter by action or actor..."
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="pl-9 bg-black/50 border-zinc-800 text-xs"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-zinc-800/60">
            {logs.map((l) => (
              <div key={l.id} className="p-4 hover:bg-white/5 transition-colors text-xs space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-sm">{l.actor}</span>
                    <span className="px-1.5 py-0.5 rounded text-[9px] font-black bg-violet-900/40 text-violet-300 border border-violet-800/40">
                      {l.role}
                    </span>
                    <span className="text-slate-500 font-mono">→</span>
                    <span className="font-mono font-bold text-amber-400">{l.action}</span>
                    <span className="text-slate-400">({l.targetType})</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-500 text-[10px]">
                    <Clock className="w-3 h-3" /> {l.timestamp}
                    <span>• IP: {l.ip}</span>
                  </div>
                </div>

                <div className="p-2.5 rounded-lg bg-black/60 border border-zinc-800/80 font-mono text-[11px] text-slate-300 overflow-x-auto">
                  {JSON.stringify(l.metadata, null, 2)}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
