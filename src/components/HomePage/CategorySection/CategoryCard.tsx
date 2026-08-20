
"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ProductCategory } from "@/src/types/productCategoriesType";

interface CategoryCardProps {
  category: ProductCategory;
}

export default function CategoryCard({ category }: CategoryCardProps) {
  const [isImageLoading, setIsImageLoading] = useState(true);

  const targetPath = `/category/${category.slug}`;

  return (
    <Link
      href={targetPath}
      className="shrink-0 h-full w-28 md:w-36 lg:w-40 bg-white border border-slate-200 rounded-2xl p-1.5 flex flex-col items-center justify-start text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-emerald-200 group"
    >
      {/* ইমেজ কন্টেইনার — every breakpoint gets a fixed box, so the icon
          never changes the card's overall height */}
      <div className="relative  w-28 h-28 mb-2 rounded-xl flex items-center justify-center overflow-hidden shrink-0 transition-all duration-300 group-hover:scale-105">
        {isImageLoading && (
          <div className="absolute inset-0 bg-slate-100 animate-pulse rounded-xl" />
        )}
        <Image
          src={category?.image || "/placeholder-category.png"}
          alt={category?.name || "Category"}
          fill
          sizes="(max-width: 640px) 56px, (max-width: 768px) 64px, (max-width: 1024px) 80px, 96px"
          className={`object-contain p-1.5 sm:p-2 transition-all duration-300 ${
            isImageLoading ? "opacity-0 scale-95" : "opacity-100 scale-100"
          }`}
          onLoad={() => setIsImageLoading(false)}
          onError={() => setIsImageLoading(false)}
          unoptimized
        />
      </div>

      {/* ক্যাটাগরি নাম — clamped to exactly 2 lines so short and long
          names both reserve the same amount of vertical space */}
      <div className="w-full flex items-center justify-center h-8">
        <h3 className="text-xs font-bold text-slate-700 tracking-tight leading-4 line-clamp-2 transition-colors group-hover:text-emerald-600 px-0.5">
          {category?.name}
        </h3>
      </div>
    </Link>
  );
}
