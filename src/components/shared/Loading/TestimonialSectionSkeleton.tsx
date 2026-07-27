// src/components/shared/Loading/TestimonialSkeleton.tsx

import { Star, Quote } from "lucide-react";

export const TestimonialCardSkeleton = () => {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-md flex flex-col justify-between overflow-hidden animate-pulse">
      {/* Card Body */}
      <div className="p-6">
        {/* Header info / Avatar */}
        <div className="flex items-center gap-4 mb-4">
          <div className="w-14 h-14 rounded-full bg-slate-200 shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="h-4 w-32 bg-slate-200 rounded" />
            <div className="h-3 w-24 bg-slate-200 rounded" />
            <div className="flex items-center gap-1 mt-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 text-slate-200" />
              ))}
            </div>
          </div>
        </div>

        {/* Quote Content */}
        <div className="space-y-2">
          <Quote className="w-6 h-6 text-slate-200 mb-1" />
          <div className="h-3 w-full bg-slate-200 rounded" />
          <div className="h-3 w-11/12 bg-slate-200 rounded" />
          <div className="h-3 w-10/12 bg-slate-200 rounded" />
          <div className="h-3 w-9/12 bg-slate-200 rounded" />
        </div>
      </div>

      {/* Card Footer */}
      <div className="px-6 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
        <div className="h-5 w-20 bg-slate-200 rounded-full" />
        <div className="h-4 w-24 bg-slate-200 rounded" />
      </div>
    </div>
  );
};

export const TestimonialSectionSkeleton = () => {
  const skeletonCards = Array.from({ length: 6 });

  return (
    <section className="container py-8 md:py-12">
      {/* Section Header */}
      <div className="text-center mb-10 animate-pulse">
        <div className="inline-flex items-center gap-2 bg-emerald-50/50 px-4 py-2 rounded-full mb-3">
          <Quote className="w-4 h-4 text-slate-300" />
          <span className="text-sm font-semibold text-slate-300">
            Testimonials
          </span>
        </div>
        <div className="h-8 w-64 bg-slate-200 rounded-lg mx-auto mb-2" />
        <div className="h-4 w-96 bg-slate-100 rounded-lg mx-auto" />
      </div>

      {/* Grid Display */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {skeletonCards.map((_, index) => (
          <TestimonialCardSkeleton key={index} />
        ))}
      </div>

      {/* Load More Button Skeleton */}
      <div className="text-center mt-10 animate-pulse">
        <div className="inline-flex items-center gap-2 bg-slate-200 px-6 py-3 rounded-full w-48 h-11" />
      </div>
    </section>
  );
};

// Default export for easier importing
export default TestimonialSectionSkeleton;
