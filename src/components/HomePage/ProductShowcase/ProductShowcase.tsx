/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useRef, useMemo } from "react";
import {
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Sparkles,
  ShoppingCart,
} from "lucide-react";
import Link from "next/link";
import { useSelector } from "react-redux";
import ProductCard from "./ProductCard";

export default function ProductShowcase({ products }: { products: any[] }) {
  const scrollRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const cartCount = useSelector((state: any) => state?.cart?.totalQuantity);

  const categoriesList = useMemo(() => {
    if (!products || products.length === 0) return [];

    const categoryMap = new Map();
    products.forEach((p) => {
      if (p.category?.name && p.category?.slug) {
        // Use the slug as the key to avoid duplicates
        if (!categoryMap.has(p.category.slug)) {
          categoryMap.set(p.category.slug, {
            name: p.category.name,
            slug: p.category.slug,
          });
        }
      }
    });

    return Array.from(categoryMap.values());
  }, [products]);

  const handleScroll = (categorySlug: string, direction: "left" | "right") => {
    const container = scrollRefs.current[categorySlug];
    if (container) {
      container.scrollBy({
        left: direction === "left" ? -300 : 300,
        behavior: "smooth",
      });
    }
  };

  console.log(products, "products");

  if (!products || products.length === 0) {
    return (
      <section className="bg-slate-50 py-10 font-sans">
        <div className="container text-center text-slate-400 font-semibold py-16 sm:py-20">
          এই মুহূর্তে কোনো পণ্য পাওয়া যাচ্ছে না।
        </div>
      </section>
    );
  }

  return (
    <section className="bg-slate-50 py-8 sm:py-10 font-sans">
      <div className="container">
        {/* Promotional Top Bar */}
        <div className="bg-linear-to-r from-emerald-600 to-emerald-700 text-white rounded-2xl p-4 sm:p-6 mb-8 sm:mb-10 shadow-lg flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="min-w-0">
              <h2 className="text-base sm:text-lg md:text-xl font-extrabold tracking-tight">
                Doctor Dairy Tools & Equipment
              </h2>
              <p className="text-xs sm:text-sm text-emerald-100 font-semibold mt-0.5">
                প্রিমিয়াম মানের ডেইরি ফার্ম সরঞ্জাম ও ভেটেরিনারি টুলস
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:gap-3 bg-emerald-700/60 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl border border-emerald-500/30 w-full md:w-auto justify-center">
            <ShoppingCart size={18} className="text-emerald-300 shrink-0" />
            <span className="text-[11px] sm:text-xs uppercase tracking-wider font-black">
              কার্টে পণ্য:
            </span>
            <span className="bg-red-500 text-white font-extrabold text-sm px-2.5 py-0.5 rounded-full animate-bounce">
              {cartCount ?? 0}
            </span>
          </div>
        </div>

        {/* Dynamic Category Carousels */}
        <div className="space-y-8 sm:space-y-12">
          {categoriesList?.map((category) => {
            const filteredProducts = products?.filter(
              (p) => p.category?.name === category.name,
            );

            if (filteredProducts.length === 0) return null;

            return (
              <div
                key={category?.slug}
                className="md:bg-white p-0.5 md:p-5 md:rounded-2xl md:shadow-sm md:border md:border-slate-100 relative group"
              >
                {/* Category Header */}
                <div className="flex items-center justify-between gap-2 mb-4 sm:mb-6">
                  <div className="space-y-1 min-w-0">
                    <h3 className="text-base sm:text-lg md:text-xl font-black text-slate-900 truncate flex items-center gap-2">
                      {category?.name}
                    </h3>
                  </div>

                  <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                    <Link
                      href={`/category/${category?.slug}`}
                      className="group/link flex items-center gap-1 text-[11px] sm:text-xs font-bold text-emerald-600 hover:text-emerald-700 transition-colors uppercase tracking-wider underline underline-offset-2 decoration-emerald-300 hover:decoration-emerald-600 px-2 py-1.5 rounded whitespace-nowrap"
                    >
                      সব দেখুন
                      <ArrowRight
                        size={14}
                        className="transition-transform font-bold group-hover/link:translate-x-0.5"
                      />
                    </Link>
                  </div>
                </div>

                {/* Product Carousel */}
                <div className="relative">
                  <div
                    ref={(el) => {
                      scrollRefs.current[category.slug] = el;
                    }}
                    className="flex items-stretch gap-3 sm:gap-4 overflow-x-auto no-scrollbar scroll-smooth snap-x snap-mandatory pb-4"
                    style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                  >
                    {filteredProducts?.map((product) => (
                      <div key={product.id} className="snap-start">
                        <ProductCard product={product} />
                      </div>
                    ))}
                  </div>

                  {/* Floating scroll arrows, centered on the carousel — hidden on
                      touch/mobile since swiping handles navigation there */}
                  <button
                    onClick={() => handleScroll(category?.slug, "left")}
                    className="hidden sm:flex items-center justify-center absolute left-0 sm:-left-3 top-1/2 -translate-y-1/2 z-10 h-9 w-9 sm:h-10 sm:w-10 rounded-full cursor-pointer border border-slate-200 bg-white text-slate-600 shadow-md hover:bg-emerald-600 hover:text-white hover:border-emerald-600 active:scale-95 transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                    aria-label={`${category.name} বামে স্ক্রল করুন`}
                  >
                    <ChevronLeft size={20} className="stroke-[2.5]" />
                  </button>

                  <button
                    onClick={() => handleScroll(category?.slug, "right")}
                    className="hidden sm:flex items-center justify-center absolute right-0 sm:-right-3 top-1/2 -translate-y-1/2 z-10 h-9 w-9 sm:h-10 sm:w-10 rounded-full cursor-pointer border border-slate-200 bg-white text-slate-600 shadow-md hover:bg-emerald-600 hover:text-white hover:border-emerald-600 active:scale-95 transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                    aria-label={`${category.name} ডানে স্ক্রল করুন`}
                  >
                    <ChevronRight size={20} className="stroke-[2.5]" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
