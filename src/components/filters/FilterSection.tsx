// components/filters/FilterSection.tsx
import React from "react";

interface FilterSectionProps {
  title: string;
  children: React.ReactNode;
  onClear?: () => void;
}

export const FilterSection: React.FC<FilterSectionProps> = ({
  title,
  children,
  onClear,
}) => (
  <div className="border-b border-slate-200 pb-4 mb-4">
    <div className="flex items-center justify-between mb-3">
      <h3 className="text-xs font-extrabold text-slate-700 uppercase tracking-wider">
        {title}
      </h3>
      {onClear && (
        <button
          onClick={onClear}
          className="text-[10px] font-bold text-emerald-600 hover:text-emerald-700 transition-colors"
        >
          Clear All
        </button>
      )}
    </div>
    {children}
  </div>
);
