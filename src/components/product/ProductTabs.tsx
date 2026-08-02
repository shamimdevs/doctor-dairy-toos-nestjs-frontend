/* eslint-disable @typescript-eslint/no-explicit-any */
// src/components/product/ProductTabs.tsx
"use client";

import { useState } from "react";
import { RatingStars } from "./RatingStars";

interface ProductTabsProps {
  product: any;
}

type TabType = "description" | "specifications" | "reviews";

export function ProductTabs({ product }: ProductTabsProps) {
  const [activeTab, setActiveTab] = useState<TabType>("description");

  const tabs: { id: TabType; label: string }[] = [
    { id: "description", label: "Description" },
    { id: "specifications", label: "Specifications" },
    { id: "reviews", label: "Reviews" },
  ];

  return (
    <div className="mt-10 border-t border-gray-200 pt-6">
      <div className="flex gap-4 border-b border-gray-200 mb-4 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`pb-3 text-sm font-bold transition-all border-b-2 whitespace-nowrap ${
              activeTab === tab.id
                ? "border-emerald-500 text-emerald-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="prose prose-sm max-w-none text-gray-600">
        {activeTab === "description" && (
          <div>
            {product.description ? (
              product.description.trimStart().startsWith("<") ? (
                <div
                  dangerouslySetInnerHTML={{ __html: product.description }}
                />
              ) : (
                <p className="whitespace-pre-wrap">{product.description}</p>
              )
            ) : (
              <p className="whitespace-pre-wrap">
                {product.meta_description || "No description available."}
              </p>
            )}
            {product.meta_keywords && (
              <div className="mt-3">
                <h4 className="font-bold text-gray-800">Keywords:</h4>
                <p className="text-sm">{product.meta_keywords}</p>
              </div>
            )}
          </div>
        )}

        {activeTab === "specifications" && (
          <div className="grid grid-cols-1 gap-2">
            {product.specifications && product.specifications.length > 0 ? (
              product.specifications.map(
                (spec: { label: string; value: string }, index: number) => (
                  <div
                    key={`${spec.label}-${index}`}
                    className="flex justify-between gap-4 py-2 px-3 rounded-lg odd:bg-gray-50"
                  >
                    <span className="font-semibold text-gray-700">
                      {spec.label}
                    </span>
                    <span className="text-gray-600 text-right">
                      {spec.value}
                    </span>
                  </div>
                ),
              )
            ) : (
              <p className="text-gray-500">
                No specifications available for this product.
              </p>
            )}
          </div>
        )}

        {activeTab === "reviews" && (
          <div>
            {product.reviews_count > 0 ? (
              <div className="flex items-center gap-3">
                <span className="text-3xl font-black text-gray-900">
                  {Number(product.rating_avg || 0).toFixed(1)}
                </span>
                <div>
                  <RatingStars
                    rating={product.rating_avg || 0}
                    showCount={false}
                  />
                  <p className="text-sm text-gray-500 mt-0.5">
                    Based on {product.reviews_count} review
                    {product.reviews_count === 1 ? "" : "s"}
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-gray-500">
                No reviews yet. Be the first to review this product!
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
