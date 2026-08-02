const shimmerBlock = (className: string) => (
  <div
    className={`bg-linear-to-r from-slate-200 via-slate-300 to-slate-200 animate-shimmer rounded ${className}`}
  />
);

export default function Loading() {
  return (
    <section className="container py-8 md:py-12">
      {/* Section Header */}
      <div className="text-center mb-8 flex flex-col items-center gap-3">
        {shimmerBlock("w-36 h-8 rounded-full")}
        {shimmerBlock("w-80 max-w-full h-8")}
        {shimmerBlock("w-96 max-w-full h-4")}
      </div>

      {/* Category Filters */}
      <div className="flex flex-wrap gap-2 justify-center mb-8">
        {shimmerBlock("w-20 h-9 rounded-full")}
        {[1, 2, 3, 4].map((i) => (
          <div key={i}>{shimmerBlock("w-28 h-9 rounded-full")}</div>
        ))}
      </div>

      {/* Video Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <div
            key={i}
            className="bg-white rounded-xl overflow-hidden shadow-md"
          >
            {/* Thumbnail */}
            <div className="relative h-72 w-full">
              {shimmerBlock("absolute inset-0 rounded-none")}
            </div>

            {/* Info */}
            <div className="p-4 space-y-3">
              {shimmerBlock("w-full h-4")}
              {shimmerBlock("w-3/4 h-3")}
              <div className="flex items-center justify-between pt-1">
                {shimmerBlock("w-20 h-3")}
                {shimmerBlock("w-16 h-5 rounded-full")}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
