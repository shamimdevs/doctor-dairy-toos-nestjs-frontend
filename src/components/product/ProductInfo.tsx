/* eslint-disable @typescript-eslint/no-explicit-any */
// src/components/product/ProductInfo.tsx
"use client";

import { Star } from "lucide-react";

interface ProductInfoProps {
  product: any;
  selectedVariant: any;
  discountPercentage: number;
}

export function ProductInfo({ product }: ProductInfoProps) {
  return (
    <div className="space-y-2">
      <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">
        {product.name}
      </h1>
      <p className="text-sm text-gray-500">
        Manufactured by{" "}
        <span className="font-medium text-gray-700">
          {product.manufacturer}
        </span>
      </p>
      {product.brand && (
        <p className="text-sm text-gray-500">
          Brand:{" "}
          <span className="font-medium text-gray-700">
            {product.brand.name}
          </span>
        </p>
      )}

      {/* Rating (placeholder) */}
      <div className="flex items-center gap-2 mt-2">
        <div className="flex items-center gap-0.5">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              size={16}
              className={`${
                star <= 4
                  ? "fill-amber-400 text-amber-400"
                  : "fill-gray-200 text-gray-200"
              } stroke-none`}
            />
          ))}
        </div>
        <span className="text-sm text-gray-500">(124 reviews)</span>
      </div>
    </div>
  );
}
