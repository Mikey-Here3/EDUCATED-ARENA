export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#050614] relative overflow-hidden px-4">
      {/* Ambient background glow */}
      <div className="absolute w-72 h-72 rounded-full bg-cyan-500/10 blur-[100px] pointer-events-none" />
      <div className="absolute w-72 h-72 rounded-full bg-purple-600/10 blur-[100px] pointer-events-none translate-x-20" />

      <div className="relative z-10 flex flex-col items-center gap-6 max-w-xs text-center">
        {/* Futuristic Cyber Spinner */}
        <div className="relative w-20 h-20 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full border-2 border-cyan-500/20 animate-ping opacity-30" />
          <div className="w-20 h-20 rounded-full border-2 border-t-cyan-400 border-r-purple-500 border-b-emerald-400 border-l-transparent animate-spin" />
          <div className="absolute inset-2 rounded-full border-2 border-dashed border-cyan-400/40 animate-[spin_3s_linear_infinite_reverse]" />
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-purple-600 to-pink-500 p-0.5 flex items-center justify-center shadow-[0_0_20px_rgba(0,240,255,0.6)]">
            <span className="font-heading font-black text-xs text-white tracking-widest">EG</span>
          </div>
        </div>

        {/* Loading Gamer Text */}
        <div className="space-y-2">
          <div className="font-heading font-black text-sm uppercase tracking-widest text-white flex items-center justify-center gap-1.5">
            <span>LOADING ARENA</span>
            <span className="inline-flex gap-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce" />
              <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-bounce [animation-delay:0.2s]" />
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-bounce [animation-delay:0.4s]" />
            </span>
          </div>
          <p className="text-[11px] text-slate-400 font-medium">
            Syncing Free Fire custom rooms &amp; wallet ledger...
          </p>
        </div>

        {/* Cyber Neon Progress Bar */}
        <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden relative">
          <div className="h-full bg-gradient-to-r from-cyan-400 via-purple-500 to-emerald-400 w-1/2 rounded-full animate-[shimmer_1.5s_infinite]" />
        </div>
      </div>
    </div>
  );
}

