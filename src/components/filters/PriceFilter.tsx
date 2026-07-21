// components/filters/PriceFilter.tsx
import React from "react";
import { FilterSection } from "./FilterSection";

interface PriceFilterProps {
  selectedRange: string | null;
  onSelect: (range: string | null) => void;
}

export const PriceFilter: React.FC<PriceFilterProps> = ({
  selectedRange,
  onSelect,
}) => {
  const ranges = [
    { label: "Under ৳500", value: "under-500" },
    { label: "৳500 - ৳1000", value: "500-1000" },
    { label: "৳1000 - ৳2000", value: "1000-2000" },
    { label: "Over ৳2000", value: "over-2000" },
  ];

  return (
    <FilterSection title="Price">
      <div className="space-y-2">
        {ranges.map((range) => (
          <label
            key={range.value}
            className="flex items-center gap-2 cursor-pointer group"
          >
            <input
              type="radio"
              name="price"
              checked={selectedRange === range.value}
              onChange={() =>
                onSelect(selectedRange === range.value ? null : range.value)
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
