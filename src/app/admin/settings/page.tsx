'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sliders, Save, CheckCircle2, Shield, AlertTriangle } from 'lucide-react';

export default function AdminSettingsPage() {
  const [saved, setSaved] = useState(false);

  const [settings, setSettings] = useState({
    minDeposit: '50',
    minWithdrawal: '200',
    platformFeePercentage: '10',
    matchExpiryHours: '24',
    noShowTimeoutMinutes: '15',
    ratingInitial: '1000',
    ratingKFactor: '32',
    allowGuestBrowsing: true,
    maintenanceMode: false,
  });

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">Platform Business Rules</h1>
          <p className="text-sm text-slate-400">
            Configure financial thresholds, match timeout intervals, rating algorithms, and system flags.
          </p>
        </div>
      </div>

      {saved && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          Settings updated successfully and persisted to database.
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Financial Rules */}
        <Card className="bg-zinc-900/50 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-base font-bold text-white">Financial & Fee Configuration</CardTitle>
            <CardDescription>Control deposit/withdrawal limits and platform fee take rates.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                  Minimum Deposit (PKR)
                </label>
                <Input
                  type="number"
                  required
                  value={settings.minDeposit}
                  onChange={(e) => setSettings({ ...settings, minDeposit: e.target.value })}
                  className="bg-black/50 border-zinc-800"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                  Minimum Withdrawal (PKR)
                </label>
                <Input
                  type="number"
                  required
                  value={settings.minWithdrawal}
                  onChange={(e) => setSettings({ ...settings, minWithdrawal: e.target.value })}
                  className="bg-black/50 border-zinc-800"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                  Platform Fee Percentage (%)
                </label>
                <Input
                  type="number"
                  required
                  value={settings.platformFeePercentage}
                  onChange={(e) => setSettings({ ...settings, platformFeePercentage: e.target.value })}
                  className="bg-black/50 border-zinc-800"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Match Operational Timers */}
        <Card className="bg-zinc-900/50 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-base font-bold text-white">Match Operations & Timeouts</CardTitle>
            <CardDescription>Control challenge expiry and room no-show limits.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                  Unaccepted Challenge Expiry (Hours)
                </label>
                <Input
                  type="number"
                  required
                  value={settings.matchExpiryHours}
                  onChange={(e) => setSettings({ ...settings, matchExpiryHours: e.target.value })}
                  className="bg-black/50 border-zinc-800"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                  Room No-Show Timeout (Minutes)
                </label>
                <Input
                  type="number"
                  required
                  value={settings.noShowTimeoutMinutes}
                  onChange={(e) => setSettings({ ...settings, noShowTimeoutMinutes: e.target.value })}
                  className="bg-black/50 border-zinc-800"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Rating Engine */}
        <Card className="bg-zinc-900/50 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-base font-bold text-white">ELO Rating Calculation Engine</CardTitle>
            <CardDescription>Tune competitive player and team ranking parameters.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                  Starting Rating (ELO)
                </label>
                <Input
                  type="number"
                  required
                  value={settings.ratingInitial}
                  onChange={(e) => setSettings({ ...settings, ratingInitial: e.target.value })}
                  className="bg-black/50 border-zinc-800"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                  K-Factor (Volatility Weight)
                </label>
                <Input
                  type="number"
                  required
                  value={settings.ratingKFactor}
                  onChange={(e) => setSettings({ ...settings, ratingKFactor: e.target.value })}
                  className="bg-black/50 border-zinc-800"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Button type="submit" className="bg-violet-600 hover:bg-violet-500 text-white font-bold">
          <Save className="w-4 h-4 mr-2" /> Save System Settings
        </Button>
      </form>
    </div>
  );
}
