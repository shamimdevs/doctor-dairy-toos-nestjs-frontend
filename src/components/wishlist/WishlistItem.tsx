// src/components/wishlist/WishlistItem.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { X, ShoppingBag, Heart } from "lucide-react";
import { IWishlistItem } from "@/src/redux/api/wishlistApi";
import { JSX } from "react/jsx-runtime";

interface WishlistItemProps {
  item: IWishlistItem;
  onRemove: () => void;
}

export function WishlistItem({
  item,
  onRemove,
}: WishlistItemProps): JSX.Element {
  // ✅ Get product from item (nested object)
  const product = item?.product;

  // ✅ If product doesn't exist, show fallback
  if (!product) {
    return (
      <div className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-slate-200">
        <div className="flex-1">
          <p className="text-sm text-slate-500">Product not available</p>
          <p className="text-xs text-slate-400">ID: {item?.product_id}</p>
        </div>
        <button
          onClick={onRemove}
          className="p-2 bg-red-50 text-red-500 rounded-xl hover:bg-red-100 transition-colors"
          aria-label="Remove from wishlist"
        >
          <X size={18} />
        </button>
      </div>
    );
  }

  // ✅ Get product details from the product object
  const productName = product.name || "Unknown Product";
  const productSlug = product.slug || "";
  const productThumbnail = product.thumbnail || "/placeholder.png";

  // ✅ Calculate price - from product object or use fallback
  const price = product?.price || product?.price_range?.min || 0;

  return (
    <div className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-slate-200 hover:shadow-md transition-all group">
      {/* Product Image */}
      <Link
        href={`/product/${productSlug}`}
        className="relative w-20 h-20 shrink-0 rounded-xl overflow-hidden bg-slate-100"
      >
        <Image
          src={productThumbnail}
          alt={productName}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          sizes="80px"
        />
      </Link>

      {/* Product Info */}
      <div className="flex-1 min-w-0">
        <Link href={`/product/${productSlug}`}>
          <h4 className="text-sm font-bold text-slate-800 hover:text-emerald-600 transition-colors line-clamp-2">
            {productName}
          </h4>
        </Link>
        <div className="flex items-center gap-2 mt-1">
          <p className="text-sm font-bold text-emerald-600">
            ৳{typeof price === "number" ? price.toFixed(2) : "0.00"}
          </p>
          {product?.discount_price && (
            <span className="text-xs text-slate-400 line-through">
              ৳
              {typeof product.discount_price === "number"
                ? product.discount_price.toFixed(2)
                : "0.00"}
            </span>
          )}
        </div>
        {product?.variants && product.variants.length > 0 && (
          <p className="text-xs text-slate-500">
            {product.variants.length} variant(s) available
          </p>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        <Link
          href={`/product/${productSlug}`}
          className="p-2 bg-emerald-50 text-emerald-600 rounded-xl hover:bg-emerald-100 transition-colors"
          aria-label="View product"
        >
          <ShoppingBag size={18} />
        </Link>
        <button
          onClick={onRemove}
          className="p-2 bg-red-50 text-red-500 rounded-xl hover:bg-red-100 transition-colors"
          aria-label="Remove from wishlist"
        >
          <Heart size={18} className="fill-current" />
        </button>
      </div>
    </div>
  );
}
