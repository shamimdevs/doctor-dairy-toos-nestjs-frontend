// src/components/product/ProductDetailsClient.tsx
"use client";

import React, { useState } from "react";
import { ProductBreadcrumb } from "./ProductBreadcrumb";
import { ProductImageGallery } from "./ProductImageGallery";
import { ProductInfo } from "./ProductInfo";
import { ProductVariants } from "./ProductVariants";
import { ProductActions } from "./ProductActions";
import { ProductTabs } from "./ProductTabs";
import { ProductTrustBadges } from "./ProductTrustBadges";

type Variant = {
  id: string;
  strength: string;
  pack_size: string;
  sku: string;
  price: number;
  discount_price: number;
  stock: number;
  weight: number;
  expiry_date: string;
  is_active: boolean;
};

type ProductProps = {
  product: {
    id: string;
    name: string;
    slug: string;
    thumbnail: string;
    manufacturer: string;
    is_prescription_required: boolean;
    meta_description?: string;
    meta_keywords?: string;
    category: { id: string; name: string; slug: string };
    generic: { id: string; name: string };
    brand: { id: string; name: string };
    variants: Variant[];
    price_range: { min: number; max: number };
    discount_range: { min: number; max: number };
    addedBy?: { id: string; name: string };
    created_at: string;
    updated_at: string;
  };
};

export default function ProductDetailsClient({ product }: ProductProps) {
  // Default to the first active variant
  const activeVariants = product?.variants?.filter((v) => v.is_active) || [];
  const [selectedVariant, setSelectedVariant] = useState<Variant>(
    activeVariants[0] ||
      product?.variants?.[0] || {
        id: "",
        strength: "",
        pack_size: "",
        sku: "",
        price: 0,
        discount_price: 0,
        stock: 0,
        weight: 0,
        expiry_date: "",
        is_active: false,
      },
  );

  // Calculate discount percentage safely with optional chaining
  const price = selectedVariant?.price || 0;
  const discountPrice = selectedVariant?.discount_price || 0;
  const savings = price - discountPrice;
  const discountPercentage =
    price > 0 ? Math.round((savings / price) * 100) : 0;

  // Check if in stock
  const isInStock = (selectedVariant?.stock || 0) > 0;

  // Safe access to product properties with optional chaining
  const productName = product?.name || "";
  const categoryName = product?.category?.name || "";
  const categorySlug = product?.category?.slug || "";
  const isPrescriptionRequired = product?.is_prescription_required || false;
  const genericName = product?.generic?.name || "";

  return (
    <div className="container mx-auto px-4 py-6 max-w-6xl">
      {/* Breadcrumb Navigation */}
      <ProductBreadcrumb
        categoryName={categoryName}
        categorySlug={categorySlug}
        productName={productName}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100">
        {/* Left Column: Image Section */}
        <ProductImageGallery
          product={product}
          discountPercentage={discountPercentage}
          isInStock={isInStock}
          selectedVariant={selectedVariant}
        />

        {/* Right Column: Product Info Section */}
        <div className="flex flex-col justify-between">
          <div>
            {/* Badges */}
            <div className="flex flex-wrap gap-2 mb-4">
              {isPrescriptionRequired && (
                <span className="bg-red-50 text-red-600 text-xs font-semibold px-2.5 py-1 rounded-md border border-red-200">
                  Rx Prescription Required
                </span>
              )}
              {genericName && (
                <span className="bg-blue-50 text-blue-600 text-xs font-semibold px-2.5 py-1 rounded-md">
                  {genericName}
                </span>
              )}
            </div>

            {/* Title & Brand */}
            <ProductInfo
              product={product}
              selectedVariant={selectedVariant}
              discountPercentage={discountPercentage}
            />

            <hr className="border-gray-100 my-4" />

            {/* Pricing Section */}
            <div className="mb-6">
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-black text-emerald-600">
                  ৳
                  {selectedVariant?.discount_price ||
                    selectedVariant?.price ||
                    0}
                </span>
                {savings > 0 && discountPrice > 0 && (
                  <>
                    <span className="text-lg text-gray-400 line-through">
                      ৳{selectedVariant?.price || 0}
                    </span>
                    <span className="bg-emerald-50 text-emerald-700 text-xs font-bold px-2 py-0.5 rounded">
                      Save {discountPercentage}%
                    </span>
                  </>
                )}
              </div>
              <p className="text-xs text-gray-400 mt-1">
                Inclusive of all taxes
              </p>
            </div>

            {/* Variants Selector */}
            <ProductVariants
              variants={product?.variants || []}
              selectedVariant={selectedVariant}
              onVariantSelect={setSelectedVariant}
            />

            {/* Availability & Specifications Info Card */}
            <div className="bg-gray-50 rounded-xl p-4 text-sm space-y-2 mb-8 text-gray-600">
              <div className="flex justify-between">
                <span>SKU:</span>
                <span className="font-mono text-gray-900">
                  {selectedVariant?.sku || "N/A"}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Availability:</span>
                {(selectedVariant?.stock || 0) > 0 ? (
                  <span className="text-emerald-600 font-medium">
                    In Stock ({selectedVariant?.stock || 0} available)
                  </span>
                ) : (
                  <span className="text-red-500 font-medium">Out of Stock</span>
                )}
              </div>
              <div className="flex justify-between">
                <span>Expiry Date:</span>
                <span className="text-gray-900 font-medium">
                  {selectedVariant?.expiry_date || "N/A"}
                </span>
              </div>
              {selectedVariant?.weight && selectedVariant.weight > 0 && (
                <div className="flex justify-between">
                  <span>Weight:</span>
                  <span className="text-gray-900 font-medium">
                    {selectedVariant.weight} kg
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Action Button */}
          <ProductActions
            product={product}
            selectedVariant={selectedVariant}
            isInStock={isInStock}
          />
        </div>
      </div>

      {/* Product Tabs */}
      <ProductTabs product={product} />

      {/* Trust Badges */}
      <ProductTrustBadges />
    </div>
  );
}
