/* eslint-disable @typescript-eslint/no-explicit-any */
// components/product/RelatedProducts.tsx
"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { Plus, Check, Minus, ShoppingBag } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Product, PackSize } from "@/src/types/product";
import { ADD_TO_CART, REMOVE_FROM_CART } from "@/src/redux/features/cartSlice";

interface RelatedProductsProps {
  products: Product[];
  currentProductId: string;
}

export const RelatedProducts: React.FC<RelatedProductsProps> = ({
  products,
  currentProductId,
}) => {
  const dispatch = useDispatch();
  const cartItems = useSelector((state: any) => state?.cart?.cartItems || []);
  const [addedStates, setAddedStates] = useState<{ [key: string]: boolean }>(
    {},
  );
  const [selectedPacks, setSelectedPacks] = useState<{ [key: string]: string }>(
    {},
  );

  // Filter out current product
  const filteredProducts = useMemo(() => {
    return products.filter((p) => p.id !== currentProductId);
  }, [products, currentProductId]);

  if (filteredProducts.length === 0) return null;

  // Convert variants to pack sizes
  const getPackSizes = (product: Product): PackSize[] => {
    if (!product.variants || product.variants.length === 0) {
      return [
        {
          id: "default",
          label: "1 Unit",
          quantity: 1,
          price: product.price_range?.min || 0,
          originalPrice: product.price_range?.min || 0,
          discount: 0,
          inStock: product.is_active,
        },
      ];
    }

    return product.variants.map((variant) => ({
      id: variant.id,
      label: variant.pack_size || variant.strength || "Standard",
      quantity: 1,
      price: variant.price,
      originalPrice: variant.discount_price || variant.price,
      discount: variant.discount_price
        ? Math.round(
            ((variant.price - variant.discount_price) / variant.price) * 100,
          )
        : 0,
      inStock: variant.stock > 0,
    }));
  };

  // Get selected pack for a product
  const getSelectedPack = (product: Product): PackSize => {
    const packSizes = getPackSizes(product);
    const selectedId = selectedPacks[product.id];
    const pack = packSizes.find((p) => p.id === selectedId);
    return (
      pack ||
      packSizes[0] || {
        id: "default",
        label: "1 Unit",
        quantity: 1,
        price: product.price_range?.min || 0,
        originalPrice: product.price_range?.min || 0,
        discount: 0,
        inStock: product.is_active,
      }
    );
  };

  // Check if a specific pack size is in cart
  const getCartItemQuantity = (productId: string, packSizeId: string) => {
    const existingItem = cartItems.find(
      (item: any) => item.id === productId && item.packSizeId === packSizeId,
    );
    return existingItem ? existingItem.quantity : 0;
  };

  // Check if product is in stock
  const isProductInStock = (product: Product): boolean => {
    if (!product.variants || product.variants.length === 0) {
      return product.is_active || false;
    }
    return product.variants.some((v) => v.stock > 0);
  };

  // Get discount percentage
  const getDiscountPercentage = (product: Product): number => {
    if (product.variants && product.variants.length > 0) {
      const firstVariant = product.variants[0];
      if (firstVariant.discount_price && firstVariant.price) {
        return Math.round(
          ((firstVariant.price - firstVariant.discount_price) /
            firstVariant.price) *
            100,
        );
      }
    }
    if (product.discount_range && product.discount_range.min > 0) {
      const price = product.price_range?.min || 0;
      const discountPrice = product.discount_range?.min || 0;
      if (price > 0 && discountPrice > 0) {
        return Math.round(((price - discountPrice) / price) * 100);
      }
    }
    return 0;
  };

  const handleAddToCart = (
    e: React.MouseEvent,
    product: Product,
    packSize: PackSize,
  ) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isProductInStock(product)) {
      toast.error("This product is currently out of stock!", {
        position: "bottom-right",
        autoClose: 3000,
      });
      return;
    }

    const cartItem = {
      id: product.id,
      productId: product.id,
      name: `${product.name} (${packSize.label})`,
      price: packSize.price,
      quantity: 1,
      packSizeId: packSize.id,
      packSizeLabel: packSize.label,
      image: product.thumbnail,
      maxQuantity: 99,
      discount: packSize.discount || getDiscountPercentage(product),
      originalPrice: packSize.originalPrice || packSize.price,
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

    setAddedStates((prev) => ({
      ...prev,
      [`${product.id}-${packSize.id}`]: true,
    }));
    setTimeout(() => {
      setAddedStates((prev) => ({
        ...prev,
        [`${product.id}-${packSize.id}`]: false,
      }));
    }, 2000);
  };

  const handleRemoveFromCart = (
    e: React.MouseEvent,
    productId: string,
    packSizeId: string,
  ) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(REMOVE_FROM_CART({ id: productId, packSizeId }));

    toast.info(`🛒 Removed from cart`, {
      position: "bottom-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      theme: "light",
    });
  };

  const handlePackChange = (
    e: React.ChangeEvent<HTMLSelectElement>,
    productId: string,
  ) => {
    setSelectedPacks((prev) => ({
      ...prev,
      [productId]: e.target.value,
    }));
  };

  return (
    <div className="mt-16">
      <h2 className="text-2xl font-extrabold text-slate-900 mb-6">
        You May Also Like
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredProducts.map((product) => {
          const packSizes = getPackSizes(product);
          const selectedPack = getSelectedPack(product);
          const cartQuantity = getCartItemQuantity(product.id, selectedPack.id);
          const isInCart = cartQuantity > 0;
          const isAdded =
            addedStates[`${product.id}-${selectedPack.id}`] || false;
          const inStock = isProductInStock(product);
          const discount = getDiscountPercentage(product);

          return (
            <div
              key={product.id}
              className="group bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col"
            >
              <Link href={`/product/${product.slug}`} className="block">
                <div className="relative aspect-square bg-slate-50">
                  {product.thumbnail ? (
                    <Image
                      src={product.thumbnail}
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 640px) 50vw, 25vw"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-slate-100">
                      <ShoppingBag className="w-12 h-12 text-slate-300" />
                    </div>
                  )}
                  {discount > 0 && (
                    <span className="absolute top-2 left-2 bg-red-500 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-md">
                      {discount}% OFF
                    </span>
                  )}
                  {isInCart && (
                    <span className="absolute top-2 right-2 bg-emerald-500 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-md">
                      {cartQuantity} in Cart
                    </span>
                  )}
                  {!inStock && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <span className="bg-red-500 text-white text-xs font-extrabold px-3 py-1 rounded-lg">
                        Out of Stock
                      </span>
                    </div>
                  )}
                </div>
              </Link>

              <div className="p-3 flex-1 flex flex-col">
                <Link href={`/product/${product.slug}`} className="flex-1">
                  <h4 className="text-sm font-bold text-slate-800 line-clamp-2 min-h-10 hover:text-emerald-600 transition-colors">
                    {product.name}
                  </h4>
                </Link>

                {product.brand && (
                  <p className="text-[10px] text-slate-500 mt-0.5">
                    {product.brand.name}
                  </p>
                )}

                <div className="flex items-center justify-between mt-1">
                  <Link href={`/product/${product.slug}`}>
                    <div>
                      {selectedPack.originalPrice &&
                        selectedPack.originalPrice > selectedPack.price && (
                          <span className="text-[10px] text-slate-400 line-through block">
                            ৳{selectedPack.originalPrice.toFixed(2)}
                          </span>
                        )}
                      <span className="text-sm font-extrabold text-emerald-600">
                        ৳{selectedPack.price.toFixed(2)}
                      </span>
                    </div>
                  </Link>
                </div>

                {/* Pack Size Selector */}
                {packSizes.length > 1 && (
                  <div className="mt-1">
                    <select
                      value={selectedPack.id}
                      onChange={(e) => handlePackChange(e, product.id)}
                      className="w-full text-[10px] font-semibold border border-slate-200 rounded-lg px-1.5 py-1 bg-slate-50 focus:outline-none focus:border-emerald-500 transition-colors cursor-pointer"
                      onClick={(e) => e.stopPropagation()}
                      disabled={!inStock}
                    >
                      {packSizes.map((pack) => {
                        const inCart = cartItems.some(
                          (item: any) =>
                            item.id === product.id &&
                            item.packSizeId === pack.id,
                        );
                        return (
                          <option key={pack.id} value={pack.id}>
                            {pack.label} - ৳{pack.price.toFixed(2)}
                            {!pack.inStock && " (Out of Stock)"}
                            {inCart ? " ✓" : ""}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                )}

                {/* Add to Cart Button */}
                <div className="mt-2 pt-2 border-t border-slate-100">
                  {isInCart ? (
                    <div className="flex items-center justify-between gap-1 bg-emerald-50 rounded-lg border border-emerald-200 px-1.5 py-0.5">
                      <button
                        onClick={(e) =>
                          handleRemoveFromCart(e, product.id, selectedPack.id)
                        }
                        className="p-1 rounded hover:bg-emerald-100 transition-colors text-emerald-600"
                        aria-label="Remove one"
                      >
                        <Minus size={14} className="stroke-3" />
                      </button>
                      <span className="text-xs font-bold text-emerald-700 min-w-4.5 text-center">
                        {cartQuantity}
                      </span>
                      <button
                        onClick={(e) =>
                          handleAddToCart(e, product, selectedPack)
                        }
                        className="p-1 rounded hover:bg-emerald-100 transition-colors text-emerald-600"
                        aria-label="Add one more"
                        disabled={!inStock}
                      >
                        <Plus size={14} className="stroke-3" />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={(e) => handleAddToCart(e, product, selectedPack)}
                      disabled={!inStock}
                      className={`w-full font-black text-xs px-2 py-1.5 rounded-lg transition-all shadow-sm active:scale-95 flex items-center justify-center gap-1 uppercase tracking-wider hover:shadow-md ${
                        isAdded
                          ? "bg-emerald-600 text-white"
                          : "bg-emerald-500 hover:bg-emerald-600 text-white"
                      } disabled:bg-slate-300 disabled:cursor-not-allowed`}
                    >
                      {isAdded ? (
                        <>
                          <Check size={12} className="stroke-3" />
                          ADDED
                        </>
                      ) : (
                        <>
                          <Plus size={12} className="stroke-3" />
                          ADD
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
