"use client";

import { Bar, BarChart, Cell, LabelList, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export interface StatusBreakdownEntry {
  key: string;
  label: string;
  color: string;
  count: number;
}

interface StatusBreakdownChartProps {
  data: StatusBreakdownEntry[];
  unitLabel?: string;
}

function CustomTooltip({
  active,
  payload,
  unitLabel = "orders",
}: {
  active?: boolean;
  payload?: { payload: StatusBreakdownEntry }[];
  unitLabel?: string;
}) {
  if (!active || !payload || payload.length === 0) return null;
  const { label, count } = payload[0].payload;
  return (
    <div className="rounded-lg border border-black/10 bg-white px-3 py-2 shadow-md">
      <p className="text-xs font-semibold text-gray-500">{label}</p>
      <p className="text-sm font-bold text-gray-900">
        {count} {unitLabel}
      </p>
    </div>
  );
}

// Reusable horizontal bar for any status-shaped breakdown (order status,
// payment status). Colors are passed in by the caller so each dimension can
// reuse this app's reserved status palette (good/warning/critical) rather
// than this component inventing its own.
export default function StatusBreakdownChart({
  data,
  unitLabel = "orders",
}: StatusBreakdownChartProps) {
  const hasData = data.some((d) => d.count > 0);

  if (!hasData) {
    return (
      <div className="h-55 flex flex-col items-center justify-center text-center p-6">
        <p className="text-gray-900 font-bold text-sm">No data in this range</p>
      </div>
    );
  }

  return (
    <div className="h-55 w-full">
      <ResponsiveContainer width="100%" height="100%" minHeight={220}>
        <BarChart data={data} layout="vertical" margin={{ top: 0, right: 24, left: 0, bottom: 0 }}>
          <XAxis type="number" hide />
          <YAxis
            dataKey="label"
            type="category"
            tick={{ fontSize: 12, fill: "#52514e", fontWeight: 600 }}
            axisLine={false}
            tickLine={false}
            width={80}
          />
          <Tooltip
            content={<CustomTooltip unitLabel={unitLabel} />}
            cursor={{ fill: "#f9f9f7" }}
          />
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
