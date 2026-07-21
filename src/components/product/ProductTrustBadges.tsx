// src/components/product/ProductTrustBadges.tsx
"use client";

import { Truck, Shield, RefreshCw } from "lucide-react";

export function ProductTrustBadges() {
  const badges = [
    { icon: Shield, label: "Genuine Products" },
    { icon: Truck, label: "Free Delivery" },
    { icon: RefreshCw, label: "Easy Returns" },
  ];

  return (
    <div className="grid grid-cols-3 gap-3 pt-4 mt-8 border-t border-gray-200">
      {badges.map((badge, index) => (
        <div
          key={index}
          className="flex items-center gap-2 text-xs text-gray-600"
        >
          <badge.icon size={16} className="text-emerald-500" />
          <span>{badge.label}</span>
        </div>
      ))}
    </div>
  );
}
