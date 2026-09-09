import Link from 'next/link';
import { CinematicBackground } from '@/components/cinematic';
import { MobileBattleNav } from '@/components/navigation/mobile-battle-nav';
import { ArrowLeft, Swords, Trophy, BarChart3, ShieldCheck } from 'lucide-react';
import { Logo } from '@/components/ui/logo';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-[#050614] relative overflow-hidden pb-20 lg:pb-0">
      {/* Cinematic Background Atmosphere */}
      <CinematicBackground showParticles showGrid intensity="medium" />

      {/* High-Impact Navigation Header */}
      <header className="relative z-30 py-4 px-4 sm:px-6 border-b border-white/10 bg-[#060713]/85 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          {/* Logo */}
          <Logo size="md" href="/" />

          {/* Quick Route Links on Desktop */}
          <nav className="hidden md:flex items-center gap-5 text-xs font-bold uppercase tracking-wider text-slate-300">
            <Link href="/" className="hover:text-cyan-400 transition-colors">Home</Link>
            <Link href="/matches" className="hover:text-red-400 transition-colors flex items-center gap-1">
              <Swords className="w-3.5 h-3.5" /> Battles
            </Link>
            <Link href="/tournaments" className="hover:text-amber-400 transition-colors flex items-center gap-1">
              <Trophy className="w-3.5 h-3.5" /> Tournaments
            </Link>
            <Link href="/leaderboard" className="hover:text-yellow-400 transition-colors flex items-center gap-1">
              <BarChart3 className="w-3.5 h-3.5" /> Rankings
            </Link>
            <Link href="/rules" className="hover:text-emerald-400 transition-colors flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> Rules
            </Link>
          </nav>

          {/* Back Action */}
          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs font-bold text-slate-300 hover:bg-white/10 hover:text-white transition-all"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="relative z-20 flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-xl">
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-20 py-4 px-4 text-center border-t border-white/5">
        <p className="text-xs text-slate-500">
          &copy; {new Date().getFullYear()} Educated Gamer Arena Pakistan. Skill-based esports.
        </p>
      </footer>

      {/* Mobile Battle Nav for 1-Tap Switching */}
      <MobileBattleNav isLoggedIn={false} />
    </div>
  );
}

