"use client";

import { useMemo } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { IOrder } from "@/src/redux/api/orderApi";

interface RevenueTrendChartProps {
  orders: IOrder[];
  days?: number;
}

const CHART_BLUE = "#2a78d6";

function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: { value: number }[];
  label?: string;
}) {
  if (!active || !payload || payload.length === 0) return null;
  return (
    <div className="rounded-lg border border-black/10 bg-white px-3 py-2 shadow-md">
      <p className="text-xs font-semibold text-gray-500">{label}</p>
      <p className="text-sm font-bold text-gray-900">
        ৳{payload[0].value.toLocaleString()}
      </p>
    </div>
  );
}

export default function RevenueTrendChart({
  orders,
  days = 14,
}: RevenueTrendChartProps) {
  const data = useMemo(() => {
    const today = new Date();
    const buckets: { date: string; label: string; revenue: number }[] = [];

    for (let i = days - 1; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      buckets.push({
        date: d.toISOString().slice(0, 10),
        label: d.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        }),
        revenue: 0,
      });
    }

    const byDate = new Map(buckets.map((b) => [b.date, b]));
    orders.forEach((order) => {
      const key = new Date(order.created_at).toISOString().slice(0, 10);
      const bucket = byDate.get(key);
      if (bucket) bucket.revenue += Number(order.total_amount) || 0;
    });

    return buckets;
  }, [orders, days]);

  const hasRevenue = data.some((d) => d.revenue > 0);

  if (!hasRevenue) {
    return (
      <div className="flex-1 min-h-55 flex flex-col items-center justify-center text-center p-8">
        <p className="text-gray-900 font-bold text-sm">No revenue yet</p>
        <p className="text-xs text-gray-500 mt-1">
          Revenue from the last {days} days will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 min-h-55 w-full">
      <ResponsiveContainer width="100%" height="100%" minHeight={220}>
        <AreaChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={CHART_BLUE} stopOpacity={0.35} />
              <stop offset="100%" stopColor={CHART_BLUE} stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid
            vertical={false}
            stroke="#e1e0d9"
            strokeDasharray="3 3"
          />
          <XAxis
            dataKey="label"
            tick={{ fontSize: 11, fill: "#898781" }}
            axisLine={{ stroke: "#c3c2b7" }}
            tickLine={false}
            interval="preserveStartEnd"
            minTickGap={24}
          />
          <YAxis
            tick={{ fontSize: 11, fill: "#898781" }}
            axisLine={false}
            tickLine={false}
            width={44}
            tickFormatter={(v) =>
              v >= 1000 ? `${(v / 1000).toFixed(0)}k` : `${v}`
            }
          />
          <Tooltip content={<CustomTooltip />} cursor={{ stroke: "#c3c2b7" }} />
          <Area
            type="monotone"
            dataKey="revenue"
            stroke={CHART_BLUE}
            strokeWidth={2}
            fill="url(#revenueFill)"
            activeDot={{ r: 4, fill: CHART_BLUE, stroke: "#fff", strokeWidth: 2 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
