import { notFound } from "next/navigation";
import { slugify } from "@/src/utils/slugify";
import { ProductCategory } from "@/src/types/productCategoriesType";

import CategoryPageClient from "@/src/components/CategoryPage/CategoryPageClient";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

interface ICategoriesApiResponse {
  success: boolean;
  data: ProductCategory[];
}

async function getCategories(baseUrl: string): Promise<ProductCategory[]> {
  try {
    const res = await fetch(`${baseUrl}/product-categories`, {
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

export default async function Page({ params }: PageProps) {
  const { slug: rawSlug } = await params;
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;

  const categories = await getCategories(baseUrl!);

  // Bangla (and other unicode) slugs arrive percent-encoded in the URL;
  // decode before matching. Guard against already-decoded input.
  let slug = rawSlug;
  try {
    slug = decodeURIComponent(rawSlug);
  } catch {
    // rawSlug wasn't percent-encoded; use as-is
  }

  const targetSlug = slug.toLowerCase().trim();

  const foundCategory = categories.find(
    (cat) =>
      cat.slug?.toLowerCase() === targetSlug ||
      slugify(cat.name).toLowerCase() === targetSlug ||
      cat.name?.toLowerCase() === targetSlug.replace(/-/g, " "),
  );

  if (!foundCategory) {
    notFound();
  }

  return (
    <CategoryPageClient
      slug={slug}
      initialCategory={foundCategory}
      allCategories={categories}
    />
  );
}
