import { ShieldAlert, CheckCircle2, Ban, Lock, FileText, AlertCircle, Scale, Zap } from 'lucide-react';
import { MobileBattleNav } from '@/components/navigation/mobile-battle-nav';

export default function FairPlayPage() {
  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto pt-24 pb-32">
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#00f0ff]/40 bg-[#00f0ff]/10 text-xs font-black text-[#00f0ff] mb-3 uppercase tracking-wider shadow-[0_0_15px_rgba(0,240,255,0.2)]">
          <Scale size={14} />
          Anti-Cheat &amp; Fair Play
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white italic tracking-tight font-heading text-glow-cyan mb-3">
          FAIR PLAY POLICY
        </h1>
        <p className="text-slate-300 text-xs sm:text-sm max-w-lg mx-auto leading-relaxed">
          Educated Gamer Arena maintains a strict zero-tolerance policy against cheats, scripts, smurfing, and abusive match conduct.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="rounded-3xl border border-red-500/30 bg-[#160a12]/80 p-6 shadow-xl relative overflow-hidden">
          <div className="w-12 h-12 rounded-2xl bg-red-500/15 border border-red-500/40 flex items-center justify-center text-red-400 mb-4 shadow-md">
            <Ban size={24} />
          </div>
          <h3 className="text-base font-black text-white mb-2 font-heading uppercase tracking-wide">
            Zero Tolerance for Cheats &amp; Scripts
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Use of headshot hacks, wall penetration, speed modifiers, antenna scripts, config files, or modified game APKs results in an immediate permanent hardware ban and complete confiscation of platform wallet balances.
          </p>
        </div>

        <div className="rounded-3xl border border-[#ffbe1a]/30 bg-[#1a1506]/80 p-6 shadow-xl relative overflow-hidden">
          <div className="w-12 h-12 rounded-2xl bg-[#ffbe1a]/15 border border-[#ffbe1a]/40 flex items-center justify-center text-[#ffbe1a] mb-4 shadow-md">
            <Lock size={24} />
          </div>
          <h3 className="text-base font-black text-white mb-2 font-heading uppercase tracking-wide">
            Verified Free Fire Identity
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Players may only enter custom rooms with their genuine registered Free Fire UID. Ringing unregistered players or swapping players mid-match results in instant disqualification and forfeiture of entry fees.
          </p>
        </div>
      </div>

      <div className="rounded-3xl border border-[#00f0ff]/25 bg-[#060a22]/90 p-8 space-y-4 text-xs sm:text-sm text-slate-300 shadow-xl mb-8">
        <div className="flex items-center gap-2.5 text-[#00f0ff] font-heading font-black text-base uppercase">
          <ShieldAlert size={20} />
          <span>Manager Supervision &amp; Auditing</span>
        </div>
        <p className="leading-relaxed">
          Every cash match on Educated Gamer Arena is monitored by an official operational Manager. Managers are authorized to join custom rooms as referees, record match gameplay, and verify live match conditions.
        </p>
        <p className="leading-relaxed">
          In dispute situations, managers cross-reference end-game screenshot proofs, referee recordings, and combat logs. Manager decisions on match integrity are final and binding.
        </p>
      </div>

      <MobileBattleNav />
    </div>
  );
}
