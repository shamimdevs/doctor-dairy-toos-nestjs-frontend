/* eslint-disable @typescript-eslint/no-explicit-any */
// src/app/wishlist/page.tsx
"use client";

import { JSX, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { toast } from "react-toastify";

import {
  useGetMyWishlistQuery,
  useRemoveFromWishlistMutation,
  IWishlistItem,
} from "@/src/redux/api/wishlistApi";
import {
  setWishlistItems,
  removeFromWishlistLocal,
  selectWishlistItems,
} from "@/src/redux/features/wishlistSlice";
import { WishlistItem } from "@/src/components/wishlist/WishlistItem";
import { WishlistEmpty } from "@/src/components/wishlist/WishlistEmpty";

export default function WishlistPage(): JSX.Element {
  const dispatch = useDispatch();

  // ✅ Ensure wishlistItems is always an array
  const wishlistItems: IWishlistItem[] = useSelector(selectWishlistItems) || [];

  // ✅ Fetch wishlist data
  const { data: wishlistResponse, refetch } = useGetMyWishlistQuery();

  // ✅ Remove from wishlist mutation
  const [removeFromWishlist] = useRemoveFromWishlistMutation();

  // ✅ Set wishlist items in Redux store
  useEffect((): void => {
    // ✅ Access data from the response wrapper
    if (wishlistResponse?.data && Array.isArray(wishlistResponse.data)) {
      console.log("Setting wishlist items:", wishlistResponse.data);
      dispatch(setWishlistItems(wishlistResponse.data));
    }
  }, [wishlistResponse, dispatch]);

  // ✅ Handle remove item
  const handleRemoveItem = async (
    itemId: string,
    productId: string,
  ): Promise<void> => {
    try {
      // ✅ Optimistic update
      dispatch(removeFromWishlistLocal(productId));

      // ✅ API call
      await removeFromWishlist(itemId).unwrap();

      toast.success("Removed from wishlist", {
        position: "bottom-right",
        autoClose: 2000,
      });

      // ✅ Refetch to sync
      refetch();
    } catch (error: any) {
      // ✅ Revert on error
      refetch();
      toast.error(error?.data?.message || "Failed to remove", {
        position: "bottom-right",
        autoClose: 3000,
      });
    }
  };

  // ✅ Empty state - check if array is empty
  if (
    !wishlistItems ||
    !Array.isArray(wishlistItems) ||
    wishlistItems.length === 0
  ) {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center gap-2 mb-6">
            <Link
              href="/"
              className="p-2 hover:bg-white rounded-xl transition-colors"
            >
              <ChevronLeft size={20} />
            </Link>
            <h1 className="text-2xl font-extrabold text-slate-900">
              My Wishlist
            </h1>
          </div>
          <WishlistEmpty />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="container  py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="p-2 hover:bg-white rounded-xl transition-colors"
            >
              <ChevronLeft size={20} />
            </Link>
            <h1 className="text-2xl font-extrabold text-slate-900">
              My Wishlist
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-slate-500 bg-white px-4 py-2 rounded-xl shadow-sm">
              {wishlistItems.length}{" "}
              {wishlistItems.length === 1 ? "item" : "items"}
            </span>
          </div>
        </div>

        {/* Wishlist Items */}
        <div className="space-y-3">
          {wishlistItems?.map((item: IWishlistItem) => (
            <WishlistItem
              key={item.id}
              item={item}
              onRemove={() => handleRemoveItem(item.id, item.product_id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
