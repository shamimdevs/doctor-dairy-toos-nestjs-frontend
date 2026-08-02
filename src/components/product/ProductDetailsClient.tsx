// src/components/product/ProductDetailsClient.tsx
"use client";

import { ProductBreadcrumb } from "./ProductBreadcrumb";
import { ProductImageGallery } from "./ProductImageGallery";
import { ProductInfo } from "./ProductInfo";
import { ProductActions } from "./ProductActions";
import { ProductTabs } from "./ProductTabs";
import { ProductTrustBadges } from "./ProductTrustBadges";

type ProductProps = {
  product: {
    id: string;
    name: string;
    slug: string;
    thumbnail: string;
    images?: string[];
    description?: string;
    specifications?: { label: string; value: string }[];
    rating_avg?: number | null;
    reviews_count?: number;
    manufacturer: string;
    is_prescription_required: boolean;
    price: number;
    discount_price?: number;
    original_price?: number;
    stock: number;
    weight?: number;
    meta_description?: string;
    meta_keywords?: string;
    category: { id: string; name: string; slug: string };
    brand?: { id: string; name: string };
    addedBy?: { id: string; name: string };
    created_at: string;
    updated_at: string;
  };
};

export default function ProductDetailsClient({ product }: ProductProps) {
  const currentPrice = product?.price || 0;
  const discountPrice = product?.discount_price || 0;
  const originalPrice = product?.original_price || product?.price || 0;

  const savings = originalPrice - currentPrice;
  const discountPercentage =
    originalPrice > 0 ? Math.round((savings / originalPrice) * 100) : 0;

  const productName = product?.name || "";
  const categoryName = product?.category?.name || "";
  const categorySlug = product?.category?.slug || "";
  const brandName = product?.brand?.name || "";

  return (
    <div className="container mx-auto px-4 py-6 max-w-6xl">
      <ProductBreadcrumb
        categoryName={categoryName}
        categorySlug={categorySlug}
        productName={productName}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100">
        <ProductImageGallery
          product={product}
          discountPercentage={discountPercentage}
        />

        <div className="flex flex-col justify-between">
          <div>
            <div className="flex flex-wrap gap-2 mb-4">
              {brandName && (
                <span className="bg-blue-50 text-blue-600 text-xs font-semibold px-2.5 py-1 rounded-md">
                  {brandName}
                </span>
              )}
            </div>

            <ProductInfo
              product={product}
              discountPercentage={discountPercentage}
            />

            <hr className="border-gray-100 my-4" />

            <div className="mb-6">
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-black text-emerald-600">
                  ৳{currentPrice.toFixed(2)}
                </span>
                {savings > 0 && discountPrice > 0 && (
                  <>
                    <span className="text-lg text-gray-400 line-through">
                      ৳{originalPrice.toFixed(2)}
                    </span>
                    <span className="bg-emerald-50 text-emerald-700 text-xs font-bold px-2 py-0.5 rounded">
                      Save {discountPercentage}%
                    </span>
                  </>
                )}
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-4 text-sm space-y-2 mb-8 text-gray-600">
              {/* <div className="flex justify-between">
                <span>SKU:</span>
                <span className="font-mono text-gray-900">
                  {product?.slug || "N/A"}
                </span>
              </div> */}
              {product?.weight && product.weight > 0 && (
                <div className="flex justify-between">
                  <span>Weight:</span>
                  <span className="text-gray-900 font-medium">
                    {product.weight} kg
                  </span>
                </div>
              )}
              {/* <div className="flex justify-between">
                <span>Category:</span>
                <span className="text-gray-900 font-medium">
                  {product?.category?.name || "N/A"}
                </span>
              </div> */}
            </div>
          </div>

          <ProductActions product={product} />
        </div>
      </div>

      <ProductTabs product={product} />
      <ProductTrustBadges />
    </div>
  );
}
