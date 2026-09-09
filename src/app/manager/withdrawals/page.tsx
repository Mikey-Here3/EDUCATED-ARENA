'use client';

import { useState, useEffect } from 'react';
import { Check, X, Search, DollarSign } from 'lucide-react';

export default function WithdrawalsReview() {
  const [withdrawals, setWithdrawals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchWithdrawals = async () => {
    try {
      // Fetch both PENDING and APPROVED
      const res = await fetch('/api/manager/withdrawals');
      const data = await res.json();
      if (data.data) {
        setWithdrawals(data.data.filter((w: any) => w.status === 'PENDING' || w.status === 'APPROVED' || w.status === 'PROCESSING'));
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWithdrawals();
  }, []);

  const handleAction = async (id: string, action: 'APPROVE' | 'REJECT' | 'MARK_PAID') => {
    if (!confirm(`Are you sure you want to ${action} this withdrawal?`)) return;
    
    try {
      const res = await fetch(`/api/manager/withdrawals/${id}/review`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, notes: '' }),
      });
      if (res.ok) {
        fetchWithdrawals();
      } else {
        alert('Failed to process withdrawal');
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tight text-white mb-2">Withdrawals Review</h1>
          <p className="text-gray-400">Process user withdrawal requests and mark as paid.</p>
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
                <th className="p-4 font-medium">Account Info</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {loading ? (
                <tr><td colSpan={6} className="p-4 text-center text-gray-400">Loading...</td></tr>
              ) : withdrawals.length === 0 ? (
                <tr><td colSpan={6} className="p-4 text-center text-gray-400">No pending withdrawals.</td></tr>
              ) : (
                withdrawals.map((withdrawal) => (
                  <tr key={withdrawal.id} className="border-b border-gray-800/50 hover:bg-gray-800/30">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div>
                          <p className="text-white font-medium">{withdrawal.user?.displayName || withdrawal.user?.username}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-amber-400 font-bold">PKR {withdrawal.amount}</td>
                    <td className="p-4 text-gray-300">{withdrawal.paymentMethod}</td>
                    <td className="p-4 text-gray-400 font-mono text-xs max-w-[150px] truncate" title={JSON.stringify(withdrawal.accountDetails)}>
                      {JSON.stringify(withdrawal.accountDetails)}
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-1 text-xs font-bold rounded ${
                        withdrawal.status === 'PENDING' ? 'bg-amber-500/10 text-amber-500' :
                        'bg-blue-500/10 text-blue-500'
                      }`}>
                        {withdrawal.status}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-end gap-2">
                        {withdrawal.status === 'PENDING' && (
                          <>
                            <button 
                              onClick={() => handleAction(withdrawal.id, 'APPROVE')}
                              className="p-2 bg-green-500/10 text-green-500 hover:bg-green-500 hover:text-white rounded transition-colors" 
                              title="Approve"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => handleAction(withdrawal.id, 'REJECT')}
                              className="p-2 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded transition-colors" 
                              title="Reject"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </>
                        )}
                        {(withdrawal.status === 'APPROVED' || withdrawal.status === 'PROCESSING') && (
                          <button 
                            onClick={() => handleAction(withdrawal.id, 'MARK_PAID')}
                            className="p-2 bg-blue-500/10 text-blue-500 hover:bg-blue-500 hover:text-white rounded transition-colors" 
                            title="Mark as Paid"
                          >
                            <DollarSign className="w-4 h-4" />
                          </button>
                        )}
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
