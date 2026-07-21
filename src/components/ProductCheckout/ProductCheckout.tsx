/* eslint-disable react-hooks/purity */
/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import {
  ChevronLeft,
  Truck,
  RefreshCw,
  Lock,
  CreditCard,
  Building2,
  MapPin,
  User,
  Mail,
  Phone,
  MessageSquare,
  Percent,
  CheckCircle,
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  AlertCircle,
} from "lucide-react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  CLEAR_CART,
  REMOVE_FROM_CART,
  UPDATE_QUANTITY,
} from "@/src/redux/features/cartSlice";
import { useCreateOrderMutation } from "@/src/redux/api/orderApi";
import { useGetMyProfileQuery } from "@/src/redux/api/authApi";

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
}

interface CheckoutFormData {
  fullName: string;
  mobileNumber: string;
  emailAddress: string;
  fullAddress: string;
  optionalNote: string;
  deliveryMethod: "inside-dhaka" | "outside-dhaka";
  paymentMethod: "cod" | "online";
  addressId?: string;
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

// Components
const DeliveryMethodCard: React.FC<{
  method: "inside-dhaka" | "outside-dhaka";
  selected: boolean;
  onSelect: () => void;
  label: string;
  price: number;
  description: string;
}> = ({ selected, onSelect, label, price, description }) => (
  <button
    type="button"
    onClick={onSelect}
    className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
      selected
        ? "border-emerald-500 bg-emerald-50 ring-2 ring-emerald-200"
        : "border-slate-200 hover:border-slate-300 bg-white"
    }`}
  >
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div
          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
            selected ? "border-emerald-500 bg-emerald-500" : "border-slate-300"
          }`}
        >
          {selected && <CheckCircle size={12} className="text-white" />}
        </div>
        <div>
          <p className="font-bold text-slate-800">{label}</p>
          <p className="text-xs text-slate-500">{description}</p>
        </div>
      </div>
      <p className="font-bold text-emerald-600">৳{price}</p>
    </div>
  </button>
);

const PaymentMethodCard: React.FC<{
  method: "cod" | "online";
  selected: boolean;
  onSelect: () => void;
  icon: React.ReactNode;
  title: string;
  description: string;
  subDescription?: string;
}> = ({ selected, onSelect, icon, title, description, subDescription }) => (
  <button
    type="button"
    onClick={onSelect}
    className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
      selected
        ? "border-emerald-500 bg-emerald-50 ring-2 ring-emerald-200"
        : "border-slate-200 hover:border-slate-300 bg-white"
    }`}
  >
    <div className="flex items-start gap-3">
      <div
        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mt-1 shrink-0 ${
          selected ? "border-emerald-500 bg-emerald-500" : "border-slate-300"
        }`}
      >
        {selected && <CheckCircle size={12} className="text-white" />}
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2">
          {icon}
          <p className="font-bold text-slate-800">{title}</p>
        </div>
        <p className="text-xs text-slate-500 mt-1">{description}</p>
        {subDescription && (
          <p className="text-xs font-medium text-emerald-600 mt-1">
            {subDescription}
          </p>
        )}
      </div>
    </div>
  </button>
);

// Main Checkout Page
export default function ProductCheckout() {
  const router = useRouter();
  const dispatch = useDispatch();

  // Get user profile
  const { data: profileData, isLoading: profileLoading } =
    useGetMyProfileQuery();

  const user = profileData?.data?.user;
  // const isAuthenticated = !!user;

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
    deliveryMethod: "inside-dhaka",
    paymentMethod: "cod",
    addressId: "",
  });

  const [couponCode, setCouponCode] = useState("");
  const [isCouponApplied, setIsCouponApplied] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  // Populate form with user data when available
  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        fullName: user.name || "",
        emailAddress: user.email || "",
        mobileNumber: user.mobile || "",
      }));
    }
  }, [user]);

  // Calculate order summary from real cart data
  const subtotal = cartItems.reduce(
    (sum: number, item: CartItem) =>
      sum + (item.price || 0) * (item.quantity || 0),
    0,
  );

  const totalDiscount = cartItems.reduce(
    (sum: number, item: CartItem) =>
      sum + (item.discount || 0) * (item.quantity || 0),
    0,
  );

  const deliveryFee = formData.deliveryMethod === "inside-dhaka" ? 60 : 120;
  const totalPayable = subtotal - totalDiscount + deliveryFee;

  // Handlers
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setApiError(null);
  };

  const handleApplyCoupon = () => {
    if (couponCode.trim()) {
      setIsCouponApplied(true);
      toast.success("Coupon applied successfully!", {
        position: "bottom-right",
        autoClose: 3000,
      });
    }
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
    // Check authentication
    // if (!isAuthenticated) {
    //   toast.error("Please login to place your order!", {
    //     position: "bottom-right",
    //     autoClose: 3000,
    //   });
    //   sessionStorage.setItem("redirectAfterLogin", "/checkout");
    //   router.push("/login");
    //   return;
    // }

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
        payment_method: formData.paymentMethod === "cod" ? "COD" : "SSLCOMMERZ",
        notes: formData.optionalNote || "",
        items: cartItems.map((item: CartItem) => ({
          product_variant_id: item.packSizeId || item.id,
          product_name: item.name,
          sku: item.sku || `SKU-${item.id}`,
          quantity: item.quantity,
          unit_price: item.price,
          total_price: item.price * item.quantity,
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

      console.log("📥 Full response:", JSON.stringify(response, null, 2));

      // ✅ Get order and items from response.data
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
        })),
        subtotal: Number(order.subtotal) || subtotal,
        discount: Number(order.discount) || totalDiscount,
        deliveryFee: Number(order.delivery_charge) || deliveryFee,
        total: Number(order.total_amount) || totalPayable,
        paymentMethod: formData.paymentMethod,
        deliveryMethod:
          formData.deliveryMethod === "inside-dhaka"
            ? "Inside Dhaka"
            : "Outside Dhaka",
        optionalNote: formData.optionalNote,
        orderStatus: order.order_status || "pending",
        paymentStatus: order.payment_status || "unpaid",
        estimatedDelivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        paymentMethodFromBackend: order.payment_method,
        itemsFromBackend: items || [],
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
      }, 500);
    } catch (error: any) {
      console.error("❌ Order placement error:", error);

      // Handle authentication errors
      if (error?.status === 401 || error?.status === 403) {
        toast.error("Your session has expired. Please login again.", {
          position: "bottom-right",
          autoClose: 3000,
        });
        sessionStorage.setItem("redirectAfterLogin", "/checkout");
        router.push("/login");
        return;
      }

      // Handle validation errors from backend
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

  // Show loading state while checking authentication
  if (profileLoading) {
    return (
      <div className="bg-slate-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-emerald-500 border-t-transparent mx-auto mb-4" />
          <p className="text-slate-600 font-semibold">Loading...</p>
        </div>
      </div>
    );
  }

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
            href="/cart"
            className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors"
          >
            <ChevronLeft size={20} />
            <span className="font-semibold">Back to Cart</span>
          </Link>
          <h1 className="text-2xl font-extrabold text-slate-900">Checkout</h1>
          <div className="w-24" />
        </div>

        {/* User Info Banner */}
        <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-100 rounded-lg">
              <User size={18} className="text-emerald-600" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-800">
                {user?.name || "User"}
              </p>
              <p className="text-xs text-slate-500">{user?.email}</p>
            </div>
          </div>
          <span className="text-xs font-bold text-emerald-600 bg-emerald-100 px-3 py-1 rounded-full">
            Logged In
          </span>
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
                      placeholder="John Doe"
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
                      placeholder="01712345678"
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail
                      size={18}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    />
                    <input
                      type="email"
                      name="emailAddress"
                      value={formData.emailAddress}
                      onChange={handleInputChange}
                      placeholder="john@example.com"
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all"
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

            {/* Delivery Method */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
              <h2 className="text-lg font-extrabold text-slate-900 mb-4">
                Delivery Method
              </h2>
              <div className="space-y-3">
                <DeliveryMethodCard
                  method="inside-dhaka"
                  selected={formData.deliveryMethod === "inside-dhaka"}
                  onSelect={() =>
                    setFormData((prev) => ({
                      ...prev,
                      deliveryMethod: "inside-dhaka",
                    }))
                  }
                  label="Inside Dhaka"
                  price={60}
                  description="First delivery"
                />
                <DeliveryMethodCard
                  method="outside-dhaka"
                  selected={formData.deliveryMethod === "outside-dhaka"}
                  onSelect={() =>
                    setFormData((prev) => ({
                      ...prev,
                      deliveryMethod: "outside-dhaka",
                    }))
                  }
                  label="Outside Dhaka"
                  price={120}
                  description="First delivery"
                />
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
              <h2 className="text-lg font-extrabold text-slate-900 mb-4">
                Payment Method
              </h2>
              <div className="space-y-3">
                <PaymentMethodCard
                  method="cod"
                  selected={formData.paymentMethod === "cod"}
                  onSelect={() =>
                    setFormData((prev) => ({ ...prev, paymentMethod: "cod" }))
                  }
                  icon={<Building2 size={18} className="text-emerald-600" />}
                  title="Cash on Delivery"
                  description="পণ্য পেয়ে ক্যাশ দিন — Pay when you receive"
                />
                <PaymentMethodCard
                  method="online"
                  selected={formData.paymentMethod === "online"}
                  onSelect={() =>
                    setFormData((prev) => ({
                      ...prev,
                      paymentMethod: "online",
                    }))
                  }
                  icon={<CreditCard size={18} className="text-emerald-600" />}
                  title="Online Payment"
                  description="SSL Commerz — Card, bKash, Nagad, Rocket ও অন্যান্য"
                  subDescription="SSLCommerz"
                />
              </div>
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 sticky top-6">
              <h2 className="text-lg font-extrabold text-slate-900 mb-4">
                Order Summary ({totalQuantity} items)
              </h2>

              {/* Cart Items */}
              <div className="space-y-3 max-h-60 overflow-y-auto scrollbar-thin">
                {cartItems.map((item: CartItem) => (
                  <div
                    key={`${item.id}-${item.packSizeId}`}
                    className="flex gap-3 pb-3 border-b border-slate-100"
                  >
                    <div className="relative w-16 h-16 shrink-0 rounded-xl overflow-hidden bg-slate-50">
                      <Image
                        src={item.image || "/placeholder.png"}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-slate-800 truncate">
                        {item.name}
                      </p>
                      <p className="text-[10px] text-slate-500">
                        {item.packSizeLabel}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <button
                          type="button"
                          onClick={() =>
                            handleUpdateQuantity(item, item.quantity - 1)
                          }
                          className="p-0.5 rounded hover:bg-slate-200 transition-colors"
                        >
                          <Minus size={12} className="text-slate-500" />
                        </button>
                        <span className="text-xs font-bold text-slate-700 min-w-4 text-center">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            handleUpdateQuantity(item, item.quantity + 1)
                          }
                          className="p-0.5 rounded hover:bg-slate-200 transition-colors"
                        >
                          <Plus size={12} className="text-slate-500" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRemoveItem(item)}
                          className="p-0.5 rounded hover:bg-red-100 transition-colors ml-1"
                        >
                          <Trash2 size={12} className="text-red-500" />
                        </button>
                      </div>
                      <p className="text-sm font-bold text-emerald-600">
                        ৳{(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-2 py-4 border-b border-slate-200">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Subtotal</span>
                  <span className="font-semibold text-slate-800">
                    ৳{subtotal.toFixed(2)}
                  </span>
                </div>
                {totalDiscount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-green-600">Discount</span>
                    <span className="font-semibold text-green-600">
                      −৳{totalDiscount.toFixed(2)}
                    </span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Delivery</span>
                  <span className="font-semibold text-slate-800">
                    ৳{deliveryFee.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Total */}
              <div className="pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-extrabold text-slate-900">
                    Total Payable
                  </span>
                  <span className="text-2xl font-extrabold text-emerald-600">
                    ৳{totalPayable.toFixed(2)}
                  </span>
                </div>
                {totalDiscount > 0 && (
                  <p className="text-sm font-bold text-green-600 mt-1">
                    Saving ৳{totalDiscount.toFixed(2)} on this order!
                  </p>
                )}
              </div>

              {/* Coupon Code */}
              <div className="mt-4 p-3 bg-slate-50 rounded-xl">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Percent
                      size={16}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    />
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      placeholder="Coupon Code"
                      disabled={isCouponApplied}
                      className="w-full pl-8 pr-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 disabled:opacity-50 transition-all"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleApplyCoupon}
                    disabled={isCouponApplied || !couponCode.trim()}
                    className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 disabled:bg-slate-300 text-white font-bold text-sm rounded-lg transition-all whitespace-nowrap"
                  >
                    {isCouponApplied ? "Applied" : "Apply"}
                  </button>
                </div>
                {isCouponApplied && (
                  <p className="text-xs text-green-600 mt-2">
                    ✓ Coupon applied successfully!
                  </p>
                )}
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
                    className="w-full py-3.5 bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold rounded-xl transition-all shadow-sm hover:shadow-md active:scale-95 flex items-center justify-center gap-2"
                  >
                    Place Order{" "}
                    {formData.paymentMethod === "cod" ? "(COD)" : ""}
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
