import Link from 'next/link';
import { Eye, ShieldPlus, Clock } from 'lucide-react';
import { prisma } from '@/lib/db';
import { getSession } from '@/lib/auth/session';
import { formatCurrency } from '@/lib/utils';
import { MatchStatus } from '@prisma/client';

export default async function MatchBoard() {
  const session = await getSession();
  const managerId = session?.id;

  if (!managerId) return null;

  // Fetch available matches (not assigned, status implies ready for management)
  const availableMatches = await prisma.match.findMany({
    where: { managerId: null, status: { in: [MatchStatus.READY, MatchStatus.ROOM_ASSIGNED, MatchStatus.SCHEDULED, MatchStatus.MATCH_FIXED] } },
    include: { gameMode: true },
    orderBy: { createdAt: 'asc' },
  });

  // Fetch assigned matches
  const assignedMatches = await prisma.match.findMany({
    where: { managerId, status: { notIn: [MatchStatus.COMPLETED, MatchStatus.CANCELLED, MatchStatus.REFUNDED] } },
    include: { gameMode: true },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tight text-white mb-2">Match Board</h1>
          <p className="text-gray-400">Claim matches and manage your assigned queue.</p>
        </div>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        <div className="flex border-b border-gray-800">
          <button className="px-6 py-4 text-sm font-medium text-amber-500 border-b-2 border-amber-500">
            Available to Claim ({availableMatches.length})
          </button>
          <button className="px-6 py-4 text-sm font-medium text-gray-400 hover:text-white">
            My Assigned ({assignedMatches.length})
          </button>
        </div>
        
        <div className="p-6">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-800 text-sm text-gray-400">
                  <th className="pb-3 font-medium">Match ID</th>
                  <th className="pb-3 font-medium">Mode</th>
                  <th className="pb-3 font-medium">Prize Pool</th>
                  <th className="pb-3 font-medium">Status</th>
                  <th className="pb-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {availableMatches.length === 0 && (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-gray-500">
                      No matches available to claim at the moment.
                    </td>
                  </tr>
                )}
                {availableMatches.map((match) => (
                  <tr key={match.id} className="border-b border-gray-800/50 hover:bg-gray-800/30">
                    <td className="py-4 text-white font-mono">{match.publicId}</td>
                    <td className="py-4 text-gray-300">{match.gameMode.name} ({match.format})</td>
                    <td className="py-4 text-green-400 font-medium">{formatCurrency(Number(match.prizePool))}</td>
                    <td className="py-4">
                      <span className="px-2 py-1 bg-amber-500/10 text-amber-500 rounded text-xs font-medium">{match.status}</span>
                    </td>
                    <td className="py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Link href={`/manager/matches/${match.id}`} className="p-2 text-gray-400 hover:text-white bg-gray-800 rounded transition-colors">
                          <Eye className="w-4 h-4" />
                        </Link>
                        <form action={async () => {
                          'use server';
                          await prisma.match.update({
                            where: { id: match.id },
                            data: { managerId, assignedAt: new Date() }
                          });
                        }}>
                          <button type="submit" className="flex items-center gap-2 px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-white rounded font-medium transition-colors">
                            <ShieldPlus className="w-4 h-4" /> Claim
                          </button>
                        </form>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {assignedMatches.length > 0 && (
        <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden mt-6">
          <div className="p-6 border-b border-gray-800">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Clock className="text-amber-500" /> My Assigned Queue
            </h2>
          </div>
          <div className="p-6">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-800 text-sm text-gray-400">
                    <th className="pb-3 font-medium">Match ID</th>
                    <th className="pb-3 font-medium">Mode</th>
                    <th className="pb-3 font-medium">Prize Pool</th>
                    <th className="pb-3 font-medium">Status</th>
                    <th className="pb-3 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {assignedMatches.map((match) => (
                    <tr key={match.id} className="border-b border-gray-800/50 hover:bg-gray-800/30">
                      <td className="py-4 text-white font-mono">{match.publicId}</td>
                      <td className="py-4 text-gray-300">{match.gameMode.name} ({match.format})</td>
                      <td className="py-4 text-green-400 font-medium">{formatCurrency(Number(match.prizePool))}</td>
                      <td className="py-4">
                        <span className="px-2 py-1 bg-blue-500/10 text-blue-400 rounded text-xs font-medium">{match.status}</span>
                      </td>
                      <td className="py-4 text-right">
                        <Link href={`/manager/matches/${match.id}`} className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded font-medium transition-colors">
                          <Eye className="w-4 h-4" /> Manage
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
