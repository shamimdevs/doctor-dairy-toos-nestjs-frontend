// components/Loading/ProductCardSkeleton.tsx
export const ProductCardSkeleton = () => {
  const items = Array.from({ length: 8 });

  return (
    <div className="flex items-stretch gap-4 overflow-hidden pb-4">
      {items.map((_, index) => (
        <div
          key={index}
          className="shrink-0 w-47.5 sm:w-55 bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm flex flex-col"
        >
          <div className="relative aspect-square w-full bg-slate-100" />
          <div className="p-3.5 flex-1 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="h-3 w-16 bg-slate-200 rounded" />
              <div className="h-4 w-full bg-slate-200 rounded" />
              <div className="h-4 w-3/4 bg-slate-200 rounded" />
              <div className="flex items-center gap-1 py-1">
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="w-3 h-3 bg-slate-200 rounded" />
                  ))}
                </div>
                <div className="h-3 w-8 bg-slate-200 rounded" />
              </div>
            </div>
            <div className="pt-3 border-t border-slate-50 flex items-center justify-between gap-1 mt-2">
              <div className="space-y-1">
                <div className="h-3 w-12 bg-slate-200 rounded" />
                <div className="h-5 w-16 bg-slate-200 rounded" />
              </div>
              <div className="h-8 w-16 bg-slate-200 rounded-xl" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
