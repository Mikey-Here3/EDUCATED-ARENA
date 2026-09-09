import { Activity, Clock, ShieldCheck, CreditCard, DollarSign } from 'lucide-react';

export default function ManagerOverview() {
  const stats = [
    { title: 'My Assigned Matches', value: '12', icon: ShieldCheck, color: 'text-emerald-500' },
    { title: 'Pending Schedule', value: '5', icon: Clock, color: 'text-amber-500' },
    { title: 'Live Matches', value: '3', icon: Activity, color: 'text-blue-500' },
    { title: 'Awaiting Results', value: '8', icon: ShieldCheck, color: 'text-purple-500' },
    { title: 'Pending Deposits', value: '24', icon: CreditCard, color: 'text-indigo-500' },
    { title: 'Pending Withdrawals', value: '15', icon: DollarSign, color: 'text-rose-500' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-black uppercase tracking-tight text-white mb-2">Manager Overview</h1>
        <p className="text-gray-400">Welcome back. Here are your current operational metrics.</p>
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
    </div>
  );
}
