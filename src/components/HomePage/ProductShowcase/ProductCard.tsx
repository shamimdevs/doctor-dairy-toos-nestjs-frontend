/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { Star, Plus, Check, Minus } from "lucide-react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ADD_TO_CART, REMOVE_FROM_CART } from "@/src/redux/features/cartSlice";

interface ProductCardProps {
  product: any;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const dispatch = useDispatch();
  const cartItems = useSelector((state: any) => state?.cart?.cartItems || []);

  // ✅ API থেকে আসা ডেটা ম্যাপিং
  const image =
    product.thumbnail ||
    product.imageUrl ||
    product.image ||
    "/placeholder.png";

  // ✅ variants থেকে প্রথম বা সস্তা ভেরিয়েন্ট নেওয়া
  const variants = product?.variants || [];
  const sortedVariants = [...variants].sort(
    (a: any, b: any) => a.price - b.price,
  );
  const cheapestVariant = sortedVariants[0] || null;

  // ✅ ডিফল্ট প্যাক সেট করা
  const defaultPack = cheapestVariant
    ? {
        id: cheapestVariant.id || "default",
        label: cheapestVariant.pack_size || "1 Unit",
        quantity: 1,
        price: cheapestVariant.discount_price || cheapestVariant.price || 0,
        originalPrice: cheapestVariant.price || 0,
        discount: cheapestVariant.discount_price
          ? Math.round(
              ((cheapestVariant.price - cheapestVariant.discount_price) /
                cheapestVariant.price) *
                100,
            )
          : 0,
        inStock: cheapestVariant.stock > 0,
      }
    : {
        id: "default",
        label: "1 Unit",
        quantity: 1,
        price: product.currentPrice || product.price || 0,
        originalPrice: product.originalPrice || product.price || 0,
        discount: product.discount || 0,
        inStock: true,
      };

  const [selectedPack, setSelectedPack] = useState(defaultPack);
  const [isAdded, setIsAdded] = useState(false);

  const getCartItemQuantity = () => {
    const existingItem = cartItems.find(
      (item: any) =>
        item.id === product.id && item.packSizeId === selectedPack.id,
    );
    return existingItem ? existingItem.quantity : 0;
  };

  const cartQuantity = getCartItemQuantity();
  const isInCart = cartQuantity > 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Make sure price is a number
    const price =
      typeof selectedPack.price === "number"
        ? selectedPack.price
        : parseFloat(selectedPack.price) || 0;
    const originalPrice =
      typeof selectedPack.originalPrice === "number"
        ? selectedPack.originalPrice
        : parseFloat(selectedPack.originalPrice) || 0;

    const cartItem = {
      id: product.id,
      productId: product.id,
      name: `${product.name} (${selectedPack.label})`,
      price: price,
      quantity: 1,
      packSizeId: selectedPack.id,
      packSizeLabel: selectedPack.label,
      image: image,
      maxQuantity: 99,
      discount: selectedPack.discount || 0,
      originalPrice: originalPrice,
    };

    console.log("Adding to cart:", cartItem); // Debug log

    dispatch(ADD_TO_CART(cartItem));

    toast.success(`✅ ${product.name} added to cart!`, {
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
    dispatch(REMOVE_FROM_CART({ id: product.id, packSizeId: selectedPack.id }));

    toast.info(`🛒 Removed 1 ${product.name} from cart`, {
      position: "bottom-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      theme: "light",
    });
  };

  const handlePackChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const variant = variants.find((v: any) => v.id === e.target.value);
    if (variant) {
      const price = variant.discount_price || variant.price || 0;
      const originalPrice = variant.price || 0;
      setSelectedPack({
        id: variant.id,
        label: variant.pack_size,
        quantity: 1,
        price: price,
        originalPrice: originalPrice,
        discount: variant.discount_price
          ? Math.round(
              ((variant.price - variant.discount_price) / variant.price) * 100,
            )
          : 0,
        inStock: variant.stock > 0,
      });
    }
  };

  // ✅ variants কে packSizes ফরম্যাটে কনভার্ট করা
  const packSizes = variants.map((v: any) => ({
    id: v.id,
    label: v.pack_size,
    price: v.discount_price || v.price || 0,
    originalPrice: v.price || 0,
    discount: v.discount_price
      ? Math.round(((v.price - v.discount_price) / v.price) * 100)
      : 0,
    inStock: v.stock > 0,
  }));

  // If no variants but product has direct price
  if (packSizes.length === 0 && product.currentPrice) {
    packSizes.push({
      id: "default",
      label: "1 Unit",
      price: product.currentPrice || 0,
      originalPrice: product.originalPrice || 0,
      discount: product.discount || 0,
      inStock: true,
    });
  }

  return (
    <div className="shrink-0 w-47.5 sm:w-55 bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col group/card relative">
      <div className="absolute top-2.5 left-2.5 z-10 flex flex-col gap-1 items-start">
        {(selectedPack.discount || 0) > 0 && (
          <span className="bg-red-500 text-white font-extrabold text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-md shadow-sm">
            {selectedPack.discount}% OFF
          </span>
        )}
        {isInCart && (
          <span className="bg-emerald-500 text-white font-extrabold text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-md shadow-sm">
            {cartQuantity} in Cart
          </span>
        )}
      </div>

      <Link
        href={`/product/${product.slug}`}
        className="relative aspect-square w-full bg-slate-50 overflow-hidden block"
      >
        <Image
          src={image}
          alt={product.name}
          className="object-cover transition-transform duration-500 will-change-transform group-hover/card:scale-105"
          loading="lazy"
          fill
          sizes="(max-width: 640px) 190px, 220px"
          style={{ objectFit: "cover" }}
        />
      </Link>

      <div className="p-3.5 flex-1 flex flex-col justify-between">
        <div className="space-y-1">
          <Link href={`/product/${product.slug}`}>
            <h4 className="text-xs sm:text-sm font-bold text-slate-800 tracking-tight line-clamp-2 min-h-9 hover:text-emerald-600 transition-colors">
              {product.name}
            </h4>
          </Link>
        </div>

        {product.rating !== undefined && (
          <div className="flex items-center gap-1 py-1">
            <div className="flex items-center text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={10}
                  fill={
                    i < Math.floor(product.rating || 0)
                      ? "currentColor"
                      : "none"
                  }
                  className={
                    i < Math.floor(product.rating || 0)
                      ? "stroke-none"
                      : "stroke-1"
                  }
                />
              ))}
            </div>
            <span className="text-[9px] text-slate-400 font-bold">
              ({product.reviewsCount || 0})
            </span>
          </div>
        )}

        {packSizes.length > 1 && (
          <select
            value={selectedPack.id}
            onChange={handlePackChange}
            className="w-full text-[10px] font-semibold border border-slate-200 rounded-lg px-2 py-1.5 bg-slate-50 focus:outline-none focus:border-emerald-500 transition-colors cursor-pointer"
            onClick={(e) => e.stopPropagation()}
          >
            {packSizes.map((pack: any) => {
              const inCart = cartItems.some(
                (item: any) =>
                  item.id === product.id && item.packSizeId === pack.id,
              );
              return (
                <option key={pack.id} value={pack.id}>
                  {pack.label} - ৳{pack.price.toFixed(2)}
                  {inCart ? " ✓" : ""}
                </option>
              );
            })}
          </select>
        )}

        <div className="pt-3 flex items-center justify-between gap-1 mt-2">
          <Link
            href={`/product/${product.slug}`}
            className="flex flex-col hover:opacity-80 transition-opacity"
          >
            {(selectedPack.originalPrice || 0) > selectedPack.price && (
              <span className="text-[10px] text-slate-400 line-through">
                ৳ {(selectedPack.originalPrice ?? 0).toFixed(2)}
              </span>
            )}
            <span className="text-xs sm:text-sm font-extrabold text-emerald-600">
              ৳ {selectedPack.price.toFixed(2)}
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
              className={`font-black text-xs px-2.5 py-1.5 rounded-xl transition-all shadow-sm active:scale-95 flex items-center gap-1 uppercase tracking-wider hover:shadow-md ${
                isAdded
                  ? "bg-emerald-600 text-white"
                  : "bg-emerald-500 hover:bg-emerald-600 text-white"
              }`}
            >
              {isAdded ? (
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

export default ProductCard;
