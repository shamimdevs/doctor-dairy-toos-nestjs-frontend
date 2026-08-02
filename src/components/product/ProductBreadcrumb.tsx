// src/components/product/ProductBreadcrumb.tsx
"use client";

import Link from "next/link";

interface ProductBreadcrumbProps {
  categoryName?: string;
  categorySlug?: string;
  productName: string;
}

export function ProductBreadcrumb({
  categoryName,
  categorySlug,
  productName,
}: ProductBreadcrumbProps) {
  return (
    <nav
      aria-label="Breadcrumb"
      className="text-xs sm:text-sm text-gray-500 mb-4 sm:mb-6 capitalize flex items-center gap-1.5 sm:gap-2 w-full"
    >
      <Link
        href="/"
        className="shrink-0 hover:text-emerald-600 transition-colors"
      >
        Home
      </Link>
      <span className="shrink-0 text-gray-300">/</span>
      {categoryName && categorySlug && (
        <>
          <Link
            href={`/category/${categorySlug}`}
            className="shrink-0 max-w-[35vw] sm:max-w-50 truncate hover:text-emerald-600 transition-colors"
          >
            {categoryName}
          </Link>
          <span className="shrink-0 text-gray-300">/</span>
        </>
      )}
      <span className="min-w-0 flex-1 truncate text-gray-800 font-medium">
        {productName}
      </span>
    </nav>
  );
}
