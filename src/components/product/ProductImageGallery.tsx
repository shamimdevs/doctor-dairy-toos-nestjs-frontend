/* eslint-disable @typescript-eslint/no-explicit-any */
// src/components/product/ProductImageGallery.tsx
"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { ShoppingBag, ChevronLeft, ChevronRight } from "lucide-react";

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
  const hasMultiple = images.length > 1;

  const goPrev = () =>
    setActiveIndex((i) => (i === 0 ? images.length - 1 : i - 1));
  const goNext = () =>
    setActiveIndex((i) => (i === images.length - 1 ? 0 : i + 1));

  return (
    <div className="flex flex-col gap-3 w-full">
      {/* Big image */}
      <div className="group relative flex items-center justify-center bg-gray-50 rounded-xl p-4 sm:p-6 w-full h-64 sm:h-80 md:h-96 lg:h-105 overflow-hidden">
        {activeImage ? (
          <Image
            key={activeImage}
            width={500}
            height={500}
            src={activeImage}
            alt={product?.name || "Product image"}
            className="object-contain w-full h-full transition-transform duration-300 md:group-hover:scale-105"
            priority
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <ShoppingBag className="w-16 h-16 text-gray-300" />
          </div>
        )}

        {/* Discount Badge */}
        {discountPercentage > 0 && (
          <span className="absolute top-3 left-3 sm:top-4 sm:left-4 bg-red-500 text-white font-extrabold text-xs px-2.5 py-1 rounded-lg shadow-lg">
            {discountPercentage}% OFF
          </span>
        )}

        {/* Prescription Required Badge */}
        {product?.is_prescription_required && (
          <span className="absolute top-3 right-3 sm:top-4 sm:right-4 bg-amber-500 text-white font-bold text-xs px-2.5 py-1 rounded-lg shadow-lg">
            Prescription Required
          </span>
        )}

        {/* Prev / Next arrows */}
        {hasMultiple && (
          <>
            <button
              type="button"
              onClick={goPrev}
              aria-label="Previous image"
              className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/90 hover:bg-white text-gray-700 shadow-md flex items-center justify-center transition-all cursor-pointer opacity-90 md:opacity-0 md:group-hover:opacity-100"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              type="button"
              onClick={goNext}
              aria-label="Next image"
              className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/90 hover:bg-white text-gray-700 shadow-md flex items-center justify-center transition-all cursor-pointer opacity-90 md:opacity-0 md:group-hover:opacity-100"
            >
              <ChevronRight size={18} />
            </button>

            {/* Image counter */}
            <span className="absolute bottom-3 right-3 bg-black/60 text-white text-[11px] font-semibold px-2 py-0.5 rounded-full">
              {activeIndex + 1} / {images.length}
            </span>
          </>
        )}
      </div>

      {/* Thumbnails — click one to swap the big image */}
      {hasMultiple && (
        <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
          {images.map((img, index) => (
            <button
              key={img}
              type="button"
              onClick={() => setActiveIndex(index)}
              aria-label={`View image ${index + 1}`}
              aria-current={index === activeIndex}
              className={`relative shrink-0 w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-lg overflow-hidden border-2 bg-gray-50 transition-all cursor-pointer ${
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
