/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useRef, useMemo } from "react";
import {
  ChevronLeft,
  ChevronRight,
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
      <section className="bg-slate-50 min-h-screen py-10 font-sans">
        <div className="container text-center text-slate-400 font-semibold py-20">
          No products available right now.
        </div>
      </section>
    );
  }

  return (
    <section className="bg-slate-50 min-h-screen py-10 font-sans">
      <div className="container">
        {/* Promotional Top Bar */}
        <div className="bg-emerald-600 text-white rounded-2xl p-4 sm:p-6 mb-10 shadow-lg flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-500 rounded-xl">
              <Sparkles className="text-amber-300 animate-pulse" size={24} />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-extrabold tracking-tight">
                Medico Seasonal Wellness Festival
              </h2>
              <p className="text-xs sm:text-sm text-emerald-100 font-semibold mt-0.5">
                Sourcing 100% genuine products directly to your doorstep.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-emerald-700/60 px-4 py-2.5 rounded-xl border border-emerald-500/30">
            <ShoppingCart size={18} className="text-emerald-300" />
            <span className="text-xs uppercase tracking-wider font-black">
              Cart Items:
            </span>
            <span className="bg-red-500 text-white font-extrabold text-sm px-2.5 py-0.5 rounded-full animate-bounce">
              {cartCount ?? 0}
            </span>
          </div>
        </div>

        {/* Dynamic Category Carousels */}
        <div className="space-y-12">
          {categoriesList.map((category) => {
            const filteredProducts = products?.filter(
              (p) => p.category?.name === category.name,
            );

            if (filteredProducts.length === 0) return null;

            return (
              <div
                key={category.slug}
                className="md:bg-white p-0.5 md:p-5 md:rounded-2xl md:shadow-sm md:border md:border-slate-100 relative group"
              >
                {/* Category Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="space-y-1">
                    <h3 className="text-lg md:text-xl font-black text-slate-900 flex items-center gap-2">
                      {category.name}
                    </h3>
                  </div>

                  <div className="md:flex items-center gap-3">
                    <Link
                      href={`/category/${category.slug}`}
                      className="text-xs font-bold text-emerald-600 hover:text-emerald-700 transition-colors uppercase tracking-wider focus:outline-none focus:ring-2 focus:ring-emerald-500/20 px-2 py-1 rounded"
                    >
                      See All
                    </Link>

                    <div className="md:flex hidden items-center gap-1.5">
                      <button
                        onClick={() => handleScroll(category.slug, "left")}
                        className="p-2 cursor-pointer rounded-xl border border-slate-200 bg-white text-slate-600 hover:text-emerald-600 hover:border-emerald-300 active:scale-95 transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                        aria-label={`Scroll Left in ${category.name}`}
                      >
                        <ChevronLeft size={18} className="stroke-[2.5]" />
                      </button>

                      <button
                        onClick={() => handleScroll(category.slug, "right")}
                        className="p-2 cursor-pointer rounded-xl border border-slate-200 bg-white text-slate-600 hover:text-emerald-600 hover:border-emerald-300 active:scale-95 transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                        aria-label={`Scroll Right in ${category.name}`}
                      >
                        <ChevronRight size={18} className="stroke-[2.5]" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Product Carousel */}
                <div
                  ref={(el) => {
                    scrollRefs.current[category.slug] = el;
                  }}
                  className="flex items-stretch gap-4 overflow-x-auto no-scrollbar scroll-smooth pb-4"
                  style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                >
                  {filteredProducts?.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
