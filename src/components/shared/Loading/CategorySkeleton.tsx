// components/Loading/CategorySkeleton.tsx
export const CategorySkeleton = () => {
  const items = Array.from({ length: 8 });

  return (
    <section className="container py-8 animate-pulse">
      <div className="flex items-center justify-between mb-6">
        <div className="h-7 w-48 bg-slate-200 rounded-lg" />
        <div className="flex gap-2">
          <div className="w-10 h-10 bg-slate-200 rounded-xl" />
          <div className="w-10 h-10 bg-slate-200 rounded-xl" />
        </div>
      </div>
      <div className="flex items-center gap-4 overflow-hidden py-4">
        {items.map((_, index) => (
          <div
            key={index}
            className="shrink-0 w-36 sm:w-40 bg-white border border-slate-100 rounded-2xl p-4 flex flex-col items-center justify-center text-center gap-3"
          >
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-slate-100 rounded-xl" />
            <div className="h-3 w-3/4 bg-slate-200 rounded" />
          </div>
        ))}
      </div>
    </section>
  );
};
