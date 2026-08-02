"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search, X, TrendingUp, Loader2, ShoppingBag } from "lucide-react";
import { useDebounce } from "@/src/hooks/useDebounce";
import { useQuickSearchProductsQuery } from "@/src/redux/api/productsApi";
import { Product, QuickSearchCategory } from "@/src/types/productsType";

interface ProductSearchProps {
  autoFocus?: boolean;
  onResultClick?: () => void;
  inputClassName?: string;
  placeholder?: string;
}

const SECTION_LABEL_CLASS =
  "px-2 mb-1 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400";

function CategoryChips({
  categories,
  onClick,
  emphasized,
}: {
  categories: QuickSearchCategory[];
  onClick: () => void;
  emphasized?: boolean;
}) {
  return (
    <div className="flex flex-wrap gap-1.5 px-2">
      {categories?.map((cat) => (
        <Link
          key={cat.id}
          href={`/category/${cat.slug}`}
          onClick={onClick}
          className={`px-2.5 py-1 rounded-full text-xs font-semibold transition-colors ${
            emphasized
              ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
              : "bg-slate-100 text-slate-700 hover:bg-emerald-50 hover:text-emerald-700"
          }`}
        >
          {cat?.name}
        </Link>
      ))}
    </div>
  );
}

function ProductRow({
  product,
  onClick,
}: {
  product: Product;
  onClick: () => void;
}) {
  return (
    <Link
      href={`/product/${product.slug}`}
      onClick={onClick}
      className="flex items-center gap-3 px-2 py-2 rounded-xl hover:bg-slate-50 transition-colors"
    >
      <div className="relative h-11 w-11 shrink-0 rounded-lg overflow-hidden bg-slate-100 border border-slate-200">
        {product.thumbnail ? (
          <Image
            src={product.thumbnail}
            alt={product.name}
            fill
            className="object-cover"
            sizes="44px"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-slate-300">
            <ShoppingBag size={18} />
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-slate-800 truncate">
          {product.name}
        </p>
        {product.category?.name && (
          <p className="text-xs text-slate-400 truncate">
            {product.category.name}
          </p>
        )}
      </div>
      <span className="text-sm font-bold text-emerald-600 shrink-0">
        ৳{product.price}
      </span>
    </Link>
  );
}

export default function ProductSearch({
  autoFocus = false,
  onResultClick,
  inputClassName = "",
  placeholder = "Search products...",
}: ProductSearchProps) {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const debouncedQuery = (useDebounce(query, 350) as string).trim();

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const { data, isFetching } = useQuickSearchProductsQuery(
    { search: debouncedQuery || undefined, limit: 6 },
    { skip: !isOpen },
  );

  const categories = data?.data?.categories || [];
  const products = data?.data?.products || [];
  const hasQuery = debouncedQuery.length > 0;
  const hasResults = categories.length > 0 || products.length > 0;

  useEffect(() => {
    if (autoFocus) inputRef.current?.focus();
  }, [autoFocus]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleResultClick = () => {
    setIsOpen(false);
    onResultClick?.();
  };

  return (
    <div ref={containerRef} className="relative w-full">
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsOpen(true)}
          onKeyDown={(e) => {
            if (e.key === "Escape") {
              setIsOpen(false);
              inputRef.current?.blur();
            }
          }}
          placeholder={placeholder}
          className={`w-full bg-slate-50 border border-slate-300 rounded-xl pl-4 pr-10 py-2 text-sm text-slate-800 focus:outline-none focus:border-emerald-500 transition-all ${inputClassName}`}
        />
        {query ? (
          <button
            type="button"
            onClick={() => setQuery("")}
            className="absolute right-3 top-2.5 text-slate-400 hover:text-emerald-600 cursor-pointer"
            aria-label="Clear search"
          >
            <X size={18} />
          </button>
        ) : (
          <Search
            size={18}
            className="absolute right-3 top-2.5 text-slate-400 pointer-events-none"
          />
        )}
      </div>

      {isOpen && (
        <div className="absolute left-0 right-0 z-50 mt-2 max-h-[70vh] overflow-y-auto rounded-2xl border border-slate-200 bg-white shadow-xl">
          {isFetching ? (
            <div className="p-6 flex items-center justify-center text-slate-400">
              <Loader2 size={20} className="animate-spin" />
            </div>
          ) : hasQuery ? (
            hasResults ? (
              <div className="p-3">
                {categories.length > 0 && (
                  <div className="mb-3">
                    <p className={SECTION_LABEL_CLASS}>Categories</p>
                    <CategoryChips
                      categories={categories}
                      onClick={handleResultClick}
                      emphasized
                    />
                  </div>
                )}

                {products.length > 0 && (
                  <div>
                    <p className={SECTION_LABEL_CLASS}>Products</p>
                    <div className="flex flex-col">
                      {products.map((product) => (
                        <ProductRow
                          key={product.id}
                          product={product}
                          onClick={handleResultClick}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-8 text-center">
                <p className="text-sm text-slate-500">
                  No results for &ldquo;{debouncedQuery}&rdquo;
                </p>
              </div>
            )
          ) : hasResults ? (
            <div className="p-3">
              {categories.length > 0 && (
                <div className="mb-3">
                  <p className={SECTION_LABEL_CLASS}>Browse Categories</p>
                  <CategoryChips
                    categories={categories}
                    onClick={handleResultClick}
                  />
                </div>
              )}

              {products.length > 0 && (
                <div>
                  <p className={SECTION_LABEL_CLASS}>
                    <TrendingUp size={12} />
                    Popular Products
                  </p>
                  <div className="flex flex-col">
                    {products.map((product) => (
                      <ProductRow
                        key={product.id}
                        product={product}
                        onClick={handleResultClick}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="p-6 text-center text-sm text-slate-400">
              Start typing to search products...
            </div>
          )}
        </div>
      )}
    </div>
  );
}
