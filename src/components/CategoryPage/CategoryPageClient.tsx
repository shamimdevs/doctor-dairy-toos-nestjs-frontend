/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { X, ChevronLeft } from "lucide-react";
import CategoryProductCard from "@/src/components/HomePage/ProductShowcase/CategoryProductCard";
import { Product } from "@/src/types/product";
import { IProductCategory } from "@/src/types/productCategoriesType";
import { DiscountFilter, PriceFilter } from "../filters";
import CategoryFilter from "../filters/CategoryFilter";

interface CategoryPageClientProps {
  slug: string;
  initialCategory: IProductCategory;
  allProducts: Product[];
  allCategories: IProductCategory[];
}

interface FilterState {
  price: string | null;
  discount: string | null;
  categories: string[];
  sortBy: string;
}

export default function CategoryPageClient({
  initialCategory,
  allProducts,
}: CategoryPageClientProps) {
  const router = useRouter();

  const [filters, setFilters] = useState<FilterState>({
    price: null,
    discount: null,
    categories: initialCategory.slug
      ? [initialCategory.slug.toLowerCase()]
      : [],
    sortBy: "default",
  });

  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  const getProductPrice = useCallback((product: Product): number => {
    if (product.variants && product.variants.length > 0) {
      return product.variants[0].price;
    }
    return product.price_range?.min || 0;
  }, []);

  const getProductDiscount = useCallback((product: Product): number => {
    if (product.variants && product.variants.length > 0) {
      const variant = product.variants[0];
      if (variant.discount_price && variant.price > 0) {
        return Math.round(
          ((variant.price - variant.discount_price) / variant.price) * 100,
        );
      }
    }
    return 0;
  }, []);

  const filteredProducts = useMemo(() => {
    let filtered = allProducts;

    if (filters.categories.length > 0) {
      filtered = filtered.filter((p: Product) => {
        const productCategorySlug = p.category?.slug?.toLowerCase() || "";
        return filters.categories.includes(productCategorySlug);
      });
    }

    if (filters.price) {
      filtered = filtered.filter((p: Product) => {
        const price = getProductPrice(p);
        switch (filters.price) {
          case "under-500":
            return price < 500;
          case "500-1000":
            return price >= 500 && price <= 1000;
          case "1000-2000":
            return price >= 1000 && price <= 2000;
          case "over-2000":
            return price > 2000;
          default:
            return true;
        }
      });
    }

    if (filters.discount) {
      const minDiscount = parseInt(filters.discount, 10);
      filtered = filtered.filter(
        (p: Product) => getProductDiscount(p) >= minDiscount,
      );
    }

    switch (filters.sortBy) {
      case "price-low":
        filtered = [...filtered].sort(
          (a, b) => getProductPrice(a) - getProductPrice(b),
        );
        break;
      case "price-high":
        filtered = [...filtered].sort(
          (a, b) => getProductPrice(b) - getProductPrice(a),
        );
        break;
      case "discount":
        filtered = [...filtered].sort(
          (a, b) => getProductDiscount(b) - getProductDiscount(a),
        );
        break;
      case "popular":
        filtered = [...filtered].sort(
          (a, b) =>
            ((b as any).reviewsCount || 0) - ((a as any).reviewsCount || 0),
        );
        break;
      default:
        break;
    }

    return filtered;
  }, [allProducts, filters, getProductPrice, getProductDiscount]);

  const clearAllFilters = useCallback(() => {
    setFilters({
      price: null,
      discount: null,
      categories: [],
      sortBy: "default",
    });
  }, []);

  const toggleCategory = useCallback((categorySlug: string) => {
    const target = categorySlug.toLowerCase();
    setFilters((prev) => ({
      ...prev,
      categories: prev.categories.includes(target)
        ? prev.categories.filter((c) => c !== target)
        : [...prev.categories, target],
    }));
  }, []);

  const updateFilter = useCallback((key: keyof FilterState, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }, []);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.price) count++;
    if (filters.discount) count++;
    if (filters.categories.length > 0) count++;
    return count;
  }, [filters]);

  return (
    <div className="bg-slate-50 min-h-screen">
      <div className="container py-6 ">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-slate-600 hover:text-emerald-600 mb-4 transition-colors group"
        >
          <ChevronLeft
            size={20}
            className="group-hover:-translate-x-0.5 transition-transform"
          />
          <span className="font-semibold">Back</span>
        </button>

        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-emerald-600">
              {initialCategory.name}
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Browsing items under {initialCategory.name} and related filter
              sets.
            </p>
          </div>

          {/* Sort By Dropdown UI */}
          <div className="flex items-center gap-2 self-end sm:self-auto">
            <span className="text-xs font-bold text-slate-500 uppercase">
              Sort By:
            </span>
            <select
              value={filters.sortBy}
              onChange={(e) => updateFilter("sortBy", e.target.value)}
              className="bg-white border border-slate-200 text-sm font-semibold text-slate-700 py-1.5 px-3 rounded-xl focus:outline-none focus:border-emerald-500 shadow-sm"
            >
              <option value="default">Default</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="discount">Biggest Discount</option>
              <option value="popular">Popularity</option>
            </select>
            <button
              onClick={() => setIsMobileFilterOpen(true)}
              className="lg:hidden bg-emerald-600 text-white px-4 py-1.5 rounded-xl text-sm font-bold"
            >
              Filters ({activeFilterCount})
            </button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Desktop Sidebar */}
          <aside className="hidden lg:block w-64 shrink-0">
            <div className="bg-white border border-slate-200 rounded-2xl p-5 sticky top-24 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-extrabold text-slate-800 uppercase tracking-wider">
                  Filters
                </h2>
                {activeFilterCount > 0 && (
                  <button
                    onClick={clearAllFilters}
                    className="text-[10px] font-bold text-emerald-600 hover:text-emerald-700"
                  >
                    Clear All ({activeFilterCount})
                  </button>
                )}
              </div>
              <PriceFilter
                selectedRange={filters.price}
                onSelect={(val) => updateFilter("price", val)}
              />
              <DiscountFilter
                selectedDiscount={filters.discount}
                onSelect={(val) => updateFilter("discount", val)}
              />

              <CategoryFilter
                selectedCategories={filters.categories}
                onToggle={toggleCategory}
              />
            </div>
          </aside>

          {/* Mobile Filter Drawer */}
          {isMobileFilterOpen && (
            <div className="fixed inset-0 z-50 lg:hidden">
              <div
                className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                onClick={() => setIsMobileFilterOpen(false)}
              />
              <div className="absolute inset-y-0 left-0 w-4/5 max-w-xs bg-white p-5 overflow-y-auto z-10">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-extrabold text-slate-900">
                    Filters
                  </h2>
                  <button
                    onClick={() => setIsMobileFilterOpen(false)}
                    className="p-2 hover:bg-slate-100 rounded-xl"
                  >
                    <X size={20} />
                  </button>
                </div>
                <PriceFilter
                  selectedRange={filters.price}
                  onSelect={(val) => updateFilter("price", val)}
                />
                <DiscountFilter
                  selectedDiscount={filters.discount}
                  onSelect={(val) => updateFilter("discount", val)}
                />
                <CategoryFilter
                  selectedCategories={filters.categories}
                  onToggle={toggleCategory}
                />
              </div>
            </div>
          )}

          {/* Product Grid Layout */}
          <main className="flex-1">
            {filteredProducts?.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                {filteredProducts?.map((product: Product) => (
                  <CategoryProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center shadow-sm">
                <p className="text-slate-400 font-medium">
                  No products match the selected criteria. Try adjusting your
                  filters.
                </p>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
