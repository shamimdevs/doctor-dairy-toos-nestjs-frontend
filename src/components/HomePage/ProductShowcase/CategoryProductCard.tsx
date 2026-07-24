/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { Plus, Check, Minus, Eye, Heart } from "lucide-react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ADD_TO_CART, REMOVE_FROM_CART } from "@/src/redux/features/cartSlice";
import { Product } from "@/src/types/product";

interface CategoryProductCardProps {
  product: Product;
}

const CategoryProductCard: React.FC<CategoryProductCardProps> = ({
  product,
}) => {
  const dispatch = useDispatch();
  const cartItems = useSelector((state: any) => state?.cart?.cartItems || []);

  const image = product.thumbnail || "/placeholder.png";

  // Use the fields from API response
  const currentPrice = product.price || 0; // 555
  const originalPrice = product.original_price || product.price || 0; // 585

  // Calculate discount percentage
  const discountPercentage =
    originalPrice > currentPrice
      ? Math.round(((originalPrice - currentPrice) / originalPrice) * 100)
      : 0;

  const inStock = (product.stock || 0) > 0;

  const [isAdded, setIsAdded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);

  const getCartItemQuantity = () => {
    const existingItem = cartItems.find((item: any) => item.id === product.id);
    return existingItem ? existingItem.quantity : 0;
  };

  const cartQuantity = getCartItemQuantity();
  const isInCart = cartQuantity > 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!inStock) {
      toast.error("Product is out of stock!", {
        position: "bottom-right",
        autoClose: 3000,
      });
      return;
    }

    const cartItem = {
      id: product.id,
      productId: product.id,
      name: product.name,
      price: currentPrice,
      quantity: 1,
      packSizeId: product.id,
      packSizeLabel: "Default",
      image: image,
      discount: discountPercentage,
      originalPrice: originalPrice,
      sku: product.slug || "",
    };

    dispatch(ADD_TO_CART(cartItem));

    toast.success(`${product.name} added to cart!`, {
      position: "bottom-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      theme: "light",
    });

    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const handleRemoveFromCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(
      REMOVE_FROM_CART({
        id: product.id,
        packSizeId: product.id,
      }),
    );

    toast.info(`Removed 1 ${product.name} from cart`, {
      position: "bottom-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      theme: "light",
    });
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
  };

  return (
    <div
      className="shrink-0 w-47.5 sm:w-full bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col group/card relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Badges - Top Left */}
      <div className="absolute top-2.5 left-2.5 z-10 flex flex-col gap-1 items-start">
        {discountPercentage > 0 && (
          <span className="bg-red-500 text-white font-extrabold text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-md shadow-sm">
            {discountPercentage}% OFF
          </span>
        )}
        {!inStock && (
          <span className="bg-red-500 text-white font-extrabold text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-md shadow-sm">
            OUT OF STOCK
          </span>
        )}
        {isInCart && (
          <span className="bg-emerald-500 text-white font-extrabold text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-md shadow-sm">
            {cartQuantity} in Cart
          </span>
        )}
      </div>

      {/* Prescription Required Badge - Top Right */}
      {product.is_prescription_required && (
        <div className="absolute top-2.5 right-2.5 z-10 bg-amber-500 text-white text-[8px] font-bold px-2 py-0.5 rounded-md shadow-sm">
          Rx
        </div>
      )}

      {/* Wishlist Button */}
      <button
        onClick={handleWishlist}
        className="absolute top-8 right-2.5 z-10 p-1 rounded-full bg-white/80 backdrop-blur-sm shadow-md hover:bg-white transition-all"
      >
        <Heart
          size={14}
          className={`transition-colors ${
            isWishlisted
              ? "fill-red-500 text-red-500"
              : "text-slate-400 hover:text-red-500"
          }`}
        />
      </button>

      {/* Product Image */}
      <div className="relative aspect-square w-full bg-slate-50 overflow-hidden block">
        {imageError ? (
          <div className="w-full h-full flex items-center justify-center bg-emerald-50">
            <span className="text-4xl font-bold text-emerald-400">
              {product.name.charAt(0)}
            </span>
          </div>
        ) : (
          <Image
            src={image}
            alt={product.name}
            className="object-cover transition-transform duration-500 will-change-transform group-hover/card:scale-105"
            loading="lazy"
            fill
            sizes="(max-width: 640px) 190px, 220px"
            style={{ objectFit: "cover" }}
            onError={() => setImageError(true)}
          />
        )}

        {/* Quick View Overlay */}
        <div
          className={`absolute inset-0 bg-black/40 flex items-center justify-center transition-opacity duration-300 ${
            isHovered ? "opacity-100" : "opacity-0"
          }`}
        >
          <Link
            href={`/product/${product.slug}`}
            className="p-2 bg-white rounded-full shadow-lg hover:bg-emerald-50 transition-colors"
          >
            <Eye size={18} className="text-slate-700" />
          </Link>
        </div>
      </div>

      <div className="p-3.5 flex-1 flex flex-col justify-between">
        {/* Product Name */}
        <div className="space-y-1">
          <Link href={`/product/${product.slug}`}>
            <h4 className="text-xs sm:text-sm font-bold text-slate-800 tracking-tight line-clamp-2 min-h-9 hover:text-emerald-600 transition-colors">
              {product.name}
            </h4>
          </Link>
        </div>

        {/* Category Info */}
        <div className="flex items-center justify-between mt-1">
          <span className="text-[10px] text-slate-400">
            {product.category?.name || "Uncategorized"}
          </span>
          <span
            className={`text-[10px] font-medium ${inStock ? "text-emerald-600" : "text-red-500"}`}
          >
            {inStock ? `${product.stock} in stock` : "Out of stock"}
          </span>
        </div>

        {/* Price and Add to Cart */}
        <div className="pt-3 flex items-center justify-between gap-1 mt-2">
          <Link
            href={`/product/${product.slug}`}
            className="flex flex-col hover:opacity-80 transition-opacity"
          >
            {originalPrice > currentPrice && (
              <span className="text-[10px] text-slate-400 line-through">
                ৳ {originalPrice.toFixed(2)}
              </span>
            )}
            <span className="text-xs sm:text-sm font-extrabold text-emerald-600">
              ৳ {currentPrice.toFixed(2)}
            </span>
          </Link>

          {isInCart ? (
            <div className="flex items-center gap-1 bg-emerald-50 rounded-xl border border-emerald-200 px-1.5 py-0.5">
              <button
                onClick={handleRemoveFromCart}
                className="p-1 rounded-lg hover:bg-emerald-100 transition-colors text-emerald-600"
                aria-label="Remove one"
              >
                <Minus size={14} className="stroke-3" />
              </button>
              <span className="text-xs font-bold text-emerald-700 min-w-4.5 text-center">
                {cartQuantity}
              </span>
              <button
                onClick={handleAddToCart}
                className="p-1 rounded-lg hover:bg-emerald-100 transition-colors text-emerald-600"
                aria-label="Add one more"
              >
                <Plus size={14} className="stroke-3" />
              </button>
            </div>
          ) : (
            <button
              onClick={handleAddToCart}
              disabled={!inStock}
              className={`font-black text-xs px-2.5 py-1.5 rounded-xl transition-all shadow-sm active:scale-95 flex items-center gap-1 uppercase tracking-wider hover:shadow-md ${
                !inStock
                  ? "bg-slate-300 text-white cursor-not-allowed"
                  : isAdded
                    ? "bg-emerald-600 text-white"
                    : "bg-emerald-500 hover:bg-emerald-600 text-white"
              }`}
            >
              {!inStock ? (
                "OUT OF STOCK"
              ) : isAdded ? (
                <>
                  <Check size={12} className="stroke-3" /> ADDED
                </>
              ) : (
                <>
                  <Plus size={12} className="stroke-3" /> ADD
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CategoryProductCard;
