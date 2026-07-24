/* eslint-disable react-hooks/purity */
/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import {
  ChevronLeft,
  Truck,
  RefreshCw,
  Lock,
  MapPin,
  User,
  Phone,
  MessageSquare,
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  AlertCircle,
  Building2,
  Weight,
} from "lucide-react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  CLEAR_CART,
  REMOVE_FROM_CART,
  UPDATE_QUANTITY,
} from "@/src/redux/features/cartSlice";
import { useCreateOrderMutation } from "@/src/redux/api/orderApi";

// Types
interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  packSizeId: string;
  packSizeLabel: string;
  image?: string;
  discount?: number;
  originalPrice?: number;
  sku?: string;
  weight?: number; // Add weight field
}

interface CheckoutFormData {
  fullName: string;
  mobileNumber: string;
  emailAddress: string;
  fullAddress: string;
  optionalNote: string;
}

// Response type from backend
interface IOrderApiResponse {
  apiVersion: string;
  success: boolean;
  message: string;
  status: number;
  data: {
    order: {
      id: string;
      order_number: string;
      user_id: string;
      address_id: string;
      subtotal: number;
      discount: string | number;
      delivery_charge: string | number;
      total_amount: number;
      payment_status: string;
      payment_method: string;
      order_status: string;
      notes?: string;
      placed_at: string;
      created_at: string;
      updated_at: string;
    };
    items: Array<{
      id: string;
      order_id: string;
      product_variant_id: string;
      product_name: string;
      sku: string;
      quantity: number;
      unit_price: number;
      total_price: number;
      created_at: string;
    }>;
  };
}

// Main Checkout Page
export default function ProductCheckout() {
  const router = useRouter();
  const dispatch = useDispatch();

  // Get cart data from Redux
  const cartItems = useSelector((state: any) => state?.cart?.cartItems || []);
  const totalQuantity = useSelector(
    (state: any) => state?.cart?.totalQuantity || 0,
  );

  // RTK Query mutation hook
  const [createOrder, { isLoading: isOrderPlacing }] = useCreateOrderMutation();

  // State
  const [formData, setFormData] = useState<CheckoutFormData>({
    fullName: "",
    mobileNumber: "",
    emailAddress: "",
    fullAddress: "",
    optionalNote: "",
  });

  console.log(cartItems, "cartItems");

  const [apiError, setApiError] = useState<string | null>(null);

  // Calculate total weight
  const totalWeight = useMemo(() => {
    return cartItems.reduce((sum: number, item: CartItem) => {
      const weight = item.weight || 0.15; // Default weight 150g per item
      return sum + weight * item.quantity;
    }, 0);
  }, [cartItems]);

  // Calculate delivery fee based on weight
  const calculateDeliveryFee = (weight: number) => {
    const baseWeight = 1; // 1 kg base
    const baseFee = 150;
    const extraPerKg = 20;

    if (weight <= baseWeight) {
      return baseFee;
    }

    const extraKg = Math.ceil(weight - baseWeight);
    return baseFee + extraKg * extraPerKg;
  };

  const deliveryFee = calculateDeliveryFee(totalWeight);

  // Calculate order summary
  const subtotal = cartItems.reduce(
    (sum: number, item: CartItem) =>
      sum + (item.price || 0) * (item.quantity || 0),
    0,
  );

  const totalPayable = subtotal + deliveryFee;

  // Handlers
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setApiError(null);
  };

  const handleUpdateQuantity = (item: CartItem, newQuantity: number) => {
    if (newQuantity < 1) {
      dispatch(REMOVE_FROM_CART({ id: item.id, packSizeId: item.packSizeId }));
      toast.info(`Removed ${item.name} from cart`, {
        position: "bottom-right",
        autoClose: 2000,
      });
    } else {
      dispatch(
        UPDATE_QUANTITY({
          id: item.id,
          packSizeId: item.packSizeId,
          quantity: newQuantity,
        }),
      );
    }
  };

  const handleRemoveItem = (item: CartItem) => {
    dispatch(REMOVE_FROM_CART({ id: item.id, packSizeId: item.packSizeId }));
    toast.info(`Removed ${item.name} from cart`, {
      position: "bottom-right",
      autoClose: 2000,
    });
  };

  const handlePlaceOrder = async () => {
    // Validate form
    if (!formData.fullName || !formData.mobileNumber || !formData.fullAddress) {
      toast.error("Please fill in all required fields!", {
        position: "bottom-right",
        autoClose: 3000,
      });
      return;
    }

    // Validate mobile number
    if (!/^01[3-9]\d{8}$/.test(formData.mobileNumber)) {
      toast.error("Please enter a valid Bangladesh mobile number!", {
        position: "bottom-right",
        autoClose: 3000,
      });
      return;
    }

    setApiError(null);

    try {
      const orderData = {
        payment_method: "COD",
        notes: formData.optionalNote || "",
        items: cartItems.map((item: CartItem) => ({
          product_variant_id: item.packSizeId || item.id,
          product_name: item.name,
          sku: item.sku || `SKU-${item.id}`,
          quantity: item.quantity,
          unit_price: item.price,
          total_price: item.price * item.quantity,
          weight: item.weight || 0.15,
        })),
        shipping_address: {
          address_line: formData.fullAddress,
          phone: formData.mobileNumber,
          email: formData.emailAddress || "",
        },
      };

      // Call API using RTK Query mutation
      const response = (await createOrder(
        orderData,
      ).unwrap()) as unknown as IOrderApiResponse;

      const { order, items } = response.data;

      if (!order) {
        console.error("❌ Order not found in response:", response);
        throw new Error("Order not found in response");
      }

      // Store order data in sessionStorage for confirmation page
      const orderConfirmationData = {
        orderId: order.order_number || order.id || `ORD-${Date.now()}`,
        customerName: formData.fullName,
        customerEmail: formData.emailAddress || "N/A",
        customerPhone: formData.mobileNumber,
        shippingAddress: formData.fullAddress,
        orderDate: new Date(),
        items: cartItems.map((item: CartItem) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
          packSizeLabel: item.packSizeLabel,
          weight: item.weight || 0.15,
        })),
        subtotal: Number(order.subtotal) || subtotal,
        deliveryFee: Number(order.delivery_charge) || deliveryFee,
        total: Number(order.total_amount) || totalPayable,
        paymentMethod: "Cash on Delivery",
        optionalNote: formData.optionalNote,
        orderStatus: order.order_status || "pending",
        paymentStatus: order.payment_status || "unpaid",
        estimatedDelivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        paymentMethodFromBackend: order.payment_method,
        itemsFromBackend: items || [],
        totalWeight: totalWeight,
      };

      sessionStorage.setItem(
        "orderData",
        JSON.stringify(orderConfirmationData),
      );

      // Clear cart after successful order
      dispatch(CLEAR_CART());

      toast.success(
        "🎉 Order placed successfully! Thank you for shopping with us.",
        {
          position: "bottom-right",
          autoClose: 3000,
        },
      );

      // Redirect to order confirmation
      setTimeout(() => {
        router.push("/order-confirmation");
      }, 200);
    } catch (error: any) {
      console.error("❌ Order placement error:", error);

      if (error?.data?.message) {
        const messages = Array.isArray(error.data.message)
          ? error.data.message.join(", ")
          : error.data.message;
        setApiError(messages);
        toast.error(messages, {
          position: "bottom-right",
          autoClose: 5000,
        });
        return;
      }

      const errorMessage =
        error?.message || "Failed to place order. Please try again.";
      setApiError(errorMessage);

      toast.error(errorMessage, {
        position: "bottom-right",
        autoClose: 5000,
      });
    }
  };

  // If cart is empty, show empty state
  if (cartItems.length === 0) {
    return (
      <div className="bg-slate-50 min-h-screen py-20">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <div className="bg-white rounded-2xl p-12 shadow-sm">
            <ShoppingBag size={64} className="mx-auto text-slate-300 mb-4" />
            <h2 className="text-2xl font-extrabold text-slate-900 mb-2">
              Your Cart is Empty
            </h2>
            <p className="text-slate-500 mb-6">
              Looks like you haven&apos;t added any items to your cart yet.
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl transition-all"
            >
              <ChevronLeft size={18} />
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen py-6">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Link
            href="/"
            className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors"
          >
            <ChevronLeft size={20} />
            <span className="font-semibold">Back to Home</span>
          </Link>
          <h1 className="text-2xl font-extrabold text-slate-900">Checkout</h1>
          <div className="w-24" />
        </div>

        {/* API Error Display */}
        {apiError && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 text-red-700">
            <AlertCircle size={20} />
            <span className="text-sm font-medium">{apiError}</span>
          </div>
        )}

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Information */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
              <h2 className="text-lg font-extrabold text-slate-900 mb-4">
                Personal Information
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <User
                      size={18}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    />
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      placeholder="Monirul Islam"
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">
                    Mobile Number <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Phone
                      size={18}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    />
                    <input
                      type="tel"
                      name="mobileNumber"
                      value={formData.mobileNumber}
                      onChange={handleInputChange}
                      placeholder="017123......."
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">
                    Full Address <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <MapPin
                      size={18}
                      className="absolute left-3 top-3 text-slate-400"
                    />
                    <textarea
                      name="fullAddress"
                      value={formData.fullAddress}
                      onChange={handleInputChange}
                      placeholder="House #123, Road #45, Block C, Bashundhara R/A, Dhaka"
                      rows={3}
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all resize-none"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">
                    Optional Note
                  </label>
                  <div className="relative">
                    <MessageSquare
                      size={18}
                      className="absolute left-3 top-3 text-slate-400"
                    />
                    <textarea
                      name="optionalNote"
                      value={formData.optionalNote}
                      onChange={handleInputChange}
                      placeholder="Any special instructions for delivery..."
                      rows={2}
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all resize-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Delivery & Payment Method - Combined */}
            <div className="bg-white rounded-2xl md:p-6 p-3 shadow-sm border border-slate-100">
              <h2 className="text-lg font-extrabold text-slate-900 mb-4 flex items-center gap-2">
                <Truck size={20} className="text-emerald-500" />
                Delivery & Payment
              </h2>

              {/* Cash on Delivery Card */}
              <div className="md:p-4 p-2 bg-linear-to-r from-emerald-50 to-emerald-100/50 border-2 border-emerald-200 rounded-xl">
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div className="p-3 md:flex hidden bg-emerald-600 rounded-xl shadow-lg shadow-emerald-200">
                    <Building2 size={24} className="text-white" />
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div>
                        <p className="font-bold text-slate-800 text-lg">
                          Cash on Delivery
                        </p>
                        <p className="text-xs text-slate-500">
                          Pay with cash when your order arrives
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="bg-emerald-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                          COD
                        </span>
                        <span className="text-lg font-extrabold text-emerald-600">
                          ৳{deliveryFee}
                        </span>
                      </div>
                    </div>

                    {/* Weight & Delivery Info */}
                    <div className="mt-3 flex flex-wrap items-center gap-3 p-2 bg-white/50 rounded-lg border border-emerald-100">
                      <div className="flex items-center gap-1.5">
                        <Weight size={14} className="text-emerald-600" />
                        <span className="text-xs text-slate-600">
                          Total Weight: {totalWeight.toFixed(2)} kg
                        </span>
                      </div>
                      <span className="text-slate-300">|</span>
                      <div className="flex items-center gap-1.5">
                        <Truck size={14} className="text-emerald-600" />
                        <span className="text-xs text-slate-600">
                          {totalWeight <= 1
                            ? "Base delivery (1 kg)"
                            : `Base (1kg) + ${(totalWeight - 1).toFixed(1)}kg extra`}
                        </span>
                      </div>
                      <span className="text-slate-300">|</span>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-emerald-600">
                          ৳{150} + {Math.max(0, Math.ceil(totalWeight - 1))} ×
                          ৳20
                        </span>
                      </div>
                    </div>

                    <p className="text-[10px] text-slate-400 mt-2">
                      * Delivery fee: ৳150 for first 1kg, ৳20 for each
                      additional kg
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Order Summary */}
          {/* Right Column - Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 sticky top-6">
              <h2 className="text-lg font-extrabold text-slate-900 mb-4 flex items-center gap-2">
                <ShoppingBag size={20} className="text-emerald-500" />
                Order Summary ({totalQuantity} items)
              </h2>

              {/* Cart Items */}
              <div className="space-y-3 max-h-60 overflow-y-auto pr-1 custom-scrollbar">
                {cartItems.map((item: CartItem) => (
                  <div
                    key={`${item.id}-${item.packSizeId}`}
                    className="flex items-center gap-3 pb-3 border-b border-slate-100 last:border-0"
                  >
                    {/* Product Image */}
                    <div className="relative w-14 h-14 shrink-0 rounded-xl overflow-hidden bg-slate-50 border border-slate-100">
                      <Image
                        src={item.image || "/placeholder.png"}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>

                    {/* Product Details */}
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-slate-800 truncate">
                        {item.name}
                      </p>

                      {/* Weight Display */}
                      <div className="flex items-center gap-1 mt-0.5">
                        <Weight size={10} className="text-slate-400" />
                        <span className="text-[10px] text-slate-500">
                          {(item.weight || 0.15).toFixed(2)} kg
                        </span>
                      </div>

                      {/* Quantity & Price - Inline */}
                      <div className="flex items-center justify-between mt-1">
                        <div className="flex space-x-1">
                          {/* Quantity Controls - Inline */}
                          <div className="flex items-center gap-1 bg-slate-50 rounded-lg border border-slate-200 p-0.5">
                            <button
                              type="button"
                              onClick={() =>
                                handleUpdateQuantity(item, item.quantity - 1)
                              }
                              className="p-1 rounded-md hover:bg-slate-200 transition-colors"
                              aria-label="Decrease quantity"
                            >
                              <Minus size={12} className="text-slate-500" />
                            </button>
                            <span className="text-xs font-bold text-slate-700 min-w-5 text-center">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() =>
                                handleUpdateQuantity(item, item.quantity + 1)
                              }
                              className="p-1 rounded-md hover:bg-slate-200 transition-colors"
                              aria-label="Increase quantity"
                            >
                              <Plus size={12} className="text-slate-500" />
                            </button>
                          </div>

                          {/* Delete Button - Left */}
                          <button
                            type="button"
                            onClick={() => handleRemoveItem(item)}
                            className="shrink-0 p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors"
                            aria-label="Remove item"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>

                        {/* Price */}
                        <div className="text-right">
                          <p className="text-sm font-bold text-emerald-600">
                            ৳{(item.price * item.quantity).toFixed(2)}
                          </p>
                          {item.quantity > 1 && (
                            <p className="text-[10px] text-slate-400">
                              ৳{item.price.toFixed(2)} x {item.quantity}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-2 py-4 border-t border-slate-200 mt-2">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-600">Subtotal</span>
                  <span className="font-semibold text-slate-800">
                    ৳{subtotal.toFixed(2)}
                  </span>
                </div>

                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-600">Total Weight</span>
                  <span className="font-semibold text-slate-800">
                    {totalWeight.toFixed(2)} kg
                  </span>
                </div>

                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-600">Delivery Fee</span>
                  <span className="font-semibold text-slate-800">
                    ৳{deliveryFee.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between items-center text-[10px] text-slate-400 pl-4">
                  <span>Base (1kg)</span>
                  <span>+ {Math.max(0, Math.ceil(totalWeight - 1))} × ৳20</span>
                </div>
              </div>

              {/* Total */}
              <div className="pt-4 border-t border-slate-200">
                <div className="flex justify-between items-center">
                  <span className="text-base font-extrabold text-slate-900">
                    Total Payable
                  </span>
                  <span className="text-2xl font-extrabold text-emerald-600">
                    ৳{totalPayable.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Place Order Button */}
              <div className="mt-4">
                {isOrderPlacing ? (
                  <button
                    type="button"
                    disabled
                    className="w-full py-3.5 bg-slate-300 text-white font-extrabold rounded-xl flex items-center justify-center gap-2 cursor-not-allowed"
                  >
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                    Processing...
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handlePlaceOrder}
                    className="w-full py-3.5 bg-linear-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-extrabold rounded-xl transition-all shadow-lg shadow-emerald-200 hover:shadow-emerald-300 active:scale-95 flex items-center justify-center gap-2"
                  >
                    <ShoppingBag size={18} />
                    Place Order (COD)
                  </button>
                )}
              </div>

              <p className="text-[10px] text-slate-400 text-center mt-3">
                By placing order you agree to our Terms & Conditions
              </p>

              {/* Trust Badges */}
              <div className="mt-4 flex justify-center gap-6">
                <div className="flex items-center gap-1.5 text-[10px] text-slate-500">
                  <Lock size={14} className="text-emerald-500" />
                  <span>Secure</span>
                </div>
                <div className="flex items-center gap-1.5 text-[10px] text-slate-500">
                  <Truck size={14} className="text-emerald-500" />
                  <span>Fast Delivery</span>
                </div>
                <div className="flex items-center gap-1.5 text-[10px] text-slate-500">
                  <RefreshCw size={14} className="text-emerald-500" />
                  <span>Easy Return</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
