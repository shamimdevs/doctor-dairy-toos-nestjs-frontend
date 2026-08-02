/* eslint-disable @typescript-eslint/no-explicit-any */
// src/components/product/ProductImageGallery.tsx
"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { ShoppingBag } from "lucide-react";

interface ProductImageGalleryProps {
  product: any;
  discountPercentage: number;
}

export function ProductImageGallery({
  product,
  discountPercentage,
}: ProductImageGalleryProps) {
  // Main thumbnail first, then the gallery images — deduped in case the
  // same image was uploaded as both.
  const images: string[] = useMemo(() => {
    const list = [product?.thumbnail, ...(product?.images || [])].filter(
      Boolean,
    );
    return Array.from(new Set(list));
  }, [product?.thumbnail, product?.images]);

  const [activeIndex, setActiveIndex] = useState(0);
  const activeImage = images[activeIndex];

  return (
    <div className="flex flex-col gap-3">
      {/* Big image */}
      <div className="relative flex items-center justify-center bg-gray-50 rounded-xl p-6 aspect-square w-full">
        {activeImage ? (
          <Image
            key={activeImage}
            width={500}
            height={500}
            src={activeImage}
            alt={product?.name || "Product image"}
            className="object-contain max-h-full w-auto mix-blend-multiply"
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

        {/* Prescription Required Badge */}
        {product?.is_prescription_required && (
          <span className="absolute top-4 right-4 bg-amber-500 text-white font-bold text-xs px-2.5 py-1 rounded-lg shadow-lg">
            Prescription Required
          </span>
        )}
      </div>

      {/* Thumbnails — click one to swap the big image */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {images.map((img, index) => (
            <button
              key={img}
              type="button"
              onClick={() => setActiveIndex(index)}
              aria-label={`View image ${index + 1}`}
              aria-current={index === activeIndex}
              className={`relative shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden border-2 bg-gray-50 transition-all cursor-pointer ${
                index === activeIndex
                  ? "border-emerald-500 ring-2 ring-emerald-200"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <Image
                src={img}
                alt={`${product?.name || "Product"} thumbnail ${index + 1}`}
                fill
                sizes="80px"
                className="object-contain p-1"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
