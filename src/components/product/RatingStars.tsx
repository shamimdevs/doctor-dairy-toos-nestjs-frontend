// components/product/RatingStars.tsx
"use client";

import React from "react";
import { Star } from "lucide-react";

interface RatingStarsProps {
  rating: number;
  reviewsCount?: number;
  size?: number;
  showCount?: boolean;
}

export const RatingStars: React.FC<RatingStarsProps> = ({
  rating,
  reviewsCount = 0,
  size = 18,
  showCount = true,
}) => {
  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center text-amber-400">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            size={size}
            fill={i < Math.floor(rating) ? "currentColor" : "none"}
            className={i < Math.floor(rating) ? "stroke-none" : "stroke-1"}
          />
        ))}
      </div>
      {showCount && (
        <span className="text-sm font-semibold text-slate-600">
          ({reviewsCount || 0} reviews)
        </span>
      )}
    </div>
  );
};
