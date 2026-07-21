/* eslint-disable @typescript-eslint/no-explicit-any */
// src/components/product/ProductImageGallery.tsx
"use client";

import Image from "next/image";
import { ShoppingBag } from "lucide-react";

interface ProductImageGalleryProps {
  product: any;
  discountPercentage: number;
  isInStock: boolean;
  selectedVariant: any;
}

export function ProductImageGallery({
  product,
  discountPercentage,
  isInStock,
}: ProductImageGalleryProps) {
  return (
    <div className="flex flex-col items-center justify-center bg-gray-50 rounded-xl p-6 min-h-80 md:min-h-100 relative">
      {product.thumbnail ? (
        <Image
          width={400}
          height={400}
          src={product.thumbnail}
          alt={product.name}
          className="object-contain max-h-80 w-auto mix-blend-multiply hover:scale-105 transition-transform duration-300"
          priority
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <ShoppingBag className="w-16 h-16 text-gray-300" />
        </div>
      )}

      {/* Discount Badge */}
      {discountPercentage > 0 && (
        <span className="absolute top-4 left-4 bg-red-500 text-white font-extrabold text-xs px-2.5 py-1 rounded-lg shadow-lg">
          {discountPercentage}% OFF
        </span>
      )}

      {/* Out of Stock Badge */}
      {!isInStock && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-xl">
          <span className="bg-red-500 text-white font-extrabold text-lg px-6 py-3 rounded-xl">
            Out of Stock
          </span>
        </div>
      )}

      {/* Prescription Required Badge */}
      {product.is_prescription_required && (
        <span className="absolute top-4 right-4 bg-amber-500 text-white font-bold text-xs px-2.5 py-1 rounded-lg shadow-lg">
          Prescription Required
        </span>
      )}
    </div>
  );
}
