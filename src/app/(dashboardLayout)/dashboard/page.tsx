"use client";

import React from "react";

interface MetricCardProps {
  title: string;
  value: string;
  change: string;
  isPositive: boolean;
  bgGradient: string;
  badgeBg: string;
  iconBg: string;
  icon: string;
}

const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  change,
  isPositive,
  bgGradient,
  badgeBg,
  iconBg,
  icon,
}) => (
  <div
    className={`p-5 sm:p-6 rounded-2xl ${bgGradient} text-white shadow-md hover:shadow-lg transition-all duration-300 flex flex-col justify-between relative overflow-hidden group border border-white/20`}
  >
    {/* Background Blur Glow */}
    <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-white/10 rounded-full blur-xl group-hover:scale-150 transition-transform duration-500" />

    <div className="flex items-center justify-between mb-3 z-10">
      <span className="text-xs sm:text-sm font-bold tracking-wide text-white/90">
        {title}
      </span>
      <div
        className={`w-11 h-11 rounded-2xl ${iconBg} flex items-center justify-center text-xl shadow-inner backdrop-blur-md`}
      >
        {icon}
      </div>
    </div>

    <div className="flex items-baseline justify-between mt-2 z-10">
      <span className="text-2xl sm:text-3xl font-black tracking-tight drop-shadow-sm">
        {value}
      </span>
      <span
        className={`text-xs font-extrabold px-3 py-1 rounded-full border border-white/20 shadow-sm ${badgeBg}`}
      >
        {change}
      </span>
    </div>
  </div>
);

const VetDashboard = () => {
  const metrics = [
    {
      title: "Cattle & Goat Meds",
      value: "৳ 284,500",
      change: "+22.4%",
      isPositive: true,
      bgGradient: "bg-gradient-to-br from-emerald-600 via-teal-600 to-teal-700",
      badgeBg: "bg-emerald-400/30 text-white",
      iconBg: "bg-white/20 text-white",
      icon: "🐄",
    },
    {
      title: "Poultry / Chicken Care",
      value: "৳ 142,100",
      change: "+15.8%",
      isPositive: true,
      bgGradient:
        "bg-gradient-to-br from-amber-500 via-orange-500 to-orange-600",
      badgeBg: "bg-amber-300/30 text-white",
      iconBg: "bg-white/20 text-white",
      icon: "🐔",
    },
    {
      title: "Dairy Tools & Milking",
      value: "186 Units",
      change: "+31.0%",
      isPositive: true,
      bgGradient:
        "bg-gradient-to-br from-blue-600 via-indigo-600 to-indigo-700",
      badgeBg: "bg-blue-300/30 text-white",
      iconBg: "bg-white/20 text-white",
      icon: "🥛",
    },
    {
      title: "Cold Chain Vaccines",
      value: "14 Low Stock",
      change: "-8.2%",
      isPositive: false,
      bgGradient: "bg-gradient-to-br from-rose-500 via-pink-600 to-rose-700",
      badgeBg: "bg-rose-300/30 text-white",
      iconBg: "bg-white/20 text-white",
      icon: "💉",
    },
  ];

  // 7 Specific Bengali Veterinary Categories with Product Counts
  const categoryQuickStats = [
    {
      id: "vet-med",
      name: "ভেটেরিনারি মেডিসিন",
      icon: "💊",
      itemCount: 340,
      unit: "টি আইটেম",
      color:
        "bg-emerald-600 text-white shadow-emerald-200 hover:bg-emerald-700",
    },
    {
      id: "vet-surg",
      name: "ভেটেরিনারি সার্জিক্যাল",
      icon: "✂️",
      itemCount: 112,
      unit: "টি আইটেম",
      color: "bg-rose-600 text-white shadow-rose-200 hover:bg-rose-700",
    },
    {
      id: "art-insem",
      name: "কৃত্রিম প্রজনন সামগ্রী",
      icon: "🧪",
      itemCount: 85,
      unit: "টি আইটেম",
      color: "bg-purple-600 text-white shadow-purple-200 hover:bg-purple-700",
    },
    {
      id: "dairy-tools",
      name: "ডেইরি ফার্ম টুলস",
      icon: "🥛",
      itemCount: 195,
      unit: "টি আইটেম",
      color: "bg-blue-600 text-white shadow-blue-200 hover:bg-blue-700",
    },
    {
      id: "dairy-machinery",
      name: "ডেইরি ফার্ম মেশিনারিজ",
      icon: "⚙️",
      itemCount: 48,
      unit: "টি আইটেম",
      color: "bg-indigo-600 text-white shadow-indigo-200 hover:bg-indigo-700",
    },
    {
      id: "poultry-tools",
      name: "পোল্ট্রি ফার্ম টুলস",
      icon: "🐔",
      itemCount: 260,
      unit: "টি আইটেম",
      color: "bg-amber-600 text-white shadow-amber-200 hover:bg-amber-700",
    },
    {
      id: "vet-lab",
      name: "ভেটেরিনারি ল্যাব আইটেম",
      icon: "🔬",
      itemCount: 74,
      unit: "টি আইটেম",
      color: "bg-teal-600 text-white shadow-teal-200 hover:bg-teal-700",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Category Cards Displaying Product Length */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-extrabold text-gray-900">
            পণ্য বিভাগ (Categories & Product Count)
          </h2>
          <span className="text-xs font-bold text-gray-500">
            মোট ক্যাটাগরি: {categoryQuickStats.length} টি
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5">
          {categoryQuickStats.map((cat) => (
            <div
              key={cat.id}
              className={`p-4 rounded-2xl ${cat.color} shadow-md hover:-translate-y-1 transition-all duration-300 flex items-center justify-between cursor-pointer border border-white/10`}
            >
              <div className="flex items-center gap-3.5">
                <span className="text-2xl p-2.5 bg-white/20 rounded-xl backdrop-blur-md shrink-0">
                  {cat.icon}
                </span>
                <div>
                  <p className="font-extrabold text-sm sm:text-base leading-snug">
                    {cat.name}
                  </p>
                  <span className="text-xs text-white/80 font-medium">
                    {cat.itemCount} {cat.unit}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bright Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {metrics.map((metric, index) => (
          <MetricCard key={index} {...metric} />
        ))}
      </div>

      {/* Analytics & Cold Chain Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sales Trend Canvas */}
        <div className="lg:col-span-2 bg-white p-5 sm:p-6 rounded-2xl border border-gray-100 shadow-md flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-extrabold text-gray-900">
                Livestock vs Poultry Sales Trend
              </h2>
              <p className="text-xs font-medium text-gray-500">
                Monthly revenue split across Cattle, Poultry, Goat & Dairy Tools
              </p>
            </div>
            <select className="text-xs border border-teal-200 rounded-xl px-3 py-2 bg-teal-50 font-bold text-teal-800 outline-none focus:ring-2 focus:ring-teal-500">
              <option>This Season</option>
              <option>Full Year</option>
            </select>
          </div>

          <div className="flex-1 min-h-[220px] bg-gradient-to-br from-teal-500/10 via-emerald-500/5 to-amber-500/10 rounded-2xl border-2 border-dashed border-teal-200/80 flex flex-col items-center justify-center p-8 text-center relative overflow-hidden">
            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-teal-500 to-emerald-400 flex items-center justify-center text-white text-2xl shadow-lg mb-3 animate-bounce">
              📈
            </div>
            <p className="text-gray-900 font-extrabold text-base">
              Interactive Analytics Area
            </p>
            <p className="text-xs text-gray-500 max-w-xs mt-1 font-medium">
              Ready for Recharts integration (Cattle, Poultry, and Vaccine sales
              plots).
            </p>
          </div>
        </div>

        {/* Cold Chain / Vaccine Temperature Alert Panel */}
        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-rose-100 shadow-md">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-extrabold text-gray-900">
              Cold Chain Monitor
            </h2>
            <span className="text-xs font-black text-rose-700 bg-rose-100 border border-rose-200 px-3 py-1 rounded-full animate-pulse shadow-sm">
              2°C - 8°C Alert
            </span>
          </div>

          <div className="space-y-3">
            <div className="p-3.5 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl border border-emerald-200/60 flex items-center justify-between">
              <div>
                <p className="font-extrabold text-gray-900 text-xs sm:text-sm">
                  FMD Vaccine (Cattle)
                </p>
                <span className="text-[11px] text-teal-700 font-semibold">
                  Fridge A • 4.2°C (Optimal)
                </span>
              </div>
              <span className="text-xs font-black text-emerald-800 bg-emerald-200/80 px-2.5 py-1 rounded-lg">
                Stable
              </span>
            </div>

            <div className="p-3.5 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border border-amber-200/60 flex items-center justify-between">
              <div>
                <p className="font-extrabold text-gray-900 text-xs sm:text-sm">
                  Gumboro Vaccine (Poultry)
                </p>
                <span className="text-[11px] text-amber-800 font-semibold">
                  Freezer B • 7.8°C (Warning)
                </span>
              </div>
              <span className="text-xs font-black text-amber-800 bg-amber-200/80 px-2.5 py-1 rounded-lg">
                Check Temp
              </span>
            </div>

            <div className="p-3.5 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl border border-emerald-200/60 flex items-center justify-between">
              <div>
                <p className="font-extrabold text-gray-900 text-xs sm:text-sm">
                  Anthrax Spore Vaccine
                </p>
                <span className="text-[11px] text-teal-700 font-semibold">
                  Fridge A • 3.5°C (Optimal)
                </span>
              </div>
              <span className="text-xs font-black text-emerald-800 bg-emerald-200/80 px-2.5 py-1 rounded-lg">
                Stable
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VetDashboard;
