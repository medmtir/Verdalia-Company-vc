export default function Loading() {
  return (
    <div className="min-h-screen flex flex-col bg-verdalia-offwhite">
      {/* Header skeleton */}
      <div className="h-20 bg-white/80 backdrop-blur border-b border-verdalia-border/30" />

      {/* Content skeleton */}
      <main className="flex-grow pt-8 pb-20">
        {/* Banner skeleton */}
        <section className="relative py-20 bg-[#203A1A] mb-16">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <div className="h-4 w-32 bg-white/20 rounded mx-auto mb-4 animate-pulse" />
            <div className="h-8 w-96 max-w-full bg-white/20 rounded mx-auto mb-3 animate-pulse" />
            <div className="h-4 w-72 max-w-full bg-white/10 rounded mx-auto animate-pulse" />
          </div>
        </section>

        {/* Cards skeleton */}
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl shadow-sm border border-verdalia-border/30 p-6 animate-pulse"
            >
              <div className="h-40 bg-gray-200 rounded-xl mb-4" />
              <div className="h-5 bg-gray-200 rounded w-3/4 mb-2" />
              <div className="h-4 bg-gray-100 rounded w-full mb-1" />
              <div className="h-4 bg-gray-100 rounded w-2/3" />
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
