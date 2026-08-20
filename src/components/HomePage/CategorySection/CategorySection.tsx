import Link from "next/link";
import CategoryCard from "./CategoryCard";
import { ProductCategory } from "@/src/types/productCategoriesType";

interface CategorySectionProps {
  categories: ProductCategory[];
}

export default function CategorySection({
  categories = [],
}: CategorySectionProps) {
  return (
    <section className="container py-6 sm:py-8">
      {/* Header Panel */}
      <div className="flex items-center justify-between gap-2 mb-3 sm:mb-4">
        <h2 className="text-lg sm:text-xl md:text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
          Shop by Category
        </h2>
      </div>

      {/* Category Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
        {categories?.map((category) => (
          <CategoryCard key={category.id} category={category} />
        ))}
      </div>

      {/* View All */}
      <div className="flex justify-center mt-5 sm:mt-6">
        <Link
          href="/category"
          className="px-6 py-2.5 rounded-xl border border-emerald-600  font-bold text-sm bg-emerald-600 hover:scale-105 duration-300 ease-in-out  text-white  transition-all"
        >
          View All Categories
        </Link>
      </div>
    </section>
  );
}
