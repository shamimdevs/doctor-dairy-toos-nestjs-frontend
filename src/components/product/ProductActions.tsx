/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
// src/components/product/ProductActions.tsx
"use client";

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Heart, Share2, ShoppingBag, Minus, Plus, Check } from "lucide-react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ADD_TO_CART, REMOVE_FROM_CART } from "@/src/redux/features/cartSlice";
import {
  addToWishlistLocal,
  removeFromWishlistLocal,
  selectIsInWishlist,
} from "@/src/redux/features/wishlistSlice";
import {
  useAddToWishlistMutation,
  useRemoveFromWishlistMutation,
  useCheckWishlistStatusQuery,
} from "@/src/redux/api/wishlistApi";

interface ProductActionsProps {
  product: any;
  selectedVariant: any;
  isInStock: boolean;
}

export function ProductActions({
  product,
  selectedVariant,
  isInStock,
}: ProductActionsProps) {
  const dispatch = useDispatch();
  const cartItems = useSelector((state: any) => state?.cart?.cartItems || []);

  // ✅ Use selector to check if product is in wishlist
  const isInWishlist = useSelector((state: any) =>
    selectIsInWishlist(state, product.id),
  );

  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(isInWishlist);
  const [isAdding, setIsAdding] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);
  const [isWishlistToggling, setIsWishlistToggling] = useState(false);

  // ✅ Update local state when Redux state changes
  useEffect(() => {
    setIsWishlisted(isInWishlist);
  }, [isInWishlist]);

  // ✅ Wishlist mutations
  const [addToWishlist] = useAddToWishlistMutation();
  const [removeFromWishlist] = useRemoveFromWishlistMutation();
  const { refetch: refetchWishlistStatus } = useCheckWishlistStatusQuery(
    { productId: product.id },
    { skip: !product.id },
  );

  // Check if this specific pack size is already in cart
  const getCartItemQuantity = () => {
    const existingItem = cartItems.find(
      (item: any) =>
        item.id === product.id && item.packSizeId === selectedVariant?.id,
    );
    return existingItem ? existingItem.quantity : 0;
  };

  const cartQuantity = getCartItemQuantity();
  const isInCart = cartQuantity > 0;

  // Update quantity when variant changes
  useEffect(() => {
    const cartQty = getCartItemQuantity();
    if (cartQty > 0) {
      setQuantity(cartQty);
    } else {
      setQuantity(1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedVariant?.id, cartItems]);

  // Calculate discount
  const discountPercentage = selectedVariant?.discount_price
    ? Math.round(
        ((selectedVariant.price - selectedVariant.discount_price) /
          selectedVariant.price) *
          100,
      )
    : 0;

  // ✅ Handle Wishlist Toggle with Redux
  const handleWishlistToggle = async () => {
    if (!product.id || isWishlistToggling) return;

    setIsWishlistToggling(true);

    try {
      if (isWishlisted) {
        // ✅ Remove from wishlist (API + Redux)
        await removeFromWishlist(product.id).unwrap();
        dispatch(removeFromWishlistLocal(product.id));
        setIsWishlisted(false);
        toast.info("Removed from wishlist", {
          position: "bottom-right",
          autoClose: 2000,
        });
      } else {
        // ✅ Add to wishlist (API + Redux)
        const result = await addToWishlist({ product_id: product.id }).unwrap();

        // ✅ Add to Redux if we have full data
        if (result?.data) {
          dispatch(addToWishlistLocal(result.data));
        } else {
          // ✅ Otherwise refetch status
          await refetchWishlistStatus();
        }

        setIsWishlisted(true);
        toast.success("Added to wishlist! ❤️", {
          position: "bottom-right",
          autoClose: 2000,
        });
      }
      // Refetch to update status
      refetchWishlistStatus();
    } catch (error: any) {
      const errorMessage = error?.data?.message || "Failed to update wishlist";
      toast.error(errorMessage, {
        position: "bottom-right",
        autoClose: 3000,
      });
      // Revert optimistic update
      setIsWishlisted(isInWishlist);
      refetchWishlistStatus();
    } finally {
      setIsWishlistToggling(false);
    }
  };

  // ✅ Handle Add to Cart
  const handleAddToCart = () => {
    if (!isInStock) {
      toast.error("This product is currently out of stock!", {
        position: "bottom-right",
        autoClose: 3000,
      });
      return;
    }

    setIsAdding(true);

    const price =
      typeof selectedVariant?.discount_price === "number"
        ? selectedVariant.discount_price
        : typeof selectedVariant?.price === "number"
          ? selectedVariant.price
          : 0;

    const originalPrice =
      typeof selectedVariant?.price === "number" ? selectedVariant.price : 0;

    const cartItem = {
      id: product.id,
      productId: product.id,
      name: `${product.name} (${selectedVariant?.pack_size || "1 Unit"})`,
      price: price,
      quantity: quantity,
      packSizeId: selectedVariant?.id || "default",
      packSizeLabel: selectedVariant?.pack_size || "1 Unit",
      image: product.thumbnail,
      maxQuantity: 99,
      discount: discountPercentage || 0,
      originalPrice: originalPrice,
    };

    dispatch(ADD_TO_CART(cartItem));

    toast.success(
      <div className="flex items-center gap-3">
        <div className="bg-emerald-100 p-2 rounded-full">
          <Check className="text-emerald-600" size={20} />
        </div>
        <div>
          <p className="font-bold text-sm">Added to Cart!</p>
          <p className="text-xs text-slate-600">{product.name}</p>
          <p className="text-xs text-slate-500">
            {selectedVariant?.pack_size || "1 Unit"} × {quantity}
          </p>
        </div>
      </div>,
      {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        icon: false,
        theme: "light",
      },
    );

    setIsAdding(false);
  };

  // ✅ Handle Remove from Cart
  const handleRemoveFromCart = () => {
    setIsRemoving(true);
    dispatch(
      REMOVE_FROM_CART({
        id: product.id,
        packSizeId: selectedVariant?.id || "default",
      }),
    );

    toast.info(
      <div className="flex items-center gap-3">
        <div className="bg-amber-100 p-2 rounded-full">
          <span className="text-amber-600">🛒</span>
        </div>
        <div>
          <p className="font-bold text-sm">Removed from Cart</p>
          <p className="text-xs text-slate-600">{product.name}</p>
          <p className="text-xs text-slate-500">
            {selectedVariant?.pack_size || "1 Unit"}
          </p>
        </div>
      </div>,
      {
        position: "bottom-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        icon: false,
        theme: "light",
      },
    );

    setIsRemoving(false);
    setQuantity(1);
  };

  // ✅ Handle Buy Now
  const handleBuyNow = () => {
    if (!isInStock) {
      toast.error("This product is currently out of stock!", {
        position: "bottom-right",
        autoClose: 3000,
      });
      return;
    }

    // First add to cart
    const price =
      typeof selectedVariant?.discount_price === "number"
        ? selectedVariant.discount_price
        : typeof selectedVariant?.price === "number"
          ? selectedVariant.price
          : 0;

    const originalPrice =
      typeof selectedVariant?.price === "number" ? selectedVariant.price : 0;

    const cartItem = {
      id: product.id,
      productId: product.id,
      name: `${product.name} (${selectedVariant?.pack_size || "1 Unit"})`,
      price: price,
      quantity: quantity,
      packSizeId: selectedVariant?.id || "default",
      packSizeLabel: selectedVariant?.pack_size || "1 Unit",
      image: product.thumbnail,
      maxQuantity: 99,
      discount: discountPercentage || 0,
      originalPrice: originalPrice,
    };

    dispatch(ADD_TO_CART(cartItem));

    toast.info(
      <div className="flex items-center gap-3">
        <div className="bg-blue-100 p-2 rounded-full">
          <span className="text-blue-600">🛒</span>
        </div>
        <div>
          <p className="font-bold text-sm">Proceeding to Checkout!</p>
          <p className="text-xs text-slate-600">{product.name}</p>
          <p className="text-xs text-slate-500">
            {selectedVariant?.pack_size || "1 Unit"} × {quantity}
          </p>
        </div>
      </div>,
      {
        position: "bottom-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        icon: false,
        theme: "light",
        onClose: () => {
          window.location.href = "/checkout";
        },
      },
    );
  };

  // ✅ Handle Share
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: product.meta_description || product.name,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.info("Link copied to clipboard!", {
        position: "bottom-right",
        autoClose: 2000,
      });
    }
  };

  // ✅ Quantity Controls
  const incrementQuantity = () => {
    if (quantity < 99) {
      setQuantity(quantity + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  return (
    <div className="space-y-3">
      {/* Show message if different pack size is in cart */}
      {!isInCart && cartItems.some((item: any) => item.id === product.id) && (
        <div className="flex items-center gap-2 text-amber-600 text-sm font-medium bg-amber-50 px-4 py-2 rounded-xl">
          <ShoppingBag size={16} />
          <span>Other pack size in cart</span>
        </div>
      )}

      {/* Quantity Selector - Show different when in cart */}
      {isInCart ? (
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-emerald-50 rounded-xl border border-emerald-200 px-3 py-1.5">
            <button
              onClick={handleRemoveFromCart}
              disabled={isRemoving}
              className="p-1.5 rounded-lg hover:bg-emerald-100 transition-colors text-emerald-600 disabled:opacity-50"
              aria-label="Remove one"
            >
              <Minus size={18} className="stroke-3" />
            </button>
            <span className="text-sm font-bold text-emerald-700 min-w-6 text-center">
              {cartQuantity}
            </span>
            <button
              onClick={handleAddToCart}
              disabled={isAdding}
              className="p-1.5 rounded-lg hover:bg-emerald-100 transition-colors text-emerald-600 disabled:opacity-50"
              aria-label="Add one more"
            >
              <Plus size={18} className="stroke-3" />
            </button>
          </div>
          <span className="text-xs text-gray-500">Already in cart</span>
        </div>
      ) : (
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 bg-gray-100 rounded-xl p-1">
            <button
              onClick={decrementQuantity}
              className="p-1.5 hover:bg-white rounded-lg transition-all disabled:opacity-50"
              disabled={quantity <= 1 || !isInStock}
            >
              <Minus size={16} />
            </button>
            <span className="w-8 text-center font-bold text-sm">
              {quantity}
            </span>
            <button
              onClick={incrementQuantity}
              className="p-1.5 hover:bg-white rounded-lg transition-all disabled:opacity-50"
              disabled={quantity >= 99 || !isInStock}
            >
              <Plus size={16} />
            </button>
          </div>
          <span className="text-xs text-gray-500">Max 99 per order</span>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3">
        {isInCart ? (
          <button
            onClick={handleAddToCart}
            disabled={!isInStock || isAdding}
            className="flex-1 px-6 py-3 rounded-xl font-bold tracking-wide transition-all flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-600/10 active:scale-[0.99] disabled:bg-gray-300 disabled:cursor-not-allowed disabled:shadow-none"
          >
            {isAdding ? (
              <>
                <span className="animate-spin">⟳</span>
                Adding...
              </>
            ) : (
              <>
                <Plus size={18} />
                Add More
              </>
            )}
          </button>
        ) : (
          <button
            onClick={handleAddToCart}
            disabled={!isInStock || isAdding}
            className={`flex-1 px-6 py-3 rounded-xl font-bold tracking-wide transition-all flex items-center justify-center gap-2 ${
              isInStock
                ? "bg-emerald-600 text-white hover:bg-emerald-700 shadow-lg shadow-emerald-600/10 active:scale-[0.99]"
                : "bg-gray-200 text-gray-400 cursor-not-allowed shadow-none"
            }`}
          >
            {isAdding ? (
              <>
                <span className="animate-spin">⟳</span>
                Adding...
              </>
            ) : (
              <>
                <ShoppingBag size={18} />
                Add to Cart
              </>
            )}
          </button>
        )}

        <button
          onClick={handleBuyNow}
          disabled={!isInStock}
          className={`flex-1 px-6 py-3 rounded-xl font-bold tracking-wide transition-all flex items-center justify-center gap-2 ${
            isInStock
              ? "bg-gray-900 text-white hover:bg-gray-800 shadow-lg shadow-gray-900/10 active:scale-[0.99]"
              : "bg-gray-200 text-gray-400 cursor-not-allowed shadow-none"
          }`}
        >
          Buy Now
        </button>

        {/* ✅ Wishlist Button */}
        <button
          onClick={handleWishlistToggle}
          disabled={!isInStock || isWishlistToggling}
          className={`p-3 rounded-xl transition-all ${
            isWishlisted
              ? "bg-red-50 text-red-500 hover:bg-red-100"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          } disabled:opacity-50 disabled:cursor-not-allowed`}
          aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
        >
          {isWishlistToggling ? (
            <div className="animate-spin">
              <Heart size={20} className="opacity-50" />
            </div>
          ) : (
            <Heart
              size={20}
              className={isWishlisted ? "fill-current" : "fill-none"}
            />
          )}
        </button>

        {/* Share Button */}
        <button
          onClick={handleShare}
          className="p-3 bg-gray-100 hover:bg-gray-200 rounded-xl transition-all"
          aria-label="Share product"
        >
          <Share2 size={20} className="text-gray-600" />
        </button>
      </div>
    </div>
  );
}
