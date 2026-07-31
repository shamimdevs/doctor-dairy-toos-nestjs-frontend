/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { Plus, Check, Minus, Weight } from "lucide-react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ADD_TO_CART, REMOVE_FROM_CART } from "@/src/redux/features/cartSlice";

interface ProductCardProps {
  product: any;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const dispatch = useDispatch();
  const cartItems = useSelector((state: any) => state?.cart?.cartItems || []);

  // Image handling
  const image = product.thumbnail || "/placeholder.png";

  console.log(product, "product");

  // Price handling - using API fields directly
  const currentPrice = product?.price;
  const originalPrice = product.original_price || product.price;

  //  Get weight from product
  const productWeight = product?.weight;

  // Calculate discount percentage
  const discountPercentage =
    originalPrice > currentPrice
      ? Math.round(((originalPrice - currentPrice) / originalPrice) * 100)
      : 0;

  const [isAdded, setIsAdded] = useState(false);

  const getCartItemQuantity = () => {
    const existingItem = cartItems.find((item: any) => item.id === product.id);
    return existingItem ? existingItem.quantity : 0;
  };

  const cartQuantity = getCartItemQuantity();
  const isInCart = cartQuantity > 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const cartItem = {
      id: product.id,
      productId: product.id,
      name: product.name,
      price: product?.price,
      quantity: 1,
      packSizeId: product.id,
      packSizeLabel: "Default",
      image: image,
      maxQuantity: 99,
      weight: productWeight,
      discount: discountPercentage,
      originalPrice: product?.original_price,
      sku: product.slug || "",
    };

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
    dispatch(
      REMOVE_FROM_CART({
        id: product.id,
      }),
    );

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

  return (
    <div className="shrink-0 w-52 sm:w-60 bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col group/card relative">
      <div className="absolute top-2.5 inset-x-2.5 z-10 flex justify-between items-start">
        {/* Right side badges */}
        <div className="flex flex-col gap-1 items-end">
          {isInCart && (
            <span className="bg-emerald-500 text-white font-extrabold text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-md shadow-sm">
              {cartQuantity} in Cart
            </span>
          )}
        </div>
      </div>

      {/* Product Image */}
      <Link
        href={`/product/${product.slug}`}
        className="relative aspect-square w-full bg-slate-50 overflow-hidden block"
      >
        <Image
          src={image}
          alt={product.name}
          className="transition-transform duration-500 will-change-transform group-hover/card:scale-105"
          loading="lazy"
          fill
          sizes="(max-width: 640px) 190px, 220px"
        />
      </Link>

      <div className="p-2.5 flex-1 flex flex-col justify-between">
        {/* Product Name */}
        <div className="">
          <Link href={`/product/${product.slug}`}>
            <h4 className="text-sm sm:text-base text-slate-800 tracking-tight line-clamp-2 min-h-8 hover:text-emerald-600 transition-colors">
              {product?.name}
            </h4>
          </Link>
        </div>

        {/*  Weight Display */}
        {productWeight != 0 && (
          <div className="flex items-center gap-1 text-sm text-slate-500 mt-0.5">
            <Weight size={14} className="text-emerald-500" />
            <span>{productWeight} Kg</span>
          </div>
        )}

        {/* Price and Add to Cart */}
        <div className="flex flex-col gap-2 mt-2">
          {/* Price Section */}
          <div className="flex flex-col gap-1">
            <div className="flex items-center flex-wrap gap-2">
              {/* Current Price */}
              <span className="text-base sm:text-lg font-extrabold text-emerald-600">
                ৳ {product?.price}
              </span>

              {/* Original Price (strikethrough) */}

              <span className="text-xs sm:text-sm text-slate-400 line-through">
                ৳ {product?.original_price}
              </span>

              {/* Discount Badge */}
              {product?.discount_price > 0 && (
                <span className="bg-red-500 text-white font-bold text-[10px] sm:text-xs px-2 py-0.5 rounded-md shadow-sm whitespace-nowrap">
                  ৳{product?.discount_price} OFF
                </span>
              )}
            </div>
          </div>

          {isInCart ? (
            <div className="flex items-center justify-between gap-2 bg-emerald-50 rounded-xl border border-emerald-200 px-3 py-1.5 w-full">
              <button
                onClick={handleRemoveFromCart}
                className="p-1 rounded-lg cursor-pointer hover:bg-emerald-100 transition-colors text-emerald-600"
                aria-label="Remove one"
              >
                <Minus size={16} className="stroke-3" />
              </button>
              <span className="text-sm font-bold text-emerald-700">
                {cartQuantity}
              </span>
              <button
                onClick={handleAddToCart}
                className="p-1 rounded-lg cursor-pointer hover:bg-emerald-100 transition-colors text-emerald-600"
                aria-label="Add one more"
              >
                <Plus size={16} className="stroke-3" />
              </button>
            </div>
          ) : (
            <button
              onClick={handleAddToCart}
              className={`font-black w-full cursor-pointer text-xs py-2 rounded-xl transition-all shadow-sm active:scale-95 flex items-center justify-center gap-1 uppercase tracking-wider hover:shadow-md ${
                isAdded
                  ? "bg-emerald-600 text-white"
                  : "bg-emerald-500 hover:bg-emerald-600 text-white"
              }`}
            >
              {isAdded ? (
                <>
                  <Check size={14} className="stroke-3" /> ADDED
                </>
              ) : (
                <>
                  <Plus size={14} className="stroke-3" /> ADD
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
