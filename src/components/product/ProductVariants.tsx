/* eslint-disable @typescript-eslint/no-explicit-any */
// src/components/product/ProductVariants.tsx
"use client";

interface ProductVariantsProps {
  variants: any[];
  selectedVariant: any;
  onVariantSelect: (variant: any) => void;
}

export function ProductVariants({
  variants,
  selectedVariant,
  onVariantSelect,
}: ProductVariantsProps) {
  const activeVariants = variants.filter((v) => v.is_active);

  if (activeVariants.length <= 1) return null;

  return (
    <div className="mb-6">
      <h3 className="text-sm font-semibold text-gray-700 mb-3">
        Select Pack Size:
      </h3>
      <div className="flex flex-wrap gap-3">
        {activeVariants.map((variant) => (
          <button
            key={variant.id}
            onClick={() => onVariantSelect(variant)}
            className={`px-4 py-2 text-sm font-medium rounded-lg border transition-all ${
              selectedVariant.id === variant.id
                ? "border-emerald-600 bg-emerald-50 text-emerald-700 shadow-sm"
                : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
            } ${variant.stock === 0 ? "opacity-50 cursor-not-allowed" : ""}`}
            disabled={variant.stock === 0}
          >
            {variant.pack_size} ({variant.strength})
            {variant.stock === 0 && " - Out of Stock"}
          </button>
        ))}
      </div>
    </div>
  );
}
