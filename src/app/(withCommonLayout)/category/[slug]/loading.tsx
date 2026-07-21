import { ChevronLeft, Filter } from "lucide-react";

export default function Loading() {
  return (
    <div className="bg-slate-50 min-h-screen">
      <div className="container py-6">
        {/* Back Button Skeleton */}
        <div className="flex items-center gap-2 text-slate-400 mb-4">
          <ChevronLeft size={20} />
          <span className="font-semibold">Back</span>
        </div>

        {/* Header Skeleton */}
        <div className="mb-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <div className="w-48 h-8 bg-linear-to-r from-slate-200 via-slate-300 to-slate-200 rounded-lg animate-shimmer"></div>
              <div className="w-32 h-4 bg-linear-to-r from-slate-200 via-slate-300 to-slate-200 rounded mt-2 animate-shimmer"></div>
            </div>
          </div>
        </div>

        {/* Mobile Filter Skeleton */}
        <div className="lg:hidden flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl border border-slate-200 shadow-sm">
            <Filter size={16} className="text-slate-400" />
            <span className="text-sm font-bold text-slate-400">Filters</span>
          </div>
          <div className="px-3 py-2 bg-white border border-slate-200 rounded-xl shadow-sm w-32 h-10 animate-shimmer"></div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Filters Skeleton - Desktop */}
          <aside className="hidden lg:block w-64 shrink-0">
            <div className="bg-white border border-slate-200 rounded-2xl p-5 sticky top-24 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="w-16 h-5 bg-linear-to-r from-slate-200 via-slate-300 to-slate-200 rounded animate-shimmer"></div>
              </div>

              {/* Price Filter Skeleton */}
              <div className="border-t border-slate-200 pt-4 mt-4">
                <div className="w-24 h-4 bg-linear-to-r from-slate-200 via-slate-300 to-slate-200 rounded animate-shimmer mb-3"></div>
                <div className="space-y-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-linear-to-r from-slate-200 via-slate-300 to-slate-200 rounded animate-shimmer"></div>
                      <div className="w-20 h-4 bg-linear-to-r from-slate-200 via-slate-300 to-slate-200 rounded animate-shimmer"></div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Discount Filter Skeleton */}
              <div className="border-t border-slate-200 pt-4 mt-4">
                <div className="w-24 h-4 bg-linear-to-r from-slate-200 via-slate-300 to-slate-200 rounded animate-shimmer mb-3"></div>
                <div className="space-y-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-linear-to-r from-slate-200 via-slate-300 to-slate-200 rounded animate-shimmer"></div>
                      <div className="w-16 h-4 bg-linear-to-r from-slate-200 via-slate-300 to-slate-200 rounded animate-shimmer"></div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Category Filter Skeleton */}
              <div className="border-t border-slate-200 pt-4 mt-4">
                <div className="w-24 h-4 bg-linear-to-r from-slate-200 via-slate-300 to-slate-200 rounded animate-shimmer mb-3"></div>
                <div className="space-y-2">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-linear-to-r from-slate-200 via-slate-300 to-slate-200 rounded animate-shimmer"></div>
                      <div className="w-20 h-4 bg-linear-to-r from-slate-200 via-slate-300 to-slate-200 rounded animate-shimmer"></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Products Grid Skeleton */}
          <main className="flex-1">
            {/* Sort Skeleton - Desktop */}
            <div className="hidden lg:flex items-center justify-between mb-4 bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
              <div className="w-32 h-5 bg-linear-to-r from-slate-200 via-slate-300 to-slate-200 rounded animate-shimmer"></div>
              <div className="w-40 h-10 bg-linear-to-r from-slate-200 via-slate-300 to-slate-200 rounded-xl animate-shimmer"></div>
            </div>

            {/* Product Cards Skeleton */}
            <div className="grid gap-3 sm:gap-4 grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div
                  key={i}
                  className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm"
                >
                  {/* Image Skeleton with Shimmer */}
                  <div className="aspect-square bg-linear-to-r from-slate-200 via-slate-300 to-slate-200 animate-shimmer"></div>

                  {/* Content Skeleton */}
                  <div className="p-3 space-y-2">
                    <div className="w-20 h-4 bg-linear-to-r from-slate-200 via-slate-300 to-slate-200 rounded animate-shimmer"></div>
                    <div className="w-full h-5 bg-linear-to-r from-slate-200 via-slate-300 to-slate-200 rounded animate-shimmer"></div>
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-5 bg-linear-to-r from-slate-200 via-slate-300 to-slate-200 rounded animate-shimmer"></div>
                      <div className="w-12 h-4 bg-linear-to-r from-slate-200 via-slate-300 to-slate-200 rounded animate-shimmer"></div>
                    </div>
                    <div className="w-16 h-3 bg-linear-to-r from-slate-200 via-slate-300 to-slate-200 rounded animate-shimmer"></div>
                    <div className="w-full h-9 bg-linear-to-r from-slate-200 via-slate-300 to-slate-200 rounded-xl mt-2 animate-shimmer"></div>
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
