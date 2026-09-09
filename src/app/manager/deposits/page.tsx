'use client';

import { useState, useEffect } from 'react';
import { Check, X, Search, FileImage } from 'lucide-react';

export default function DepositsReview() {
  const [deposits, setDeposits] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDeposits = async () => {
    try {
      const res = await fetch('/api/manager/deposits?status=PENDING');
      const data = await res.json();
      if (data.data) {
        setDeposits(data.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeposits();
  }, []);

  const handleAction = async (id: string, action: 'APPROVE' | 'REJECT') => {
    if (!confirm(`Are you sure you want to ${action} this deposit?`)) return;
    
    try {
      const res = await fetch(`/api/manager/deposits/${id}/review`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, notes: '' }),
      });
      if (res.ok) {
        fetchDeposits();
      } else {
        alert('Failed to process deposit');
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tight text-white mb-2">Deposits Review</h1>
          <p className="text-gray-400">Verify and approve user deposit requests.</p>
        </div>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-800 text-sm text-gray-400 bg-gray-900/50">
                <th className="p-4 font-medium">User</th>
                <th className="p-4 font-medium">Amount</th>
                <th className="p-4 font-medium">Method</th>
                <th className="p-4 font-medium">Reference ID</th>
                <th className="p-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {loading ? (
                <tr><td colSpan={5} className="p-4 text-center text-gray-400">Loading...</td></tr>
              ) : deposits.length === 0 ? (
                <tr><td colSpan={5} className="p-4 text-center text-gray-400">No pending deposits.</td></tr>
              ) : (
                deposits.map((deposit) => (
                  <tr key={deposit.id} className="border-b border-gray-800/50 hover:bg-gray-800/30">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div>
                          <p className="text-white font-medium">{deposit.user?.displayName || deposit.user?.username}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-green-400 font-bold">PKR {deposit.amount}</td>
                    <td className="p-4 text-gray-300">{deposit.method}</td>
                    <td className="p-4 text-gray-400 font-mono">{deposit.transactionReference}</td>
                    <td className="p-4">
                      <div className="flex items-center justify-end gap-2">
                        {deposit.screenshot?.url && (
                          <a 
                            href={deposit.screenshot.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="p-2 bg-blue-500/10 text-blue-500 hover:bg-blue-500 hover:text-white rounded transition-colors"
                            title="View Screenshot"
                          >
                            <FileImage className="w-4 h-4" />
                          </a>
                        )}
                        <button 
                          onClick={() => handleAction(deposit.id, 'APPROVE')}
                          className="p-2 bg-green-500/10 text-green-500 hover:bg-green-500 hover:text-white rounded transition-colors" 
                          title="Approve"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleAction(deposit.id, 'REJECT')}
                          className="p-2 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded transition-colors" 
                          title="Reject"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
