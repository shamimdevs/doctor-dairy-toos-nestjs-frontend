// components/product/QuantitySelector.tsx
"use client";

import React from "react";
import { Plus, Minus } from "lucide-react";

interface QuantitySelectorProps {
  quantity: number;
  onIncrease: () => void;
  onDecrease: () => void;
  minQuantity?: number;
  maxQuantity?: number;
}

export const QuantitySelector: React.FC<QuantitySelectorProps> = ({
  quantity,
  onIncrease,
  onDecrease,
  minQuantity = 1,
  maxQuantity = 99,
}) => {
  return (
    <div className="flex items-center gap-1 bg-slate-100 rounded-xl p-1">
      <button
        onClick={onDecrease}
        disabled={quantity <= minQuantity}
        className="p-1.5 hover:bg-white rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label="Decrease quantity"
      >
        <Minus size={16} />
      </button>
      <span className="w-8 text-center font-bold text-sm">{quantity}</span>
      <button
        onClick={onIncrease}
        disabled={quantity >= maxQuantity}
        className="p-1.5 hover:bg-white rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label="Increase quantity"
      >
        <Plus size={16} />
      </button>
    </div>
  );
};
