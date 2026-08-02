const shimmerBlock = (className: string) => (
  <div
    className={`bg-linear-to-r from-slate-200 via-slate-300 to-slate-200 animate-shimmer rounded ${className}`}
  />
);

export default function Loading() {
  return (
    <div className="bg-slate-50 min-h-screen">
      <div className="container py-6">
        {/* Back Button Skeleton */}
        {shimmerBlock("w-16 h-5 mb-4")}

        {/* Header: Title + Sort/Filter Controls */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
          {shimmerBlock("w-40 h-8")}

          <div className="flex flex-wrap items-center justify-end gap-2">
            {shimmerBlock("w-40 md:w-60 h-9 sm:h-10 rounded-xl")}
            <div className="lg:hidden">
              {shimmerBlock("w-24 h-9 rounded-xl")}
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Filters Skeleton - Desktop */}
          <aside className="hidden lg:block w-64 shrink-0">
            <div className="bg-white border border-slate-200 rounded-2xl p-5 sticky top-24 shadow-sm">
              {shimmerBlock("w-16 h-5 mb-4")}

              {/* Price Filter Skeleton */}
              <div className="border-t border-slate-200 pt-4 mt-4">
                {shimmerBlock("w-24 h-4 mb-3")}
                <div className="space-y-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="flex items-center gap-2">
                      {shimmerBlock("w-4 h-4")}
                      {shimmerBlock("w-20 h-4")}
                    </div>
                  ))}
                </div>
              </div>

              {/* Discount Filter Skeleton */}
              <div className="border-t border-slate-200 pt-4 mt-4">
                {shimmerBlock("w-24 h-4 mb-3")}
                <div className="space-y-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="flex items-center gap-2">
                      {shimmerBlock("w-4 h-4")}
                      {shimmerBlock("w-16 h-4")}
                    </div>
                  ))}
                </div>
              </div>

              {/* Category Filter Skeleton */}
              <div className="border-t border-slate-200 pt-4 mt-4">
                {shimmerBlock("w-24 h-4 mb-3")}
                <div className="space-y-2">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center gap-2">
                      {shimmerBlock("w-4 h-4")}
                      {shimmerBlock("w-20 h-4")}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Product Cards Skeleton */}
          <main className="flex-1">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-5">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div
                  key={i}
                  className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm"
                >
                  {/* Image */}
                  <div className="relative aspect-square w-full">
                    {shimmerBlock("absolute inset-0 rounded-none")}
                  </div>

                  {/* Content */}
                  <div className="p-2 sm:p-3 space-y-2">
                    {shimmerBlock("w-full h-4")}
                    {shimmerBlock("w-2/3 h-4")}
                    <div className="flex items-center gap-1.5 mt-1">
                      {shimmerBlock("w-14 h-5")}
                      {shimmerBlock("w-10 h-3")}
                    </div>
                    {shimmerBlock("w-full h-9 rounded-xl mt-1")}
                  </div>
                </div>
              ))}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
