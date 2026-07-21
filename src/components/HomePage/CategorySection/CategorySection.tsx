"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import CategoryCard from "./CategoryCard";

interface IProductCategory {
  id: string;
  name: string;
  slug: string;
  image: string;
  created_at: string;
  updated_at: string;
}

interface CategorySectionProps {
  categories: IProductCategory[];
}

export default function CategorySection({
  categories = [],
}: CategorySectionProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 320;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <section className="container py-8">
      {/* Header Panel */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl md:text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            Shop by Category
          </h2>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => scroll("left")}
            className="p-2 md:p-2.5 cursor-pointer rounded-xl border border-slate-200 bg-white text-slate-600 hover:text-emerald-600 hover:border-emerald-200 hover:shadow-md active:scale-95 transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            aria-label="Scroll left categories"
          >
            <ChevronLeft className="w-5 h-5 stroke-[2.5]" />
          </button>
          <button
            onClick={() => scroll("right")}
            className="p-2 md:p-2.5 cursor-pointer rounded-xl border border-slate-200 bg-white text-slate-600 hover:text-emerald-600 hover:border-emerald-200 hover:shadow-md active:scale-95 transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            aria-label="Scroll right categories"
          >
            <ChevronRight className="w-5 h-5 stroke-[2.5]" />
          </button>
        </div>
      </div>

      {/* Horizontal Scroller Canvas */}
      <div
        ref={scrollRef}
        className="flex items-center gap-4 overflow-x-auto no-scrollbar scroll-smooth py-4"
        style={{
          msOverflowStyle: "none",
          scrollbarWidth: "none",
        }}
      >
        {categories?.map((category) => (
          <CategoryCard key={category.id} category={category} />
        ))}
      </div>
    </section>
  );
}
