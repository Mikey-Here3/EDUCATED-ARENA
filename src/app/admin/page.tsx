import { Activity, Users, Swords, Trophy, DollarSign, Wallet, AlertCircle } from 'lucide-react';
import { prisma } from '@/lib/db';
import { formatCurrency } from '@/lib/utils';
import Link from 'next/link';
import { MatchStatus, TransactionType, TransactionStatus, UserRole } from '@prisma/client';

export default async function AdminOverview() {
  const usersCount = await prisma.user.count({ where: { role: UserRole.USER } });
  
  const activeMatchesCount = await prisma.match.count({
    where: { status: { in: [MatchStatus.READY, MatchStatus.LIVE, MatchStatus.ROOM_ASSIGNED] } }
  });
  
  const completedMatchesCount = await prisma.match.count({
    where: { status: MatchStatus.COMPLETED }
  });

  const wallets = await prisma.wallet.aggregate({
    _sum: {
      totalDeposits: true,
      totalWithdrawals: true,
      totalFees: true
    }
  });

  const platformRevenue = Number(wallets._sum.totalFees || 0);
  const totalDeposits = Number(wallets._sum.totalDeposits || 0);
  const totalWithdrawals = Number(wallets._sum.totalWithdrawals || 0);

  const pendingDeposits = await prisma.ledgerTransaction.count({
    where: { type: TransactionType.DEPOSIT, status: TransactionStatus.PENDING }
  });
  
  const pendingWithdrawals = await prisma.ledgerTransaction.count({
    where: { type: TransactionType.WITHDRAWAL_REQUEST, status: TransactionStatus.PENDING }
  });

  const stats = [
    { title: 'Platform Revenue', value: formatCurrency(platformRevenue), icon: DollarSign, color: 'text-emerald-500' },
    { title: 'Total Users', value: usersCount.toString(), icon: Users, color: 'text-blue-500' },
    { title: 'Active Matches', value: activeMatchesCount.toString(), icon: Activity, color: 'text-rose-500' },
    { title: 'Completed Matches', value: completedMatchesCount.toString(), icon: Swords, color: 'text-amber-500' },
    { title: 'Total Deposits', value: formatCurrency(totalDeposits), icon: Wallet, color: 'text-indigo-500' },
    { title: 'Total Withdrawals', value: formatCurrency(totalWithdrawals), icon: Wallet, color: 'text-purple-500' },
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
      
      {(pendingDeposits > 0 || pendingWithdrawals > 0) && (
        <div className="bg-rose-500/10 border border-rose-500/20 rounded-xl p-6 flex items-start gap-4">
          <AlertCircle className="w-6 h-6 text-rose-500 shrink-0 mt-1" />
          <div>
            <h3 className="text-lg font-bold text-rose-500 mb-1">Pending Reviews ({pendingDeposits + pendingWithdrawals})</h3>
            <p className="text-rose-400/80 text-sm">
              There are pending deposits ({pendingDeposits}) and withdrawals ({pendingWithdrawals}) awaiting manager or admin review. 
              <Link href="/admin/wallet" className="underline font-medium hover:text-rose-300 ml-1">Go to Ledger</Link>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
