export default function DashboardLoading() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto animate-pulse pb-12">
      {/* Hero Banner Skeleton */}
      <div className="h-48 sm:h-56 rounded-3xl bg-[#0e1026]/70 border border-cyan-500/20 relative overflow-hidden skeleton-shimmer" />

      {/* 4 Stats Grid Skeleton */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-28 rounded-2xl bg-[#0e1026]/70 border border-white/5 p-4 space-y-3 skeleton-shimmer">
            <div className="w-20 h-3 rounded bg-white/10" />
            <div className="w-28 h-6 rounded bg-white/20" />
          </div>
        ))}
      </div>

      {/* Main Two-Column Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 space-y-3">
          <div className="w-36 h-5 rounded bg-white/10 mb-4" />
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 rounded-2xl bg-[#0e1026]/70 border border-white/5 p-4 skeleton-shimmer" />
          ))}
        </div>
        <div className="lg:col-span-5 space-y-3">
          <div className="w-36 h-5 rounded bg-white/10 mb-4" />
          {[1, 2].map((i) => (
            <div key={i} className="h-32 rounded-2xl bg-[#0e1026]/70 border border-white/5 p-4 skeleton-shimmer" />
          ))}
        </div>
      </div>
    </div>
  );
}

