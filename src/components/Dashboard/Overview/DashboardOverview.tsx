"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import {
  Wallet,
  Receipt,
  Package,
  Users,
  LayoutGrid,
  Newspaper,
  Quote,
  Video,
  HelpCircle,
  TrendingUp,
  TrendingDown,
  CalendarDays,
  type LucideIcon,
} from "lucide-react";

import { useGetAllOrdersQuery } from "@/src/redux/api/orderApi";
import type { IOrder } from "@/src/redux/api/orderApi";
import { useGetAllProductsQuery } from "@/src/redux/api/productsApi";
import { useGetAllProductCategoriesQuery } from "@/src/redux/api/productCategoriesApi";
import { useGetUsersQuery } from "@/src/redux/api/usersApi";
import { useGetAllBlogsQuery } from "@/src/redux/api/blogApi";
import { useGetAllTestimonialsQuery } from "@/src/redux/api/testimonialApi";
import { useGetAllVideoGallariesQuery } from "@/src/redux/api/videoGallaryApi";
import { useGetAllQuestionAnswersQuery } from "@/src/redux/api/questionAnswerApi";

import RevenueTrendChart from "./RevenueTrendChart";
import OrderStatusChart from "./OrderStatusChart";
import ProductsByCategoryChart from "./ProductsByCategoryChart";

// ─────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────

function sumAmount(orders: IOrder[]) {
  return orders.reduce((total, o) => total + (Number(o.total_amount) || 0), 0);
}

function ordersInWeek(orders: IOrder[], weeksAgo: number) {
  const now = new Date();
  const end = new Date(now);
  end.setDate(end.getDate() - weeksAgo * 7);
  const start = new Date(end);
  start.setDate(start.getDate() - 7);

  return orders.filter((o) => {
    const created = new Date(o.created_at);
    return created >= start && created < end;
  });
}

function percentDelta(current: number, previous: number) {
  if (previous > 0) return ((current - previous) / previous) * 100;
  return current > 0 ? 100 : 0;
}

const STATUS_BADGE: Record<string, string> = {
  pending: "bg-amber-100 text-amber-700",
  processing: "bg-blue-100 text-blue-700",
  delivered: "bg-emerald-100 text-emerald-700",
  cancelled: "bg-red-100 text-red-700",
};

// ─────────────────────────────────────────────────────────────
// Stat Card
// ─────────────────────────────────────────────────────────────

interface StatCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  iconBg: string;
  deltaPercent?: number;
  isLoading?: boolean;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon: Icon,
  iconBg,
  deltaPercent,
  isLoading,
}) => {
  const hasDelta = typeof deltaPercent === "number";
  const isUp = (deltaPercent || 0) >= 0;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-5 flex flex-col justify-between">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs sm:text-sm font-bold text-gray-500">
          {title}
        </span>
        <div
          className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center shrink-0 ${iconBg}`}
        >
          <Icon size={18} className="text-white" />
        </div>
      </div>

      {isLoading ? (
        <div className="h-7 w-24 bg-gray-100 rounded animate-pulse" />
      ) : (
        <div className="flex items-center justify-between gap-2">
          <span className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
            {value}
          </span>
          {hasDelta && (
            <span
              className={`flex items-center gap-0.5 text-xs font-extrabold px-2 py-0.5 rounded-full shrink-0 ${
                isUp
                  ? "bg-emerald-50 text-emerald-700"
                  : "bg-red-50 text-red-600"
              }`}
            >
              {isUp ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
              {Math.abs(deltaPercent || 0).toFixed(0)}%
            </span>
          )}
        </div>
      )}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────
// Content overview tile (secondary row)
// ─────────────────────────────────────────────────────────────

interface OverviewTileProps {
  label: string;
  value: number;
  icon: LucideIcon;
  href: string;
  isLoading?: boolean;
}

const OverviewTile: React.FC<OverviewTileProps> = ({
  label,
  value,
  icon: Icon,
  href,
  isLoading,
}) => (
  <Link
    href={href}
    className="bg-white rounded-xl border border-gray-100 shadow-sm p-3.5 flex items-center gap-3 hover:border-emerald-200 hover:shadow-md transition-all"
  >
    <div className="w-9 h-9 rounded-lg bg-gray-50 flex items-center justify-center shrink-0 text-gray-500">
      <Icon size={16} />
    </div>
    <div className="min-w-0">
      {isLoading ? (
        <div className="h-4 w-10 bg-gray-100 rounded animate-pulse" />
      ) : (
        <p className="text-base font-extrabold text-gray-900 leading-tight">
          {value}
        </p>
      )}
      <p className="text-[11px] text-gray-500 font-medium truncate">
        {label}
      </p>
    </div>
  </Link>
);

// ─────────────────────────────────────────────────────────────
// Main Overview
// ─────────────────────────────────────────────────────────────

export default function DashboardOverview() {
  // Orders: backend returns the full unpaginated list, which is exactly
  // what the trend/status charts and revenue totals need.
  const { data: ordersRes, isLoading: ordersLoading } = useGetAllOrdersQuery();
  const orders: IOrder[] = Array.isArray(ordersRes)
    ? ordersRes
    : Array.isArray((ordersRes as { data?: IOrder[] })?.data)
      ? (ordersRes as { data: IOrder[] }).data
      : [];

  const { data: productsRes, isLoading: productsLoading } =
    useGetAllProductsQuery({ limit: 500 });
  const products = productsRes?.data || [];
  const totalProducts = productsRes?.meta?.total ?? products.length;

  const { data: categoriesRes, isLoading: categoriesLoading } =
    useGetAllProductCategoriesQuery({ limit: 1 });
  const totalCategories = categoriesRes?.meta?.total ?? 0;

  const { data: usersRes, isLoading: usersLoading } = useGetUsersQuery({
    limit: 1,
  });
  const totalCustomers =
    (usersRes as { meta?: { total?: number } })?.meta?.total ?? 0;

  const { data: blogsRes, isLoading: blogsLoading } = useGetAllBlogsQuery({
    limit: 1,
  });
  const totalBlogs = blogsRes?.meta?.total ?? 0;

  const { data: testimonialsRes, isLoading: testimonialsLoading } =
    useGetAllTestimonialsQuery({ limit: 1 });
  const totalTestimonials = testimonialsRes?.meta?.total ?? 0;

  const { data: videosRes, isLoading: videosLoading } =
    useGetAllVideoGallariesQuery({ limit: 1 });
  const totalVideos = videosRes?.meta?.total ?? 0;

  const { data: faqsRes, isLoading: faqsLoading } = useGetAllQuestionAnswersQuery(
    { limit: 1 },
  );
  const totalFaqs = faqsRes?.meta?.total ?? 0;

  // Real week-over-week comparisons, computed from actual order dates —
  // no fabricated percentages.
  const { totalRevenue, revenueDelta, orderDelta } = useMemo(() => {
    const revenue = sumAmount(orders);
    const thisWeek = ordersInWeek(orders, 0);
    const lastWeek = ordersInWeek(orders, 1);

    return {
      totalRevenue: revenue,
      revenueDelta: percentDelta(sumAmount(thisWeek), sumAmount(lastWeek)),
      orderDelta: percentDelta(thisWeek.length, lastWeek.length),
    };
  }, [orders]);

  const recentOrders = useMemo(() => orders.slice(0, 6), [orders]);

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-gray-900">
            Dashboard Overview
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
            Store performance at a glance
          </p>
        </div>
        <span className="hidden sm:flex items-center gap-1.5 text-xs font-semibold text-gray-500 bg-gray-50 border border-gray-100 px-3 py-1.5 rounded-full">
          <CalendarDays size={14} />
          {new Date().toLocaleDateString("en-US", {
            weekday: "long",
            month: "long",
            day: "numeric",
          })}
        </span>
      </div>

      {/* Primary KPI Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
        <StatCard
          title="Total Revenue"
          value={`৳${totalRevenue.toLocaleString()}`}
          icon={Wallet}
          iconBg="bg-emerald-600"
          deltaPercent={orders.length > 0 ? revenueDelta : undefined}
          isLoading={ordersLoading}
        />
        <StatCard
          title="Total Orders"
          value={orders.length.toLocaleString()}
          icon={Receipt}
          iconBg="bg-blue-600"
          deltaPercent={orders.length > 0 ? orderDelta : undefined}
          isLoading={ordersLoading}
        />
        <StatCard
          title="Total Products"
          value={totalProducts.toLocaleString()}
          icon={Package}
          iconBg="bg-orange-500"
          isLoading={productsLoading}
        />
        <StatCard
          title="Total Customers"
          value={totalCustomers.toLocaleString()}
          icon={Users}
          iconBg="bg-violet-600"
          isLoading={usersLoading}
        />
      </div>

      {/* Content Overview Row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        <OverviewTile
          label="Categories"
          value={totalCategories}
          icon={LayoutGrid}
          href="/dashboard/product-category/all-product-category"
          isLoading={categoriesLoading}
        />
        <OverviewTile
          label="Blog Posts"
          value={totalBlogs}
          icon={Newspaper}
          href="/dashboard/blog/blog-posts/all-blog-posts"
          isLoading={blogsLoading}
        />
        <OverviewTile
          label="Testimonials"
          value={totalTestimonials}
          icon={Quote}
          href="/dashboard/testimonials/all-testimonials"
          isLoading={testimonialsLoading}
        />
        <OverviewTile
          label="Videos"
          value={totalVideos}
          icon={Video}
          href="/dashboard/video-gallaries/all-video-gallaries"
          isLoading={videosLoading}
        />
        <OverviewTile
          label="FAQs"
          value={totalFaqs}
          icon={HelpCircle}
          href="/dashboard/question-answers/all-question-answers"
          isLoading={faqsLoading}
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Revenue Trend */}
        <div className="lg:col-span-2 bg-white p-4 sm:p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col">
          <div className="mb-3">
            <h2 className="text-base sm:text-lg font-extrabold text-gray-900">
              Revenue Trend
            </h2>
            <p className="text-xs font-medium text-gray-500">
              Daily revenue over the last 14 days
            </p>
          </div>
          {ordersLoading ? (
            <div className="flex-1 min-h-55 bg-gray-50 rounded-xl animate-pulse" />
          ) : (
            <RevenueTrendChart orders={orders} />
          )}
        </div>

        {/* Order Status */}
        <div className="bg-white p-4 sm:p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col">
          <div className="mb-3">
            <h2 className="text-base sm:text-lg font-extrabold text-gray-900">
              Order Status
            </h2>
            <p className="text-xs font-medium text-gray-500">
              Breakdown of all orders
            </p>
          </div>
          {ordersLoading ? (
            <div className="h-55 bg-gray-50 rounded-xl animate-pulse" />
          ) : (
            <OrderStatusChart orders={orders} />
          )}
        </div>
      </div>

      {/* Products by Category + Recent Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        <div className="bg-white p-4 sm:p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="mb-3">
            <h2 className="text-base sm:text-lg font-extrabold text-gray-900">
              Products by Category
            </h2>
            <p className="text-xs font-medium text-gray-500">
              Where your catalog is concentrated
            </p>
          </div>
          {productsLoading ? (
            <div className="h-64 bg-gray-50 rounded-xl animate-pulse" />
          ) : (
            <ProductsByCategoryChart products={products} />
          )}
        </div>

        {/* Recent Orders */}
        <div className="lg:col-span-2 bg-white p-4 sm:p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="text-base sm:text-lg font-extrabold text-gray-900">
                Recent Orders
              </h2>
              <p className="text-xs font-medium text-gray-500">
                The latest orders placed
              </p>
            </div>
          </div>

          {ordersLoading ? (
            <div className="space-y-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-14 bg-gray-50 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : recentOrders.length === 0 ? (
            <div className="py-10 text-center">
              <p className="text-gray-900 font-bold text-sm">No orders yet</p>
              <p className="text-xs text-gray-500 mt-1">
                New orders will show up here as they come in.
              </p>
            </div>
          ) : (
            <>
              {/* Desktop table */}
              <div className="hidden sm:block overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="text-left text-xs font-bold text-gray-400 uppercase tracking-wider">
                      <th className="pb-2 pr-4">Order</th>
                      <th className="pb-2 pr-4">Customer</th>
                      <th className="pb-2 pr-4">Date</th>
                      <th className="pb-2 pr-4">Status</th>
                      <th className="pb-2 text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentOrders.map((order) => (
                      <tr
                        key={order.id}
                        className="border-t border-gray-100 hover:bg-gray-50 transition-colors"
                      >
                        <td className="py-3 pr-4 font-bold text-gray-800">
                          {order.order_number}
                        </td>
                        <td className="py-3 pr-4 text-gray-600 truncate max-w-40">
                          {order.customer_name}
                        </td>
                        <td className="py-3 pr-4 text-gray-500">
                          {formatDate(order.created_at)}
                        </td>
                        <td className="py-3 pr-4">
                          <span
                            className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-bold capitalize ${
                              STATUS_BADGE[order.order_status] ||
                              "bg-gray-100 text-gray-600"
                            }`}
                          >
                            {order.order_status}
                          </span>
                        </td>
                        <td className="py-3 text-right font-extrabold text-emerald-600">
                          ৳{Number(order.total_amount).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile stacked cards */}
              <div className="sm:hidden space-y-2">
                {recentOrders.map((order) => (
                  <div
                    key={order.id}
                    className="p-3 rounded-xl border border-gray-100 bg-gray-50/60"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm text-gray-800">
                        {order.order_number}
                      </span>
                      <span className="font-extrabold text-sm text-emerald-600">
                        ৳{Number(order.total_amount).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 truncate mt-0.5">
                      {order.customer_name}
                    </p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-[11px] text-gray-400">
                        {formatDate(order.created_at)}
                      </span>
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full text-[11px] font-bold capitalize ${
                          STATUS_BADGE[order.order_status] ||
                          "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {order.order_status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
