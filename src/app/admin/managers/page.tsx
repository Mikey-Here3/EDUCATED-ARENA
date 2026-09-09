import { Shield, Plus, Key, Ban } from 'lucide-react';

export default function ManagersAdmin() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tight text-white mb-2">Managers</h1>
          <p className="text-gray-400">Control manager accounts and granular permissions.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-lg font-medium transition-colors">
          <Plus className="w-4 h-4" /> Create Manager
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-gray-900 border border-gray-800 rounded-xl p-6 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-rose-500"></div>
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center">
                  <Shield className="w-5 h-5 text-rose-500" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Manager {i}</h3>
                  <p className="text-xs text-gray-500">MGR-{100 + i}</p>
                </div>
              </div>
              <span className="px-2 py-1 bg-emerald-500/10 text-emerald-500 rounded text-xs font-medium">Active</span>
            </div>
            
            <div className="mb-4">
              <p className="text-xs font-semibold text-gray-400 uppercase mb-2">Permissions</p>
              <div className="flex flex-wrap gap-2">
                <span className="px-2 py-1 bg-gray-800 text-gray-300 text-xs rounded border border-gray-700">matches.claim</span>
                <span className="px-2 py-1 bg-gray-800 text-gray-300 text-xs rounded border border-gray-700">matches.resolve</span>
                {i % 2 === 0 && <span className="px-2 py-1 bg-gray-800 text-gray-300 text-xs rounded border border-gray-700">wallet.review</span>}
              </div>
            </div>

            <div className="flex gap-2 pt-4 border-t border-gray-800">
              <button className="flex-1 flex items-center justify-center gap-2 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg text-sm font-medium transition-colors">
                <Key className="w-4 h-4" /> Edit Perms
              </button>
              <button className="flex-1 flex items-center justify-center gap-2 py-2 bg-rose-500/10 hover:bg-rose-500 text-rose-500 hover:text-white rounded-lg text-sm font-medium transition-colors">
                <Ban className="w-4 h-4" /> Disable
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
