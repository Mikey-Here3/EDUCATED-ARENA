import { RotateCcw, CheckCircle2, ShieldCheck } from 'lucide-react';
import { MobileBattleNav } from '@/components/navigation/mobile-battle-nav';

export default function RefundPolicyPage() {
  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto pt-24 pb-32">
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#00f0ff]/40 bg-[#00f0ff]/10 text-xs font-black text-[#00f0ff] mb-3 uppercase tracking-wider shadow-[0_0_15px_rgba(0,240,255,0.2)]">
          <RotateCcw size={14} />
          Guaranteed Protection
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white italic tracking-tight font-heading text-glow-cyan mb-3">
          REFUND &amp; CANCELLATIONS
        </h1>
        <p className="text-slate-300 text-xs sm:text-sm max-w-lg mx-auto leading-relaxed">
          100% money-back guarantee for unaccepted stakes and server void matches.
        </p>
      </div>

      <div className="space-y-6 text-xs sm:text-sm text-slate-300 leading-relaxed bg-[#060a22]/90 p-6 sm:p-10 rounded-3xl border border-[#00f0ff]/25 shadow-xl">
        <section className="space-y-2">
          <h2 className="text-base font-black text-white uppercase font-heading flex items-center gap-2 text-[#00f0ff]">
            <CheckCircle2 size={16} />
            1. Pre-Match Stake Cancellation
          </h2>
          <p className="text-slate-300 leading-relaxed">
            If a challenge created by a player has not yet been accepted by an opponent, the creator may cancel it at any time with 1-tap. 100% of the reserved stake funds are immediately released back to the available wallet balance with zero cancellation fee.
          </p>
        </section>

        <section className="space-y-2 border-t border-white/10 pt-4">
          <h2 className="text-base font-black text-white uppercase font-heading flex items-center gap-2 text-[#00ff88]">
            <ShieldCheck size={16} />
            2. Match Void &amp; Opponent No-Show Refunds
          </h2>
          <p className="text-slate-300 leading-relaxed">
            If an accepted match cannot proceed due to Garena game server downtime, room setup issues, or opponent no-show beyond 15 minutes, our match referee voids the battle and issues a complete 100% refund of entry fees.
          </p>
        </section>

        <section className="space-y-2 border-t border-white/10 pt-4">
          <h2 className="text-base font-black text-white uppercase font-heading flex items-center gap-2 text-[#ffbe1a]">
            <RotateCcw size={16} />
            3. Finality of Verified Settlements
          </h2>
          <p className="text-slate-300 leading-relaxed">
            Once match outcome screenshots have been verified and prize funds disbursed to the winning participant, settlements are final. In the event that anti-cheat audits subsequently confirm match hacking, winnings are revoked and returned to the compliant victim.
          </p>
        </section>
      </div>

      <MobileBattleNav />
    </div>
  );
}
