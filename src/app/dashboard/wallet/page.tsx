'use client';
import { useState, useEffect } from 'react';
import {
  Wallet,
  ArrowDownToLine,
  ArrowUpFromLine,
  Receipt,
  Copy,
  Check,
  ShieldCheck,
  Zap,
  Flame,
  Clock,
  CheckCircle2,
  XCircle,
  Trophy,
  AlertCircle,
  Loader2,
  Smartphone,
} from 'lucide-react';
import { cn, formatCurrency } from '@/lib/utils';

const QUICK_AMOUNTS = ['50', '100', '250', '500', '1000', '2000'];
const QUICK_WITHDRAW = ['200', '500', '1000', '2000'];

export default function WalletPage() {
  const [activeTab, setActiveTab] = useState<'deposit' | 'withdraw' | 'history'>('deposit');
  const [depositMethod, setDepositMethod] = useState<'EASYPAISA' | 'JAZZCASH'>('EASYPAISA');
  const [depositAmount, setDepositAmount] = useState('500');
  const [depositRef, setDepositRef] = useState('');
  const [depositLoading, setDepositLoading] = useState(false);
  const [depositMessage, setDepositMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [copied, setCopied] = useState(false);

  const [withdrawMethod, setWithdrawMethod] = useState<'EASYPAISA' | 'JAZZCASH'>('EASYPAISA');
  const [withdrawAmount, setWithdrawAmount] = useState('500');
  const [accountTitle, setAccountTitle] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [withdrawLoading, setWithdrawLoading] = useState(false);
  const [withdrawMessage, setWithdrawMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [summary, setSummary] = useState({
    available: 0,
    reserved: 0,
    pending: 0,
    totalWinnings: 0,
    totalDeposits: 0,
    totalWithdrawals: 0,
  });
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Official tournament cashier accounts for Pakistan
  const officialAccounts = {
    EASYPAISA: {
      title: 'Educated Gamer Official',
      number: '03459876543',
    },
    JAZZCASH: {
      title: 'Educated Gamer Official',
      number: '03041234567',
    },
  };

  async function loadData() {
    try {
      const [sumRes, txRes] = await Promise.all([
        fetch('/api/wallet/summary'),
        fetch('/api/wallet/transactions'),
      ]);
      if (sumRes.ok) {
        const sumData = await sumRes.json();
        setSummary(sumData);
      }
      if (txRes.ok) {
        const txData = await txRes.json();
        if (txData.data) {
          setTransactions(txData.data);
        }
      }
    } catch (e) {
      console.error('Failed to load wallet data:', e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  function handleCopyNumber(num: string) {
    navigator.clipboard.writeText(num);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  async function handleDeposit(e: React.FormEvent) {
    e.preventDefault();
    setDepositLoading(true);
    setDepositMessage(null);

    const fileInput = document.getElementById('depositScreenshot') as HTMLInputElement;
    const file = fileInput?.files?.[0];

    if (!file) {
      setDepositMessage({ type: 'error', text: 'Please select a screenshot to upload.' });
      setDepositLoading(false);
      return;
    }

    try {
      // 1. Upload the screenshot
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', 'PAYMENT_SCREENSHOT');

      const uploadRes = await fetch('/api/uploads', {
        method: 'POST',
        body: formData,
      });

      const uploadJson = await uploadRes.json();
      if (!uploadRes.ok) {
        setDepositMessage({ type: 'error', text: uploadJson.error || 'Failed to upload screenshot' });
        setDepositLoading(false);
        return;
      }

      const screenshotId = uploadJson.fileAsset.id;

      // 2. Submit the deposit
      const res = await fetch('/api/wallet/deposit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: parseFloat(depositAmount),
          method: depositMethod,
          transactionReference: depositRef,
          screenshotId,
        }),
      });
      const json = await res.json();
      if (res.ok) {
        setDepositMessage({
          type: 'success',
          text: json.message || 'Deposit submitted! Manager is verifying your payment (usually 2-5 mins).',
        });
        setDepositRef('');
        if (fileInput) fileInput.value = '';
        loadData();
      } else {
        setDepositMessage({ type: 'error', text: json.error || 'Failed to submit deposit' });
      }
    } catch {
      setDepositMessage({ type: 'error', text: 'Network error submitting deposit' });
    } finally {
      setDepositLoading(false);
    }
  }

  async function handleWithdraw(e: React.FormEvent) {
    e.preventDefault();
    setWithdrawLoading(true);
    setWithdrawMessage(null);
    try {
      const res = await fetch('/api/wallet/withdraw', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: parseFloat(withdrawAmount),
          method: withdrawMethod,
          accountName: accountTitle,
          accountTitle,
          accountNumber,
        }),
      });
      const json = await res.json();
      if (res.ok) {
        setWithdrawMessage({
          type: 'success',
          text: json.message || 'Cashout requested! Cash is sent to your mobile wallet shortly.',
        });
        setAccountTitle('');
        setAccountNumber('');
        loadData();
      } else {
        setWithdrawMessage({ type: 'error', text: json.error || 'Failed to submit cashout' });
      }
    } catch {
      setWithdrawMessage({ type: 'error', text: 'Network error submitting cashout' });
    } finally {
      setWithdrawLoading(false);
    }
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto px-2 sm:px-4 pb-20">
      {/* Gamer Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#16102b] via-[#231445] to-[#16102b] border border-white/10 p-5 sm:p-6 shadow-2xl">
        <div className="absolute -right-10 -top-10 w-44 h-44 bg-[#00f59b]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#00f59b]/10 border border-[#00f59b]/30 text-[#00f59b] text-xs font-bold mb-2">
              <Zap className="w-3.5 h-3.5" /> INSTANT PAKISTAN CASHOUT
            </div>
            <h1 className="text-2xl sm:text-3xl font-black font-heading tracking-wide text-white">
              BATTLE CASH &amp; WALLET
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1">
              Deposit entry cash and withdraw victory prizes via Easypaisa &amp; JazzCash.
            </p>
          </div>

          {/* Quick Safety Badge */}
          <div className="flex items-center gap-2 bg-black/40 border border-white/10 px-3.5 py-2 rounded-xl backdrop-blur-md">
            <ShieldCheck className="w-5 h-5 text-[#00f59b] shrink-0" />
            <div className="text-left text-xs">
              <p className="font-bold text-white">100% Secure Escrow</p>
              <p className="text-[10px] text-slate-400">Funds locked until match verified</p>
            </div>
          </div>
        </div>
      </div>

      {/* High-Impact Gamer Balance Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        {/* Available Balance */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-[#00f59b]/10 to-[#080512] border-2 border-[#00f59b]/40 p-4 sm:p-5 shadow-[0_0_25px_rgba(0,245,155,0.15)]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-[#00f59b] uppercase tracking-wider flex items-center gap-1.5">
              <Wallet className="w-4 h-4" /> Battle Cash
            </span>
            <span className="w-2.5 h-2.5 rounded-full bg-[#00f59b] animate-pulse" />
          </div>
          <div className="text-3xl sm:text-4xl font-black text-white font-heading tracking-tight">
            {formatCurrency(summary.available)}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Your available cash for battles</p>
        </div>

        {/* Locked In Active Battles */}
        <div className="relative overflow-hidden rounded-2xl bg-[#0e091d] border border-white/10 p-4 sm:p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-[#ffb703] uppercase tracking-wider flex items-center gap-1.5">
              <Clock className="w-4 h-4" /> In Active Fights
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-[#ffb703] font-heading tracking-tight">
            {formatCurrency(summary.reserved)}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Stakes safely locked in progress</p>
        </div>

        {/* Total Cash Won */}
        <div className="relative overflow-hidden rounded-2xl bg-[#0e091d] border border-white/10 p-4 sm:p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-[#ff3b56] uppercase tracking-wider flex items-center gap-1.5">
              <Trophy className="w-4 h-4" /> Arena Winnings
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white font-heading tracking-tight">
            {formatCurrency(summary.totalWinnings)}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Lifetime tournament prizes won</p>
        </div>
      </div>

      {/* Mobile-First Big Touch Tabs */}
      <div className="grid grid-cols-3 gap-2 p-1.5 bg-[#0e091d] border border-white/10 rounded-2xl">
        <button
          onClick={() => setActiveTab('deposit')}
          className={cn(
            'flex items-center justify-center gap-2 py-3 px-3 rounded-xl font-bold text-xs sm:text-sm transition-all active:scale-95',
            activeTab === 'deposit'
              ? 'bg-[#00f59b] text-black shadow-[0_0_15px_rgba(0,245,155,0.4)]'
              : 'text-slate-400 hover:text-white'
          )}
        >
          <ArrowDownToLine className="w-4 h-4 shrink-0" />
          <span>ADD CASH</span>
        </button>

        <button
          onClick={() => setActiveTab('withdraw')}
          className={cn(
            'flex items-center justify-center gap-2 py-3 px-3 rounded-xl font-bold text-xs sm:text-sm transition-all active:scale-95',
            activeTab === 'withdraw'
              ? 'bg-[#ffb703] text-black shadow-[0_0_15px_rgba(255,183,3,0.4)]'
              : 'text-slate-400 hover:text-white'
          )}
        >
          <ArrowUpFromLine className="w-4 h-4 shrink-0" />
          <span>CASHOUT</span>
        </button>

        <button
          onClick={() => setActiveTab('history')}
          className={cn(
            'flex items-center justify-center gap-2 py-3 px-3 rounded-xl font-bold text-xs sm:text-sm transition-all active:scale-95',
            activeTab === 'history'
              ? 'bg-[#9d4edd] text-white shadow-[0_0_15px_rgba(157,78,221,0.4)]'
              : 'text-slate-400 hover:text-white'
          )}
        >
          <Receipt className="w-4 h-4 shrink-0" />
          <span>HISTORY</span>
        </button>
      </div>

      {/* ─── TAB 1: ADD CASH (EASYPAISA / JAZZCASH) ─── */}
      {activeTab === 'deposit' && (
        <div className="space-y-5">
          {depositMessage && (
            <div
              className={cn(
                'p-4 rounded-2xl text-sm flex items-start gap-3 border',
                depositMessage.type === 'success'
                  ? 'bg-[#00f59b]/15 border-[#00f59b]/40 text-[#00f59b]'
                  : 'bg-[#ff2040]/15 border-[#ff2040]/40 text-[#ff3b56]'
              )}
            >
              {depositMessage.type === 'success' ? (
                <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              )}
              <p className="font-semibold">{depositMessage.text}</p>
            </div>
          )}

          {/* Step 1: Select Payment App */}
          <div className="p-5 rounded-2xl bg-[#100b21] border border-white/10 space-y-4">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#00f59b] text-black font-black text-xs flex items-center justify-center">
                1
              </span>
              <h3 className="font-bold text-white text-base">Select Your Mobile Payment App</h3>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setDepositMethod('EASYPAISA')}
                className={cn(
                  'p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all active:scale-95 text-center',
                  depositMethod === 'EASYPAISA'
                    ? 'border-[#00f59b] bg-[#00f59b]/10 text-white shadow-[0_0_15px_rgba(0,245,155,0.2)]'
                    : 'border-white/10 bg-black/30 text-slate-400 hover:border-white/20'
                )}
              >
                <div className="w-10 h-10 rounded-full bg-[#00c853] flex items-center justify-center font-black text-white text-xs">
                  EP
                </div>
                <span className="font-bold text-sm">Easypaisa</span>
                <span className="text-[10px] text-slate-400">Instant transfer</span>
              </button>

              <button
                type="button"
                onClick={() => setDepositMethod('JAZZCASH')}
                className={cn(
                  'p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all active:scale-95 text-center',
                  depositMethod === 'JAZZCASH'
                    ? 'border-[#ff2040] bg-[#ff2040]/10 text-white shadow-[0_0_15px_rgba(255,32,64,0.2)]'
                    : 'border-white/10 bg-black/30 text-slate-400 hover:border-white/20'
                )}
              >
                <div className="w-10 h-10 rounded-full bg-[#ff2040] flex items-center justify-center font-black text-white text-xs">
                  JC
                </div>
                <span className="font-bold text-sm">JazzCash</span>
                <span className="text-[10px] text-slate-400">Instant transfer</span>
              </button>
            </div>

            {/* Tap to copy Cashier Card */}
            <div className="mt-4 p-4 rounded-xl bg-black/60 border border-white/15 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <p className="text-xs text-slate-400">Send Payment To This Official Number:</p>
                <p className="text-lg sm:text-xl font-mono font-black text-white tracking-wider mt-0.5">
                  {officialAccounts[depositMethod].number}
                </p>
                <p className="text-[11px] text-[#00f59b] font-medium">
                  Account Title: {officialAccounts[depositMethod].title}
                </p>
              </div>

              <button
                type="button"
                onClick={() => handleCopyNumber(officialAccounts[depositMethod].number)}
                className="battle-btn-green px-4 py-2.5 rounded-xl font-bold text-black text-xs flex items-center justify-center gap-2 shrink-0 active:scale-95 shadow-md"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4" /> COPIED!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" /> TAP TO COPY NUMBER
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Step 2 & 3: Amount and TID Confirmation Form */}
          <form onSubmit={handleDeposit} className="p-5 rounded-2xl bg-[#100b21] border border-white/10 space-y-4">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#00f59b] text-black font-black text-xs flex items-center justify-center">
                2
              </span>
              <h3 className="font-bold text-white text-base">Enter Amount &amp; Transaction ID (TID)</h3>
            </div>

            {/* Quick Amount Selector */}
            <div>
              <label className="text-xs font-semibold text-slate-300 mb-2 block">
                Select Amount (PKR) — Minimum PKR 50
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 mb-2">
                {QUICK_AMOUNTS.map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setDepositAmount(amt)}
                    className={cn(
                      'py-2 px-1 rounded-xl text-xs font-bold border transition-all active:scale-95',
                      depositAmount === amt
                        ? 'bg-[#00f59b] text-black border-[#00f59b]'
                        : 'bg-white/5 border-white/10 text-slate-300 hover:border-white/20'
                    )}
                  >
                    PKR {amt}
                  </button>
                ))}
              </div>
              <input
                type="number"
                min="50"
                value={depositAmount}
                onChange={(e) => setDepositAmount(e.target.value)}
                placeholder="Or type custom amount..."
                className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:border-[#00f59b] focus:outline-none transition-all"
                required
              />
            </div>

            {/* TID Input */}
            <div>
              <label className="text-xs font-semibold text-slate-300 mb-1.5 block">
                Transaction ID (TID) from Easypaisa / JazzCash SMS:
              </label>
              <input
                type="text"
                value={depositRef}
                onChange={(e) => setDepositRef(e.target.value)}
                placeholder="e.g. 29482018401 (11 digits)"
                className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white font-mono text-sm focus:border-[#00f59b] focus:outline-none tracking-wide transition-all"
                required
              />
              <p className="text-[11px] text-slate-400 mt-1">
                You receive this TID in your SMS or payment receipt screen after sending money.
              </p>
            </div>

            {/* Image Upload Input */}
            <div>
              <label className="text-xs font-semibold text-slate-300 mb-1.5 block">
                Upload Payment Screenshot (Required):
              </label>
              <input
                type="file"
                id="depositScreenshot"
                accept="image/*"
                className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-[#00f59b] file:text-black hover:file:bg-[#00c853] transition-all cursor-pointer"
                required
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Clear screenshot showing the transaction amount and TID.
              </p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={depositLoading || !depositRef}
              className="w-full battle-btn-green py-4 rounded-xl font-heading font-black text-black text-base flex items-center justify-center gap-2 active:scale-95 transition-all disabled:opacity-50 mt-4"
            >
              {depositLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" /> UPLOADING &amp; VERIFYING...
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-5 h-5" /> CONFIRM &amp; ADD CASH (2-5 MINS)
                </>
              )}
            </button>
          </form>
        </div>
      )}

      {/* ─── TAB 2: CASHOUT (WITHDRAWAL) ─── */}
      {activeTab === 'withdraw' && (
        <form onSubmit={handleWithdraw} className="p-5 sm:p-6 rounded-2xl bg-[#100b21] border border-white/10 space-y-5">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-[#ffb703] text-black font-black text-xs flex items-center justify-center">
              ✓
            </span>
            <div>
              <h3 className="font-bold text-white text-base">Instant Cashout to Mobile Wallet</h3>
              <p className="text-xs text-slate-400">Sent directly to your Easypaisa or JazzCash (Min PKR 200)</p>
            </div>
          </div>

          {withdrawMessage && (
            <div
              className={cn(
                'p-4 rounded-2xl text-sm flex items-start gap-3 border',
                withdrawMessage.type === 'success'
                  ? 'bg-[#00f59b]/15 border-[#00f59b]/40 text-[#00f59b]'
                  : 'bg-[#ff2040]/15 border-[#ff2040]/40 text-[#ff3b56]'
              )}
            >
              {withdrawMessage.type === 'success' ? (
                <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              )}
              <p className="font-semibold">{withdrawMessage.text}</p>
            </div>
          )}

          {/* Provider Selection */}
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setWithdrawMethod('EASYPAISA')}
              className={cn(
                'p-3.5 rounded-xl border-2 flex items-center justify-center gap-2 transition-all active:scale-95',
                withdrawMethod === 'EASYPAISA'
                  ? 'border-[#00c853] bg-[#00c853]/10 text-white font-bold'
                  : 'border-white/10 bg-black/30 text-slate-400'
              )}
            >
              <Smartphone className="w-4 h-4 text-[#00c853]" />
              Easypaisa
            </button>

            <button
              type="button"
              onClick={() => setWithdrawMethod('JAZZCASH')}
              className={cn(
                'p-3.5 rounded-xl border-2 flex items-center justify-center gap-2 transition-all active:scale-95',
                withdrawMethod === 'JAZZCASH'
                  ? 'border-[#ff2040] bg-[#ff2040]/10 text-white font-bold'
                  : 'border-white/10 bg-black/30 text-slate-400'
              )}
            >
              <Smartphone className="w-4 h-4 text-[#ff2040]" />
              JazzCash
            </button>
          </div>

          {/* Amount Selection */}
          <div>
            <label className="text-xs font-semibold text-slate-300 mb-2 block">
              Cashout Amount (PKR) — Minimum PKR 200
            </label>
            <div className="grid grid-cols-4 gap-2 mb-2">
              {QUICK_WITHDRAW.map((amt) => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => setWithdrawAmount(amt)}
                  className={cn(
                    'py-2 px-1 rounded-xl text-xs font-bold border transition-all active:scale-95',
                    withdrawAmount === amt
                      ? 'bg-[#ffb703] text-black border-[#ffb703]'
                      : 'bg-white/5 border-white/10 text-slate-300 hover:border-white/20'
                  )}
                >
                  PKR {amt}
                </button>
              ))}
            </div>
            <input
              type="number"
              min="200"
              max={summary.available}
              value={withdrawAmount}
              onChange={(e) => setWithdrawAmount(e.target.value)}
              className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:border-[#ffb703] focus:outline-none"
              required
            />
          </div>

          {/* Account Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-300 mb-1.5 block">
                {withdrawMethod} Mobile Number:
              </label>
              <input
                type="tel"
                placeholder="03001234567"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white font-mono text-sm focus:border-[#ffb703] focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 mb-1.5 block">
                Account Holder Real Name:
              </label>
              <input
                type="text"
                placeholder="e.g. Muhammad Ali"
                value={accountTitle}
                onChange={(e) => setAccountTitle(e.target.value)}
                className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:border-[#ffb703] focus:outline-none"
                required
              />
            </div>
          </div>

          {/* Submit Cashout Button */}
          <button
            type="submit"
            disabled={withdrawLoading || !accountNumber || !accountTitle || summary.available < 200}
            className="w-full battle-btn-gold py-4 rounded-xl font-heading font-black text-black text-base flex items-center justify-center gap-2 active:scale-95 transition-all disabled:opacity-50"
          >
            {withdrawLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" /> SENDING CASHOUT...
              </>
            ) : (
              <>
                <ArrowUpFromLine className="w-5 h-5" /> CASHOUT PKR {withdrawAmount} NOW
              </>
            )}
          </button>
        </form>
      )}

      {/* ─── TAB 3: CASH HISTORY ─── */}
      {activeTab === 'history' && (
        <div className="p-4 sm:p-5 rounded-2xl bg-[#100b21] border border-white/10 space-y-3">
          <h3 className="font-bold text-white text-base mb-3 flex items-center gap-2">
            <Receipt className="w-4 h-4 text-[#9d4edd]" /> Recent Cash Activity
          </h3>

          {transactions.length === 0 ? (
            <div className="text-center py-10 text-slate-400 text-sm">
              No transactions yet. Add cash or play a battle to see history.
            </div>
          ) : (
            <div className="divide-y divide-white/5 space-y-2">
              {transactions.map((tx) => {
                const isCredit = [
                  'DEPOSIT',
                  'DEPOSIT_APPROVED',
                  'WINNING_CREDIT',
                  'REFUND',
                  'MATCH_RESERVATION_RELEASE',
                ].includes(tx.type);

                return (
                  <div key={tx.id} className="pt-2 flex items-center justify-between gap-3">
                    <div>
                      <p className="text-xs sm:text-sm font-semibold text-white">
                        {tx.description || tx.type}
                      </p>
                      <p className="text-[10px] text-slate-400">
                        {new Date(tx.createdAt).toLocaleDateString('en-PK', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>

                    <div className="text-right">
                      <p
                        className={cn(
                          'font-mono font-bold text-sm',
                          isCredit ? 'text-[#00f59b]' : 'text-[#ff3b56]'
                        )}
                      >
                        {isCredit ? '+' : '-'} {formatCurrency(tx.amount)}
                      </p>
                      <span className="text-[10px] text-slate-400 uppercase">{tx.status}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
