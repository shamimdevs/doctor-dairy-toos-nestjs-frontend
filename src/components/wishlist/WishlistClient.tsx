/* eslint-disable @typescript-eslint/no-explicit-any */
// src/app/wishlist/WishlistClient.tsx
"use client";

import { useState } from "react";
import { toast } from "react-toastify";
import { IWishlistItem } from "@/src/components/services/wishlist.service";
import { WishlistItem } from "@/src/components/wishlist/WishlistItem";
import { WishlistEmpty } from "@/src/components/wishlist/WishlistEmpty";
import { useRemoveFromWishlistMutation } from "@/src/redux/api/wishlistApi";

interface WishlistClientProps {
  items: IWishlistItem[];
}

export function WishlistClient({ items: initialItems }: WishlistClientProps) {
  const [wishlistItems, setWishlistItems] =
    useState<IWishlistItem[]>(initialItems);

  // ✅ RTK Query mutation for removal
  const [removeFromWishlist] = useRemoveFromWishlistMutation();

  // ✅ Handle remove item
  const handleRemoveItem = async (itemId: string) => {
    try {
      // ✅ Optimistic update - remove from UI immediately
      setWishlistItems((prev) => prev.filter((item) => item.id !== itemId));

      // ✅ Call API to remove
      await removeFromWishlist(itemId).unwrap();

      toast.success("Removed from wishlist", {
        position: "bottom-right",
        autoClose: 2000,
      });
    } catch (error: any) {
      // ✅ Revert on error
      setWishlistItems(initialItems);
      toast.error(error?.data?.message || "Failed to remove from wishlist", {
        position: "bottom-right",
        autoClose: 3000,
      });
    }
  };

  // ✅ If empty after removal
  if (wishlistItems.length === 0) {
    return <WishlistEmpty />;
  }

  return (
    <div className="space-y-3">
      {wishlistItems?.map((item) => (
        <WishlistItem
          key={item.id}
          item={item}
          onRemove={() => handleRemoveItem(item.id)}
        />
      ))}
    </div>
  );
}
