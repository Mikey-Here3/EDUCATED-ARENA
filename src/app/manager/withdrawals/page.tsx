'use client';

import { useState, useEffect } from 'react';
import { Check, X, Search, DollarSign, Clock } from 'lucide-react';
import { BattleConfirmModal } from '@/components/ui/battle-confirm-modal';
import { formatDateTime } from '@/lib/utils';

export default function WithdrawalsReview() {
  const [withdrawals, setWithdrawals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionTarget, setActionTarget] = useState<{ id: string; action: 'APPROVE' | 'REJECT' | 'MARK_PAID'; amount: number; user: string; account: string } | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const fetchWithdrawals = async () => {
    try {
      // Fetch both PENDING and APPROVED
      const res = await fetch('/api/manager/withdrawals');
      const data = await res.json();
      if (data.data) {
        setWithdrawals(data.data);
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

  const executeAction = async () => {
    if (!actionTarget) return;
    const { id, action } = actionTarget;
    setActionLoading(true);
    setFeedbackMsg(null);
    
    try {
      const res = await fetch(`/api/manager/withdrawals/${id}/review`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, notes: '' }),
      });
      if (res.ok) {
        setFeedbackMsg({ type: 'success', text: `Withdrawal successfully updated (${action}).` });
        setActionTarget(null);
        fetchWithdrawals();
      } else {
        const data = await res.json().catch(() => ({}));
        setFeedbackMsg({ type: 'error', text: data.error || 'Failed to process withdrawal' });
        setActionTarget(null);
      }
    } catch (e) {
      console.error(e);
      setFeedbackMsg({ type: 'error', text: 'Network error processing withdrawal' });
      setActionTarget(null);
    } finally {
      setActionLoading(false);
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
                <th className="p-4 font-medium">Requested Time</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {loading ? (
                <tr><td colSpan={7} className="p-4 text-center text-gray-400">Loading...</td></tr>
              ) : withdrawals.length === 0 ? (
                <tr><td colSpan={7} className="p-4 text-center text-gray-400">No pending withdrawals.</td></tr>
              ) : (
                withdrawals.map((withdrawal) => (
                  <tr key={withdrawal.id} className="border-b border-gray-800/50 hover:bg-gray-800/30">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div>
                          <p className="text-white font-medium">{withdrawal.user?.displayName || withdrawal.user?.username}</p>
                          <p className="text-xs text-gray-500">{withdrawal.user?.username}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-amber-400 font-bold">PKR {withdrawal.amount}</td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 text-xs font-bold rounded-lg ${
                        withdrawal.method === 'EASYPAISA' 
                          ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30' 
                          : 'bg-red-500/15 text-red-400 border border-red-500/30'
                      }`}>
                        {withdrawal.method || 'EASYPAISA'}
                      </span>
                    </td>
                    <td className="p-4">
                      <div>
                        <p className="text-white font-bold text-xs">{withdrawal.accountTitle || withdrawal.accountName || 'N/A'}</p>
                        <p className="text-cyan-400 font-mono text-xs">{withdrawal.accountNumber || 'N/A'}</p>
                      </div>
                    </td>
                    <td className="p-4 text-gray-300 text-xs whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-gray-500 shrink-0" />
                        <span>{formatDateTime(withdrawal.createdAt)}</span>
                      </div>
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
                              onClick={() => setActionTarget({
                                id: withdrawal.id,
                                action: 'APPROVE',
                                amount: withdrawal.amount,
                                user: withdrawal.user?.displayName || withdrawal.user?.username || 'User',
                                account: `${withdrawal.method || 'EASYPAISA'} - ${withdrawal.accountTitle || withdrawal.accountName || ''} (${withdrawal.accountNumber || ''})`
                              })}
                              className="p-2 bg-green-500/10 text-green-500 hover:bg-green-500 hover:text-white rounded transition-colors" 
                              title="Approve"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => setActionTarget({
                                id: withdrawal.id,
                                action: 'REJECT',
                                amount: withdrawal.amount,
                                user: withdrawal.user?.displayName || withdrawal.user?.username || 'User',
                                account: `${withdrawal.method || 'EASYPAISA'} - ${withdrawal.accountTitle || withdrawal.accountName || ''} (${withdrawal.accountNumber || ''})`
                              })}
                              className="p-2 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded transition-colors" 
                              title="Reject"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </>
                        )}
                        {(withdrawal.status === 'APPROVED' || withdrawal.status === 'PROCESSING') && (
                          <button 
                            onClick={() => setActionTarget({
                              id: withdrawal.id,
                              action: 'MARK_PAID',
                              amount: withdrawal.amount,
                              user: withdrawal.user?.displayName || 'User',
                              account: withdrawal.accountNumber || withdrawal.accountName || ''
                            })}
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

      {/* Action Dialog Modal */}
      <BattleConfirmModal
        isOpen={Boolean(actionTarget)}
        onClose={() => setActionTarget(null)}
        onConfirm={executeAction}
        title={
          actionTarget?.action === 'APPROVE' ? 'APPROVE WITHDRAWAL' :
          actionTarget?.action === 'MARK_PAID' ? 'MARK WITHDRAWAL AS PAID' :
          'REJECT WITHDRAWAL'
        }
        subtitle={actionTarget ? `Confirm ${actionTarget.action.replace('_', ' ').toLowerCase()} for PKR ${actionTarget.amount} requested by ${actionTarget.user}?` : undefined}
        confirmText={
          actionTarget?.action === 'APPROVE' ? 'Approve Cashout' :
          actionTarget?.action === 'MARK_PAID' ? 'Confirm Payment Sent' :
          'Reject Cashout'
        }
        cancelText="Back"
        variant={actionTarget?.action === 'REJECT' ? 'danger' : 'info'}
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
              <span className="text-amber-400 font-black">PKR {actionTarget.amount}</span>
            </div>
            {actionTarget.account && (
              <div className="flex justify-between">
                <span className="text-gray-400">Account</span>
                <span className="text-white font-mono">{actionTarget.account}</span>
              </div>
            )}
            {actionTarget.action === 'APPROVE' && (
              <p className="text-[11px] text-emerald-300 pt-2 border-t border-white/10">
                ✓ Approving moves this withdrawal to processing queue for payment dispatch.
              </p>
            )}
            {actionTarget.action === 'MARK_PAID' && (
              <p className="text-[11px] text-cyan-300 pt-2 border-t border-white/10">
                ✓ Marking as paid will complete the ledger withdrawal transaction.
              </p>
            )}
            {actionTarget.action === 'REJECT' && (
              <p className="text-[11px] text-rose-300 pt-2 border-t border-white/10">
                ⚠ Rejecting will refund the reserved withdrawal amount back to user's wallet.
              </p>
            )}
          </div>
        )}
      </BattleConfirmModal>
    </div>
  );
}
