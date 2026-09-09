export default function ChallengesLoading() {
  return (
    <div className="space-y-6 max-w-6xl mx-auto animate-pulse pb-12">
      <div className="h-32 rounded-3xl bg-[#0e1026]/70 border border-red-500/20 skeleton-shimmer" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="h-56 rounded-3xl bg-[#0e1026]/70 border border-white/5 p-5 space-y-4 skeleton-shimmer">
            <div className="flex justify-between">
              <div className="w-20 h-4 rounded bg-white/10" />
              <div className="w-16 h-4 rounded bg-white/10" />
            </div>
            <div className="h-10 rounded-2xl bg-white/5" />
            <div className="h-12 rounded-xl bg-white/5" />
          </div>
        ))}
      </div>
    </div>
  );
}

