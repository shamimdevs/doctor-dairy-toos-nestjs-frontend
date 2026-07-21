/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useMemo } from "react";
import { useGetAllProductCategoriesQuery } from "@/src/redux/api/productCategoriesApi";

interface CategoryFilterProps {
  selectedCategories: string[]; // Now stores slugs
  onToggle: (categorySlug: string) => void;
}

export default function CategoryFilter({
  selectedCategories,
  onToggle,
}: CategoryFilterProps) {
  const { data: categoriesData, isLoading } =
    useGetAllProductCategoriesQuery(undefined);

  const categories = useMemo(() => {
    if (!categoriesData?.data) return [];
    return categoriesData.data;
  }, [categoriesData]);

  if (isLoading) {
    return (
      <div className="border-t border-slate-200 pt-4 mt-4">
        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
          Categories
        </h4>
        <div className="space-y-2">
          <div className="h-5 bg-slate-100 rounded animate-pulse"></div>
          <div className="h-5 bg-slate-100 rounded animate-pulse"></div>
          <div className="h-5 bg-slate-100 rounded animate-pulse"></div>
        </div>
      </div>
    );
  }

  if (categories.length === 0) {
    return null;
  }

  return (
    <div className="border-t border-slate-200 pt-4 mt-4">
      <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
        Categories
      </h4>
      <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
        {categories.map((category: any) => {
          const isChecked = selectedCategories.includes(category.slug);
          return (
            <label
              key={category.id}
              className="flex items-center gap-2.5 cursor-pointer group hover:bg-slate-50 px-2 py-1 rounded-lg transition-all"
            >
              <input
                type="checkbox"
                checked={isChecked}
                onChange={() => onToggle(category.slug)} // ✅ Pass slug
                className="w-4 h-4 rounded border-slate-300 text-emerald-500 focus:ring-emerald-500 focus:ring-2 cursor-pointer transition-all"
              />
              <span className="text-sm text-slate-700 group-hover:text-emerald-600 transition-colors font-medium">
                {category.name}
              </span>
            </label>
          );
        })}
      </div>
    </div>
  );
}
