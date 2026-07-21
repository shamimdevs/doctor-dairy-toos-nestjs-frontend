// components/Loading/ProductShowcaseSkeleton.tsx

import { ProductCardSkeleton } from "./ProductCardSkeleton";

export const ProductShowcaseSkeleton = () => {
  const categories = Array.from({ length: 4 });

  return (
    <>
      {categories.map((_, index) => (
        <section key={index} className="container py-6 animate-pulse">
          <div className="md:bg-white p-0.5 md:p-5 md:rounded-2xl md:shadow-sm md:border md:border-slate-100">
            <div className="flex items-center justify-between mb-6 pb-3 ">
              <div className="space-y-1">
                <div className="h-7 w-56 bg-slate-200 rounded-lg" />
                <div className="h-3 w-32 bg-slate-100 rounded" />
              </div>
              <div className="flex gap-2">
                <div className="w-10 h-10 bg-slate-200 rounded-xl" />
                <div className="w-10 h-10 bg-slate-200 rounded-xl" />
              </div>
            </div>
            <ProductCardSkeleton />
          </div>
        </section>
      ))}
    </>
  );
};
