import Link from 'next/link';
import { Shield, CheckCircle2, AlertTriangle, XCircle, BookOpen, Zap, Camera } from 'lucide-react';
import { MobileBattleNav } from '@/components/navigation/mobile-battle-nav';

const CATEGORIES = [
  {
    icon: Shield,
    title: 'General Match Conduct',
    color: 'cyan',
    rules: [
      'You MUST use the Free Fire UID registered on your Educated Gamer profile — no alt accounts ever.',
      'No PC emulators or external input devices allowed in Mobile game categories.',
      'Room ID and Password must NEVER be shared with anyone outside the registered match roster.',
      'All players must join the Custom Room within 15 minutes of the scheduled match time or it\'s a forfeit.',
    ],
  },
  {
    icon: AlertTriangle,
    title: 'Weapon & Skill Rules',
    color: 'gold',
    rules: [
      'In "Desert Eagle Only" or "M590 Only" modes — using any other gun = instant forfeit, no appeal.',
      'Nading, roof-camping, and wall/object glitching are strictly banned in standard clash formats.',
      'Character skills and ability restrictions listed in the challenge must be respected from match start.',
      'Agreed weapon load-outs must be locked in before the game begins — no last-second changes.',
    ],
  },
  {
    icon: Camera,
    title: 'Proof & Result Verification',
    color: 'purple',
    rules: [
      'Both squads must take a full, uncropped end-game screenshot showing the Victory/Defeat banner AND the score.',
      'If there\'s a dispute, video recordings of the full match (start to end) may be demanded by the Manager.',
      'Managers have final verification authority — their decision on room results is binding and non-negotiable.',
      'Attempting to submit edited screenshots results in an immediate permanent ban.',
    ],
  },
  {
    icon: XCircle,
    title: 'Banned Behaviour',
    color: 'red',
    rules: [
      'Using hacks, aimbots, speed mods, or any third-party cheat software = permanent ban + forfeit of wallet balance.',
      'Colluding with the opponent to throw matches for a payout split = ban for both accounts.',
      'Abusive language, threats, or harassment against staff, managers, or players will result in account suspension.',
      'Creating fake disputes or submitting fraudulent evidence is an immediate permanent ban.',
    ],
  },
  {
    icon: CheckCircle2,
    title: 'Payments & Financial Rules',
    color: 'green',
    rules: [
      'Deposits are only accepted via Easypaisa and JazzCash to official platform numbers shown in the deposit panel.',
      'Minimum deposit: PKR 200 — Maximum single deposit: PKR 50,000.',
      'Withdrawals are processed within 24 hours on business days to your registered payment account.',
      'Platform fee of 10% is deducted from prize winnings automatically — entry fees are 100% safe until the match settles.',
    ],
  },
];

const colorMap: Record<string, { icon: string; border: string; badge: string; bullet: string }> = {
  cyan:   { icon: 'text-[#00f0ff]', border: 'border-[#00f0ff]/25', badge: 'bg-[#00f0ff]/10 border-[#00f0ff]/30 text-[#00f0ff]',   bullet: 'bg-[#00f0ff]' },
  gold:   { icon: 'text-[#ffbe1a]', border: 'border-[#ffbe1a]/25', badge: 'bg-[#ffbe1a]/10 border-[#ffbe1a]/30 text-[#ffbe1a]',   bullet: 'bg-[#ffbe1a]' },
  purple: { icon: 'text-[#a855f7]', border: 'border-[#a855f7]/25', badge: 'bg-[#a855f7]/10 border-[#a855f7]/30 text-[#a855f7]',   bullet: 'bg-[#a855f7]' },
  green:  { icon: 'text-[#00ff88]', border: 'border-[#00ff88]/25', badge: 'bg-[#00ff88]/10 border-[#00ff88]/30 text-[#00ff88]',   bullet: 'bg-[#00ff88]' },
  red:    { icon: 'text-red-400',    border: 'border-red-500/25',   badge: 'bg-red-500/10 border-red-500/30 text-red-400',         bullet: 'bg-red-400' },
};

export default function RulesPage() {
  return (
    <div className="min-h-screen pb-32 pt-6 px-4 sm:px-6 max-w-4xl mx-auto">

      {/* Header */}
      <div className="text-center mb-14 pt-16">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#00ff88]/30 bg-[#00ff88]/10 text-xs font-black text-[#00ff88] mb-4 uppercase tracking-widest">
          <BookOpen size={13} />
          Official Rulebook
        </div>
        <h1 className="text-4xl sm:text-6xl font-black text-white italic tracking-tight font-heading text-glow-green mb-4">
          BATTLE RULES
        </h1>
        <p className="text-gray-400 text-sm sm:text-base max-w-lg mx-auto leading-relaxed">
          These rules keep every match fair and every payout honest. Breaking them = instant penalties. Read them once — you won&apos;t regret it.
        </p>
      </div>

      {/* Alert Banner */}
      <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 flex items-start gap-3 mb-10">
        <AlertTriangle size={18} className="text-red-400 shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-black text-red-300 mb-1">Zero Tolerance Policy</p>
          <p className="text-xs text-red-400/80 leading-relaxed">
            Cheating, hacking, match-fixing, or fraud results in an immediate permanent ban and all wallet funds are confiscated. No appeals.
          </p>
        </div>
      </div>

      {/* Rule Categories */}
      <div className="space-y-5 mb-14">
        {CATEGORIES.map((cat) => {
          const cfg = colorMap[cat.color];
          const Icon = cat.icon;
          return (
            <div key={cat.title} className={`rounded-2xl border ${cfg.border} bg-black/70 backdrop-blur-sm p-6`}>
              <h2 className="text-base font-black text-white mb-5 flex items-center gap-3 font-heading">
                <span className={`w-9 h-9 rounded-xl border ${cfg.border} flex items-center justify-center ${cfg.badge} shrink-0`}>
                  <Icon size={16} className={cfg.icon} />
                </span>
                {cat.title}
              </h2>
              <ul className="space-y-3">
                {cat.rules.map((r, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-gray-300 leading-relaxed">
                    <span className={`w-1.5 h-1.5 rounded-full ${cfg.bullet} mt-2 shrink-0`} />
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>

      {/* Questions CTA */}
      <div className="rounded-2xl border border-[#00f0ff]/25 bg-gradient-to-r from-[#00f0ff]/10 via-black/60 to-[#a855f7]/10 p-8 text-center">
        <Zap className="w-10 h-10 mx-auto mb-3 text-[#00f0ff]" />
        <h2 className="text-xl font-black text-white mb-2 font-heading">Got Questions?</h2>
        <p className="text-gray-400 text-sm mb-6 max-w-sm mx-auto">
          Our team is active daily. Reach out via Discord or in-platform support before your match.
        </p>
        <div className="flex items-center justify-center gap-4 flex-wrap">
          <Link href="/how-it-works" className="battle-btn-cyan inline-flex items-center gap-2 px-8 py-3">
            How It Works
          </Link>
          <Link href="/register" className="px-8 py-3 rounded-xl border border-white/15 text-sm font-bold text-gray-300 hover:border-white/30 hover:text-white transition-all">
            Create Account
          </Link>
        </div>
      </div>

      <MobileBattleNav />
    </div>
  );
}
