// components/Loading/HeroSkeleton.tsx
export const HeroSkeleton = () => (
  <section className="relative bg-linear-to-r from-emerald-600 to-emerald-800 text-white py-16 md:py-24 overflow-hidden animate-pulse">
    <div className="container">
      <div className="flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="flex-1 space-y-4">
          <div className="h-4 w-24 bg-white/20 rounded-full" />
          <div className="h-12 w-3/4 bg-white/20 rounded-lg" />
          <div className="h-12 w-1/2 bg-white/20 rounded-lg" />
          <div className="h-4 w-full max-w-md bg-white/20 rounded" />
          <div className="h-4 w-3/4 max-w-sm bg-white/20 rounded" />
          <div className="flex flex-wrap gap-3 pt-4">
            <div className="h-12 w-32 bg-white/20 rounded-xl" />
            <div className="h-12 w-32 bg-white/10 rounded-xl" />
          </div>
        </div>
        <div className="flex-1 flex justify-center">
          <div className="w-64 h-64 md:w-80 md:h-80 bg-white/10 rounded-full" />
        </div>
      </div>
    </div>
  </section>
);
