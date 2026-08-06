"use client";

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { ICategorySales } from "@/src/redux/api/reportsApi";

interface CategorySalesChartProps {
  data: ICategorySales[];
}

// Revenue trend already owns the sequential blue on this page, so this
// second magnitude chart takes the next categorical slot (orange) — same
// convention the dashboard overview's category chart uses.
const CHART_ORANGE = "#eb6834";
const MAX_CATEGORIES = 8;

function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: { payload: { quantity: number }; value: number }[];
  label?: string;
}) {
  if (!active || !payload || payload.length === 0) return null;
  return (
    <div className="rounded-lg border border-black/10 bg-white px-3 py-2 shadow-md">
      <p className="text-xs font-semibold text-gray-500">{label}</p>
      <p className="text-sm font-bold text-gray-900">
        ৳{payload[0].value.toLocaleString()}
      </p>
      <p className="text-xs text-gray-500">{payload[0].payload.quantity} units sold</p>
    </div>
  );
}

export default function CategorySalesChart({ data }: CategorySalesChartProps) {
  if (data.length === 0) {
    return (
      <div className="h-64 flex flex-col items-center justify-center text-center p-6">
        <p className="text-gray-900 font-bold text-sm">No sales in this range</p>
      </div>
    );
  }

  const sorted = [...data].sort((a, b) => b.revenue - a.revenue);
  const chartData =
    sorted.length <= MAX_CATEGORIES
      ? sorted
      : [
          ...sorted.slice(0, MAX_CATEGORIES - 1),
          sorted.slice(MAX_CATEGORIES - 1).reduce(
            (acc, c) => ({
              category_id: "other",
              category_name: "Other",
              revenue: acc.revenue + c.revenue,
              quantity: acc.quantity + c.quantity,
            }),
            { category_id: "other", category_name: "Other", revenue: 0, quantity: 0 },
          ),
        ];

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%" minHeight={240}>
        <BarChart data={chartData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid vertical={false} stroke="#e1e0d9" strokeDasharray="3 3" />
          <XAxis
            dataKey="category_name"
            tick={{ fontSize: 10, fill: "#898781" }}
            axisLine={{ stroke: "#c3c2b7" }}
            tickLine={false}
            interval={0}
            angle={-20}
            textAnchor="end"
            height={50}
          />
          <YAxis
            tick={{ fontSize: 11, fill: "#898781" }}
            axisLine={false}
            tickLine={false}
            width={44}
            tickFormatter={(v) => (v >= 1000 ? `${(v / 1000).toFixed(0)}k` : `${v}`)}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: "#f9f9f7" }} />
          <Bar dataKey="revenue" fill={CHART_ORANGE} radius={[4, 4, 0, 0]} maxBarSize={40} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
