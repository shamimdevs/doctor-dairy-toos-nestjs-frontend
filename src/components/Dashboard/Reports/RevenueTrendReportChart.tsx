"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { IDailyTrendPoint } from "@/src/redux/api/reportsApi";

interface RevenueTrendReportChartProps {
  data: IDailyTrendPoint[];
}

// Same sequential blue as the dashboard overview's Revenue Trend chart, so
// "revenue over time" reads as one consistent visual language app-wide.
const CHART_BLUE = "#2a78d6";

function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: { payload: { orders: number }; value: number }[];
  label?: string;
}) {
  if (!active || !payload || payload.length === 0) return null;
  return (
    <div className="rounded-lg border border-black/10 bg-white px-3 py-2 shadow-md">
      <p className="text-xs font-semibold text-gray-500">{label}</p>
      <p className="text-sm font-bold text-gray-900">
        ৳{payload[0].value.toLocaleString()}
      </p>
      <p className="text-xs text-gray-500">
        {payload[0].payload.orders} order{payload[0].payload.orders !== 1 ? "s" : ""}
      </p>
    </div>
  );
}

export default function RevenueTrendReportChart({
  data,
}: RevenueTrendReportChartProps) {
  const chartData = data.map((d) => ({
    ...d,
    label: new Date(d.date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    }),
  }));

  const hasRevenue = chartData.some((d) => d.revenue > 0);

  if (!hasRevenue) {
    return (
      <div className="flex-1 min-h-55 flex flex-col items-center justify-center text-center p-8">
        <p className="text-gray-900 font-bold text-sm">No revenue in this range</p>
        <p className="text-xs text-gray-500 mt-1">
          Try a wider date range to see the trend.
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 min-h-55 w-full">
      <ResponsiveContainer width="100%" height="100%" minHeight={220}>
        <AreaChart data={chartData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="reportRevenueFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={CHART_BLUE} stopOpacity={0.35} />
              <stop offset="100%" stopColor={CHART_BLUE} stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid vertical={false} stroke="#e1e0d9" strokeDasharray="3 3" />
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
            tickFormatter={(v) => (v >= 1000 ? `${(v / 1000).toFixed(0)}k` : `${v}`)}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ stroke: "#c3c2b7" }} />
          <Area
            type="monotone"
            dataKey="revenue"
            stroke={CHART_BLUE}
            strokeWidth={2}
            fill="url(#reportRevenueFill)"
            activeDot={{ r: 4, fill: CHART_BLUE, stroke: "#fff", strokeWidth: 2 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
