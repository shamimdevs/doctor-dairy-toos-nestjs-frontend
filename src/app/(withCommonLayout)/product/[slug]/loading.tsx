const shimmerBlock = (className: string) => (
  <div
    className={`bg-linear-to-r from-slate-200 via-slate-300 to-slate-200 animate-shimmer rounded ${className}`}
  />
);

export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-6 max-w-6xl">
      {/* Breadcrumb Skeleton */}
      <div className="flex items-center gap-2 mb-6">
        {shimmerBlock("w-10 h-4")}
        <span className="text-gray-300">/</span>
        {shimmerBlock("w-20 h-4")}
        <span className="text-gray-300">/</span>
        {shimmerBlock("w-32 h-4")}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100">
        {/* Image Gallery Skeleton */}
        <div className="flex flex-col gap-3">
          <div className="relative bg-gray-50 rounded-xl aspect-square w-full overflow-hidden">
            {shimmerBlock("absolute inset-0 rounded-xl")}
          </div>
          <div className="flex gap-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="relative shrink-0 w-16 h-16 sm:w-20 sm:h-20">
                {shimmerBlock("absolute inset-0 rounded-lg")}
              </div>
            ))}
          </div>
        </div>

        {/* Info / Actions Skeleton */}
        <div className="flex flex-col justify-between">
          <div className="space-y-4">
            {/* Brand badge */}
            {shimmerBlock("w-20 h-5 rounded-md")}

            {/* Title */}
            <div className="space-y-2">
              {shimmerBlock("w-3/4 h-7")}
              {shimmerBlock("w-40 h-4")}
            </div>

            {/* Rating */}
            {shimmerBlock("w-28 h-4")}

            <hr className="border-gray-100" />

            {/* Price */}
            <div className="flex items-baseline gap-3">
              {shimmerBlock("w-24 h-8")}
              {shimmerBlock("w-16 h-5")}
            </div>

            {/* Weight info box */}
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="flex justify-between">
                {shimmerBlock("w-16 h-4")}
                {shimmerBlock("w-14 h-4")}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-3 mt-6">
            {shimmerBlock("w-32 h-4")}
            <div className="flex items-center gap-3">
              {shimmerBlock("w-28 h-10 rounded-xl")}
              {shimmerBlock("w-24 h-4")}
            </div>
            <div className="flex gap-3">
              {shimmerBlock("flex-1 h-12 rounded-xl")}
              {shimmerBlock("w-12 h-12 rounded-xl")}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Skeleton */}
      <div className="mt-10 border-t border-gray-200 pt-6">
        <div className="flex gap-6 border-b border-gray-200 mb-4">
          {["Description", "Specifications", "Reviews"].map((label) => (
            <div key={label} className="pb-3">
              {shimmerBlock("w-24 h-4")}
            </div>
          ))}
        </div>
        <div className="space-y-2">
          {shimmerBlock("w-full h-4")}
          {shimmerBlock("w-full h-4")}
          {shimmerBlock("w-2/3 h-4")}
        </div>
      </div>

      {/* Trust Badges Skeleton */}
      <div className="grid grid-cols-3 gap-3 pt-4 mt-8 border-t border-gray-200">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center gap-2">
            {shimmerBlock("w-4 h-4 rounded-full")}
            {shimmerBlock("w-16 h-3")}
          </div>
        ))}
      </div>
    </div>
  );
}
