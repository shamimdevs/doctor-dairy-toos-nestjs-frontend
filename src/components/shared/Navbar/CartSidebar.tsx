/* eslint-disable @typescript-eslint/no-explicit-any */
// components/CartSidebar.tsx
"use client";

import { useDispatch, useSelector } from "react-redux";
import { ShoppingBag, X, Plus, Minus, Trash2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { sidebarToggle } from "@/src/redux/features/sidebarSlice";
import {
  REMOVE_FROM_CART,
  DELETE_ITEM,
  CLEAR_CART,
  ADD_TO_CART,
} from "@/src/redux/features/cartSlice";
import { CartItem } from "@/src/redux/features/cartSlice";

export default function CartSidebar() {
  const dispatch = useDispatch();
  const isCartOpen = useSelector(
    (state: any) => state.adminTree?.sidebarStatus || false,
  );
  const cartItems = useSelector((state: any) => state?.cart?.cartItems || []);
  const totalQuantity = useSelector(
    (state: any) => state?.cart?.totalQuantity || 0,
  );
  const totalAmount = useSelector(
    (state: any) => state?.cart?.totalAmount || 0,
  );

  // Calculate unique product count (different pack sizes count as different products)
  const uniqueProductCount = cartItems.length;

  const handleRemoveFromCart = (id: string, packSizeId: string) => {
    dispatch(REMOVE_FROM_CART({ id, packSizeId }));
  };

  const handleAddToCart = (item: CartItem) => {
    dispatch(
      ADD_TO_CART({
        ...item,
        quantity: 1,
      }),
    );
  };

  const handleDeleteItem = (id: string, packSizeId: string) => {
    dispatch(DELETE_ITEM({ id, packSizeId }));
  };

  const handleClearCart = () => {
    dispatch(CLEAR_CART());
  };

  return (
    <div
      className={`fixed inset-0 z-50 transition-all duration-100 ${
        isCartOpen
          ? "opacity-100 pointer-events-auto"
          : "opacity-0 pointer-events-none"
      }`}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={() => dispatch(sidebarToggle())}
      />

      {/* Cart Drawer */}
      <div
        className={`absolute inset-y-0 right-0 w-full max-w-md bg-white border-l border-slate-200 flex flex-col shadow-2xl transition-transform duration-100 ease-in-out ${
          isCartOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 pb-4 border-b border-slate-100">
          <div>
            <span className="text-xl font-black text-slate-900 flex items-center gap-2">
              <ShoppingBag className="text-emerald-600" />
              My Cart
            </span>
            <div className="flex items-center gap-3 mt-0.5">
              <span className="text-xs font-semibold text-slate-500">
                {uniqueProductCount}{" "}
                {uniqueProductCount === 1 ? "Product" : "Products"}
              </span>
              <span className="text-xs text-slate-300">•</span>
              <span className="text-xs font-semibold text-emerald-600">
                {totalQuantity} {totalQuantity === 1 ? "Item" : "Items"} Total
              </span>
              {/* Clear All Button */}
              {cartItems.length > 1 && (
                <button
                  onClick={handleClearCart}
                  className="text-xs text-red-500 cursor-pointer font-bold hover:text-red-600 transition-colors flex items-center gap-1"
                >
                  <Trash2 size={12} />
                  Clear All Items
                </button>
              )}
            </div>
          </div>
          <button
            onClick={() => dispatch(sidebarToggle())}
            className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-all"
          >
            <X size={22} />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto no-scrollbar p-6 space-y-4">
          {cartItems && cartItems.length > 0 ? (
            <>
              {cartItems.map((item: CartItem, index: number) => (
                <div
                  key={`${item.id}-${item.packSizeId}-${index}`}
                  className="flex items-center gap-4 p-3 bg-slate-50 rounded-xl border border-slate-100 hover:border-emerald-200 transition-all"
                >
                  {/* Product Image */}
                  <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center border border-slate-200 overflow-hidden shrink-0">
                    {item.image ? (
                      <Image
                        src={item.image}
                        alt={item.name}
                        width={64}
                        height={64}
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <span className="text-xs font-bold text-slate-400">
                        Med
                      </span>
                    )}
                  </div>

                  {/* Product Details */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-slate-800 truncate">
                      {item.name}
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {item.packSizeLabel}
                    </p>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-2 mt-1">
                      <button
                        onClick={() =>
                          handleRemoveFromCart(item.id, item.packSizeId)
                        }
                        className="p-1 cursor-pointer rounded-lg hover:bg-slate-200 transition-colors text-slate-500"
                        aria-label="Decrease quantity"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="text-sm font-bold text-slate-700 min-w-5 text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => handleAddToCart(item)}
                        className="p-1 cursor-pointer rounded-lg hover:bg-slate-200 transition-colors text-slate-500"
                        aria-label="Increase quantity"
                      >
                        <Plus size={14} />
                      </button>
                      <button
                        onClick={() =>
                          handleDeleteItem(item.id, item.packSizeId)
                        }
                        className="p-1 cursor-pointer rounded-lg hover:bg-red-100 transition-colors text-red-500 ml-2"
                        aria-label="Remove item"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="text-right shrink-0">
                    <p className="text-sm font-extrabold text-emerald-600">
                      ৳ {(item.price * item.quantity).toFixed(2)}
                    </p>
                    <p className="text-[10px] text-slate-400">
                      ৳ {item.price.toFixed(2)} each
                    </p>
                  </div>
                </div>
              ))}
            </>
          ) : (
            // Empty Cart State
            <div className="text-center py-12">
              <ShoppingBag size={48} className="mx-auto text-slate-300 mb-4" />
              <p className="text-sm text-slate-500 font-semibold">
                Your cart is empty.
              </p>
              <p className="text-xs text-slate-400 mt-1">
                Start adding some amazing products!
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 pt-4 border-t border-slate-100 space-y-4">
          {/* Subtotal */}
          <div className="flex justify-between items-center">
            <span className="text-sm text-slate-500 font-semibold">
              Subtotal:
            </span>
            <span className="text-xl font-black text-slate-900">
              ৳ {totalAmount.toFixed(2)}
            </span>
          </div>

          {/* Item Summary */}
          {cartItems && cartItems.length > 0 && (
            <div className="flex justify-between items-center text-xs text-slate-400">
              <span>Total Items:</span>
              <span className="font-semibold text-slate-600">
                {totalQuantity} items
              </span>
            </div>
          )}

          {/* Delivery Info */}
          {/* {cartItems && cartItems.length > 0 && (
            <div className="flex justify-between items-center text-xs text-slate-400">
              <span>Delivery Charge:</span>
              <span className="font-semibold text-emerald-600">Free</span>
            </div>
          )} */}

          {/* Checkout Button */}
          <Link
            href={cartItems && cartItems.length > 0 ? "/checkout" : "#"}
            onClick={() => {
              if (cartItems && cartItems.length > 0) dispatch(sidebarToggle());
            }}
            className={`block w-full text-center font-bold py-3.5 rounded-xl transition-all shadow-md ${
              cartItems && cartItems.length > 0
                ? "bg-emerald-600 hover:bg-emerald-700 text-white hover:shadow-lg"
                : "bg-slate-200 text-slate-400 cursor-not-allowed"
            }`}
          >
            {cartItems && cartItems.length > 0
              ? `Proceed to Checkout (${totalQuantity} items)`
              : "Cart is Empty"}
          </Link>

          {/* Continue Shopping */}
          {cartItems && cartItems.length > 0 && (
            <button
              onClick={() => dispatch(sidebarToggle())}
              className="block w-full text-center text-sm font-semibold text-slate-500 hover:text-emerald-600 transition-colors"
            >
              Continue Shopping →
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
