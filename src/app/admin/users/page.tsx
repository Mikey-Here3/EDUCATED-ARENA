import { Search, Filter, Ban, Wallet, Edit } from 'lucide-react';

export default function UsersAdmin() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tight text-white mb-2">Users Management</h1>
          <p className="text-gray-400">Manage players, bans, and direct wallet adjustments.</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg border border-gray-700 transition-colors">
            <Filter className="w-4 h-4" /> Filter
          </button>
          <div className="relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input 
              type="text" 
              placeholder="Search Username/ID..." 
              className="pl-10 pr-4 py-2 bg-gray-900 border border-gray-800 rounded-lg text-white focus:outline-none focus:border-rose-500 w-full sm:w-64"
            />
          </div>
        </div>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-800 text-sm text-gray-400 bg-gray-900/50">
                <th className="p-4 font-medium">User ID</th>
                <th className="p-4 font-medium">Player Info</th>
                <th className="p-4 font-medium">Role</th>
                <th className="p-4 font-medium">Balance</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {[1, 2, 3, 4, 5].map((i) => (
                <tr key={i} className="border-b border-gray-800/50 hover:bg-gray-800/30">
                  <td className="p-4 text-gray-400 font-mono">USR-{1000 + i}</td>
                  <td className="p-4">
                    <p className="text-white font-medium">ProGamer{i}</p>
                    <p className="text-xs text-gray-500">progamer{i}@email.com</p>
                  </td>
                  <td className="p-4">
                    <span className="px-2 py-1 bg-gray-800 text-gray-300 rounded text-xs font-medium">Player</span>
                  </td>
                  <td className="p-4 text-emerald-400 font-medium">Rs {i * 500}</td>
                  <td className="p-4">
                    <span className="px-2 py-1 bg-emerald-500/10 text-emerald-500 rounded text-xs font-medium">Active</span>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button className="p-2 text-blue-400 hover:text-white bg-blue-500/10 hover:bg-blue-500 rounded transition-colors" title="Adjust Wallet">
                        <Wallet className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-rose-500 hover:text-white bg-rose-500/10 hover:bg-rose-500 rounded transition-colors" title="Ban User">
                        <Ban className="w-4 h-4" />
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
