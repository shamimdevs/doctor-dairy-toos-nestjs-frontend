// src/components/wishlist/WishlistSkeleton.tsx
export function WishlistSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-slate-200 animate-pulse"
        >
          <div className="w-20 h-20 bg-slate-200 rounded-xl shrink-0"></div>
          <div className="flex-1 space-y-2">
            <div className="w-3/4 h-5 bg-slate-200 rounded"></div>
            <div className="w-20 h-4 bg-slate-200 rounded"></div>
            <div className="w-32 h-3 bg-slate-200 rounded"></div>
          </div>
          <div className="w-10 h-10 bg-slate-200 rounded-xl"></div>
          <div className="w-10 h-10 bg-slate-200 rounded-xl"></div>
        </div>
      ))}
    </div>
  );
}
