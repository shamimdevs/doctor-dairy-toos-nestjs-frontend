// "use client";

// import { useState } from "react";
// import Link from "next/link";
// import Image from "next/image";
// import { IProductCategory } from "@/src/types/productCategoriesType";
// import { slugify } from "@/src/utils/slugify";

// interface CategoryCardProps {
//   category: IProductCategory;
// }

// export default function CategoryCard({ category }: CategoryCardProps) {
//   const [isImageLoading, setIsImageLoading] = useState(true);

//   const slug = slugify(category?.name || "");
//   const targetPath = slug === "home" ? "/" : `/category/${slug}`;

//   return (
//     <Link
//       href={targetPath}
//       className="shrink-0 w-36 sm:w-40 bg-white border border-slate-200 rounded-2xl p-2 flex flex-col items-center justify-center text-center transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg hover:border-emerald-200 group"
//     >
//       <div className="relative w-16 h-16 md:w-24 md:h-24 mb-2 rounded-xl  flex items-center justify-center overflow-hidden transition-all duration-300 group-hover:scale-105 ">
//         {isImageLoading && (
//           <div className="absolute inset-0 bg-slate-100 animate-pulse rounded-xl" />
//         )}
//         <Image
//           src={category?.image}
//           alt={category?.name || "Category"}
//           fill
//           sizes="(max-width: 768px) 64px, 80px"
//           className={`object-contain p-2 transition-all duration-300 ${
//             isImageLoading ? "opacity-0 scale-95" : "opacity-100 scale-100"
//           }`}
//           onLoad={() => setIsImageLoading(false)}
//           unoptimized
//         />
//       </div>

//       <div className="w-full">
//         <h3 className="text-xs  font-bold text-slate-700 tracking-tight transition-colors group-hover:text-emerald-600 px-0.5">
//           {category?.name}
//         </h3>
//       </div>
//     </Link>
//   );
// }

// src/components/HomePage/CategorySection/CategoryCard.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { IProductCategory } from "@/src/types/productCategoriesType";

interface CategoryCardProps {
  category: IProductCategory;
}

export default function CategoryCard({ category }: CategoryCardProps) {
  const [isImageLoading, setIsImageLoading] = useState(true);

  // ✅ সরাসরি category.slug ব্যবহার করুন
  const targetPath = `/category/${category.slug}`;

  return (
    <Link
      href={targetPath}
      className="shrink-0 w-36 sm:w-40 bg-white border border-slate-200 rounded-2xl p-2 flex flex-col items-center justify-center text-center transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg hover:border-emerald-200 group"
    >
      {/* ইমেজ কন্টেইনার */}
      <div className="relative w-16 h-16 md:w-24 md:h-24 mb-2 rounded-xl flex items-center justify-center overflow-hidden transition-all duration-300 group-hover:scale-105">
        {isImageLoading && (
          <div className="absolute inset-0 bg-slate-100 animate-pulse rounded-xl" />
        )}
        <Image
          src={category?.image || "/placeholder-category.png"}
          alt={category?.name || "Category"}
          fill
          sizes="(max-width: 768px) 64px, 80px"
          className={`object-contain p-2 transition-all duration-300 ${
            isImageLoading ? "opacity-0 scale-95" : "opacity-100 scale-100"
          }`}
          onLoad={() => setIsImageLoading(false)}
          onError={() => setIsImageLoading(false)}
          unoptimized
        />
      </div>

      {/* ক্যাটাগরি নাম */}
      <div className="w-full">
        <h3 className="text-xs font-bold text-slate-700 tracking-tight transition-colors group-hover:text-emerald-600 px-0.5">
          {category?.name}
        </h3>
      </div>
    </Link>
  );
}
