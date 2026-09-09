import Link from 'next/link';
import { Zap, Wallet, Trophy, Shield, ArrowRight, Gamepad2, Camera, CheckCircle, Star } from 'lucide-react';
import { MobileBattleNav } from '@/components/navigation/mobile-battle-nav';

const STEPS = [
  {
    num: '01',
    icon: Shield,
    title: 'Sign Up & Link Your UID',
    desc: 'Create your free account, verify your email, then enter your Free Fire In-Game UID — we check it\'s real so every match is fair.',
    color: 'cyan',
  },
  {
    num: '02',
    icon: Wallet,
    title: 'Add PKR to Your Wallet',
    desc: 'Send funds via Easypaisa or JazzCash. Our team confirms within minutes — your cash is locked safe until you win or withdraw.',
    color: 'green',
  },
  {
    num: '03',
    icon: Gamepad2,
    title: 'Pick Your Battle Format',
    desc: '1v1 Duels, 2v2 Duos, 4v4 Clash Squad, or full Tournaments. Set your entry fee and challenge any player — or browse open challenges.',
    color: 'purple',
  },
  {
    num: '04',
    icon: Star,
    title: 'Get Your Custom Room',
    desc: 'Once both sides lock in, our Manager assigns an official Free Fire Custom Room ID + Password. Everyone joins, match begins.',
    color: 'gold',
  },
  {
    num: '05',
    icon: Camera,
    title: 'Submit Your Result Screenshot',
    desc: 'After the match ends, both sides upload clear end-game screenshots. Manager verifies the proof — no arguments, no bias.',
    color: 'cyan',
  },
  {
    num: '06',
    icon: Trophy,
    title: 'Winnings Hit Your Wallet Instantly',
    desc: 'Prize PKR goes straight to the winner\'s wallet. Withdraw to Easypaisa or JazzCash any time — no hidden fees on withdrawals.',
    color: 'green',
  },
];

const colorMap: Record<string, { icon: string; border: string; num: string; glow: string }> = {
  cyan:   { icon: 'text-[#00f0ff]', border: 'border-[#00f0ff]/30', num: 'bg-[#00f0ff]/10 text-[#00f0ff]', glow: 'shadow-[0_0_20px_rgba(0,240,255,0.15)]' },
  green:  { icon: 'text-[#00ff88]', border: 'border-[#00ff88]/30', num: 'bg-[#00ff88]/10 text-[#00ff88]', glow: 'shadow-[0_0_20px_rgba(0,255,136,0.15)]' },
  purple: { icon: 'text-[#a855f7]', border: 'border-[#a855f7]/30', num: 'bg-[#a855f7]/10 text-[#a855f7]', glow: 'shadow-[0_0_20px_rgba(168,85,247,0.15)]' },
  gold:   { icon: 'text-[#ffbe1a]', border: 'border-[#ffbe1a]/30', num: 'bg-[#ffbe1a]/10 text-[#ffbe1a]', glow: 'shadow-[0_0_20px_rgba(255,190,26,0.15)]' },
};

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen pb-32 pt-6 px-4 sm:px-6 max-w-4xl mx-auto">

      {/* Header */}
      <div className="text-center mb-14 pt-16">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#00f0ff]/30 bg-[#00f0ff]/10 text-xs font-black text-[#00f0ff] mb-4 uppercase tracking-widest">
          <Zap size={13} />
          Simple. Fast. Fair.
        </div>
        <h1 className="text-4xl sm:text-6xl font-black text-white italic tracking-tight font-heading text-glow-cyan mb-4">
          HOW IT WORKS
        </h1>
        <p className="text-gray-400 text-sm sm:text-base max-w-lg mx-auto leading-relaxed">
          6 easy steps from sign-up to cashing out your winnings. No confusing steps, no hidden catches.
        </p>
      </div>

      {/* Steps */}
      <div className="space-y-4 mb-14">
        {STEPS.map((s, i) => {
          const cfg = colorMap[s.color];
          const Icon = s.icon;
          return (
            <div
              key={s.num}
              className={`rounded-2xl border ${cfg.border} bg-black/70 backdrop-blur-sm p-6 flex items-start gap-5 ${cfg.glow} transition-all hover:-translate-y-0.5 group`}
            >
              {/* Step Number */}
              <div className={`w-12 h-12 rounded-2xl ${cfg.num} flex items-center justify-center font-black text-sm font-heading shrink-0 border ${cfg.border}`}>
                {s.num}
              </div>

              {/* Icon */}
              <div className={`w-10 h-10 rounded-xl bg-black/60 border ${cfg.border} flex items-center justify-center shrink-0 hidden sm:flex`}>
                <Icon size={20} className={cfg.icon} />
              </div>

              {/* Content */}
              <div className="flex-1">
                <h3 className={`text-base font-black text-white mb-1.5 font-heading group-hover:${cfg.icon} transition-colors`}>{s.title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{s.desc}</p>
              </div>

              {/* Arrow connector */}
              {i < STEPS.length - 1 && (
                <div className={`${cfg.icon} opacity-30 shrink-0 self-center hidden sm:block`}>
                  <ArrowRight size={16} />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Trust Badges */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-14">
        {[
          { icon: Shield, label: 'Verified Matches', sub: 'Manager-supervised rooms', color: 'cyan' },
          { icon: CheckCircle, label: 'Instant Payouts', sub: 'PKR credited on win', color: 'green' },
          { icon: Wallet, label: 'Easypaisa & JazzCash', sub: 'Pakistan-native payments', color: 'gold' },
        ].map(({ icon: Icon, label, sub, color }) => {
          const cfg = colorMap[color];
          return (
            <div key={label} className={`rounded-xl border ${cfg.border} bg-black/60 p-4 text-center`}>
              <Icon size={22} className={`mx-auto mb-2 ${cfg.icon}`} />
              <p className="text-xs font-black text-white font-heading">{label}</p>
              <p className="text-[10px] text-gray-500 mt-0.5">{sub}</p>
            </div>
          );
        })}
      </div>

      {/* CTA */}
      <div className="rounded-2xl border border-[#00f0ff]/30 bg-gradient-to-r from-[#00f0ff]/10 via-black/60 to-[#a855f7]/10 p-8 text-center">
        <Trophy className="w-10 h-10 mx-auto mb-3 text-[#ffbe1a]" />
        <h2 className="text-2xl font-black text-white mb-2 font-heading">Ready to Battle?</h2>
        <p className="text-gray-400 text-sm mb-6 max-w-sm mx-auto">
          Sign up free, add your PKR, and challenge the best Free Fire players in Pakistan tonight.
        </p>
        <div className="flex items-center justify-center gap-4 flex-wrap">
          <Link href="/register" className="battle-btn-cyan inline-flex items-center gap-2 px-8 py-3">
            Create Free Account
            <ArrowRight size={16} />
          </Link>
          <Link href="/rules" className="px-8 py-3 rounded-xl border border-white/15 text-sm font-bold text-gray-300 hover:border-white/30 hover:text-white transition-all">
            Read the Rules
          </Link>
        </div>
      </div>

      <MobileBattleNav />
    </div>
  );
}
