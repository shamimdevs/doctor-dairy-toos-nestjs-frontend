// app/order-confirmation/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  CheckCircle,
  Package,
  Truck,
  Clock,
  Calendar,
  MapPin,
  Phone,
  Mail,
  User,
  Download,
  ShoppingBag,
  ArrowRight,
  HelpCircle,
  RefreshCw,
  Headphones,
  ChevronLeft,
} from "lucide-react";
import { format } from "date-fns";

// Types
interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  packSizeLabel?: string;
}

interface OrderData {
  orderId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: string;
  orderDate: Date;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  deliveryFee: number;
  total: number;
  paymentMethod: string;
  deliveryMethod: string;
  optionalNote?: string;
}

export default function OrderConfirmationPage() {
  const router = useRouter();
  const [orderData, setOrderData] = useState<OrderData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get order data from sessionStorage
    const storedData = sessionStorage.getItem("orderData");

    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData);
        // Convert date string back to Date object
        parsedData.orderDate = new Date(parsedData.orderDate);
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setOrderData(parsedData);
        setLoading(false);
      } catch (error) {
        console.error("Error parsing order data:", error);
      }
    } else {
      // If no order data, redirect to home
      router.push("/");
    }
  }, [router]);

  // If loading, show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-emerald-500 border-t-transparent mx-auto mb-4" />
          <p className="text-slate-600 font-semibold">
            Loading order details...
          </p>
        </div>
      </div>
    );
  }

  // If no order data, redirect
  if (!orderData) {
    router.push("/");
    return null;
  }

  // Calculate estimated delivery (3 days from order date)
  const estimatedDelivery = new Date(orderData.orderDate);
  estimatedDelivery.setDate(estimatedDelivery.getDate() + 3);

  return (
    <div className="min-h-screen bg-linear-to-b from-emerald-50 to-slate-50 py-8">
      <div className="container mx-auto px-4 max-w-5xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Link
            href="/"
            className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors"
          >
            <ChevronLeft size={20} />
            <span className="font-semibold">Continue Shopping</span>
          </Link>
          <h1 className="text-2xl font-extrabold text-slate-900">
            Order Confirmation
          </h1>
          <div className="w-24" />
        </div>

        {/* Success Banner */}
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-emerald-100 mb-6 text-center">
          <div className="inline-flex p-4 bg-emerald-100 rounded-full mb-4">
            <CheckCircle size={48} className="text-emerald-600" />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900">
            Order Confirmed! 🎉
          </h2>
          <p className="text-slate-600 mt-2">
            Thank you,{" "}
            <span className="font-bold text-slate-900">
              {orderData.customerName}
            </span>
            ! Your order has been placed successfully. We&apos;ll notify you
            once it&apos;s confirmed.
          </p>
          <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-lg">
            <span className="text-sm font-bold text-slate-600">Order ID:</span>
            <span className="text-sm font-extrabold text-emerald-600">
              {orderData.orderId}
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-2">
            {format(orderData.orderDate, "EEEE, d MMMM yyyy · h:mm a")}
          </p>
        </div>

        {/* Order Progress */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 mb-6">
          <h3 className="text-sm font-bold text-slate-700 mb-6">
            Order Progress
          </h3>
          <div className="relative">
            {/* Progress Line */}
            <div className="absolute left-0 right-0 top-5 h-1 bg-slate-200">
              <div className="h-full bg-emerald-500 w-1/4 transition-all duration-500" />
            </div>

            {/* Steps */}
            <div className="relative flex justify-between">
              {[
                { status: "placed", label: "Placed", icon: Clock },
                { status: "confirmed", label: "Confirmed", icon: CheckCircle },
                { status: "shipped", label: "Shipped", icon: Truck },
                { status: "delivered", label: "Delivered", icon: Package },
              ].map((step, index) => {
                const isCompleted = index === 0;
                const Icon = step.icon;

                return (
                  <div key={step.status} className="flex flex-col items-center">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center relative z-10 transition-all ${
                        isCompleted
                          ? "bg-emerald-500 text-white shadow-lg shadow-emerald-200"
                          : "bg-slate-200 text-slate-400"
                      }`}
                    >
                      <Icon size={20} />
                    </div>
                    <span
                      className={`text-xs font-bold mt-2 ${
                        isCompleted ? "text-emerald-600" : "text-slate-400"
                      }`}
                    >
                      {step.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Estimated Delivery */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 mb-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-emerald-100 rounded-xl">
              <Calendar size={24} className="text-emerald-600" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-700">
                Estimated Delivery
              </p>
              <p className="text-xl font-extrabold text-emerald-600">
                {format(estimatedDelivery, "EEEE d MMMM")}
              </p>
            </div>
          </div>
        </div>

        {/* Order Items & Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Items Ordered */}
          <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <h3 className="text-sm font-bold text-slate-700 mb-4">
              Items Ordered ({orderData.items.length})
            </h3>
            <div className="space-y-4">
              {orderData.items.map((item, index) => (
                <div
                  key={index}
                  className="flex gap-4 pb-4 border-b border-slate-100 last:border-0 last:pb-0"
                >
                  <div className="relative w-20 h-20 shrink-0 rounded-xl overflow-hidden bg-slate-50">
                    <Image
                      src={item.image || "/placeholder.png"}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-slate-800 truncate">
                      {item.name}
                    </p>
                    {item.packSizeLabel && (
                      <p className="text-xs text-slate-500">
                        {item.packSizeLabel}
                      </p>
                    )}
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-xs text-slate-500">
                        ৳{item.price} × {item.quantity}
                      </span>
                      <span className="text-sm font-bold text-emerald-600">
                        ৳{(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1 bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <h3 className="text-sm font-bold text-slate-700 mb-4">
              Order Summary
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Subtotal</span>
                <span className="font-semibold">
                  ৳{orderData.subtotal.toFixed(2)}
                </span>
              </div>
              {orderData.discount > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-green-600">Discount</span>
                  <span className="font-semibold text-green-600">
                    −৳{orderData.discount.toFixed(2)}
                  </span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Delivery</span>
                <span className="font-semibold">
                  ৳{orderData.deliveryFee.toFixed(2)}
                </span>
              </div>
              <div className="border-t border-slate-200 pt-2 mt-2">
                <div className="flex justify-between">
                  <span className="font-bold text-slate-900">Total Paid</span>
                  <span className="text-xl font-extrabold text-emerald-600">
                    ৳{orderData.total.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Payment & Delivery Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <h3 className="text-sm font-bold text-slate-700 mb-3">Payment</h3>
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600 capitalize">
                {orderData.paymentMethod === "cod"
                  ? "Cash on Delivery"
                  : "Online Payment"}
              </span>
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-amber-100 text-amber-700">
                Unpaid
              </span>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <h3 className="text-sm font-bold text-slate-700 mb-3">Delivery</h3>
            <span className="text-sm text-slate-600">
              {orderData.deliveryMethod}
            </span>
          </div>
        </div>

        {/* Shipping Address */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 mt-6">
          <h3 className="text-sm font-bold text-slate-700 mb-3">
            Shipping Address
          </h3>
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <User size={16} className="text-slate-400" />
              <span className="font-semibold">{orderData.customerName}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <Phone size={16} className="text-slate-400" />
              <span>{orderData.customerPhone}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <Mail size={16} className="text-slate-400" />
              <span>{orderData.customerEmail}</span>
            </div>
            <div className="flex items-start gap-2 text-sm text-slate-600">
              <MapPin size={16} className="text-slate-400 mt-0.5" />
              <span>{orderData.shippingAddress}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 mt-6">
          <button className="flex items-center gap-2 px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl transition-all shadow-sm hover:shadow-md">
            <Download size={18} />
            Download Invoice
          </button>
          <Link
            href="/dashboard/account"
            className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 hover:border-emerald-500 text-slate-700 font-bold rounded-xl transition-all shadow-sm hover:shadow-md"
          >
            View Order
            <ArrowRight size={18} />
          </Link>
          <Link
            href="/"
            className="flex items-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl transition-all shadow-sm hover:shadow-md ml-auto"
          >
            <ShoppingBag size={18} />
            Continue Shopping
          </Link>
        </div>

        {/* Help & Support */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex items-center gap-4">
            <div className="p-2 bg-emerald-100 rounded-lg">
              <RefreshCw size={20} className="text-emerald-600" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-700">Easy Returns</p>
              <p className="text-xs text-slate-500">7-day return policy</p>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex items-center gap-4">
            <div className="p-2 bg-emerald-100 rounded-lg">
              <Headphones size={20} className="text-emerald-600" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-700">24/7 Support</p>
              <p className="text-xs text-slate-500">We&apos;re here to help</p>
            </div>
          </div>
        </div>

        {/* Need Help */}
        <div className="text-center mt-8">
          <Link
            href="/support"
            className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-600 hover:text-emerald-700 transition-colors"
          >
            <HelpCircle size={16} />
            Need help? Contact Support
          </Link>
        </div>
      </div>
    </div>
  );
}
