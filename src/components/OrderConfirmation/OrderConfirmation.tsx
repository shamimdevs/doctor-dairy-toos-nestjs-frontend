/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import React, { useEffect, useState, useMemo, useRef } from "react";
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
  HelpCircle,
  RefreshCw,
  Headphones,
  ChevronLeft,
  Wallet,
  Store,
  CreditCard,
} from "lucide-react";
import { format, differenceInDays, isToday, isTomorrow } from "date-fns";
import { bn } from "date-fns/locale";

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
  district?: string;
  upazila?: string;
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
  estimatedDelivery?: string;
}

export default function OrderConfirmationPage() {
  const router = useRouter();
  const [orderData, setOrderData] = useState<OrderData | null>(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const invoiceRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Get order data from sessionStorage
    const storedData = sessionStorage.getItem("orderData");

    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData);
        // Convert date string back to Date object
        parsedData.orderDate = new Date(parsedData.orderDate);
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

  // Estimated delivery: use the date stored at checkout (typically 2-3 days
  // from order placement); fall back to order date + 3 days if missing.
  const estimatedDelivery = useMemo(() => {
    if (orderData?.estimatedDelivery) {
      return new Date(orderData.estimatedDelivery);
    }

    const date = orderData?.orderDate
      ? new Date(orderData.orderDate)
      : new Date();

    date.setDate(date.getDate() + 3);
    return date;
  }, [orderData]);

  // Delivery window: 2 to 3 days from the order date
  const deliveryWindow = useMemo(() => {
    const base = orderData?.orderDate
      ? new Date(orderData.orderDate)
      : new Date();

    const minDate = new Date(base);
    minDate.setDate(minDate.getDate() + 2);

    const maxDate = new Date(base);
    maxDate.setDate(maxDate.getDate() + 3);

    return { minDate, maxDate };
  }, [orderData]);

  // Format the delivery window as a friendly Bengali date range
  const formatDeliveryRange = (minDate: Date, maxDate: Date): string => {
    const sameMonth =
      format(minDate, "MMMM yyyy", { locale: bn }) ===
      format(maxDate, "MMMM yyyy", { locale: bn });

    if (sameMonth) {
      return `${format(minDate, "d", { locale: bn })} - ${format(maxDate, "d MMMM", { locale: bn })}`;
    }

    return `${format(minDate, "d MMMM", { locale: bn })} - ${format(maxDate, "d MMMM", { locale: bn })}`;
  };

  // Get delivery message in Bengali
  const getDeliveryMessage = (
    date: Date,
  ): { message: string; emoji: string } => {
    const now = new Date();
    const daysDiff = differenceInDays(date, now);

    if (isToday(date)) {
      return { message: "আজই!", emoji: "🔄" };
    }

    if (isTomorrow(date)) {
      return { message: "আগামীকাল", emoji: "⏰" };
    }

    // Within the standard 2-3 day delivery window: show the actual day & date
    if (daysDiff >= 2 && daysDiff <= 3) {
      const dayAndDate = format(date, "EEEE, d MMMM", { locale: bn });
      return { message: dayAndDate, emoji: daysDiff === 2 ? "📦" : "🚚" };
    }

    if (daysDiff <= 7) {
      const dayName = format(date, "EEEE", { locale: bn });
      return { message: `পরবর্তী ${dayName}`, emoji: "📅" };
    }

    if (daysDiff <= 14) {
      return { message: "২ সপ্তাহের মধ্যে", emoji: "📆" };
    }

    return {
      message: format(date, "d MMMM", { locale: bn }),
      emoji: "🗓️",
    };
  };

  // Get delivery status color
  const getDeliveryStatusColor = (date: Date): string => {
    const now = new Date();
    const daysDiff = differenceInDays(date, now);

    if (daysDiff <= 0)
      return "bg-emerald-100 text-emerald-700 border-emerald-200";
    if (daysDiff <= 2) return "bg-blue-100 text-blue-700 border-blue-200";
    if (daysDiff <= 4) return "bg-amber-100 text-amber-700 border-amber-200";
    if (daysDiff <= 7) return "bg-orange-100 text-orange-700 border-orange-200";
    return "bg-purple-100 text-purple-700 border-purple-200";
  };

  const deliveryInfo = getDeliveryMessage(estimatedDelivery);

  // Download Invoice Function
  const downloadInvoice = async () => {
    if (!orderData) return;

    setDownloading(true);

    try {
      // Dynamically import html2canvas and jspdf
      const html2canvas = (await import("html2canvas")).default;
      const jsPDF = (await import("jspdf")).default;

      if (!invoiceRef.current) {
        throw new Error("Invoice element not found");
      }

      // Create a clone of the invoice content for rendering
      const invoiceElement = invoiceRef.current.cloneNode(true) as HTMLElement;
      invoiceElement.style.display = "block";
      invoiceElement.style.position = "fixed";
      invoiceElement.style.left = "-9999px";
      invoiceElement.style.top = "0";
      invoiceElement.style.width = "800px";
      invoiceElement.style.backgroundColor = "white";
      invoiceElement.style.padding = "20px";
      document.body.appendChild(invoiceElement);

      // Render the invoice to canvas
      const canvas = await html2canvas(invoiceElement, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff",
        width: 800,
        height: invoiceElement.scrollHeight,
      });

      // Remove the temporary element
      document.body.removeChild(invoiceElement);

      // Create a standard A4 PDF and fit the invoice image to it (with
      // margins), splitting across multiple pages if the content is taller
      // than one page. Using the raw canvas pixel size as the page format
      // (previous approach) produced a non-standard, stretched page.
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        unit: "mm",
        format: "a4",
        orientation: "portrait",
      });

      const margin = 5; // mm
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const contentWidth = pageWidth - margin * 2;
      const contentHeight = pageHeight - margin * 2;
      const imgWidth = contentWidth;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      let heightLeft = imgHeight;
      let position = margin;

      pdf.addImage(imgData, "PNG", margin, position, imgWidth, imgHeight);
      heightLeft -= contentHeight;

      while (heightLeft > 0) {
        position = margin - (imgHeight - heightLeft);
        pdf.addPage();
        pdf.addImage(imgData, "PNG", margin, position, imgWidth, imgHeight);
        heightLeft -= contentHeight;
      }

      pdf.save(`Invoice-${orderData.orderId}.pdf`);
    } catch (error) {
      console.error("Error downloading invoice:", error);
      alert(
        "ইনভয়েস ডাউনলোড করতে সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।",
      );
    } finally {
      setDownloading(false);
    }
  };

  // If loading, show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-emerald-500 border-t-transparent mx-auto mb-4" />
          <p className="text-slate-600 font-semibold">
            অর্ডারের বিবরণ লোড হচ্ছে...
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
            <span className="font-semibold">শপিং চালিয়ে যান</span>
          </Link>
          <h1 className="text-2xl font-extrabold text-slate-900">
            অর্ডার নিশ্চিতকরণ
          </h1>
          <div className="w-24" />
        </div>

        {/* Success Banner */}
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-emerald-100 mb-6 text-center">
          <div className="inline-flex p-4 bg-emerald-100 rounded-full mb-4">
            <CheckCircle size={48} className="text-emerald-600" />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900">
            অর্ডার নিশ্চিত হয়েছে! 🎉
          </h2>
          <p className="text-slate-600 mt-2">
            ধন্যবাদ,{" "}
            <span className="font-bold text-slate-900">
              {orderData.customerName}
            </span>
            ! আপনার অর্ডার সফলভাবে স্থাপন করা হয়েছে। নিশ্চিত হওয়ার পর আমরা
            আপনাকে জানিয়ে দেব।
          </p>
          <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-lg">
            <span className="text-base font-bold text-slate-600">
              অর্ডার আইডি:
            </span>
            <span className="text-base font-extrabold text-emerald-600">
              {orderData.orderId}
            </span>
          </div>
          <p className="text-base text-slate-500 mt-2">
            {format(orderData.orderDate, "EEEE, d MMMM yyyy · h:mm a", {
              locale: bn,
            })}
          </p>
        </div>

        {/* Order Progress */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 mb-6">
          <h3 className="text-base font-bold text-slate-700 mb-6">
            অর্ডারের অগ্রগতি
          </h3>
          <div className="relative">
            {/* Progress Line */}
            <div className="absolute left-0 right-0 top-5 h-1 bg-slate-200">
              <div className="h-full bg-emerald-500 w-1/4 transition-all duration-500" />
            </div>

            {/* Steps */}
            <div className="relative flex justify-between">
              {[
                { status: "placed", label: "স্থাপিত", icon: Clock },
                { status: "confirmed", label: "নিশ্চিত", icon: CheckCircle },
                { status: "shipped", label: "প্রেরিত", icon: Truck },
                { status: "delivered", label: "পৌঁছেছে", icon: Package },
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
                      className={`text-base font-bold mt-2 ${
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

        {/* Estimated Delivery Section */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 mb-6 transition-all hover:shadow-md">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-emerald-100 rounded-xl">
              <Calendar size={24} className="text-emerald-600" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div>
                  <p className="text-base font-bold text-slate-700">
                    সম্ভাব্য ডেলিভারির তারিখ
                  </p>
                  <div className="flex items-center gap-3 mt-1">
                    <p className="text-xl font-extrabold text-emerald-600">
                      {formatDeliveryRange(
                        deliveryWindow.minDate,
                        deliveryWindow.maxDate,
                      )}
                    </p>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold ${getDeliveryStatusColor(estimatedDelivery)} border`}
                    >
                      {deliveryInfo.emoji} ২-৩ দিনের মধ্যে
                    </span>
                  </div>
                </div>

                {/* Days remaining indicator */}
                <div className="hidden sm:flex items-center gap-1">
                  <div className="flex items-center gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <div
                        key={i}
                        className={`w-2 h-2 rounded-full ${
                          i < 3 ? "bg-emerald-500" : "bg-slate-200"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-xs text-slate-400 ml-1">
                    {differenceInDays(estimatedDelivery, new Date()) > 0
                      ? `${differenceInDays(estimatedDelivery, new Date())} দিন বাকি`
                      : "আজ পৌঁছাবে!"}
                  </span>
                </div>
              </div>

              {/* Time remaining progress bar */}
              <div className="mt-3 flex items-center gap-3">
                <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-linear-to-r from-emerald-400 to-emerald-600 rounded-full transition-all duration-1000"
                    style={{
                      width: `${Math.min(100, ((7 - differenceInDays(estimatedDelivery, new Date())) / 7) * 100)}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Order Items & Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Items Ordered */}
          <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <h3 className="text-base font-bold text-slate-700 mb-4">
              অর্ডারকৃত পণ্য ({orderData.items.length})
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
                    <p className="text-base font-bold text-slate-800 truncate">
                      {item.name}
                    </p>
                    {item.packSizeLabel && (
                      <p className="text-base text-slate-500">
                        {item.packSizeLabel}
                      </p>
                    )}
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-base text-slate-500">
                        ৳{item.price} × {item.quantity}
                      </span>
                      <span className="text-base font-bold text-emerald-600">
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
            <h3 className="text-base font-bold text-slate-700 mb-4">
              অর্ডারের সারসংক্ষেপ
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between text-base">
                <span className="text-slate-600">উপ-মোট</span>
                <span className="font-semibold">
                  ৳{orderData.subtotal.toFixed(2)}
                </span>
              </div>
              {orderData.discount > 0 && (
                <div className="flex justify-between text-base">
                  <span className="text-green-600">ছাড়</span>
                  <span className="font-semibold text-green-600">
                    −৳{orderData.discount.toFixed(2)}
                  </span>
                </div>
              )}
              <div className="flex justify-between text-base">
                <span className="text-slate-600">ডেলিভারি চার্জ</span>
                <span className="font-semibold">
                  ৳{orderData.deliveryFee.toFixed(2)}
                </span>
              </div>
              {orderData.optionalNote && (
                <div className="flex justify-between text-base">
                  <span className="text-slate-600">নোট</span>
                  <span className="font-semibold text-slate-500 text-sm text-right max-w-35">
                    {orderData.optionalNote}
                  </span>
                </div>
              )}
              <div className="border-t border-slate-200 pt-2 mt-2">
                <div className="flex justify-between">
                  <span className="font-bold text-slate-900">মোট</span>
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
            <h3 className="text-base font-bold text-slate-700 mb-3 flex items-center gap-2">
              <Wallet size={18} className="text-slate-400" />
              পেমেন্ট
            </h3>
            <div className="flex items-center justify-between">
              <span className="text-base text-slate-600 capitalize flex items-center gap-2">
                {orderData.paymentMethod === "cod" ? (
                  <>
                    <Store size={16} className="text-emerald-500" />
                    ক্যাশ অন ডেলিভারি
                  </>
                ) : orderData.paymentMethod === "online" ? (
                  <>
                    <CreditCard size={16} className="text-emerald-500" />
                    অনলাইন পেমেন্ট
                  </>
                ) : (
                  orderData.paymentMethod
                )}
              </span>
              <span className="text-base font-bold px-3 py-1 rounded-full bg-amber-100 text-amber-700">
                অপরিশোধিত
              </span>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <h3 className="text-base font-bold text-slate-700 mb-3 flex items-center gap-2">
              <Truck size={18} className="text-slate-400" />
              ডেলিভারি
            </h3>
            <span className="text-base text-slate-600">
              {orderData.deliveryMethod === "standard"
                ? "স্ট্যান্ডার্ড ডেলিভারি (৭ দিন)"
                : orderData.deliveryMethod === "express"
                  ? "এক্সপ্রেস ডেলিভারি (৩-৫ দিন)"
                  : orderData.deliveryMethod}
            </span>
          </div>
        </div>

        {/* Shipping Address */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 mt-6">
          <h3 className="text-base font-bold text-slate-700 mb-3 flex items-center gap-2">
            <MapPin size={18} className="text-slate-400" />
            প্রেরণের ঠিকানা
          </h3>
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-base text-slate-600">
              <User size={16} className="text-slate-400" />
              <span className="font-semibold">{orderData.customerName}</span>
            </div>
            <div className="flex items-center gap-2 text-base text-slate-600">
              <Phone size={16} className="text-slate-400" />
              <span>{orderData.customerPhone}</span>
            </div>
            <div className="flex items-center gap-2 text-base text-slate-600">
              <Mail size={16} className="text-slate-400" />
              <span>{orderData.customerEmail}</span>
            </div>
            {(orderData.district || orderData.upazila) && (
              <div className="flex items-center gap-2 text-base text-slate-600">
                <MapPin size={16} className="text-slate-400" />
                <span>
                  {[orderData.upazila, orderData.district]
                    .filter(Boolean)
                    .join(", ")}
                </span>
              </div>
            )}
            <div className="flex items-start gap-2 text-base text-slate-600">
              <MapPin size={16} className="text-slate-400 mt-0.5" />
              <span>{orderData.shippingAddress}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 mt-6">
          <button
            onClick={downloadInvoice}
            disabled={downloading}
            className="flex items-center gap-2 px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl transition-all shadow-sm hover:shadow-md cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {downloading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                <span>ডাউনলোড হচ্ছে...</span>
              </>
            ) : (
              <>
                <Download size={18} />
                <span>চালান ডাউনলোড করুন</span>
              </>
            )}
          </button>

          <Link
            href="/"
            className="flex items-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl transition-all shadow-sm hover:shadow-md ml-auto"
          >
            <ShoppingBag size={18} />
            শপিং চালিয়ে যান
          </Link>
        </div>

        {/* Hidden Invoice Template for Download/Print */}
        <div ref={invoiceRef} style={{ display: "none" }}>
          <div
            className="invoice-content"
            style={{ padding: "40px", maxWidth: "800px", margin: "0 auto" }}
          >
            {/* Invoice Header */}
            <div
              style={{
                textAlign: "center",
                borderBottom: "2px solid #10b981",
                paddingBottom: "20px",
                marginBottom: "20px",
              }}
            >
              <p
                style={{
                  fontSize: "20px",
                  fontWeight: "bold",
                  color: "#0f172a",
                  margin: 0,
                }}
              >
                ডক্টর ডেইরি টুলস
              </p>
              <h1
                style={{
                  fontSize: "28px",
                  fontWeight: "bold",
                  color: "#10b981",
                  margin: "8px 0 0 0",
                }}
              >
                📄 চালান / INVOICE
              </h1>
              <p style={{ color: "#6b7280", marginTop: "5px" }}>
                অর্ডার নিশ্চিতকরণ | Order Confirmation
              </p>
            </div>

            {/* Order Info */}
            {/* Rendered as a table (not CSS grid) because html2canvas does not
                reliably lay out CSS grid columns, which caused the two
                columns' text to overlap in the downloaded/printed invoice. */}
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                marginBottom: "20px",
              }}
            >
              <tbody>
                <tr>
                  <td style={{ verticalAlign: "top", width: "50%" }}>
                    <p style={{ margin: "4px 0" }}>
                      <strong>অর্ডার আইডি:</strong> {orderData.orderId}
                    </p>
                    <p style={{ margin: "4px 0" }}>
                      <strong>তারিখ:</strong>{" "}
                      {format(orderData.orderDate, "d MMMM yyyy, h:mm a", {
                        locale: bn,
                      })}
                    </p>
                    <p style={{ margin: "4px 0" }}>
                      <strong>স্ট্যাটাস:</strong>
                      <span
                        style={{
                          display: "inline-block",
                          padding: "2px 10px",
                          borderRadius: "20px",
                          fontSize: "12px",
                          fontWeight: "600",

                          color: "#92400e",
                          marginLeft: "5px",
                        }}
                      >
                        অপেক্ষমাণ
                      </span>
                    </p>
                  </td>
                  <td
                    style={{
                      verticalAlign: "top",
                      width: "50%",
                      textAlign: "right",
                    }}
                  >
                    <p style={{ margin: "4px 0" }}>
                      <strong>পেমেন্ট:</strong>
                      <span
                        style={{
                          display: "inline-block",
                          padding: "2px 10px",
                          borderRadius: "20px",
                          fontSize: "12px",
                          fontWeight: "600",

                          color: "#1e40af",
                          marginLeft: "5px",
                        }}
                      >
                        {orderData.paymentMethod === "cod"
                          ? "ক্যাশ অন ডেলিভারি"
                          : "অনলাইন পেমেন্ট"}
                      </span>
                    </p>
                    <p style={{ margin: "4px 0" }}>
                      <strong>ডেলিভারি:</strong>
                      <span
                        style={{
                          display: "inline-block",
                          padding: "2px 10px",
                          borderRadius: "20px",
                          fontSize: "12px",
                          fontWeight: "600",

                          color: "#166534",
                          marginLeft: "5px",
                        }}
                      >
                        {orderData.deliveryMethod === "standard"
                          ? "স্ট্যান্ডার্ড"
                          : "এক্সপ্রেস"}
                      </span>
                    </p>
                    <p style={{ margin: "4px 0" }}>
                      <strong>ডেলিভারি তারিখ:</strong>
                      <span
                        style={{
                          display: "inline-block",
                          padding: "2px 10px",
                          borderRadius: "20px",
                          fontSize: "12px",
                          fontWeight: "600",

                          color: "#92400e",
                          marginLeft: "5px",
                        }}
                      >
                        {format(estimatedDelivery, "d MMMM yyyy", {
                          locale: bn,
                        })}
                      </span>
                    </p>
                  </td>
                </tr>
              </tbody>
            </table>

            {/* Customer Info */}
            <div
              style={{
                background: "#f9fafb",
                padding: "15px",
                borderRadius: "10px",
                marginBottom: "20px",
              }}
            >
              <h3
                style={{
                  margin: "0 0 10px 0",
                  fontSize: "16px",
                  fontWeight: "bold",
                }}
              >
                👤 গ্রাহকের তথ্য
              </h3>
              <p style={{ margin: "4px 0" }}>
                <strong>নাম:</strong> {orderData.customerName}
              </p>
              <p style={{ margin: "4px 0" }}>
                <strong>ফোন:</strong> {orderData.customerPhone}
              </p>
              <p style={{ margin: "4px 0" }}>
                <strong>ইমেইল:</strong> {orderData.customerEmail}
              </p>
              {(orderData.district || orderData.upazila) && (
                <p style={{ margin: "4px 0" }}>
                  <strong>জেলা/উপজেলা:</strong>{" "}
                  {[orderData.upazila, orderData.district]
                    .filter(Boolean)
                    .join(", ")}
                </p>
              )}
              <p style={{ margin: "4px 0" }}>
                <strong>ঠিকানা:</strong> {orderData.shippingAddress}
              </p>
            </div>

            {/* Items Table */}
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                marginBottom: "20px",
              }}
            >
              <thead>
                <tr style={{ background: "#f3f4f6" }}>
                  <th
                    style={{
                      padding: "10px",
                      textAlign: "left",
                      fontWeight: "600",
                    }}
                  >
                    #
                  </th>
                  <th
                    style={{
                      padding: "10px",
                      textAlign: "left",
                      fontWeight: "600",
                    }}
                  >
                    পণ্য
                  </th>
                  <th
                    style={{
                      padding: "10px",
                      textAlign: "right",
                      fontWeight: "600",
                    }}
                  >
                    পরিমাণ
                  </th>
                  <th
                    style={{
                      padding: "10px",
                      textAlign: "right",
                      fontWeight: "600",
                    }}
                  >
                    মূল্য
                  </th>
                  <th
                    style={{
                      padding: "10px",
                      textAlign: "right",
                      fontWeight: "600",
                    }}
                  >
                    মোট
                  </th>
                </tr>
              </thead>
              <tbody>
                {orderData.items.map((item, index) => (
                  <tr key={index}>
                    <td
                      style={{
                        padding: "10px",
                        borderBottom: "1px solid #e5e7eb",
                      }}
                    >
                      {index + 1}
                    </td>
                    <td
                      style={{
                        padding: "10px",
                        borderBottom: "1px solid #e5e7eb",
                      }}
                    >
                      {item.name}
                      {item.packSizeLabel && (
                        <div style={{ fontSize: "12px", color: "#6b7280" }}>
                          {item.packSizeLabel}
                        </div>
                      )}
                    </td>
                    <td
                      style={{
                        padding: "10px",
                        borderBottom: "1px solid #e5e7eb",
                        textAlign: "right",
                      }}
                    >
                      {item.quantity}
                    </td>
                    <td
                      style={{
                        padding: "10px",
                        borderBottom: "1px solid #e5e7eb",
                        textAlign: "right",
                      }}
                    >
                      ৳{item.price.toFixed(2)}
                    </td>
                    <td
                      style={{
                        padding: "10px",
                        borderBottom: "1px solid #e5e7eb",
                        textAlign: "right",
                      }}
                    >
                      ৳{(item.price * item.quantity).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Summary */}
            <div style={{ float: "right", width: "300px" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "5px 0",
                }}
              >
                <span>উপ-মোট</span>
                <span>৳{orderData.subtotal.toFixed(2)}</span>
              </div>
              {orderData.discount > 0 && (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "5px 0",
                    color: "#16a34a",
                  }}
                >
                  <span>ছাড়</span>
                  <span>−৳{orderData.discount.toFixed(2)}</span>
                </div>
              )}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "5px 0",
                }}
              >
                <span>ডেলিভারি চার্জ</span>
                <span>৳{orderData.deliveryFee.toFixed(2)}</span>
              </div>
              <div
                style={{
                  borderTop: "2px solid #10b981",
                  paddingTop: "10px",
                  marginTop: "10px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: "20px",
                    fontWeight: "bold",
                    color: "#10b981",
                  }}
                >
                  <span>মোট</span>
                  <span>৳{orderData.total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Help & Support */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex items-center gap-4">
            <div className="p-2 bg-emerald-100 rounded-lg">
              <RefreshCw size={20} className="text-emerald-600" />
            </div>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex items-center gap-4">
            <div className="p-2 bg-emerald-100 rounded-lg">
              <Headphones size={20} className="text-emerald-600" />
            </div>
            <div>
              <p className="text-base font-bold text-slate-700">২৪/৭ সাপোর্ট</p>
              <p className="text-base text-slate-500">
                আমরা সাহায্য করতে এখানে আছি
              </p>
            </div>
          </div>
        </div>

        {/* Need Help */}
        <div className="text-center mt-8">
          <Link
            href="/support"
            className="inline-flex items-center gap-2 text-base font-semibold text-emerald-600 hover:text-emerald-700 transition-colors"
          >
            <HelpCircle size={16} />
            সাহায্য প্রয়োজন? সাপোর্টে যোগাযোগ করুন
          </Link>
        </div>
      </div>
    </div>
  );
}
