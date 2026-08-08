/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import React, { useState, useMemo, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import {
  ChevronLeft,
  Truck,
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
  ChevronDown,
} from "lucide-react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  CLEAR_CART,
  REMOVE_FROM_CART,
  UPDATE_QUANTITY,
} from "@/src/redux/features/cartSlice";
import { useCreateOrderMutation } from "@/src/redux/api/orderApi";
import {
  BD_DISTRICTS,
  BD_DISTRICTS_UPAZILAS,
} from "@/src/data/bangladeshDistricts";

// Types
interface CartItem {
  id: string;
  productId?: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  discount?: number;
  originalPrice?: number;
  sku?: string;
  weight?: number;
}

interface CheckoutFormData {
  fullName: string;
  mobileNumber: string;
  emailAddress: string;
  district: string;
  upazila: string;
  fullAddress: string;
  optionalNote: string;
}

interface IOrderApiResponse {
  apiVersion?: string;
  success?: boolean;
  message?: string;
  status?: number;
  data?: {
    order?: {
      id: string;
      order_number?: string;
      subtotal?: number;
      discount?: string | number;
      delivery_charge?: string | number;
      total_amount?: number;
      payment_status?: string;
      payment_method?: string;
      order_status?: string;
      notes?: string;
      placed_at?: string;
      created_at?: string;
      updated_at?: string;
    };
    items?: Array<{
      id: string;
      order_id?: string;
      product_name?: string;
      sku?: string;
      quantity?: number;
      unit_price?: number;
      total_price?: number;
      created_at?: string;
    }>;
  };
}

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

  // Form State
  const [formData, setFormData] = useState<CheckoutFormData>({
    fullName: "",
    mobileNumber: "",
    emailAddress: "",
    district: "",
    upazila: "",
    fullAddress: "",
    optionalNote: "",
  });

  const [apiError, setApiError] = useState<string | null>(null);

  // Calculate total weight (Defaulting missing weights to 0.15 kg)
  const totalWeight = useMemo(() => {
    return cartItems.reduce((sum: number, item: CartItem) => {
      const weight = item.weight ?? 0.15;
      return sum + weight * item.quantity;
    }, 0);
  }, [cartItems]);

  // Dynamic delivery fee calculation based on total weight
  const calculateDeliveryFee = (weight: number) => {
    const baseWeight = 1;
    const baseFee = 120;
    const extraPerKg = 20;

    if (weight <= baseWeight) {
      return baseFee;
    }

    const extraKg = Math.ceil(weight - baseWeight);
    return baseFee + extraKg * extraPerKg;
  };

  const deliveryFee = calculateDeliveryFee(totalWeight);

  // Order summary calculations
  const subtotal = useMemo(() => {
    return cartItems.reduce(
      (sum: number, item: CartItem) =>
        sum + (item.price || 0) * (item.quantity || 0),
      0,
    );
  }, [cartItems]);

  const totalPayable = subtotal + deliveryFee;

  // Form Input Change Handler
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setApiError(null);
  };

  // Custom District / Upazila Dropdown State
  const [isDistrictOpen, setIsDistrictOpen] = useState(false);
  const [isUpazilaOpen, setIsUpazilaOpen] = useState(false);
  const districtRef = useRef<HTMLDivElement>(null);
  const upazilaRef = useRef<HTMLDivElement>(null);

  // Close dropdowns when clicking outside of them
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        districtRef.current &&
        !districtRef.current.contains(e.target as Node)
      ) {
        setIsDistrictOpen(false);
      }
      if (
        upazilaRef.current &&
        !upazilaRef.current.contains(e.target as Node)
      ) {
        setIsUpazilaOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // District Selection Handler (also resets the dependent Upazila field)
  const handleSelectDistrict = (district: string) => {
    setFormData((prev) => ({ ...prev, district, upazila: "" }));
    setApiError(null);
    setIsDistrictOpen(false);
  };

  // Upazila Selection Handler
  const handleSelectUpazila = (upazila: string) => {
    setFormData((prev) => ({ ...prev, upazila }));
    setApiError(null);
    setIsUpazilaOpen(false);
  };

  // Upazila options for the currently selected district
  const upazilaOptions = useMemo(() => {
    return BD_DISTRICTS_UPAZILAS[formData.district] || [];
  }, [formData.district]);

  // Quantity Update Handler
  const handleUpdateQuantity = (item: CartItem, newQuantity: number) => {
    if (newQuantity < 1) {
      dispatch(REMOVE_FROM_CART({ id: item.id }));
      toast.info(`${item.name} কার্ট থেকে সরানো হয়েছে`, {
        position: "bottom-right",
        autoClose: 2000,
      });
    } else {
      dispatch(
        UPDATE_QUANTITY({
          id: item.id,
          quantity: newQuantity,
        }),
      );
    }
  };

  // Item Removal Handler
  const handleRemoveItem = (item: CartItem) => {
    dispatch(REMOVE_FROM_CART({ id: item.id }));
    toast.info(`${item.name} কার্ট থেকে সরানো হয়েছে`, {
      position: "bottom-right",
      autoClose: 2000,
    });
  };

  // Main Order Submission Handler
  const handlePlaceOrder = async () => {
    // Basic Form Validation
    if (
      !formData.fullName.trim() ||
      !formData.mobileNumber.trim() ||
      !formData.district.trim() ||
      !formData.upazila.trim() ||
      !formData.fullAddress.trim()
    ) {
      toast.error("দয়া করে সকল প্রয়োজনীয় তথ্য পূরণ করুন!", {
        position: "bottom-right",
        autoClose: 3000,
      });
      return;
    }

    // Bangladesh Mobile Number Validation (11 digits starting with 013-019)
    if (!/^01[3-9]\d{8}$/.test(formData.mobileNumber.trim())) {
      toast.error("দয়া করে একটি বৈধ বাংলাদেশ মোবাইল নম্বর দিন!", {
        position: "bottom-right",
        autoClose: 3000,
      });
      return;
    }

    setApiError(null);

    try {
      // Prepare Payload matching the required JSON format exactly
      const orderData = {
        fullName: formData.fullName.trim(),
        phone: formData.mobileNumber.trim(),
        address: formData.fullAddress.trim(),
        district: formData.district.trim(),
        upazila: formData.upazila.trim(),
        notes: formData.optionalNote.trim() || "",
        items: cartItems.map((item: CartItem) => ({
          product_id: item.productId || item.id,
          product_name: item.name,
          quantity: item.quantity,
          price: item.price,
          weight: item.weight ?? 0.15,
          image: item.image || "",
        })),
      };

      // Trigger RTK Query Mutation
      const response = (await createOrder(
        orderData,
      ).unwrap()) as unknown as IOrderApiResponse;

      const order = response?.data?.order;
      const items = response?.data?.items || [];

      // Store Order Details in SessionStorage for Order Confirmation Page
      const orderConfirmationData = {
        orderId: order?.order_number || order?.id || `ORD-${Date.now()}`,
        customerName: formData.fullName,
        customerEmail: formData.emailAddress || "N/A",
        customerPhone: formData.mobileNumber,
        district: formData.district,
        upazila: formData.upazila,
        shippingAddress: formData.fullAddress,
        orderDate: new Date().toISOString(),
        items: cartItems.map((item: CartItem) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
          weight: item.weight ?? 0.15,
        })),
        subtotal: Number(order?.subtotal) || subtotal,
        deliveryFee: Number(order?.delivery_charge) || deliveryFee,
        total: Number(order?.total_amount) || totalPayable,
        paymentMethod: "ক্যাশ অন ডেলিভারি",
        optionalNote: formData.optionalNote,
        orderStatus: order?.order_status || "pending",
        paymentStatus: order?.payment_status || "unpaid",
        estimatedDelivery: new Date(
          Date.now() + 3 * 24 * 60 * 60 * 1000,
        ).toISOString(),
        paymentMethodFromBackend: order?.payment_method,
        itemsFromBackend: items,
        totalWeight,
      };

      sessionStorage.setItem(
        "orderData",
        JSON.stringify(orderConfirmationData),
      );

      // Clear Redux Cart
      dispatch(CLEAR_CART());

      toast.success(
        "অর্ডার সফলভাবে সম্পন্ন হয়েছে! আমাদের সাথে কেনাকাটার জন্য ধন্যবাদ।",
        {
          position: "bottom-right",
          autoClose: 200,
        },
      );

      // Redirect to Confirmation Page
      router.push("/order-confirmation");
    } catch (error: any) {
      console.error("Order placement failed:", error);

      const errorMessage =
        error?.data?.message ||
        error?.message ||
        "অর্ডার প্লেস করতে ব্যর্থ হয়েছে। দয়া করে আবার চেষ্টা করুন।";

      const formattedError = Array.isArray(errorMessage)
        ? errorMessage.join(", ")
        : errorMessage;

      setApiError(formattedError);
      toast.error(formattedError, {
        position: "bottom-right",
        autoClose: 400,
      });
    }
  };

  // Empty Cart State
  if (cartItems.length === 0) {
    return (
      <div className="bg-slate-50 min-h-screen py-20">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <div className="bg-white rounded-2xl p-12 shadow-sm border border-slate-100">
            <ShoppingBag size={64} className="mx-auto mb-4 text-slate-300" />
            <h2 className="text-2xl font-extrabold text-slate-900 mb-2">
              আপনার কার্ট খালি
            </h2>
            <p className="text-slate-500 mb-6">
              মনে হচ্ছে আপনি এখনো কোনো পণ্য কার্টে যোগ করেননি।
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl transition-all shadow-md hover:shadow-lg"
            >
              <ChevronLeft size={18} />
              কেনাকাটা চালিয়ে যান
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen py-6">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header Navigation */}
        <div className="flex items-center justify-between mb-6">
          <Link
            href="/"
            className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors"
          >
            <ChevronLeft size={20} />
            <span className="font-semibold">হোমে ফিরে যান</span>
          </Link>
          <h1 className="text-2xl font-extrabold text-slate-900">চেকআউট</h1>
          <div className="w-24" />
        </div>

        {/* API Error Alert Banner */}
        {apiError && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 text-red-700 shadow-sm">
            <AlertCircle size={20} className="shrink-0" />
            <span className="text-sm font-medium">{apiError}</span>
          </div>
        )}

        {/* Checkout Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Customer Form & Shipping Info */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
              <h2 className="text-lg font-extrabold text-slate-900 mb-4">
                ব্যক্তিগত তথ্য
              </h2>
              <div className="space-y-4">
                {/* Full Name */}
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">
                    পূর্ণ নাম <span className="text-red-500">*</span>
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
                      placeholder="মোঃ মনিরুল ইসলাম"
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all text-slate-800"
                      required
                    />
                  </div>
                </div>

                {/* Mobile Number */}
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">
                    মোবাইল নম্বর <span className="text-red-500">*</span>
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
                      placeholder="০১৭১২৩৪৫৬৭৮"
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all text-slate-800"
                      required
                    />
                  </div>
                </div>

                {/* District & Upazila */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* District Dropdown */}
                  <div ref={districtRef}>
                    <label className="block text-sm font-bold text-slate-700 mb-1">
                      জেলা <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <MapPin
                        size={18}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none z-10"
                      />
                      <button
                        type="button"
                        onClick={() => setIsDistrictOpen((prev) => !prev)}
                        className="w-full flex items-center justify-between pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all text-left"
                      >
                        <span
                          className={
                            formData.district
                              ? "text-slate-800"
                              : "text-slate-400"
                          }
                        >
                          {formData.district || "জেলা নির্বাচন করুন"}
                        </span>
                        <ChevronDown
                          size={16}
                          className={`text-slate-400 transition-transform shrink-0 ${
                            isDistrictOpen ? "rotate-180" : ""
                          }`}
                        />
                      </button>

                      {isDistrictOpen && (
                        <div className="absolute z-20 mt-1 w-full bg-white border border-slate-200 rounded-xl shadow-lg max-h-52 overflow-y-auto">
                          {BD_DISTRICTS.map((district) => (
                            <button
                              type="button"
                              key={district}
                              onClick={() => handleSelectDistrict(district)}
                              className={`w-full text-left px-4 py-2 text-sm hover:bg-emerald-50 transition-colors ${
                                formData.district === district
                                  ? "bg-emerald-50 text-emerald-700 font-semibold"
                                  : "text-slate-700"
                              }`}
                            >
                              {district}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Upazila Dropdown */}
                  <div ref={upazilaRef}>
                    <label className="block text-sm font-bold text-slate-700 mb-1">
                      উপজেলা <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <MapPin
                        size={18}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none z-10"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          formData.district && setIsUpazilaOpen((prev) => !prev)
                        }
                        disabled={!formData.district}
                        className="w-full flex items-center justify-between pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all text-left disabled:opacity-60 disabled:cursor-not-allowed"
                      >
                        <span
                          className={
                            formData.upazila
                              ? "text-slate-800"
                              : "text-slate-400"
                          }
                        >
                          {formData.upazila ||
                            (formData.district
                              ? "উপজেলা নির্বাচন করুন"
                              : "আগে জেলা নির্বাচন করুন")}
                        </span>
                        <ChevronDown
                          size={16}
                          className={`text-slate-400 transition-transform shrink-0 ${
                            isUpazilaOpen ? "rotate-180" : ""
                          }`}
                        />
                      </button>

                      {isUpazilaOpen && (
                        <div className="absolute z-20 mt-1 w-full bg-white border border-slate-200 rounded-xl shadow-lg max-h-52 overflow-y-auto">
                          {upazilaOptions.map((upazila) => (
                            <button
                              type="button"
                              key={upazila}
                              onClick={() => handleSelectUpazila(upazila)}
                              className={`w-full text-left px-4 py-2 text-sm hover:bg-emerald-50 transition-colors ${
                                formData.upazila === upazila
                                  ? "bg-emerald-50 text-emerald-700 font-semibold"
                                  : "text-slate-700"
                              }`}
                            >
                              {upazila}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Full Address */}
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">
                    সম্পূর্ণ ঠিকানা <span className="text-red-500">*</span>
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
                      placeholder="বাড়ি #১২৩, বাশুন্ধরা আর/এ, ঢাকা"
                      rows={3}
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all resize-none text-slate-800"
                      required
                    />
                  </div>
                </div>

                {/* Optional Note */}
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">
                    ঐচ্ছিক নোট
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
                      placeholder="ডেলিভারির জন্য কোনো বিশেষ নির্দেশনা (যেমন: ডেলিভারির আগে ফোন করবেন)..."
                      rows={2}
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all resize-none text-slate-800"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Delivery & Payment Method */}
            <div className="bg-white rounded-2xl md:p-6 p-4 shadow-sm border border-slate-100">
              <h2 className="text-lg font-extrabold text-slate-900 mb-4 flex items-center gap-2">
                <Truck size={20} className="text-emerald-500" />
                ডেলিভারি ও পেমেন্ট
              </h2>

              <div className="p-4 bg-emerald-50/60 border-2 border-emerald-200 rounded-xl">
                <div className="flex items-start gap-4">
                  <div className="p-3 md:flex hidden bg-emerald-600 rounded-xl shadow-lg shadow-emerald-200">
                    <Building2 size={24} className="text-white" />
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div>
                        <p className="font-bold text-slate-800 text-lg">
                          ক্যাশ অন ডেলিভারি
                        </p>
                        <p className="text-sm text-slate-600">
                          অর্ডার আসার সময় নগদ অর্থ প্রদান করুন
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="bg-emerald-600 text-white text-sm font-bold px-3 py-1 rounded-full">
                          সিওডি
                        </span>
                        <span className="text-lg font-extrabold text-emerald-600">
                          ৳{deliveryFee}
                        </span>
                      </div>
                    </div>

                    <div className="mt-3 flex flex-wrap items-center gap-3 p-2 bg-white/70 rounded-lg border border-emerald-100">
                      <div className="flex items-center gap-1.5">
                        <Weight size={14} className="text-emerald-600" />
                        <span className="text-sm font-medium text-slate-700">
                          মোট ওজন: {totalWeight.toFixed(2)} কেজি
                        </span>
                      </div>
                      <span className="text-slate-300">|</span>
                      <div className="flex items-center gap-1.5">
                        <Truck size={14} className="text-emerald-600" />
                        <span className="text-sm font-medium text-slate-700">
                          {totalWeight <= 1
                            ? "বেস ডেলিভারি (১ কেজি)"
                            : `বেস (১কেজি) + ${(totalWeight - 1).toFixed(2)}কেজি অতিরিক্ত`}
                        </span>
                      </div>
                      <span className="text-slate-300">|</span>
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm font-bold text-emerald-600">
                          ৳120 + {Math.max(0, Math.ceil(totalWeight - 1))} × ৳২০
                        </span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-500 mt-2">
                      * ডেলিভারি চার্জ: প্রথম ১ কেজির জন্য ৳১২০, অতিরিক্ত প্রতি
                      কেজির জন্য ৳২০
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Order Summary Side Panel */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 sticky top-6">
              <h2 className="text-lg font-extrabold text-slate-900 mb-4 flex items-center gap-2">
                <ShoppingBag size={20} className="text-emerald-500" />
                অর্ডার সারাংশ ({totalQuantity} টি আইটেম)
              </h2>

              {/* Cart List */}
              <div className="max-h-80 overflow-y-auto pr-1 space-y-3 custom-scrollbar">
                {cartItems.map((item: CartItem, index: number) => (
                  <div
                    key={`${item.id}-${index}`}
                    className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100 hover:border-emerald-200 transition-all"
                  >
                    <div className="w-14 h-14 bg-white rounded-lg flex items-center justify-center border border-slate-200 overflow-hidden shrink-0">
                      {item.image ? (
                        <Image
                          src={item.image}
                          alt={item.name}
                          width={56}
                          height={56}
                          className="object-cover w-full h-full"
                        />
                      ) : (
                        <span className="text-xs font-bold text-slate-400">
                          Med
                        </span>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-slate-800 truncate">
                        {item.name}
                      </p>

                      <div className="flex items-center gap-1 mt-0.5 text-slate-500">
                        <Weight size={12} />
                        <span className="text-xs">
                          {item.weight ?? 0.15} কেজি
                        </span>
                      </div>

                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-1.5">
                          <div className="flex items-center bg-white border border-slate-200 rounded-lg overflow-hidden">
                            <button
                              type="button"
                              onClick={() =>
                                handleUpdateQuantity(item, item.quantity - 1)
                              }
                              className="px-2 py-1 hover:bg-slate-100 transition-colors text-slate-600"
                              aria-label="পরিমাণ কমান"
                            >
                              <Minus size={12} />
                            </button>
                            <span className="text-xs font-bold text-slate-700 min-w-6 text-center">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() =>
                                handleUpdateQuantity(item, item.quantity + 1)
                              }
                              className="px-2 py-1 hover:bg-slate-100 transition-colors text-slate-600"
                              aria-label="পরিমাণ বাড়ান"
                            >
                              <Plus size={12} />
                            </button>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleRemoveItem(item)}
                            className="p-1 rounded-lg hover:bg-red-100 transition-colors text-slate-400 hover:text-red-500"
                            aria-label="আইটেম সরান"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>

                        <div className="text-right">
                          <p className="text-xs font-bold text-emerald-600">
                            ৳{item.price * item.quantity}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Price Calculation Breakdown */}
              <div className="space-y-2 py-4 border-t border-slate-200 mt-4">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-600">সাবটোটাল</span>
                  <span className="font-semibold text-slate-800">
                    ৳{subtotal}
                  </span>
                </div>

                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-600">মোট ওজন</span>
                  <span className="font-semibold text-slate-800">
                    {totalWeight.toFixed(2)} কেজি
                  </span>
                </div>

                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-600">ডেলিভারি চার্জ</span>
                  <span className="font-semibold text-slate-800">
                    ৳{deliveryFee}
                  </span>
                </div>
              </div>

              {/* Total Payable Amount */}
              <div className="pt-3 border-t border-slate-200">
                <div className="flex justify-between items-center">
                  <span className="text-base font-extrabold text-slate-900">
                    মোট
                  </span>
                  <span className="text-2xl font-extrabold text-emerald-600">
                    ৳{totalPayable}
                  </span>
                </div>
              </div>

              {/* Submit Button */}
              <div className="mt-5">
                <button
                  type="button"
                  onClick={handlePlaceOrder}
                  disabled={isOrderPlacing}
                  className="w-full cursor-pointer py-3.5 bg-linear-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-extrabold rounded-xl transition-all shadow-lg shadow-emerald-200 hover:shadow-emerald-300 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isOrderPlacing ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                      প্রক্রিয়াকরণ...
                    </>
                  ) : (
                    <>
                      <ShoppingBag size={18} />
                      অর্ডার করুন (সিওডি)
                    </>
                  )}
                </button>
              </div>

              <p className="text-xs text-slate-400 text-center mt-3">
                অর্ডার করার মাধ্যমে আপনি আমাদের শর্তাবলী মেনে নিচ্ছেন
              </p>

              {/* Trust Badges */}
              <div className="mt-5 pt-4 border-t border-slate-100 flex justify-center gap-4 text-slate-500">
                <div className="flex items-center gap-1 text-xs">
                  <Lock size={13} className="text-emerald-500" />
                  <span>সুরক্ষিত</span>
                </div>
                <div className="flex items-center gap-1 text-xs">
                  <Truck size={13} className="text-emerald-500" />
                  <span>দ্রুত ডেলিভারি</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
