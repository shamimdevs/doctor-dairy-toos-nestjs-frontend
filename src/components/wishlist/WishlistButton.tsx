/* eslint-disable @typescript-eslint/no-explicit-any */
// src/components/wishlist/WishlistButton.tsx
"use client";

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Heart } from "lucide-react";
import { toast } from "react-toastify";

import {
  useAddToWishlistMutation,
  useRemoveFromWishlistMutation,
  useCheckWishlistStatusQuery,
} from "@/src/redux/api/wishlistApi";
import {
  addToWishlistLocal,
  removeFromWishlistLocal,
  selectIsInWishlist,
} from "@/src/redux/features/wishlistSlice";

interface WishlistButtonProps {
  productId: string;
  className?: string;
  size?: "sm" | "md" | "lg";
  showText?: boolean;
}

export function WishlistButton({
  productId,
  className = "",
  size = "md",
  showText = false,
}: WishlistButtonProps) {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);

  // ✅ Check if product is in wishlist from Redux
  const isInWishlist = useSelector((state: any) =>
    selectIsInWishlist(state, productId),
  );

  // ✅ Mutations
  const [addToWishlist] = useAddToWishlistMutation();
  const [removeFromWishlist] = useRemoveFromWishlistMutation();
  const { refetch } = useCheckWishlistStatusQuery(
    { productId },
    { skip: !productId },
  );

  const handleToggle = async () => {
    if (!productId || isLoading) return;

    setIsLoading(true);

    try {
      if (isInWishlist) {
        // ✅ Remove from wishlist
        await removeFromWishlist(productId).unwrap();
        dispatch(removeFromWishlistLocal(productId));
        toast.info("Removed from wishlist", {
          position: "bottom-right",
          autoClose: 2000,
        });
        await refetch();
      } else {
        // ✅ Add to wishlist
        const result = await addToWishlist({ product_id: productId }).unwrap();

        // ✅ If we get the full item data, add to Redux
        if (result?.data) {
          dispatch(addToWishlistLocal(result.data));
        } else {
          // ✅ Otherwise refetch the full list
          await refetch();
        }

        toast.success("Added to wishlist! ❤️", {
          position: "bottom-right",
          autoClose: 2000,
        });
      }
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to update wishlist", {
        position: "bottom-right",
        autoClose: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const sizeClasses = {
    sm: "p-1.5 text-xs",
    md: "p-2 text-sm",
    lg: "p-3 text-base",
  };

  const iconSizes = {
    sm: 16,
    md: 20,
    lg: 24,
  };

  return (
    <button
      onClick={handleToggle}
      disabled={isLoading}
      className={`rounded-full transition-all hover:scale-110 active:scale-95 flex items-center gap-1.5 ${
        isInWishlist
          ? "bg-red-50 text-red-500 hover:bg-red-100"
          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
      } ${sizeClasses[size]} ${className} disabled:opacity-50 disabled:cursor-not-allowed`}
      aria-label={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
    >
      {isLoading ? (
        <div className="animate-spin">
          <Heart size={iconSizes[size]} className="opacity-50" />
        </div>
      ) : (
        <Heart
          size={iconSizes[size]}
          className={isInWishlist ? "fill-current" : "fill-none"}
        />
      )}
      {showText && (
        <span className="text-sm font-medium">
          {isInWishlist ? "Remove" : "Add to Wishlist"}
        </span>
      )}
    </button>
  );
}
