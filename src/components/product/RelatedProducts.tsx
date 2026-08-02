"use client";

import { useRef } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, ArrowRight, Sparkles } from "lucide-react";
import ProductCard from "@/src/components/HomePage/ProductShowcase/ProductCard";
import { useGetSimilarProductsQuery } from "@/src/redux/api/productsApi";

interface RelatedProductsProps {
  productId: string;
  categorySlug?: string;
}

export default function RelatedProducts({
  productId,
  categorySlug,
}: RelatedProductsProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const { data, isFetching } = useGetSimilarProductsQuery(
    { id: productId, limit: 10 },
    { skip: !productId },
  );

  const products = data?.data || [];

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: direction === "left" ? -300 : 300,
        behavior: "smooth",
      });
    }
  };

  if (isFetching) {
    return (
      <div className="mt-10 md:bg-white p-0.5 md:p-5 md:rounded-2xl md:shadow-sm md:border md:border-slate-100">
        {/* Header Skeleton */}
        <div className="w-40 h-6 bg-slate-200 rounded animate-pulse mb-4 sm:mb-6" />
        <div className="flex gap-3 sm:gap-4 overflow-hidden">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="shrink-0 w-40 sm:w-52 md:w-60 aspect-3/4 rounded-2xl bg-slate-100 animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  if (products.length === 0) return null;

  return (
    <div className="mt-10 md:bg-white p-0.5 md:p-5 md:rounded-2xl md:shadow-sm md:border md:border-slate-100 relative group">
      {/* Section Header */}
      <div className="flex items-center justify-between gap-2 mb-4 sm:mb-6">
        <h3 className="text-base sm:text-lg md:text-xl font-black text-slate-900 flex items-center gap-2">
          <Sparkles size={20} className="text-emerald-500" />
          Related Products
        </h3>

        {categorySlug && (
          <Link
            href={`/category/${categorySlug}`}
            className="group/link flex items-center gap-1 text-[11px] sm:text-xs font-bold text-emerald-600 hover:text-emerald-700 transition-colors uppercase tracking-wider underline underline-offset-2 decoration-emerald-300 hover:decoration-emerald-600 px-2 py-1.5 rounded whitespace-nowrap shrink-0"
          >
            See More
            <ArrowRight
              size={13}
              className="transition-transform group-hover/link:translate-x-0.5"
            />
          </Link>
        )}
      </div>

      {/* Product Carousel */}
      <div className="relative">
        <div
          ref={scrollRef}
          className="flex items-stretch gap-3 sm:gap-4 overflow-x-auto no-scrollbar scroll-smooth snap-x snap-mandatory pb-4"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {products.map((product) => (
            <div key={product.id} className="snap-start">
              <ProductCard product={product} />
            </div>
          ))}
        </div>

        {/* Floating scroll arrows, centered on the carousel — hidden on
            touch/mobile since swiping handles navigation there */}
        {products.length > 2 && (
          <>
            <button
              onClick={() => scroll("left")}
              className="hidden sm:flex items-center justify-center absolute left-0 sm:-left-3 top-1/2 -translate-y-1/2 z-10 h-9 w-9 sm:h-10 sm:w-10 rounded-full cursor-pointer border border-slate-200 bg-white text-slate-600 shadow-md hover:bg-emerald-600 hover:text-white hover:border-emerald-600 active:scale-95 transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
              aria-label="Scroll left"
            >
              <ChevronLeft size={20} className="stroke-[2.5]" />
            </button>

            <button
              onClick={() => scroll("right")}
              className="hidden sm:flex items-center justify-center absolute right-0 sm:-right-3 top-1/2 -translate-y-1/2 z-10 h-9 w-9 sm:h-10 sm:w-10 rounded-full cursor-pointer border border-slate-200 bg-white text-slate-600 shadow-md hover:bg-emerald-600 hover:text-white hover:border-emerald-600 active:scale-95 transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
              aria-label="Scroll right"
            >
              <ChevronRight size={20} className="stroke-[2.5]" />
            </button>
          </>
        )}
      </div>
    </div>
  );
}
