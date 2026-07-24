/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
// src/components/product/ProductActions.tsx
"use client";

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Share2, ShoppingBag, Minus, Plus, Check } from "lucide-react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ADD_TO_CART, REMOVE_FROM_CART } from "@/src/redux/features/cartSlice";

interface ProductActionsProps {
  product: any;
}

export function ProductActions({ product }: ProductActionsProps) {
  const dispatch = useDispatch();
  const cartItems = useSelector((state: any) => state?.cart?.cartItems || []);

  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);

  // Direct product pricing
  const currentPrice = product?.price || 0;
  const originalPrice = product?.original_price || product?.price || 0;
  const discountPercentage =
    originalPrice > currentPrice
      ? Math.round(((originalPrice - currentPrice) / originalPrice) * 100)
      : 0;

  // ✅ Get weight from product
  const productWeight = product?.weight;

  const getCartItemQuantity = () => {
    const existingItem = cartItems.find((item: any) => item.id === product.id);
    return existingItem ? existingItem.quantity : 0;
  };

  const cartQuantity = getCartItemQuantity();
  const isInCart = cartQuantity > 0;

  useEffect(() => {
    const cartQty = getCartItemQuantity();
    if (cartQty > 0) {
      setQuantity(cartQty);
    } else {
      setQuantity(1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cartItems]);

  const handleAddToCart = () => {
    setIsAdding(true);

    const cartItem = {
      id: product.id,
      productId: product.id,
      name: product.name,
      price: currentPrice,
      quantity: quantity,
      packSizeId: product.id,
      packSizeLabel: "Default",
      image: product.thumbnail,
      maxQuantity: 99,
      weight: productWeight, // ✅ Use product weight
      discount: discountPercentage,
      originalPrice: originalPrice,
      sku: product.slug || "",
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
          <p className="text-xs text-slate-500">Quantity: {quantity}</p>
          <p className="text-xs text-slate-500">Weight: {productWeight} kg</p>
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

  const handleRemoveFromCart = () => {
    setIsRemoving(true);
    dispatch(
      REMOVE_FROM_CART({
        id: product.id,
        packSizeId: product.id,
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
      {/* Weight Display */}
      <div className="flex items-center gap-2 text-sm text-slate-500">
        <span className="font-medium">Weight:</span>
        <span>{productWeight} kg</span>
      </div>

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
              disabled={quantity <= 1}
            >
              <Minus size={16} />
            </button>
            <span className="w-8 text-center font-bold text-sm">
              {quantity}
            </span>
            <button
              onClick={incrementQuantity}
              className="p-1.5 hover:bg-white rounded-lg transition-all disabled:opacity-50"
              disabled={quantity >= 99}
            >
              <Plus size={16} />
            </button>
          </div>
          <span className="text-xs text-gray-500">Max 99 per order</span>
        </div>
      )}

      <div className="flex flex-wrap gap-3">
        {isInCart ? (
          <button
            onClick={handleAddToCart}
            disabled={isAdding}
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
            disabled={isAdding}
            className="flex-1 px-6 py-3 rounded-xl font-bold tracking-wide transition-all flex items-center justify-center gap-2 bg-emerald-600 text-white hover:bg-emerald-700 shadow-lg shadow-emerald-600/10 active:scale-[0.99] disabled:bg-gray-300 disabled:cursor-not-allowed disabled:shadow-none"
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
