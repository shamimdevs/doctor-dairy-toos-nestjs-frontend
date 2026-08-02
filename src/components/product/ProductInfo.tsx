/* eslint-disable @typescript-eslint/no-explicit-any */
// src/components/product/ProductInfo.tsx
"use client";

import { RatingStars } from "./RatingStars";

interface ProductInfoProps {
  product: any;
  discountPercentage: number;
}

export function ProductInfo({ product, discountPercentage }: ProductInfoProps) {
  return (
    <div className="space-y-2">
      <h1 className="text-lg md:text-3xl font-extrabold text-gray-900 tracking-tight">
        {product.name}
      </h1>

      {product.manufacturer && (
        <p className="text-sm text-gray-500">
          Manufactured by{" "}
          <span className="font-medium text-gray-700">
            {product.manufacturer}
          </span>
        </p>
      )}

      {product.brand && (
        <p className="text-sm text-gray-500">
          Brand:{" "}
          <span className="font-medium text-gray-700">
            {product.brand.name}
          </span>
        </p>
      )}

      {/* Category */}
      {product.category && (
        <p className="text-sm text-gray-500">
          Category:{" "}
          <span className="font-medium text-gray-700">
            {product.category.name}
          </span>
        </p>
      )}

      {/* Rating */}
      {!!product.rating_avg && (
        <div className="mt-2">
          <RatingStars
            rating={product.rating_avg}
            reviewsCount={product.reviews_count}
            size={16}
          />
        </div>
      )}

      {/* Discount Badge + Stock status */}
      <div className="mt-2 flex flex-wrap items-center gap-2">
        {discountPercentage > 0 && (
          <span className="inline-block bg-red-50 text-red-600 text-xs font-bold px-2.5 py-1 rounded-full border border-red-200">
            {discountPercentage}% OFF
          </span>
        )}
      </div>
    </div>
  );
}
