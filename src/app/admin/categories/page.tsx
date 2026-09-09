import { Plus, Smartphone, Monitor, Gamepad2, Edit, Trash2 } from 'lucide-react';

export default function CategoriesAdmin() {
  const categories = [
    { name: 'Esports (Standard)', devices: ['Mobile', 'PC'], icon: Gamepad2, isolation: false },
    { name: 'Craftland', devices: ['Mobile', 'PC'], icon: Gamepad2, isolation: false },
    { name: 'PC Only Category', devices: ['PC'], icon: Monitor, isolation: true },
    { name: 'Mobile Only Category', devices: ['Mobile'], icon: Smartphone, isolation: true },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tight text-white mb-2">Categories</h1>
          <p className="text-gray-400">Manage game categories and platform isolation.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-lg font-medium transition-colors">
          <Plus className="w-4 h-4" /> Add Category
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {categories.map((cat, idx) => (
          <div key={idx} className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-gray-800 flex items-center justify-center">
                  <cat.icon className="w-6 h-6 text-rose-500" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">{cat.name}</h3>
                  <div className="flex gap-2 mt-1">
                    {cat.devices.map(d => (
                      <span key={d} className="px-2 py-0.5 bg-gray-800 text-gray-400 text-xs rounded border border-gray-700">
                        {d}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mb-4">
              <label className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-lg border border-gray-800 cursor-pointer">
                <input type="checkbox" checked={cat.isolation} readOnly className="w-4 h-4 text-rose-500 rounded border-gray-600 bg-gray-700 focus:ring-rose-500 focus:ring-offset-gray-900" />
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-white">Strict Device Isolation</span>
                  <span className="text-xs text-gray-500">Prevent mixed mobile/PC lobbies</span>
                </div>
              </label>
            </div>

            <div className="flex gap-2">
              <button className="flex-1 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-colors">
                <Edit className="w-4 h-4" /> Edit
              </button>
              <button className="p-2 bg-gray-800 hover:bg-rose-500 hover:text-white text-gray-400 rounded-lg transition-colors">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
