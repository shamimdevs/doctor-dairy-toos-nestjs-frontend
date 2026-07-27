// src/components/shared/Loading/FAQSectionSkeleton.tsx

import { HelpCircle, MessageSquare, ChevronDown } from "lucide-react";

const shimmer = `
  before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite]
  before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent
  overflow-hidden
`;

export const FAQItemSkeleton = () => {
  return (
    <div
      className={`relative bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden ${shimmer}`}
    >
      <div className="w-full px-5 py-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-1">
          <div className="p-2 rounded-lg bg-slate-100 shrink-0">
            <MessageSquare className="w-4 h-4 text-slate-300" />
          </div>
          <div className="flex-1">
            <div className="h-4 w-3/4 bg-slate-200 rounded" />
          </div>
        </div>
        <div className="shrink-0">
          <ChevronDown className="w-5 h-5 text-slate-300" />
        </div>
      </div>
    </div>
  );
};

export const FAQSectionSkeleton = () => {
  const skeletonItems = Array.from({ length: 5 });

  return (
    <section className="container py-8 md:py-12">
      {/* Section Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 bg-emerald-50/50 px-4 py-2 rounded-full mb-3 animate-pulse">
          <HelpCircle className="w-4 h-4 text-slate-300" />
          <span className="text-sm font-semibold text-slate-300">
            সচরাচর জিজ্ঞাসিত প্রশ্ন
          </span>
        </div>

        <div className="animate-pulse">
          <div className="h-8 w-96 bg-slate-200 rounded-lg mx-auto mb-2" />
          <div className="h-4 w-64 bg-slate-100 rounded-lg mx-auto" />
        </div>
      </div>

      <div className="grid my-28 md:grid-cols-2 grid-cols-1 gap-4">
        {/* Left Side: Image/Illustration Skeleton */}
        <div className="hidden md:block">
          <div className="relative w-full h-125 bg-slate-100 rounded-2xl overflow-hidden animate-pulse">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="w-24 h-24 bg-slate-200 rounded-full mx-auto mb-4" />
                <div className="h-4 w-32 bg-slate-200 rounded mx-auto mb-2" />
                <div className="h-3 w-48 bg-slate-200 rounded mx-auto" />
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Accordion Items Skeleton */}
        <div
          className="pr-3 h-96 overflow-y-scroll space-y-3
          scrollbar-thin scrollbar-track-slate-100 scrollbar-thumb-emerald-600 
          hover:scrollbar-thumb-emerald-700
          [&::-webkit-scrollbar]:w-2
          [&::-webkit-scrollbar-track]:bg-slate-100
          [&::-webkit-scrollbar-track]:rounded-full
          [&::-webkit-scrollbar-thumb]:bg-emerald-600
          [&::-webkit-scrollbar-thumb]:rounded-full
          [&::-webkit-scrollbar-thumb]:hover:bg-emerald-700"
        >
          {skeletonItems.map((_, index) => (
            <FAQItemSkeleton key={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQSectionSkeleton;
