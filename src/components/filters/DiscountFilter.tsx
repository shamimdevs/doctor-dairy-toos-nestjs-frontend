// components/filters/DiscountFilter.tsx
import React from "react";
import { FilterSection } from "./FilterSection";

interface DiscountFilterProps {
  selectedDiscount: string | null;
  onSelect: (discount: string | null) => void;
}

export const DiscountFilter: React.FC<DiscountFilterProps> = ({
  selectedDiscount,
  onSelect,
}) => {
  const ranges = [
    { label: "10% and above", value: "10" },
    { label: "20% and above", value: "20" },
    { label: "30% and above", value: "30" },
    { label: "40% and above", value: "40" },
    { label: "50% and above", value: "50" },
  ];

  return (
    <FilterSection title="Discount Range">
      <div className="space-y-2">
        {ranges.map((range) => (
          <label
            key={range.value}
            className="flex items-center gap-2 cursor-pointer group"
          >
            <input
              type="radio"
              name="discount"
              checked={selectedDiscount === range.value}
              onChange={() =>
                onSelect(selectedDiscount === range.value ? null : range.value)
              }
              className="w-3.5 h-3.5 accent-emerald-600 cursor-pointer"
            />
            <span className="text-xs font-medium text-slate-600 group-hover:text-slate-900 transition-colors">
              {range.label}
            </span>
          </label>
        ))}
      </div>
    </FilterSection>
  );
};
