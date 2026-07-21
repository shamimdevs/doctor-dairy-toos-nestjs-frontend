// components/product/ImageGallery.tsx
"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Product } from "@/src/types/product";
import { ImageOff } from "lucide-react";

interface ImageGalleryProps {
  product: Product;
}

export const ImageGallery: React.FC<ImageGalleryProps> = ({ product }) => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [imagesLoaded, setImagesLoaded] = useState<boolean[]>([]);
  const [imageErrors, setImageErrors] = useState<boolean[]>([]);

  // ✅ Get thumbnail from product (thumbnail as main image)
  const thumbnail = React.useMemo(() => {
    const imageList: string[] = [];

    // Add thumbnail as main image
    if (product.thumbnail) {
      imageList.push(product.thumbnail);
    }

    // Add additional thumbnail if available (from product.thumbnail array)
    if (product.thumbnail && Array.isArray(product.thumbnail)) {
      imageList.push(...product.thumbnail);
    }

    // Fallback if no thumbnail
    if (imageList.length === 0) {
      imageList.push("/placeholder-product.jpg");
    }

    return imageList;
  }, [product]);

  // ✅ Get discount percentage from variants or discount_range
  const discountPercentage = React.useMemo(() => {
    if (product.variants && product.variants.length > 0) {
      const firstVariant = product.variants[0];
      if (firstVariant.discount_price && firstVariant.price) {
        return Math.round(
          ((firstVariant.price - firstVariant.discount_price) /
            firstVariant.price) *
            100,
        );
      }
    }

    // Fallback: check if discount_range exists
    if (product.discount_range && product.discount_range.min > 0) {
      const price = product.price_range?.min || 0;
      const discountPrice = product.discount_range?.min || 0;
      if (price > 0 && discountPrice > 0) {
        return Math.round(((price - discountPrice) / price) * 100);
      }
    }

    return 0;
  }, [product]);

  // ✅ Check if product is in stock
  const isInStock = React.useMemo(() => {
    if (!product.variants || product.variants.length === 0) {
      return product.is_active || false;
    }
    return product.variants.some((v) => v.stock > 0);
  }, [product]);

  // ✅ Handle image load
  const handleImageLoad = (index: number) => {
    setImagesLoaded((prev) => {
      const newState = [...prev];
      newState[index] = true;
      return newState;
    });
  };

  // ✅ Handle image error
  const handleImageError = (index: number) => {
    setImageErrors((prev) => {
      const newState = [...prev];
      newState[index] = true;
      return newState;
    });
  };

  // ✅ Get image URL with fallback
  const getImageUrl = (index: number) => {
    if (imageErrors[index]) {
      return "/placeholder-product.jpg";
    }
    return thumbnail[index] || "/placeholder-product.jpg";
  };

  // ✅ If no thumbnail available
  if (!thumbnail || thumbnail.length === 0) {
    return (
      <div className="relative aspect-square w-full bg-slate-100 rounded-2xl overflow-hidden border border-slate-200 flex items-center justify-center">
        <div className="text-center">
          <ImageOff className="w-16 h-16 text-slate-300 mx-auto" />
          <p className="text-slate-400 text-sm mt-2">No image available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Main Image */}
      <div className="relative aspect-square w-full bg-slate-50 rounded-2xl overflow-hidden border border-slate-200">
        {!imagesLoaded[selectedImage] && !imageErrors[selectedImage] && (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-100">
            <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}

        <Image
          src={getImageUrl(selectedImage)}
          alt={product.name || "Product image"}
          fill
          className={`object-cover transition-opacity duration-300 ${
            imagesLoaded[selectedImage] ? "opacity-100" : "opacity-0"
          }`}
          sizes="(max-width: 768px) 100vw, 50vw"
          priority
          onLoad={() => handleImageLoad(selectedImage)}
          onError={() => handleImageError(selectedImage)}
        />

        {/* Discount Badge */}
        {discountPercentage > 0 && (
          <span className="absolute top-4 left-4 bg-red-500 text-white font-extrabold text-sm px-3 py-1 rounded-lg shadow-lg z-10">
            {discountPercentage}% OFF
          </span>
        )}

        {/* Out of Stock Badge */}
        {!isInStock && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10">
            <span className="bg-red-500 text-white font-extrabold text-lg px-6 py-3 rounded-xl">
              Out of Stock
            </span>
          </div>
        )}

        {/* Prescription Required Badge */}
        {product.is_prescription_required && (
          <span className="absolute top-4 right-4 bg-amber-500 text-white font-bold text-xs px-3 py-1 rounded-lg shadow-lg z-10">
            Prescription Required
          </span>
        )}
      </div>

      {/* Thumbnail thumbnail */}
      {thumbnail.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-transparent">
          {thumbnail.map((img, index) => (
            <button
              key={index}
              onClick={() => setSelectedImage(index)}
              className={`relative w-20 h-20 shrink-0 rounded-xl overflow-hidden border-2 transition-all ${
                selectedImage === index
                  ? "border-emerald-500 ring-2 ring-emerald-200"
                  : "border-slate-200 hover:border-slate-400"
              }`}
              aria-label={`View image ${index + 1}`}
            >
              <Image
                src={imageErrors[index] ? "/placeholder-product.jpg" : img}
                alt={`${product.name || "Product"} - Image ${index + 1}`}
                fill
                className="object-cover"
                sizes="80px"
                onError={() => handleImageError(index)}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// ✅ Update Product type to include thumbnail array (if not already defined)
// In your types/product.ts, add:
// thumbnail?: string[];
