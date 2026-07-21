/* eslint-disable @typescript-eslint/no-explicit-any */

// components/product/ProductDetails.tsx

"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Heart,
  Share2,
  ShoppingBag,
  Truck,
  Shield,
  RefreshCw,
  Check,
  Plus,
  Minus,
} from "lucide-react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch, useSelector } from "react-redux";

import { Product, PackSize } from "@/src/types/product";
import { ADD_TO_CART, REMOVE_FROM_CART } from "@/src/redux/features/cartSlice";
import { slugify } from "@/src/utils/slugify";

interface ProductDetailsProps {
  product: Product;
  onBuyNow?: (product: Product, packSize: PackSize, quantity: number) => void;
}

export const ProductDetails: React.FC<ProductDetailsProps> = ({
  product,
  onBuyNow,
}) => {
  const dispatch = useDispatch();
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "description" | "specifications" | "benefits"
  >("description");
  const [isAdding, setIsAdding] = useState(false);

  // Get cart items from Redux
  const cartItems = useSelector((state: any) => state?.cart?.cartItems || []);

  // ✅ Get variants as pack sizes
  const packSizes = React.useMemo(() => {
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
        } as PackSize,
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
      stripCount: variant.pack_size
        ? parseInt(variant.pack_size) || undefined
        : undefined,
    })) as PackSize[];
  }, [product]);

  // ✅ Get discount percentage
  const discountPercentage = React.useMemo(() => {
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
  }, [product]);

  // ✅ Check if product is in stock
  const isInStock = React.useMemo(() => {
    if (!product.variants || product.variants.length === 0) {
      return product.is_active || false;
    }
    return product.variants.some((v) => v.stock > 0);
  }, [product]);

  // Pack size selection
  const [selectedPack, setSelectedPack] = useState<PackSize>(
    packSizes.find((p) => p.inStock) ||
      packSizes[0] || {
        id: "default",
        label: "1 Unit",
        quantity: 1,
        price: product.price_range?.min || 0,
        originalPrice: product.price_range?.min || 0,
        discount: 0,
        inStock: true,
      },
  );

  // Check if this specific pack size is already in cart
  const getCartItemQuantity = () => {
    const existingItem = cartItems.find(
      (item: any) =>
        item.id === product.id && item.packSizeId === selectedPack.id,
    );
    return existingItem ? existingItem.quantity : 0;
  };

  const cartQuantity = getCartItemQuantity();
  const isInCart = cartQuantity > 0;

  const handleAddToCart = () => {
    if (!isInStock) {
      toast.error("This product is currently out of stock!", {
        position: "bottom-right",
        autoClose: 3000,
      });
      return;
    }

    setIsAdding(true);

    const cartItem = {
      id: product.id,
      productId: product.id,
      name: `${product.name} (${selectedPack.label})`,
      price: selectedPack.price,
      quantity: quantity,
      packSizeId: selectedPack.id,
      packSizeLabel: selectedPack.label,
      image: product.thumbnail,
      maxQuantity: 99,
      discount: selectedPack.discount || discountPercentage,
      originalPrice: selectedPack.originalPrice || selectedPack.price,
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
            {selectedPack.label} × {quantity}
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

  const handleRemoveFromCart = () => {
    dispatch(REMOVE_FROM_CART({ id: product.id, packSizeId: selectedPack.id }));

    toast.info(
      <div className="flex items-center gap-3">
        <div className="bg-amber-100 p-2 rounded-full">
          <span className="text-amber-600">🛒</span>
        </div>
        <div>
          <p className="font-bold text-sm">Removed from Cart</p>
          <p className="text-xs text-slate-600">{product.name}</p>
          <p className="text-xs text-slate-500">{selectedPack.label}</p>
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
  };

  const handleBuyNow = () => {
    if (!isInStock) {
      toast.error("This product is currently out of stock!", {
        position: "bottom-right",
        autoClose: 3000,
      });
      return;
    }

    const cartItem = {
      id: product.id,
      productId: product.id,
      name: `${product.name} (${selectedPack.label})`,
      price: selectedPack.price,
      quantity: quantity,
      packSizeId: selectedPack.id,
      packSizeLabel: selectedPack.label,
      image: product.thumbnail,
      maxQuantity: 99,
      discount: selectedPack.discount || discountPercentage,
      originalPrice: selectedPack.originalPrice || selectedPack.price,
    };

    dispatch(ADD_TO_CART(cartItem));

    if (onBuyNow) {
      onBuyNow(product, selectedPack, quantity);
    }

    toast.info(
      <div className="flex items-center gap-3">
        <div className="bg-blue-100 p-2 rounded-full">
          <span className="text-blue-600">🛒</span>
        </div>
        <div>
          <p className="font-bold text-sm">Proceeding to Checkout!</p>
          <p className="text-xs text-slate-600">{product.name}</p>
          <p className="text-xs text-slate-500">
            {selectedPack.label} × {quantity}
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

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: product.name,
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

  const handlePackChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const pack = packSizes.find((p) => p.id === e.target.value);
    if (pack) {
      setSelectedPack(pack);
      setQuantity(1);
    }
  };

  // ✅ Get category slug for link
  const categorySlug =
    product.category?.slug || slugify(product.category?.name || "");

  return (
    <div className="space-y-6">
      {/* Product Name & Brand */}
      <div className="space-y-2">
        {product.category && (
          <Link
            href={`/category/${categorySlug}`}
            className="text-sm font-bold text-emerald-600 hover:text-emerald-700 transition-colors"
          >
            {product.category.name}
          </Link>
        )}
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
          {product.name}
        </h1>
        {product.brand && (
          <p className="text-sm font-semibold text-slate-600">
            By {product.brand.name}
          </p>
        )}
        {product.manufacturer && !product.brand && (
          <p className="text-sm font-semibold text-slate-600">
            By {product.manufacturer}
          </p>
        )}
      </div>

      {/* Price */}
      <div className="flex items-end gap-3 flex-wrap">
        <span className="text-3xl font-extrabold text-emerald-600">
          ৳{selectedPack.price.toFixed(2)}
        </span>
        {selectedPack.originalPrice &&
          selectedPack.originalPrice > selectedPack.price && (
            <>
              <span className="text-lg text-slate-400 line-through">
                ৳{selectedPack.originalPrice.toFixed(2)}
              </span>
              <span className="bg-red-500 text-white text-xs font-extrabold px-2 py-1 rounded-lg">
                Save {selectedPack.discount || discountPercentage}%
              </span>
            </>
          )}
      </div>

      {/* Pack Size Selector */}
      {packSizes.length > 1 && (
        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-700">
            Select Pack Size:
          </label>
          <select
            value={selectedPack.id}
            onChange={handlePackChange}
            className="w-full max-w-xs text-sm font-semibold border border-slate-200 rounded-xl px-4 py-2.5 bg-white focus:outline-none focus:border-emerald-500 transition-colors cursor-pointer"
          >
            {packSizes.map((pack) => {
              const inCart = cartItems.some(
                (item: any) =>
                  item.id === product.id && item.packSizeId === pack.id,
              );
              return (
                <option key={pack.id} value={pack.id}>
                  {pack.label} - ৳{pack.price.toFixed(2)}
                  {pack.discount > 0 && ` (${pack.discount}% OFF)`}
                  {!pack.inStock && " (Out of Stock)"}
                  {inCart ? " ✓" : ""}
                </option>
              );
            })}
          </select>
        </div>
      )}

      {/* Show message if different pack size is in cart */}
      {!isInCart && cartItems.some((item: any) => item.id === product.id) && (
        <div className="flex items-center gap-2 text-amber-600 text-sm font-medium bg-amber-50 px-4 py-2 rounded-xl">
          <ShoppingBag size={16} />
          <span>Other pack size in cart</span>
        </div>
      )}

      {/* Delivery Info */}
      <div className="flex items-center gap-4 text-sm text-slate-600 bg-slate-50 px-4 py-3 rounded-xl">
        <Truck size={18} className="text-emerald-600 shrink-0" />
        <span className="font-medium">Delivery: 12-24 HOURS</span>
        <span className="w-px h-4 bg-slate-300" />
        <span className="font-medium">Free Shipping</span>
      </div>

      {/* Quantity & Actions */}
      <div className="flex flex-wrap gap-3">
        {isInCart ? (
          <div className="flex items-center gap-2 bg-emerald-50 rounded-xl border border-emerald-200 px-3 py-1">
            <button
              onClick={handleRemoveFromCart}
              className="p-1.5 rounded-lg hover:bg-emerald-100 transition-colors text-emerald-600"
              aria-label="Remove one"
            >
              <Minus size={18} className="stroke-3" />
            </button>
            <span className="text-sm font-bold text-emerald-700 min-w-6 text-center">
              {cartQuantity}
            </span>
            <button
              onClick={handleAddToCart}
              className="p-1.5 rounded-lg hover:bg-emerald-100 transition-colors text-emerald-600"
              aria-label="Add one more"
            >
              <Plus size={18} className="stroke-3" />
            </button>
          </div>
        ) : (
          <QuantitySelector
            quantity={quantity}
            onIncrease={() => setQuantity((q) => q + 1)}
            onDecrease={() => setQuantity((q) => Math.max(1, q - 1))}
          />
        )}

        <button
          onClick={handleAddToCart}
          disabled={!isInStock || isAdding}
          className={`flex-1 min-w-35 px-6 py-3 text-white font-bold rounded-xl transition-all shadow-sm hover:shadow-md active:scale-95 flex items-center justify-center gap-2 ${
            isInCart
              ? "bg-emerald-600 hover:bg-emerald-700"
              : "bg-emerald-500 hover:bg-emerald-600"
          } disabled:bg-slate-300 disabled:cursor-not-allowed`}
        >
          {isAdding ? (
            <>
              <span className="animate-spin">⟳</span>
              Adding...
            </>
          ) : isInCart ? (
            <>
              <Plus size={18} />
              Add More
            </>
          ) : (
            <>
              <ShoppingBag size={18} />
              Add to Cart
            </>
          )}
        </button>

        <button
          onClick={handleBuyNow}
          disabled={!isInStock}
          className="flex-1 min-w-35 px-6 py-3 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-300 text-white font-bold rounded-xl transition-all shadow-sm hover:shadow-md active:scale-95 flex items-center justify-center gap-2"
        >
          Buy Now
        </button>

        <button
          onClick={() => {
            setIsWishlisted(!isWishlisted);
            if (!isWishlisted) {
              toast.success("Added to wishlist! ❤️", {
                position: "bottom-right",
                autoClose: 2000,
              });
            } else {
              toast.info("Removed from wishlist", {
                position: "bottom-right",
                autoClose: 2000,
              });
            }
          }}
          className="p-3 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all"
          aria-label="Add to wishlist"
        >
          <Heart
            size={20}
            className={
              isWishlisted ? "fill-red-500 text-red-500" : "text-slate-600"
            }
          />
        </button>

        <button
          onClick={handleShare}
          className="p-3 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all"
          aria-label="Share product"
        >
          <Share2 size={20} className="text-slate-600" />
        </button>
      </div>

      {/* Stock Status */}
      {isInStock ? (
        <div className="flex items-center gap-2 text-emerald-600 text-sm font-semibold">
          <Check size={16} />
          In Stock - Ready to Ship
        </div>
      ) : (
        <div className="flex items-center gap-2 text-red-500 text-sm font-semibold">
          <span>Out of Stock</span>
        </div>
      )}

      {/* Prescription Required */}
      {product.is_prescription_required && (
        <div className="flex items-center gap-2 text-amber-600 text-sm font-semibold bg-amber-50 px-4 py-2 rounded-xl">
          <span>💊</span>
          <span>Prescription Required</span>
        </div>
      )}

      {/* Tabs */}
      <div className="border-t border-slate-200 pt-6">
        <div className="flex gap-4 border-b border-slate-200 mb-4 overflow-x-auto">
          <button
            onClick={() => setActiveTab("description")}
            className={`pb-3 text-sm font-bold transition-all border-b-2 whitespace-nowrap ${
              activeTab === "description"
                ? "border-emerald-500 text-emerald-600"
                : "border-transparent text-slate-500 hover:text-slate-700"
            }`}
          >
            Description
          </button>
          {product.manufacturer && (
            <button
              onClick={() => setActiveTab("specifications")}
              className={`pb-3 text-sm font-bold transition-all border-b-2 whitespace-nowrap ${
                activeTab === "specifications"
                  ? "border-emerald-500 text-emerald-600"
                  : "border-transparent text-slate-500 hover:text-slate-700"
              }`}
            >
              Specifications
            </button>
          )}
        </div>

        <div className="prose prose-sm max-w-none text-slate-600">
          {activeTab === "description" && (
            <div className="space-y-3">
              <p>
                {product.name} - {product.manufacturer || "Generic"}
              </p>
              <p className="text-sm">
                Category: {product.category?.name || "N/A"}
              </p>
              <p className="text-sm">
                Available in {packSizes.length} variant(s)
              </p>
              {product.variants && product.variants.length > 0 && (
                <div>
                  <h4 className="font-bold text-slate-800">Variants:</h4>
                  <ul className="list-disc pl-5">
                    {product.variants.map((v) => (
                      <li key={v.id}>
                        {v.strength} - {v.pack_size} (Stock: {v.stock})
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {activeTab === "specifications" && product.manufacturer && (
            <dl className="grid grid-cols-2 gap-2">
              <div className="flex items-start gap-2 py-2 border-b border-slate-100">
                <dt className="font-bold text-slate-800 flex-1">
                  Manufacturer:
                </dt>
                <dd className="text-slate-600 flex-1">
                  {product.manufacturer}
                </dd>
              </div>
              {product.brand && (
                <div className="flex items-start gap-2 py-2 border-b border-slate-100">
                  <dt className="font-bold text-slate-800 flex-1">Brand:</dt>
                  <dd className="text-slate-600 flex-1">
                    {product.brand.name}
                  </dd>
                </div>
              )}
              <div className="flex items-start gap-2 py-2 border-b border-slate-100">
                <dt className="font-bold text-slate-800 flex-1">Category:</dt>
                <dd className="text-slate-600 flex-1">
                  {product.category?.name || "N/A"}
                </dd>
              </div>
              <div className="flex items-start gap-2 py-2 border-b border-slate-100">
                <dt className="font-bold text-slate-800 flex-1">
                  Prescription:
                </dt>
                <dd className="text-slate-600 flex-1">
                  {product.is_prescription_required
                    ? "Required"
                    : "Not Required"}
                </dd>
              </div>
            </dl>
          )}
        </div>
      </div>

      {/* Trust Badges */}
      <div className="grid grid-cols-3 gap-3 pt-4 border-t border-slate-200">
        <div className="flex items-center gap-2 text-xs text-slate-600">
          <Shield size={16} className="text-emerald-500" />
          <span>Genuine Products</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-600">
          <Truck size={16} className="text-emerald-500" />
          <span>Free Delivery</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-600">
          <RefreshCw size={16} className="text-emerald-500" />
          <span>Easy Returns</span>
        </div>
      </div>
    </div>
  );
};

// QuantitySelector Component
interface QuantitySelectorProps {
  quantity: number;
  onIncrease: () => void;
  onDecrease: () => void;
  minQuantity?: number;
  maxQuantity?: number;
}

const QuantitySelector: React.FC<QuantitySelectorProps> = ({
  quantity,
  onIncrease,
  onDecrease,
  minQuantity = 1,
  maxQuantity = 99,
}) => {
  return (
    <div className="flex items-center gap-1 bg-slate-100 rounded-xl p-1">
      <button
        onClick={onDecrease}
        disabled={quantity <= minQuantity}
        className="p-1.5 hover:bg-white rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label="Decrease quantity"
      >
        <Minus size={16} />
      </button>
      <span className="w-8 text-center font-bold text-sm">{quantity}</span>
      <button
        onClick={onIncrease}
        disabled={quantity >= maxQuantity}
        className="p-1.5 hover:bg-white rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label="Increase quantity"
      >
        <Plus size={16} />
      </button>
    </div>
  );
};
