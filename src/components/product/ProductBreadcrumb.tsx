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
    <nav className="text-sm text-gray-500 mb-6 capitalize flex items-center gap-2 overflow-x-auto">
      <Link href="/" className="hover:text-emerald-600 transition-colors">
        Home
      </Link>
      <span className="text-gray-300">/</span>
      {categoryName && categorySlug && (
        <>
          <Link
            href={`/category/${categorySlug}`}
            className="hover:text-emerald-600 transition-colors"
          >
            {categoryName}
          </Link>
          <span className="text-gray-300">/</span>
        </>
      )}
      <span className="text-gray-800 font-medium truncate">{productName}</span>
    </nav>
  );
}
