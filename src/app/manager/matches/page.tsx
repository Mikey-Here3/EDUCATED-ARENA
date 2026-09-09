import Link from 'next/link';
import { Eye, ShieldPlus } from 'lucide-react';

export default function MatchBoard() {
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
            Available to Claim (10)
          </button>
          <button className="px-6 py-4 text-sm font-medium text-gray-400 hover:text-white">
            My Assigned (12)
          </button>
          <button className="px-6 py-4 text-sm font-medium text-gray-400 hover:text-white">
            Live (3)
          </button>
          <button className="px-6 py-4 text-sm font-medium text-gray-400 hover:text-white">
            Completed (45)
          </button>
        </div>
        
        <div className="p-6">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-800 text-sm text-gray-400">
                  <th className="pb-3 font-medium">Match ID</th>
                  <th className="pb-3 font-medium">Game</th>
                  <th className="pb-3 font-medium">Mode</th>
                  <th className="pb-3 font-medium">Prize Pool</th>
                  <th className="pb-3 font-medium">Status</th>
                  <th className="pb-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {[1, 2, 3, 4, 5].map((i) => (
                  <tr key={i} className="border-b border-gray-800/50 hover:bg-gray-800/30">
                    <td className="py-4 text-white font-mono">#MCH-{1000 + i}</td>
                    <td className="py-4 text-gray-300">Free Fire</td>
                    <td className="py-4 text-gray-300">Clash Squad (4v4)</td>
                    <td className="py-4 text-green-400 font-medium">Rs 1,500</td>
                    <td className="py-4">
                      <span className="px-2 py-1 bg-amber-500/10 text-amber-500 rounded text-xs font-medium">Available</span>
                    </td>
                    <td className="py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Link href={`/manager/matches/MCH-${1000 + i}`} className="p-2 text-gray-400 hover:text-white bg-gray-800 rounded transition-colors">
                          <Eye className="w-4 h-4" />
                        </Link>
                        <button className="flex items-center gap-2 px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-white rounded font-medium transition-colors">
                          <ShieldPlus className="w-4 h-4" /> Claim
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
