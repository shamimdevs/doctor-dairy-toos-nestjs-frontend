"use client";

import React, { useMemo, useState } from "react";
import { toast } from "react-toastify";
import {
  Wallet,
  Receipt,
  TrendingUp,
  Weight,
  Printer,
  AlertTriangle,
  PackageX,
  Trophy,
} from "lucide-react";

import PageHeader from "@/src/components/common/PageHeader/PageHeader";
import {
  useGetSalesSummaryQuery,
  useGetTopProductsQuery,
  useGetCategorySalesReportQuery,
  useGetInventoryReportQuery,
} from "@/src/redux/api/reportsApi";
import { printBusinessReport } from "@/src/utils/reportsPrint";
import RevenueTrendReportChart from "./RevenueTrendReportChart";
import StatusBreakdownChart, { type StatusBreakdownEntry } from "./StatusBreakdownChart";
import CategorySalesChart from "./CategorySalesChart";

// Reserved status palette, matching the dashboard overview's Order Status
// chart: pending=warning, processing=sequential blue, delivered=good,
// cancelled=critical.
const ORDER_STATUS_CONFIG: { key: string; label: string; color: string }[] = [
  { key: "pending", label: "Pending", color: "#fab219" },
  { key: "processing", label: "Processing", color: "#2a78d6" },
  { key: "delivered", label: "Delivered", color: "#0ca30c" },
  { key: "cancelled", label: "Cancelled", color: "#d03b3b" },
];

// Payment status reuses the same status roles (paid=good, pending=warning,
// failed=critical) rather than inventing a second palette.
const PAYMENT_STATUS_CONFIG: { key: string; label: string; color: string }[] = [
  { key: "pending", label: "Pending", color: "#fab219" },
  { key: "paid", label: "Paid", color: "#0ca30c" },
  { key: "failed", label: "Failed", color: "#d03b3b" },
];

type PresetKey = "today" | "7d" | "30d" | "month" | "all";

const toISODate = (d: Date) => d.toISOString().slice(0, 10);

function presetToRange(preset: PresetKey): { from?: string; to?: string } {
  const today = new Date();
  const to = toISODate(today);

  switch (preset) {
    case "today":
      return { from: to, to };
    case "7d": {
      const from = new Date(today);
      from.setDate(from.getDate() - 6);
      return { from: toISODate(from), to };
    }
    case "30d": {
      const from = new Date(today);
      from.setDate(from.getDate() - 29);
      return { from: toISODate(from), to };
    }
    case "month": {
      const from = new Date(today.getFullYear(), today.getMonth(), 1);
      return { from: toISODate(from), to };
    }
    case "all":
    default:
      return {};
  }
}

const PRESETS: { key: PresetKey; label: string }[] = [
  { key: "today", label: "Today" },
  { key: "7d", label: "7 Days" },
  { key: "30d", label: "30 Days" },
  { key: "month", label: "This Month" },
  { key: "all", label: "All Time" },
];

interface KpiCardProps {
  title: string;
  value: string;
  icon: React.ElementType;
  iconBg: string;
  isLoading?: boolean;
}

const KpiCard: React.FC<KpiCardProps> = ({ title, value, icon: Icon, iconBg, isLoading }) => (
  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-5 flex flex-col justify-between">
    <div className="flex items-center justify-between mb-3">
      <span className="text-xs sm:text-sm font-bold text-gray-500">{title}</span>
      <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center shrink-0 ${iconBg}`}>
        <Icon size={18} className="text-white" />
      </div>
    </div>
    {isLoading ? (
      <div className="h-7 w-24 bg-gray-100 rounded animate-pulse" />
    ) : (
      <span className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">{value}</span>
    )}
  </div>
);

const Reports: React.FC = () => {
  const [preset, setPreset] = useState<PresetKey>("30d");
  const [customFrom, setCustomFrom] = useState("");
  const [customTo, setCustomTo] = useState("");
  const [isPrinting, setIsPrinting] = useState(false);

  const range = useMemo(() => {
    if (customFrom || customTo) {
      return { from: customFrom || undefined, to: customTo || undefined };
    }
    return presetToRange(preset);
  }, [preset, customFrom, customTo]);

  const handlePresetClick = (key: PresetKey) => {
    setPreset(key);
    setCustomFrom("");
    setCustomTo("");
  };

  const { data: summaryRes, isLoading: isSummaryLoading } = useGetSalesSummaryQuery(range);
  const { data: topProductsRes, isLoading: isTopProductsLoading } = useGetTopProductsQuery({
    ...range,
    limit: 10,
  });
  const { data: categorySalesRes, isLoading: isCategoryLoading } =
    useGetCategorySalesReportQuery(range);
  const { data: inventoryRes, isLoading: isInventoryLoading } = useGetInventoryReportQuery();

  const summary = summaryRes?.data;
  const topProducts = topProductsRes?.data || [];
  const categorySales = categorySalesRes?.data || [];
  const inventory = inventoryRes?.data;

  const orderStatusData: StatusBreakdownEntry[] = ORDER_STATUS_CONFIG.map((cfg) => ({
    ...cfg,
    count: summary?.statusBreakdown.find((s) => s.status === cfg.key)?.count || 0,
  }));

  const paymentStatusData: StatusBreakdownEntry[] = PAYMENT_STATUS_CONFIG.map((cfg) => ({
    ...cfg,
    count: summary?.paymentBreakdown.find((s) => s.status === cfg.key)?.count || 0,
  }));

  const handlePrint = () => {
    if (!summary || !inventory) {
      toast.info("Report data is still loading.");
      return;
    }
    setIsPrinting(true);
    try {
      printBusinessReport({ summary, topProducts, categorySales, inventory });
    } catch {
      toast.error("Could not open print dialog. Please allow pop-ups for this site.");
    } finally {
      setIsPrinting(false);
    }
  };

  const isLoading = isSummaryLoading || isTopProductsLoading || isCategoryLoading;

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <PageHeader
          title="Reports"
          breadcrumbs={[{ title: "Dashboard", link: "/dashboard" }, { title: "Reports" }]}
        />

        <button
          onClick={handlePrint}
          disabled={isPrinting || isLoading}
          className="flex shrink-0 cursor-pointer items-center justify-center gap-2 rounded-lg bg-gray-900 hover:bg-gray-800 disabled:opacity-60 px-4 py-2.5 text-white text-sm font-semibold transition"
        >
          <Printer size={16} />
          Print Report
        </button>
      </div>

      {/* Date range filter */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex flex-col sm:flex-row sm:items-center gap-3">
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {PRESETS.map((p) => (
            <button
              key={p.key}
              onClick={() => handlePresetClick(p.key)}
              className={`cursor-pointer whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                !customFrom && !customTo && preset === p.key
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 sm:ml-auto">
          <input
            type="date"
            value={customFrom}
            onChange={(e) => setCustomFrom(e.target.value)}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-400"
          />
          <span className="text-gray-400 text-sm">to</span>
          <input
            type="date"
            value={customTo}
            onChange={(e) => setCustomTo(e.target.value)}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
        <KpiCard
          title="Total Revenue"
          value={`৳${(summary?.totalRevenue || 0).toLocaleString()}`}
          icon={Wallet}
          iconBg="bg-emerald-600"
          isLoading={isSummaryLoading}
        />
        <KpiCard
          title="Total Orders"
          value={(summary?.totalOrders || 0).toLocaleString()}
          icon={Receipt}
          iconBg="bg-blue-600"
          isLoading={isSummaryLoading}
        />
        <KpiCard
          title="Avg Order Value"
          value={`৳${Math.round(summary?.avgOrderValue || 0).toLocaleString()}`}
          icon={TrendingUp}
          iconBg="bg-violet-600"
          isLoading={isSummaryLoading}
        />
        <KpiCard
          title="Total Weight"
          value={`${(summary?.totalWeight || 0).toFixed(2)} kg`}
          icon={Weight}
          iconBg="bg-orange-500"
          isLoading={isSummaryLoading}
        />
      </div>

      {/* Revenue trend + Order status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        <div className="lg:col-span-2 bg-white p-4 sm:p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col">
          <div className="mb-3">
            <h2 className="text-base sm:text-lg font-extrabold text-gray-900">Revenue Trend</h2>
            <p className="text-xs font-medium text-gray-500">Daily revenue for the selected range</p>
          </div>
          {isSummaryLoading ? (
            <div className="flex-1 min-h-55 bg-gray-50 rounded-xl animate-pulse" />
          ) : (
            <RevenueTrendReportChart data={summary?.dailyTrend || []} />
          )}
        </div>

        <div className="bg-white p-4 sm:p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col">
          <div className="mb-3">
            <h2 className="text-base sm:text-lg font-extrabold text-gray-900">Order Status</h2>
            <p className="text-xs font-medium text-gray-500">Breakdown for the selected range</p>
          </div>
          {isSummaryLoading ? (
            <div className="h-55 bg-gray-50 rounded-xl animate-pulse" />
          ) : (
            <StatusBreakdownChart data={orderStatusData} />
          )}
        </div>
      </div>

      {/* Category sales + Payment status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        <div className="lg:col-span-2 bg-white p-4 sm:p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="mb-3">
            <h2 className="text-base sm:text-lg font-extrabold text-gray-900">Category Sales</h2>
            <p className="text-xs font-medium text-gray-500">Revenue by product category</p>
          </div>
          {isCategoryLoading ? (
            <div className="h-64 bg-gray-50 rounded-xl animate-pulse" />
          ) : (
            <CategorySalesChart data={categorySales} />
          )}
        </div>

        <div className="bg-white p-4 sm:p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col">
          <div className="mb-3">
            <h2 className="text-base sm:text-lg font-extrabold text-gray-900">Payment Status</h2>
            <p className="text-xs font-medium text-gray-500">Breakdown for the selected range</p>
          </div>
          {isSummaryLoading ? (
            <div className="h-55 bg-gray-50 rounded-xl animate-pulse" />
          ) : (
            <StatusBreakdownChart data={paymentStatusData} />
          )}
        </div>
      </div>

      {/* Top products */}
      <div className="bg-white p-4 sm:p-6 rounded-2xl border border-gray-100 shadow-sm">
        <div className="mb-3 flex items-center gap-2">
          <Trophy size={18} className="text-amber-500" />
          <div>
            <h2 className="text-base sm:text-lg font-extrabold text-gray-900">Top Products</h2>
            <p className="text-xs font-medium text-gray-500">Best sellers by revenue for the selected range</p>
          </div>
        </div>

        {isTopProductsLoading ? (
          <div className="space-y-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-10 bg-gray-50 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : topProducts.length === 0 ? (
          <p className="py-8 text-center text-sm text-gray-400">No product sales in this range.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-left text-xs font-bold text-gray-400 uppercase tracking-wider">
                  <th className="pb-2 pr-4">#</th>
                  <th className="pb-2 pr-4">Product</th>
                  <th className="pb-2 pr-4 text-center">Qty Sold</th>
                  <th className="pb-2 text-right">Revenue</th>
                </tr>
              </thead>
              <tbody>
                {topProducts.map((p, idx) => (
                  <tr key={p.product_id || p.product_name} className="border-t border-gray-100">
                    <td className="py-2.5 pr-4 text-gray-400 font-semibold">{idx + 1}</td>
                    <td className="py-2.5 pr-4 font-medium text-gray-800">{p.product_name}</td>
                    <td className="py-2.5 pr-4 text-center text-gray-600">{p.quantity_sold}</td>
                    <td className="py-2.5 text-right font-extrabold text-emerald-600">
                      ৳{p.revenue.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Inventory */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <div className="bg-white p-4 sm:p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="mb-3 flex items-center gap-2">
            <AlertTriangle size={18} className="text-amber-500" />
            <div>
              <h2 className="text-base sm:text-lg font-extrabold text-gray-900">
                Low Stock ({inventory?.lowStock.length ?? 0})
              </h2>
              <p className="text-xs font-medium text-gray-500">
                Active products at or below {inventory?.threshold ?? 10} units
              </p>
            </div>
          </div>

          {isInventoryLoading ? (
            <div className="space-y-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-10 bg-gray-50 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : !inventory || inventory.lowStock.length === 0 ? (
            <p className="py-8 text-center text-sm text-gray-400">No low-stock products.</p>
          ) : (
            <div className="space-y-1.5 max-h-72 overflow-y-auto pr-1">
              {inventory.lowStock.map((p) => (
                <div
                  key={p.id}
                  className="flex items-center justify-between rounded-lg bg-amber-50 px-3 py-2 text-sm"
                >
                  <div className="min-w-0">
                    <p className="font-medium text-gray-800 truncate">{p.name}</p>
                    <p className="text-xs text-gray-500">{p.category_name}</p>
                  </div>
                  <span className="shrink-0 rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-bold text-amber-700">
                    {p.stock} left
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white p-4 sm:p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="mb-3 flex items-center gap-2">
            <PackageX size={18} className="text-red-500" />
            <div>
              <h2 className="text-base sm:text-lg font-extrabold text-gray-900">
                Out of Stock ({inventory?.outOfStock.length ?? 0})
              </h2>
              <p className="text-xs font-medium text-gray-500">Active products with zero stock</p>
            </div>
          </div>

          {isInventoryLoading ? (
            <div className="space-y-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-10 bg-gray-50 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : !inventory || inventory.outOfStock.length === 0 ? (
            <p className="py-8 text-center text-sm text-gray-400">No out-of-stock products.</p>
          ) : (
            <div className="space-y-1.5 max-h-72 overflow-y-auto pr-1">
              {inventory.outOfStock.map((p) => (
                <div
                  key={p.id}
                  className="flex items-center justify-between rounded-lg bg-red-50 px-3 py-2 text-sm"
                >
                  <div className="min-w-0">
                    <p className="font-medium text-gray-800 truncate">{p.name}</p>
                    <p className="text-xs text-gray-500">{p.category_name}</p>
                  </div>
                  <span className="shrink-0 rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-bold text-red-700">
                    Out
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Reports;
