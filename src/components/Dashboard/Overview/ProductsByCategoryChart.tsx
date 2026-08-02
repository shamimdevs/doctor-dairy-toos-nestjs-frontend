"use client";

import { useMemo } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Product } from "@/src/types/productsType";

interface ProductsByCategoryChartProps {
  products: Product[];
}

// Revenue trend already owns the sequential blue hue; a second magnitude
// chart on the same screen takes the next categorical slot (orange) as its
// own one-hue ramp, per the sequential-color rule.
const CHART_ORANGE = "#eb6834";
const MAX_CATEGORIES = 8;

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
        {payload[0].value} products
      </p>
    </div>
  );
}

export default function ProductsByCategoryChart({
  products,
}: ProductsByCategoryChartProps) {
  const data = useMemo(() => {
    const counts = new Map<string, number>();
    products.forEach((product) => {
      const name = product.category?.name || "Uncategorized";
      counts.set(name, (counts.get(name) || 0) + 1);
    });

    const sorted = Array.from(counts.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);

    if (sorted.length <= MAX_CATEGORIES) return sorted;

    const top = sorted.slice(0, MAX_CATEGORIES - 1);
    const otherCount = sorted
      .slice(MAX_CATEGORIES - 1)
      .reduce((sum, c) => sum + c.count, 0);
    return [...top, { name: "Other", count: otherCount }];
  }, [products]);

  if (products.length === 0) {
    return (
      <div className="h-64 flex flex-col items-center justify-center text-center p-6">
        <p className="text-gray-900 font-bold text-sm">No products yet</p>
        <p className="text-xs text-gray-500 mt-1">
          Product distribution by category will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%" minHeight={240}>
        <BarChart
          data={data}
          margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
        >
          <CartesianGrid
            vertical={false}
            stroke="#e1e0d9"
            strokeDasharray="3 3"
          />
          <XAxis
            dataKey="name"
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
            width={32}
            allowDecimals={false}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: "#f9f9f7" }} />
          <Bar dataKey="count" fill={CHART_ORANGE} radius={[4, 4, 0, 0]} maxBarSize={40} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
