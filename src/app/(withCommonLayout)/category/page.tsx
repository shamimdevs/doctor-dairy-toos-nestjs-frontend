import CategoryCard from "@/src/components/HomePage/CategorySection/CategoryCard";
import { ProductCategory } from "@/src/types/productCategoriesType";

interface ICategoriesApiResponse {
  success: boolean;
  data: ProductCategory[];
}

async function getCategories(baseUrl: string): Promise<ProductCategory[]> {
  try {
    const res = await fetch(`${baseUrl}/product-categories?limit=100`, {
      next: { revalidate: 30 },
    });
    if (!res.ok) return [];
    const result: ICategoriesApiResponse = await res.json();
    return result.data || [];
  } catch (error) {
    console.error("Server Category Fetch Error:", error);
    return [];
  }
}

export default async function AllCategoriesPage() {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  const categories = baseUrl ? await getCategories(baseUrl) : [];

  return (
    <section className="container py-6 sm:py-16">
      <h1 className="text-lg sm:text-xl md:text-2xl font-extrabold text-slate-900 tracking-tight mb-4 sm:mb-6">
        All Categories
      </h1>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
        {categories?.map((category) => (
          <CategoryCard key={category.id} category={category} />
        ))}
      </div>
    </section>
  );
}
