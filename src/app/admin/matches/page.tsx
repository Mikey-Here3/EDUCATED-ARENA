import { Activity, AlertOctagon, RotateCcw } from 'lucide-react';

export default function AdminMatches() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-black uppercase tracking-tight text-white mb-2">All Matches</h1>
        <p className="text-gray-400">Monitor all matches, override results, or force cancellations.</p>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-800 text-sm text-gray-400 bg-gray-900/50">
                <th className="p-4 font-medium">Match ID</th>
                <th className="p-4 font-medium">Type</th>
                <th className="p-4 font-medium">Players</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium">Manager</th>
                <th className="p-4 font-medium text-right">Admin Override</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {[1, 2, 3, 4, 5].map((i) => (
                <tr key={i} className="border-b border-gray-800/50 hover:bg-gray-800/30">
                  <td className="p-4 text-white font-mono">#MCH-{5000 + i}</td>
                  <td className="p-4 text-gray-300">Clash Squad (4v4)</td>
                  <td className="p-4 text-gray-400">8 / 8</td>
                  <td className="p-4">
                    {i % 3 === 0 ? (
                      <span className="px-2 py-1 bg-amber-500/10 text-amber-500 rounded text-xs font-medium">Awaiting Result</span>
                    ) : i % 2 === 0 ? (
                      <span className="px-2 py-1 bg-blue-500/10 text-blue-400 rounded text-xs font-medium flex items-center gap-1 w-max">
                        <Activity className="w-3 h-3" /> Live
                      </span>
                    ) : (
                      <span className="px-2 py-1 bg-emerald-500/10 text-emerald-500 rounded text-xs font-medium">Completed</span>
                    )}
                  </td>
                  <td className="p-4 text-gray-400">
                    {i % 2 === 0 ? 'MGR-102' : 'Unassigned'}
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button className="p-2 text-amber-500 hover:text-white bg-amber-500/10 hover:bg-amber-500 rounded transition-colors" title="Force Refund / Cancel">
                        <RotateCcw className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-rose-500 hover:text-white bg-rose-500/10 hover:bg-rose-500 rounded transition-colors" title="Override Result">
                        <AlertOctagon className="w-4 h-4" />
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
  );
}
