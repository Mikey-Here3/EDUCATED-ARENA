import { Wallet, ShieldCheck, ArrowDownToLine, ArrowUpFromLine, CheckCircle2 } from 'lucide-react';
import { MobileBattleNav } from '@/components/navigation/mobile-battle-nav';

export default function WalletPolicyPage() {
  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto pt-24 pb-32">
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#00ff88]/40 bg-[#00ff88]/10 text-xs font-black text-[#00ff88] mb-3 uppercase tracking-wider shadow-[0_0_15px_rgba(0,255,136,0.2)]">
          <Wallet size={14} />
          Financial Safety
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white italic tracking-tight font-heading text-glow-green mb-3">
          WALLET &amp; PAYMENT POLICY
        </h1>
        <p className="text-slate-300 text-xs sm:text-sm max-w-lg mx-auto leading-relaxed">
          Double-entry immutable ledger accounting with Pakistani mobile banking integration.
        </p>
      </div>

      <div className="space-y-6 text-xs sm:text-sm text-slate-300 leading-relaxed bg-[#060a22]/90 p-6 sm:p-10 rounded-3xl border border-[#00ff88]/25 shadow-xl">
        <section className="space-y-2">
          <h2 className="text-base font-black text-white uppercase font-heading flex items-center gap-2 text-[#00ff88]">
            <CheckCircle2 size={16} />
            1. Official Pakistani Payment Channels
          </h2>
          <p className="text-slate-300 leading-relaxed">
            Educated Gamer Arena supports manual direct deposits and withdrawals through official verified Easypaisa and JazzCash business accounts. Never transfer funds to personal numbers not listed on the official platform cashier screen.
          </p>
        </section>

        <section className="space-y-2 border-t border-white/10 pt-4">
          <h2 className="text-base font-black text-white uppercase font-heading flex items-center gap-2 text-[#00ff88]">
            <CheckCircle2 size={16} />
            2. Minimum Deposit &amp; Cash Out Thresholds
          </h2>
          <p className="text-slate-300 leading-relaxed">
            The minimum deposit amount is PKR 50. The minimum cash-out withdrawal threshold is PKR 200. Withdrawals are processed directly to an Easypaisa or JazzCash account registered in the player&apos;s own legal name.
          </p>
        </section>

        <section className="space-y-2 border-t border-white/10 pt-4">
          <h2 className="text-base font-black text-white uppercase font-heading flex items-center gap-2 text-[#00f0ff]">
            <ShieldCheck size={16} />
            3. Cryptographic Double-Entry Ledger
          </h2>
          <p className="text-slate-300 leading-relaxed">
            Every PKR balance modification is recorded across an immutable, append-only financial ledger with unique transaction reference hashes. Funds reserved for live matches remain escrowed safely in database isolation until the match finishes or cancels.
          </p>
        </section>

        <section className="space-y-2 border-t border-white/10 pt-4">
          <h2 className="text-base font-black text-white uppercase font-heading flex items-center gap-2 text-[#00ff88]">
            <ArrowUpFromLine size={16} />
            4. Fast Payout Turnaround
          </h2>
          <p className="text-slate-300 leading-relaxed">
            Withdrawal requests are reviewed and sent by EGA financial managers within 2 to 24 hours on operational business days. Platform withdrawal fee is strictly 0%.
          </p>
        </section>
      </div>

      <MobileBattleNav />
    </div>
  );
}
