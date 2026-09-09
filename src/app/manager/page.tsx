import { Activity, Clock, ShieldCheck, CreditCard, DollarSign } from 'lucide-react';
import { prisma } from '@/lib/db';
import { getSession } from '@/lib/auth/session';
import { MatchStatus, TransactionType, TransactionStatus } from '@prisma/client';

export default async function ManagerOverview() {
  const session = await getSession();
  const managerId = session?.user?.id;

  if (!managerId) return null;

  const myAssignedCount = await prisma.match.count({
    where: { managerId, status: { notIn: [MatchStatus.COMPLETED, MatchStatus.CANCELLED, MatchStatus.REFUNDED] } }
  });

  const pendingScheduleCount = await prisma.match.count({
    where: { managerId, status: MatchStatus.READY }
  });

  const liveMatchesCount = await prisma.match.count({
    where: { managerId, status: MatchStatus.LIVE }
  });

  const awaitingResultsCount = await prisma.match.count({
    where: { managerId, status: MatchStatus.RESULT_SUBMITTED }
  });

  const pendingDeposits = await prisma.ledgerTransaction.count({
    where: { type: TransactionType.DEPOSIT, status: TransactionStatus.PENDING }
  });

  const pendingWithdrawals = await prisma.ledgerTransaction.count({
    where: { type: TransactionType.WITHDRAWAL_REQUEST, status: TransactionStatus.PENDING }
  });

  const stats = [
    { title: 'My Assigned Matches', value: myAssignedCount.toString(), icon: ShieldCheck, color: 'text-emerald-500' },
    { title: 'Pending Setup', value: pendingScheduleCount.toString(), icon: Clock, color: 'text-amber-500' },
    { title: 'Live Matches', value: liveMatchesCount.toString(), icon: Activity, color: 'text-blue-500' },
    { title: 'Awaiting Verification', value: awaitingResultsCount.toString(), icon: ShieldCheck, color: 'text-purple-500' },
    { title: 'Pending Deposits', value: pendingDeposits.toString(), icon: CreditCard, color: 'text-indigo-500' },
    { title: 'Pending Withdrawals', value: pendingWithdrawals.toString(), icon: DollarSign, color: 'text-rose-500' },
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
