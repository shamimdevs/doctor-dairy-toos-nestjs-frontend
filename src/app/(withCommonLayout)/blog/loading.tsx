const shimmerBlock = (className: string) => (
  <div
    className={`bg-linear-to-r from-slate-200 via-slate-300 to-slate-200 animate-shimmer rounded ${className}`}
  />
);

export default function Loading() {
  return (
    <section className="min-h-screen bg-gray-50">
      {/* Hero Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center flex flex-col items-center gap-4">
          {shimmerBlock("w-24 h-6 rounded-full")}
          {shimmerBlock("w-80 max-w-full h-9")}
          {shimmerBlock("w-96 max-w-full h-4")}
        </div>
      </div>

      <div className="container py-10">
        {/* Category Tabs */}
        <div className="flex flex-wrap gap-2 justify-center mb-10">
          {shimmerBlock("w-16 h-9 rounded-full")}
          {[1, 2, 3, 4].map((i) => (
            <div key={i}>{shimmerBlock("w-24 h-9 rounded-full")}</div>
          ))}
        </div>

        {/* Blog Card Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="bg-white rounded-2xl overflow-hidden shadow-sm flex flex-col"
            >
              <div className="relative h-48 w-full">
                {shimmerBlock("absolute inset-0")}
              </div>
              <div className="p-6 space-y-3">
                {shimmerBlock("w-20 h-3")}
                {shimmerBlock("w-full h-4")}
                {shimmerBlock("w-3/4 h-4")}
                {shimmerBlock("w-full h-3")}
                {shimmerBlock("w-full h-3")}
                {shimmerBlock("w-1/2 h-3")}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
