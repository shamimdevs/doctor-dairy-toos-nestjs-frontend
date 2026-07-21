// src/app/wishlist/loading.tsx
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

// ✅ Use default export (not named export)
export default function Loading() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="container py-8">
        <div className="flex items-center gap-2 mb-6">
          <Link
            href="/"
            className="p-2 hover:bg-white rounded-xl transition-colors"
          >
            <ChevronLeft size={20} />
          </Link>
          <h1 className="text-2xl font-extrabold text-slate-900">
            My Wishlist
          </h1>
        </div>
        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-slate-200 animate-pulse"
            >
              <div className="w-20 h-20 bg-slate-200 rounded-xl shrink-0"></div>
              <div className="flex-1 space-y-2">
                <div className="w-3/4 h-5 bg-slate-200 rounded"></div>
                <div className="w-20 h-4 bg-slate-200 rounded"></div>
                <div className="w-32 h-3 bg-slate-200 rounded"></div>
              </div>
              <div className="w-10 h-10 bg-slate-200 rounded-xl"></div>
              <div className="w-10 h-10 bg-slate-200 rounded-xl"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
