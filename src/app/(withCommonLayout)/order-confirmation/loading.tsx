const shimmerBlock = (className: string) => (
  <div
    className={`bg-linear-to-r from-slate-200 via-slate-300 to-slate-200 animate-shimmer rounded ${className}`}
  />
);

export default function Loading() {
  return (
    <div className="min-h-screen bg-linear-to-b from-emerald-50 to-slate-50 py-8">
      <div className="container mx-auto px-4 max-w-5xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          {shimmerBlock("w-32 h-5")}
          {shimmerBlock("w-40 h-7")}
          <div className="w-24" />
        </div>

        {/* Success Banner */}
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-emerald-100 mb-6 flex flex-col items-center">
          {shimmerBlock("w-20 h-20 rounded-full mb-4")}
          {shimmerBlock("w-64 h-7 mb-3")}
          {shimmerBlock("w-80 max-w-full h-4 mb-2")}
          {shimmerBlock("w-72 max-w-full h-4 mb-4")}
          {shimmerBlock("w-48 h-9 rounded-lg mb-2")}
          {shimmerBlock("w-56 h-3")}
        </div>

        {/* Order Progress */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 mb-6">
          {shimmerBlock("w-32 h-4 mb-6")}
          <div className="flex justify-between">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex flex-col items-center gap-2">
                {shimmerBlock("w-10 h-10 rounded-full")}
                {shimmerBlock("w-14 h-3")}
              </div>
            ))}
          </div>
        </div>

        {/* Estimated Delivery */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 mb-6">
          <div className="flex items-center gap-4">
            {shimmerBlock("w-12 h-12 rounded-xl shrink-0")}
            <div className="flex-1 space-y-2">
              {shimmerBlock("w-40 h-4")}
              {shimmerBlock("w-56 h-6")}
              {shimmerBlock("w-full h-1.5 rounded-full mt-2")}
            </div>
          </div>
        </div>

        {/* Order Items & Summary Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Items Ordered */}
          <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            {shimmerBlock("w-40 h-4 mb-4")}
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="flex gap-4 pb-4 border-b border-slate-100 last:border-0 last:pb-0"
                >
                  {shimmerBlock("w-20 h-20 rounded-xl shrink-0")}
                  <div className="flex-1 space-y-2">
                    {shimmerBlock("w-3/4 h-4")}
                    <div className="flex justify-between">
                      {shimmerBlock("w-24 h-3")}
                      {shimmerBlock("w-16 h-4")}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1 bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            {shimmerBlock("w-40 h-4 mb-4")}
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex justify-between">
                  {shimmerBlock("w-20 h-4")}
                  {shimmerBlock("w-14 h-4")}
                </div>
              ))}
              <div className="border-t border-slate-200 pt-3 mt-2 flex justify-between">
                {shimmerBlock("w-14 h-5")}
                {shimmerBlock("w-20 h-7")}
              </div>
            </div>
          </div>
        </div>

        {/* Payment & Delivery Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 space-y-3"
            >
              {shimmerBlock("w-24 h-4")}
              <div className="flex items-center justify-between">
                {shimmerBlock("w-32 h-4")}
                {shimmerBlock("w-20 h-6 rounded-full")}
              </div>
            </div>
          ))}
        </div>

        {/* Shipping Address */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 mt-6 space-y-2">
          {shimmerBlock("w-36 h-4 mb-2")}
          {shimmerBlock("w-40 h-4")}
          {shimmerBlock("w-32 h-4")}
          {shimmerBlock("w-48 h-4")}
          {shimmerBlock("w-56 h-4")}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 mt-6">
          {shimmerBlock("w-44 h-12 rounded-xl")}
          {shimmerBlock("w-32 h-12 rounded-xl")}
          {shimmerBlock("w-40 h-12 rounded-xl ml-auto")}
        </div>

        {/* Help & Support */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex items-center gap-4"
            >
              {shimmerBlock("w-10 h-10 rounded-lg shrink-0")}
              <div className="space-y-2 flex-1">
                {shimmerBlock("w-28 h-4")}
                {shimmerBlock("w-36 h-3")}
              </div>
            </div>
          ))}
        </div>

        {/* Need Help */}
        <div className="flex justify-center mt-8">
          {shimmerBlock("w-48 h-4")}
        </div>
      </div>
    </div>
  );
}
