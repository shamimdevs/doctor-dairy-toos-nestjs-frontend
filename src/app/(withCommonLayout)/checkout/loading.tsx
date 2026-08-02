const shimmerBlock = (className: string) => (
  <div
    className={`bg-linear-to-r from-slate-200 via-slate-300 to-slate-200 animate-shimmer rounded ${className}`}
  />
);

const formFieldSkeleton = (key: number, tall = false) => (
  <div key={key} className="space-y-1.5">
    {shimmerBlock("w-24 h-3")}
    {shimmerBlock(`w-full ${tall ? "h-20" : "h-11"} rounded-xl`)}
  </div>
);

export default function Loading() {
  return (
    <div className="bg-slate-50 min-h-screen py-6">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header Navigation */}
        <div className="flex items-center justify-between mb-6">
          {shimmerBlock("w-32 h-5")}
          {shimmerBlock("w-24 h-7")}
          <div className="w-24" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Customer Form & Shipping Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Info Card */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
              {shimmerBlock("w-36 h-6 mb-4")}
              <div className="space-y-4">
                {formFieldSkeleton(1)}
                {formFieldSkeleton(2)}
                {formFieldSkeleton(3, true)}
                {formFieldSkeleton(4, true)}
              </div>
            </div>

            {/* Delivery & Payment Card */}
            <div className="bg-white rounded-2xl md:p-6 p-4 shadow-sm border border-slate-100">
              {shimmerBlock("w-52 h-6 mb-4")}
              <div className="p-4 border-2 border-slate-100 rounded-xl space-y-3">
                <div className="flex items-start gap-4">
                  {shimmerBlock("w-12 h-12 rounded-xl shrink-0 hidden md:block")}
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      {shimmerBlock("w-40 h-5")}
                      {shimmerBlock("w-16 h-6 rounded-full")}
                    </div>
                    {shimmerBlock("w-full h-10 rounded-lg")}
                    {shimmerBlock("w-2/3 h-3")}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Order Summary Side Panel */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
              {shimmerBlock("w-44 h-6 mb-4")}

              {/* Cart items */}
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100"
                  >
                    {shimmerBlock("w-14 h-14 rounded-lg shrink-0")}
                    <div className="flex-1 space-y-2">
                      {shimmerBlock("w-3/4 h-4")}
                      {shimmerBlock("w-16 h-3")}
                      <div className="flex items-center justify-between">
                        {shimmerBlock("w-20 h-6 rounded-lg")}
                        {shimmerBlock("w-10 h-3")}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-3 py-4 border-t border-slate-200 mt-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex justify-between items-center">
                    {shimmerBlock("w-20 h-4")}
                    {shimmerBlock("w-14 h-4")}
                  </div>
                ))}
              </div>

              {/* Total */}
              <div className="pt-3 border-t border-slate-200 flex justify-between items-center">
                {shimmerBlock("w-24 h-5")}
                {shimmerBlock("w-20 h-7")}
              </div>

              {/* Submit Button */}
              {shimmerBlock("w-full h-13 rounded-xl mt-5")}
              {shimmerBlock("w-3/4 h-3 mx-auto mt-3")}

              {/* Trust Badges */}
              <div className="flex justify-center gap-4 mt-5 pt-4 border-t border-slate-100">
                {[1, 2, 3].map((i) => (
                  <div key={i}>{shimmerBlock("w-16 h-3")}</div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
