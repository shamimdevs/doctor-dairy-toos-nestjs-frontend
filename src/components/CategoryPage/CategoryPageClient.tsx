/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useMemo, useCallback, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { X, ChevronLeft, ChevronDown, Check, Loader2 } from "lucide-react";
import CategoryProductCard from "@/src/components/HomePage/ProductShowcase/CategoryProductCard";
import { Product } from "@/src/types/product";
import { ProductCategory } from "@/src/types/productCategoriesType";
import { useGetProductsInfiniteQuery } from "@/src/redux/api/productsApi";
import { DiscountFilter, PriceFilter } from "../filters";
import CategoryFilter from "../filters/CategoryFilter";

interface CategoryPageClientProps {
  slug: string;
  initialCategory: ProductCategory;
  allCategories: ProductCategory[];
}

const PRODUCTS_LIMIT = 24;

interface FilterState {
  price: string | null;
  discount: string | null;
  categories: string[];
  sortBy: string;
}

const SORT_OPTIONS = [
  { value: "newest", label: "Newest First" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
  { value: "discount", label: "Biggest Discount" },
  { value: "popular", label: "Popularity" },
];

export default function CategoryPageClient({
  initialCategory,
  allCategories,
}: CategoryPageClientProps) {
  const router = useRouter();

  const [filters, setFilters] = useState<FilterState>({
    price: null,
    discount: null,
    categories: initialCategory.slug
      ? [initialCategory.slug.toLowerCase()]
      : [],
    sortBy: "newest",
  });

  // Next.js reuses this component instance when navigating between
  // /category/[slug] pages (same tree position), so `filters` would
  // otherwise stay stuck on whichever category was viewed first — and for
  // the same reason, the browser doesn't auto-scroll to top on this kind
  // of same-component navigation, so we do it ourselves.
  useEffect(() => {
    setFilters({
      price: null,
      discount: null,
      categories: initialCategory.slug
        ? [initialCategory.slug.toLowerCase()]
        : [],
      sortBy: "newest",
    });
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [initialCategory.slug]);

  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Lock background scroll while the mobile filter drawer is open
  useEffect(() => {
    document.body.style.overflow = isMobileFilterOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileFilterOpen]);

  const [isSortOpen, setIsSortOpen] = useState(false);
  const sortRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (sortRef.current && !sortRef.current.contains(e.target as Node)) {
        setIsSortOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const currentSortLabel =
    SORT_OPTIONS.find((option) => option.value === filters.sortBy)?.label ||
    "Newest First";

  // Only a single selected category can be pushed down to the backend as
  // `category_id` (the API has no multi-id filter). With zero or several
  // categories checked we fetch the unscoped feed instead and let the
  // `filteredProducts` memo below narrow it down client-side, same as it
  // already does for price/discount/sort.
  const categoryIdForQuery = useMemo(() => {
    if (filters.categories.length !== 1) return undefined;
    const slug = filters.categories[0];
    if (slug === initialCategory.slug?.toLowerCase()) return initialCategory.id;
    return allCategories.find((c) => c.slug?.toLowerCase() === slug)?.id;
  }, [filters.categories, allCategories, initialCategory]);

  // Infinite-scroll product feed, following the same RTK Query
  // accumulate-by-page + IntersectionObserver-sentinel pattern used in
  // CreateOrder.tsx. `page` resets to 1 whenever the backend-side scope
  // (category_id) changes, computed during render rather than in an effect
  // to avoid an extra render pass.
  const [page, setPage] = useState(1);
  const scopeKey = categoryIdForQuery ?? "all";
  const [lastScopeKey, setLastScopeKey] = useState(scopeKey);
  if (scopeKey !== lastScopeKey) {
    setLastScopeKey(scopeKey);
    setPage(1);
  }

  const {
    data: productsRes,
    isLoading: isProductsLoading,
    isFetching: isProductsFetching,
  } = useGetProductsInfiniteQuery({
    page,
    limit: PRODUCTS_LIMIT,
    is_active: true,
    ...(categoryIdForQuery ? { category_id: categoryIdForQuery } : {}),
  });

  const allProducts = useMemo(
    () => (productsRes?.data as unknown as Product[]) || [],
    [productsRes],
  );
  const totalPages = productsRes?.meta?.totalPages || 1;
  const hasMore = page < totalPages;

  // Auto-load the next page once the sentinel at the bottom of the grid
  // scrolls into view.
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const node = sentinelRef.current;
    if (!node || !hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isProductsFetching) {
          setPage((p) => p + 1);
        }
      },
      { rootMargin: "300px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [hasMore, isProductsFetching]);

  const getProductPrice = useCallback((product: Product): number => {
    if (product.price) return product.price;
    if (product.variants && product.variants.length > 0) {
      return product.variants[0].price;
    }
    return product.price_range?.min || 0;
  }, []);

  const getProductDiscount = useCallback((product: Product): number => {
    const price = product.price || 0;
    const originalPrice = product.original_price || price;
    if (originalPrice > price && originalPrice > 0) {
      return Math.round(((originalPrice - price) / originalPrice) * 100);
    }
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
      case "newest":
        filtered = [...filtered].sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
        );
        break;
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
      sortBy: "newest",
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

        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-emerald-600">
              {initialCategory.name}
            </h1>
            {/* <p className="text-sm text-slate-500 mt-1">
              Browsing items under {initialCategory.name} and related filter
              sets.
            </p> */}
          </div>

          {/* Sort By Dropdown UI */}
          <div className="flex flex-wrap items-center justify-end gap-2 sm:self-auto">
            <div className="relative" ref={sortRef}>
              <button
                type="button"
                onClick={() => setIsSortOpen((prev) => !prev)}
                className={`md:w-60 flex justify-between items-center gap-2 bg-white border text-xs sm:text-sm font-semibold py-2 px-3 sm:px-4 rounded-xl shadow-sm transition-all duration-200 cursor-pointer ${
                  isSortOpen
                    ? "border-emerald-400 text-emerald-600 ring-2 ring-emerald-100"
                    : "border-slate-200 text-slate-700 hover:border-emerald-300 hover:text-emerald-600"
                }`}
              >
                {currentSortLabel}
                <ChevronDown
                  size={16}
                  className={`text-slate-400 transition-transform duration-200 ${
                    isSortOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              <div
                className={`absolute right-0 z-20 mt-2 w-56 max-w-[calc(100vw-2.5rem)] origin-top-right rounded-xl border border-slate-200 bg-white shadow-lg transition-all duration-150 ${
                  isSortOpen
                    ? "opacity-100 scale-100 translate-y-0"
                    : "pointer-events-none opacity-0 scale-95 -translate-y-1"
                }`}
              >
                <div className="p-1.5">
                  {SORT_OPTIONS.map((option) => {
                    const isActive = filters.sortBy === option.value;
                    return (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => {
                          updateFilter("sortBy", option.value);
                          setIsSortOpen(false);
                        }}
                        className={`flex w-full items-center justify-between gap-2 rounded-lg px-3 py-2 text-left text-sm transition-colors cursor-pointer ${
                          isActive
                            ? "bg-emerald-50 text-emerald-700 font-semibold"
                            : "text-slate-600 hover:bg-slate-50"
                        }`}
                      >
                        {option.label}
                        {isActive && (
                          <Check size={14} className="text-emerald-600" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <button
              onClick={() => setIsMobileFilterOpen(true)}
              className="lg:hidden bg-emerald-600 text-white px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold shadow-sm hover:bg-emerald-700 active:scale-95 transition-all"
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
          <div
            className={`fixed inset-0 z-50 lg:hidden transition-opacity duration-300 ${
              isMobileFilterOpen
                ? "opacity-100 pointer-events-auto"
                : "opacity-0 pointer-events-none"
            }`}
            aria-hidden={!isMobileFilterOpen}
          >
            <div
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              onClick={() => setIsMobileFilterOpen(false)}
            />
            <div
              className={`absolute inset-y-0 left-0 h-full w-[85%] max-w-xs bg-white p-5 overflow-y-auto shadow-2xl transition-transform duration-300 ease-out ${
                isMobileFilterOpen ? "translate-x-0" : "-translate-x-full"
              }`}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-extrabold text-slate-900">
                  Filters
                </h2>
                <button
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="p-2 hover:bg-slate-100 rounded-xl transition-colors"
                  aria-label="Close filters"
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

              {activeFilterCount > 0 && (
                <button
                  onClick={clearAllFilters}
                  className="mt-6 w-full rounded-xl border border-slate-200 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-50 transition-colors"
                >
                  Clear All ({activeFilterCount})
                </button>
              )}
            </div>
          </div>

          {/* Product Grid Layout */}
          <main className="flex-1">
            {isProductsLoading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-5">
                {[...Array(PRODUCTS_LIMIT)].map((_, i) => (
                  <div
                    key={i}
                    className="h-64 animate-pulse rounded-2xl bg-slate-100"
                  />
                ))}
              </div>
            ) : filteredProducts?.length > 0 ? (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-5">
                  {filteredProducts?.map((product: Product) => (
                    <CategoryProductCard key={product.id} product={product} />
                  ))}
                </div>

                {/* Infinite scroll sentinel + status */}
                <div ref={sentinelRef} className="h-1" />
                {isProductsFetching && (
                  <div className="flex items-center justify-center gap-2 py-6 text-sm text-slate-400">
                    <Loader2 size={16} className="animate-spin" />
                    Loading more products...
                  </div>
                )}
                {!hasMore && !isProductsFetching && (
                  <p className="py-6 text-center text-xs text-slate-400">
                    You&apos;ve reached the end of the list.
                  </p>
                )}
              </>
            ) : (
              <div className="bg-white border border-slate-200 rounded-2xl p-8 sm:p-12 text-center shadow-sm">
                <p className="text-slate-400 font-medium text-sm sm:text-base">
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
