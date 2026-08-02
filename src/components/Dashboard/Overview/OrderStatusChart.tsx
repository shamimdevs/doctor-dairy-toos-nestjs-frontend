"use client";

import { useMemo } from "react";
import {
  Bar,
  BarChart,
  Cell,
  LabelList,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { IOrder } from "@/src/redux/api/orderApi";

interface OrderStatusChartProps {
  orders: IOrder[];
}

// Order status is genuine application state, so it uses the reserved status
// palette (good/warning/critical) rather than generic categorical hues.
// "Processing" isn't inherently good/bad/critical, so it takes the
// sequential-chart blue instead of borrowing a status role it doesn't own.
const STATUS_CONFIG = [
  { key: "pending", label: "Pending", color: "#fab219" },
  { key: "processing", label: "Processing", color: "#2a78d6" },
  { key: "delivered", label: "Delivered", color: "#0ca30c" },
  { key: "cancelled", label: "Cancelled", color: "#d03b3b" },
];

function CustomTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: { payload: { label: string; count: number } }[];
}) {
  if (!active || !payload || payload.length === 0) return null;
  const { label, count } = payload[0].payload;
  return (
    <div className="rounded-lg border border-black/10 bg-white px-3 py-2 shadow-md">
      <p className="text-xs font-semibold text-gray-500">{label}</p>
      <p className="text-sm font-bold text-gray-900">{count} orders</p>
    </div>
  );
}

export default function OrderStatusChart({ orders }: OrderStatusChartProps) {
  const data = useMemo(() => {
    const counts: Record<string, number> = {};
    orders.forEach((order) => {
      const status = (order.order_status || "pending").toLowerCase();
      counts[status] = (counts[status] || 0) + 1;
    });

    return STATUS_CONFIG.map((s) => ({
      ...s,
      count: counts[s.key] || 0,
    }));
  }, [orders]);

  if (orders.length === 0) {
    return (
      <div className="h-55 flex flex-col items-center justify-center text-center p-6">
        <p className="text-gray-900 font-bold text-sm">No orders yet</p>
        <p className="text-xs text-gray-500 mt-1">
          Order status breakdown will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="h-55 w-full">
      <ResponsiveContainer width="100%" height="100%" minHeight={220}>
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 0, right: 24, left: 0, bottom: 0 }}
        >
          <XAxis type="number" hide />
          <YAxis
            dataKey="label"
            type="category"
            tick={{ fontSize: 12, fill: "#52514e", fontWeight: 600 }}
            axisLine={false}
            tickLine={false}
            width={80}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: "#f9f9f7" }} />
          <Bar dataKey="count" radius={[0, 4, 4, 0]} maxBarSize={22}>
            {data.map((entry) => (
              <Cell key={entry.key} fill={entry.color} />
            ))}
            <LabelList
              dataKey="count"
              position="right"
              style={{ fontSize: 12, fontWeight: 700, fill: "#0b0b0b" }}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
