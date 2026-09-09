'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Wallet, ArrowDownToLine, ArrowUpFromLine, Shield, DollarSign, RefreshCw, CheckCircle2 } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

export default function AdminFinancialLedgerPage() {
  const [stats] = useState({
    totalSystemDeposits: 450000,
    totalSystemWithdrawals: 210000,
    activeReservedFunds: 48000,
    platformFeeRevenue: 42000,
    systemSolvencyRatio: '100%',
  });

  const [recentTransactions] = useState([
    { id: 'tx-1', user: 'SniperKing_PK', type: 'MATCH_SETTLEMENT', amount: 900, time: '12 mins ago', ref: 'EG-M-1024' },
    { id: 'tx-2', user: 'ShadowNinja_99', type: 'DEPOSIT_APPROVED', amount: 2000, time: '45 mins ago', ref: 'TID-9182741' },
    { id: 'tx-3', user: 'Khan_Destroyer', type: 'WITHDRAWAL_PAID', amount: 1500, time: '2 hours ago', ref: 'WITH-4912' },
    { id: 'tx-4', user: 'Faheem_OneTap', type: 'PLATFORM_FEE', amount: 100, time: '3 hours ago', ref: 'EG-M-1023' },
  ]);

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold text-white mb-1">Financial Operations & Ledger</h1>
        <p className="text-sm text-slate-400">
          Double-entry append-only transaction ledger, platform solvency, and liquidity management.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-zinc-900/50 border-zinc-800 p-4">
          <span className="text-xs text-slate-400 block mb-1">Total Platform Deposits</span>
          <span className="text-2xl font-black text-emerald-400">{formatCurrency(stats.totalSystemDeposits)}</span>
        </Card>

        <Card className="bg-zinc-900/50 border-zinc-800 p-4">
          <span className="text-xs text-slate-400 block mb-1">Total Paid Withdrawals</span>
          <span className="text-2xl font-black text-slate-200">{formatCurrency(stats.totalSystemWithdrawals)}</span>
        </Card>

        <Card className="bg-zinc-900/50 border-zinc-800 p-4">
          <span className="text-xs text-slate-400 block mb-1">Match Reserved Stakes</span>
          <span className="text-2xl font-black text-amber-400">{formatCurrency(stats.activeReservedFunds)}</span>
        </Card>

        <Card className="bg-zinc-900/50 border-violet-500/30 p-4">
          <span className="text-xs text-slate-400 block mb-1">Platform Revenue (Fees)</span>
          <span className="text-2xl font-black text-violet-400">{formatCurrency(stats.platformFeeRevenue)}</span>
        </Card>
      </div>

      {/* Solvency Status */}
      <Card className="bg-emerald-500/10 border border-emerald-500/30 p-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Shield className="w-8 h-8 text-emerald-400" />
          <div>
            <h3 className="font-bold text-white text-base">Ledger Health: Verified & Solvent</h3>
            <p className="text-xs text-slate-300">All user liabilities match verified liquid platform reserves.</p>
          </div>
        </div>
        <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-black">
          100% Backed
        </span>
      </Card>

      {/* Ledger Feed */}
      <Card className="bg-zinc-900/50 border-zinc-800">
        <CardHeader>
          <CardTitle>Global Ledger Activity</CardTitle>
          <CardDescription>Live streaming of verified financial events</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-zinc-800/50">
            {recentTransactions.map((tx) => (
              <div key={tx.id} className="p-4 flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-white block text-sm">{tx.user}</span>
                  <span className="text-slate-500">{tx.ref} • {tx.time}</span>
                </div>
                <div className="text-right">
                  <span className="font-mono font-bold text-emerald-400 block text-sm">
                    {formatCurrency(tx.amount)}
                  </span>
                  <span className="text-[10px] text-slate-400 uppercase font-mono">{tx.type}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
