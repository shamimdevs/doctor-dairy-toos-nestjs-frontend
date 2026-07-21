/* eslint-disable @typescript-eslint/no-explicit-any */
// src/components/product/ProductTabs.tsx
"use client";

import { useState } from "react";

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
            <p>{product.meta_description || "No description available."}</p>
            {product.meta_keywords && (
              <div className="mt-3">
                <h4 className="font-bold text-gray-800">Keywords:</h4>
                <p className="text-sm">{product.meta_keywords}</p>
              </div>
            )}
            {product.addedBy && (
              <div className="mt-4 text-xs text-gray-400">
                Added by: {product.addedBy.name}
              </div>
            )}
          </div>
        )}

        {activeTab === "specifications" && (
          <div className="grid grid-cols-1 gap-2">
            {product.variants && product.variants.length > 0 && (
              <>
                <h4 className="font-bold text-gray-800">Available Variants:</h4>
                {product.variants.map((v: any) => (
                  <div key={v.id} className="bg-gray-50 p-3 rounded-lg">
                    <div className="font-semibold">{v.pack_size}</div>
                    <div className="text-sm text-gray-600">
                      {v.strength} • SKU: {v.sku}
                    </div>
                    <div className="text-sm font-bold text-emerald-600">
                      ৳{v.price}
                      {v.discount_price && (
                        <span className="text-xs text-gray-400 line-through ml-2">
                          ৳{v.discount_price}
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-gray-500">
                      Stock: {v.stock} {v.weight && `• Weight: ${v.weight}kg`}
                    </div>
                    {v.expiry_date && (
                      <div className="text-xs text-amber-600">
                        Expires: {new Date(v.expiry_date).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                ))}
              </>
            )}
          </div>
        )}

        {activeTab === "reviews" && (
          <div>
            <p className="text-gray-500">
              No reviews yet. Be the first to review this product!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
