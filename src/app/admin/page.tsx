import { Activity, Users, Swords, Trophy, DollarSign, Wallet, AlertCircle } from 'lucide-react';

export default function AdminOverview() {
  const stats = [
    { title: 'Platform Revenue', value: 'Rs 125,000', icon: DollarSign, color: 'text-emerald-500' },
    { title: 'Total Users', value: '1,248', icon: Users, color: 'text-blue-500' },
    { title: 'Active Matches', value: '12', icon: Activity, color: 'text-rose-500' },
    { title: 'Completed Matches', value: '845', icon: Swords, color: 'text-amber-500' },
    { title: 'Total Deposits', value: 'Rs 450,000', icon: Wallet, color: 'text-indigo-500' },
    { title: 'Total Withdrawals', value: 'Rs 280,000', icon: Wallet, color: 'text-purple-500' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-black uppercase tracking-tight text-white mb-2">Admin Overview</h1>
        <p className="text-gray-400">High-level platform metrics and system health.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-gray-900 border border-gray-800 rounded-xl p-6 flex items-center gap-4">
            <div className={`p-4 rounded-lg bg-gray-800/50 ${stat.color}`}>
              <stat.icon className="w-8 h-8" />
            </div>
            <div>
              <p className="text-sm text-gray-400 font-medium">{stat.title}</p>
              <h3 className="text-2xl font-bold text-white mt-1">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>
      
      <div className="bg-rose-500/10 border border-rose-500/20 rounded-xl p-6 flex items-start gap-4">
        <AlertCircle className="w-6 h-6 text-rose-500 shrink-0 mt-1" />
        <div>
          <h3 className="text-lg font-bold text-rose-500 mb-1">Pending Reviews (39)</h3>
          <p className="text-rose-400/80 text-sm">There are pending deposits (24) and withdrawals (15) awaiting manager or admin review. <a href="/admin/wallet" className="underline font-medium hover:text-rose-300">Go to Ledger</a></p>
        </div>
      </div>
    </div>
  );
}
