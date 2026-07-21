// src/components/wishlist/WishlistEmpty.tsx
"use client";

import Link from "next/link";
import { Heart, ShoppingBag } from "lucide-react";

export function WishlistEmpty() {
  return (
    <div className="text-center py-16">
      <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <Heart size={40} className="text-gray-300" />
      </div>
      <h2 className="text-2xl font-bold text-slate-900 mb-2">
        Your Wishlist is Empty
      </h2>
      <p className="text-slate-500 mb-6">
        Start adding your favorite products to your wishlist!
      </p>
      <Link
        href="/"
        className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl transition-all shadow-sm hover:shadow-md"
      >
        <ShoppingBag size={18} />
        Browse Products
      </Link>
    </div>
  );
}
