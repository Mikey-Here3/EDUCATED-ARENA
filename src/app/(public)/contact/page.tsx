'use client';

import { Reveal } from '@/components/motion';
import { Mail, MessageSquare, MapPin, Send, Zap } from 'lucide-react';
import { MobileBattleNav } from '@/components/navigation/mobile-battle-nav';

export default function ContactPage() {
  return (
    <div className="min-h-screen pb-32 pt-20 px-4 sm:px-6 max-w-5xl mx-auto">
      <Reveal>
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-[#00F0FF]/35 bg-[#00F0FF]/10 text-xs font-black text-[#00F0FF] mb-3 uppercase tracking-wider">
            <MessageSquare size={14} />
            Support Center
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white italic tracking-tight font-heading text-glow-cyan">
            TRANSMISSION SECURE
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm max-w-lg mx-auto mt-2">
            Report issues, request support, or appeal match results directly to the Educated Gamer Arena admin team.
          </p>
        </div>
      </Reveal>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        <Reveal delay={0.1}>
          <div className="cyber-card-3d p-6 border-2 border-white/10 space-y-6">
            <h3 className="text-lg font-black text-white font-heading uppercase italic">Contact HQ</h3>
            
            <div className="space-y-4">
              <div className="flex items-start gap-3 p-4 rounded-xl bg-black/60 border border-white/5">
                <div className="w-10 h-10 rounded-full bg-[#00F0FF]/15 border border-[#00F0FF]/30 flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5 text-[#00F0FF]" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white mb-1">Email Support</h4>
                  <p className="text-xs text-slate-400 mb-1">Average response time: 2-4 hours</p>
                  <a href="mailto:support@educatedgamer.com" className="text-xs font-mono text-[#00F0FF] hover:underline">support@educatedgamer.com</a>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 rounded-xl bg-black/60 border border-white/5">
                <div className="w-10 h-10 rounded-full bg-[#FFBE1B]/15 border border-[#FFBE1B]/30 flex items-center justify-center shrink-0">
                  <MessageSquare className="w-5 h-5 text-[#FFBE1B]" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white mb-1">Live Discord Referees</h4>
                  <p className="text-xs text-slate-400 mb-1">Immediate support for live match disputes</p>
                  <a href="/social" className="text-xs font-mono text-[#FFBE1B] hover:underline">Join Official Discord Server</a>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 rounded-xl bg-black/60 border border-white/5">
                <div className="w-10 h-10 rounded-full bg-[#00FF88]/15 border border-[#00FF88]/30 flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5 text-[#00FF88]" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white mb-1">HQ Location</h4>
                  <p className="text-xs text-slate-400">Lahore, Pakistan<br/>Virtual Esports Server</p>
                </div>
              </div>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.2}>
          <form className="cyber-card-3d p-6 border-2 border-white/10 space-y-4" onSubmit={(e) => e.preventDefault()}>
            <h3 className="text-lg font-black text-white font-heading uppercase italic mb-4">Send Intel</h3>
            
            <div className="space-y-3">
              <div>
                <label className="block text-[10px] font-black uppercase text-slate-400 mb-1">Player Name</label>
                <input type="text" placeholder="In-game Name or UID" className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-[#00F0FF] focus:outline-none transition-colors" />
              </div>
              
              <div>
                <label className="block text-[10px] font-black uppercase text-slate-400 mb-1">Email Address</label>
                <input type="email" placeholder="agent@example.com" className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-[#00F0FF] focus:outline-none transition-colors" />
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase text-slate-400 mb-1">Subject</label>
                <select className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-[#00F0FF] focus:outline-none transition-colors appearance-none">
                  <option>Match Dispute</option>
                  <option>Deposit / Withdrawal Issue</option>
                  <option>Report Cheater / Emulator</option>
                  <option>General Support</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase text-slate-400 mb-1">Message</label>
                <textarea rows={4} placeholder="Describe the situation clearly..." className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-[#00F0FF] focus:outline-none transition-colors resize-none"></textarea>
              </div>

              <button className="w-full battle-btn-cyan py-3.5 rounded-xl text-xs font-black uppercase tracking-wider text-black flex items-center justify-center gap-2 mt-2">
                <Send size={15} />
                TRANSMIT MESSAGE
              </button>
            </div>
          </form>
        </Reveal>
      </div>

      <MobileBattleNav />
    </div>
  );
}
