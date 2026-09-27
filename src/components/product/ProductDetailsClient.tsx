// src/components/product/ProductDetailsClient.tsx
"use client";

import { ProductBreadcrumb } from "./ProductBreadcrumb";
import { ProductImageGallery } from "./ProductImageGallery";
import { ProductInfo } from "./ProductInfo";
import { ProductActions } from "./ProductActions";
import { ProductTabs } from "./ProductTabs";
import RelatedProducts from "./RelatedProducts";

import type { Product } from "@/src/types/product";

type ProductProps = {
  product: Product;
};

export default function ProductDetailsClient({ product }: ProductProps) {
  const currentPrice = product.price || 0;
  const discountPrice = product.discount_price || 0;
  const originalPrice = product.original_price || product.price || 0;

  const savings = originalPrice - currentPrice;

  const discountPercentage =
    originalPrice > 0 ? Math.round((savings / originalPrice) * 100) : 0;

  const productName = product.name || "";

  const categoryName = product.category?.name || "";
  const categorySlug = product.category?.slug || "";

  return (
    <div className="container py-8 sm:py-10 md:py-14">
      <ProductBreadcrumb
        categoryName={categoryName}
        categorySlug={categorySlug}
        productName={productName}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 lg:gap-12 bg-white p-4 sm:p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100">
        <ProductImageGallery
          product={product}
          discountPercentage={discountPercentage}
        />

        <div className="flex flex-col justify-between">
          <div>
            <ProductInfo
              product={product}
              discountPercentage={discountPercentage}
            />

            <hr className="border-gray-100 my-4" />

            <div className="mb-6">
              <div className="flex flex-wrap items-baseline gap-2 sm:gap-3">
                <span className="text-lg sm:text-3xl font-black text-emerald-600">
                  ৳{currentPrice.toFixed(2)}
                </span>

                {savings > 0 && discountPrice > 0 && (
                  <>
                    <span className="text-base sm:text-lg text-gray-400 line-through">
                      ৳{originalPrice.toFixed(2)}
                    </span>

                    <span className="bg-emerald-50 text-emerald-700 text-xs font-bold px-2 py-0.5 rounded">
                      Save {discountPercentage}%
                    </span>
                  </>
                )}
              </div>

              {savings > 0 && discountPrice > 0 && (
                <p className="text-xs text-gray-500 mt-1">
                  You save ৳{savings.toFixed(2)}
                </p>
              )}
            </div>

            <div className="bg-gray-50 rounded-xl p-4 text-sm space-y-2 mb-8 text-gray-600">
              <div className="flex justify-between gap-1 md:gap-3">
                <span className="shrink-0">SKU:</span>

                <span className="font-mono text-gray-900 text-right wrap-break-word">
                  {product.slug || "N/A"}
                </span>
              </div>

              {Number(product.weight) > 0 && (
                <div className="flex justify-between gap-1 md:gap-3">
                  <span className="shrink-0">Weight:</span>

                  <span className="text-gray-900 font-medium text-right">
                    {product.weight} kg
                  </span>
                </div>
              )}

              <div className="flex justify-between gap-1 md:gap-3">
                <span className="shrink-0">Category:</span>

                <span className="text-gray-900 font-medium text-right wrap-break-word">
                  {product.category?.name || "N/A"}
                </span>
              </div>
            </div>
          </div>

          <ProductActions product={product} />
        </div>
      </div>

      <ProductTabs product={product} />

      <RelatedProducts productId={product.id} categorySlug={categorySlug} />
    </div>
  );
}
