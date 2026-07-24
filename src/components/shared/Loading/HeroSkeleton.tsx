// components/Loading/HeroSkeleton.tsx

export const HeroSkeleton = () => (
  <section className="container  py-3 md:py-8 animate-pulse">
    <div className="grid grid-cols-1 lg:grid-cols-6 gap-3 md:gap-6 items-stretch">
      {/* Main Carousel Skeleton - 4 Columns */}
      <div className="lg:col-span-4">
        <div className="relative overflow-hidden rounded-xl md:rounded-2xl lg:rounded-3xl bg-slate-200 dark:bg-gray-100 aspect-4/3 sm:aspect-video lg:aspect-auto h-70 sm:h-80 md:h-95 lg:h-105 xl:h-120 w-full">
          {/* Loading shimmer effect */}
          <div className="absolute inset-0 bg-slate-200 animate-shimmer" />

          {/* Navigation Controls Skeleton */}
          <div className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-10 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-slate-200 " />
          <div className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-10 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-slate-200 " />

          {/* Indicators Skeleton */}
          <div className="absolute bottom-2 sm:bottom-4 left-1/2 -translate-x-1/2 z-10 flex gap-1.5 sm:gap-2">
            <div className="w-4 sm:w-6 h-1.5 sm:h-2 rounded-full bg-slate-200" />
            <div className="w-1.5 sm:w-2 h-1.5 sm:h-2 rounded-full bg-slate-200" />
            <div className="w-1.5 sm:w-2 h-1.5 sm:h-2 rounded-full bg-slate-200" />
          </div>
        </div>
      </div>

      {/* Right Side Cards Skeleton - 2 Columns */}
      <div className="grid grid-cols-2 lg:grid-cols-1 lg:col-span-2 gap-3 md:gap-4">
        {[1, 2].map((item) => (
          <div
            key={item}
            className="relative overflow-hidden rounded-xl md:rounded-2xl bg-slate-200 dark:bg-gray-100 aspect-4/3 sm:aspect-video lg:aspect-auto h-32.5 sm:h-37.5 md:h-45 lg:h-50 xl:h-57.5 w-full"
          >
            <div className="absolute inset-0 bg-slate-200 animate-shimmer" />
          </div>
        ))}
      </div>
    </div>
  </section>
);
