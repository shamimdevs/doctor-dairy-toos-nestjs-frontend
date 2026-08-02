const shimmerBlock = (className: string) => (
  <div
    className={`bg-linear-to-r from-slate-200 via-slate-300 to-slate-200 animate-shimmer rounded ${className}`}
  />
);

export default function Loading() {
  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 py-6 md:py-10">
      {/* Back Button */}
      {shimmerBlock("w-28 h-5 mb-6")}

      {/* Category / Featured badges */}
      <div className="flex gap-3 mb-4">
        {shimmerBlock("w-24 h-7 rounded-full")}
        {shimmerBlock("w-20 h-7 rounded-full")}
      </div>

      {/* Title */}
      <div className="space-y-3 mb-4">
        {shimmerBlock("w-full h-10")}
        {shimmerBlock("w-2/3 h-10")}
      </div>

      {/* Meta Info */}
      <div className="flex flex-wrap items-center gap-4 mb-6 pb-6 border-b border-slate-200">
        {shimmerBlock("w-28 h-4")}
        {shimmerBlock("w-24 h-4")}
        {shimmerBlock("w-20 h-4")}
      </div>

      {/* Featured Image */}
      <div className="relative w-full aspect-video rounded-2xl overflow-hidden mb-8">
        {shimmerBlock("absolute inset-0 rounded-2xl")}
      </div>

      {/* Main Content */}
      <div className="space-y-2 mb-10">
        {shimmerBlock("w-full h-4")}
        {shimmerBlock("w-full h-4")}
        {shimmerBlock("w-full h-4")}
        {shimmerBlock("w-3/4 h-4")}
      </div>

      {/* Blog Sections */}
      <div className="mt-10 pt-8 border-t border-slate-200">
        {shimmerBlock("w-48 h-7 mb-6")}
        <div className="space-y-8">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="bg-white rounded-xl p-6 shadow-sm border border-slate-100 space-y-3"
            >
              {shimmerBlock("w-1/2 h-6")}
              {i === 1 && shimmerBlock("w-full h-48 rounded-lg")}
              {shimmerBlock("w-full h-4")}
              {shimmerBlock("w-full h-4")}
              {shimmerBlock("w-2/3 h-4")}
            </div>
          ))}
        </div>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mt-8 pt-6 border-t border-slate-200">
        {[1, 2, 3].map((i) => (
          <div key={i}>{shimmerBlock("w-16 h-7 rounded-full")}</div>
        ))}
      </div>

      {/* Author Section */}
      <div className="flex items-center gap-4 mt-8 p-6 rounded-2xl border border-slate-100">
        {shimmerBlock("w-14 h-14 rounded-full shrink-0")}
        <div className="flex-1 space-y-2">
          {shimmerBlock("w-32 h-4")}
          {shimmerBlock("w-48 h-3")}
        </div>
      </div>

      {/* Related Posts */}
      <div className="mt-8 pt-6 border-t border-slate-200">
        {shimmerBlock("w-40 h-6 mb-4")}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="rounded-xl overflow-hidden border border-slate-100"
            >
              <div className="relative w-full h-40">
                {shimmerBlock("absolute inset-0")}
              </div>
              <div className="p-4 space-y-2">
                {shimmerBlock("w-full h-4")}
                {shimmerBlock("w-1/2 h-3")}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Call to Action */}
      <div className="flex flex-wrap items-center justify-between gap-4 mt-8 pt-6 border-t border-slate-200">
        <div className="space-y-2">
          {shimmerBlock("w-40 h-5")}
          {shimmerBlock("w-56 h-4")}
        </div>
        {shimmerBlock("w-32 h-11 rounded-xl")}
      </div>
    </article>
  );
}
