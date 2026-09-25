export default function Loading() {
  return (
    <div className="min-h-screen flex flex-col bg-verdalia-offwhite">
      <div className="h-20 bg-white/80 backdrop-blur border-b border-verdalia-border/30" />
      <main className="flex-grow pt-8 pb-20">
        <section className="relative py-20 bg-[#203A1A] mb-16">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <div className="h-4 w-32 bg-white/20 rounded mx-auto mb-4 animate-pulse" />
            <div className="h-8 w-96 max-w-full bg-white/20 rounded mx-auto mb-3 animate-pulse" />
            <div className="h-4 w-72 max-w-full bg-white/10 rounded mx-auto animate-pulse" />
          </div>
        </section>
        <div className="max-w-5xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white rounded-2xl shadow-sm border border-verdalia-border/30 p-8 animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-1/2 mb-6" />
            <div className="space-y-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-10 bg-gray-100 rounded-lg" />
              ))}
              <div className="h-24 bg-gray-100 rounded-lg" />
              <div className="h-12 bg-gray-200 rounded-lg" />
            </div>
          </div>
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-verdalia-border/30 p-6 animate-pulse">
              <div className="h-5 bg-gray-200 rounded w-1/3 mb-4" />
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-4 bg-gray-100 rounded" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
