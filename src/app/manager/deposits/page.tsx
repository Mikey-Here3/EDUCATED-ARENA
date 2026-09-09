'use client';

import { useState, useEffect } from 'react';
import { Check, X, Search, FileImage } from 'lucide-react';
import { BattleConfirmModal } from '@/components/ui/battle-confirm-modal';

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

  const [actionTarget, setActionTarget] = useState<{ id: string; action: 'APPROVE' | 'REJECT'; amount: number; user: string } | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const executeAction = async () => {
    if (!actionTarget) return;
    const { id, action } = actionTarget;
    setActionLoading(true);
    setFeedbackMsg(null);
    
    try {
      const res = await fetch(`/api/manager/deposits/${id}/review`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, notes: '' }),
      });
      if (res.ok) {
        setFeedbackMsg({ type: 'success', text: `Deposit ${action === 'APPROVE' ? 'approved' : 'rejected'} successfully.` });
        setActionTarget(null);
        fetchDeposits();
      } else {
        const data = await res.json().catch(() => ({}));
        setFeedbackMsg({ type: 'error', text: data.error || 'Failed to process deposit' });
        setActionTarget(null);
      }
    } catch (e) {
      console.error(e);
      setFeedbackMsg({ type: 'error', text: 'Network error processing deposit' });
      setActionTarget(null);
    } finally {
      setActionLoading(false);
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
                          onClick={() => setActionTarget({
                            id: deposit.id,
                            action: 'APPROVE',
                            amount: deposit.amount,
                            user: deposit.user?.displayName || deposit.accountName || 'User'
                          })}
                          className="p-2 bg-green-500/10 text-green-500 hover:bg-green-500 hover:text-white rounded transition-colors" 
                          title="Approve"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => setActionTarget({
                            id: deposit.id,
                            action: 'REJECT',
                            amount: deposit.amount,
                            user: deposit.user?.displayName || deposit.accountName || 'User'
                          })}
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

      {/* Action Dialog Modal */}
      <BattleConfirmModal
        isOpen={Boolean(actionTarget)}
        onClose={() => setActionTarget(null)}
        onConfirm={executeAction}
        title={actionTarget?.action === 'APPROVE' ? 'APPROVE DEPOSIT' : 'REJECT DEPOSIT'}
        subtitle={actionTarget ? `Confirm ${actionTarget.action.toLowerCase()} for PKR ${actionTarget.amount} requested by ${actionTarget.user}?` : undefined}
        confirmText={actionTarget?.action === 'APPROVE' ? 'Approve & Credit' : 'Reject Deposit'}
        cancelText="Back"
        variant={actionTarget?.action === 'APPROVE' ? 'info' : 'danger'}
        loading={actionLoading}
      >
        {actionTarget && (
          <div className="p-4 rounded-xl bg-black/60 border border-white/10 text-xs space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-400">Player</span>
              <span className="text-white font-bold">{actionTarget.user}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Amount</span>
              <span className="text-emerald-400 font-black">PKR {actionTarget.amount}</span>
            </div>
            {actionTarget.action === 'APPROVE' && (
              <p className="text-[11px] text-emerald-300 pt-2 border-t border-white/10">
                ✓ Approving will immediately credit this amount to the user's available wallet balance.
              </p>
            )}
            {actionTarget.action === 'REJECT' && (
              <p className="text-[11px] text-rose-300 pt-2 border-t border-white/10">
                ⚠ Rejecting will mark this deposit as invalid. No balance will be credited.
              </p>
            )}
          </div>
        )}
      </BattleConfirmModal>
    </div>
  );
}
