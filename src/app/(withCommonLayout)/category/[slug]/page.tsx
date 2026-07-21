/* eslint-disable @typescript-eslint/no-explicit-any */
import { notFound } from "next/navigation";
import { slugify } from "@/src/utils/slugify";
import { IProductCategory } from "@/src/types/productCategoriesType";
import CategoryPageClient from "@/src/components/CategoryPage/CategoryPageClient";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

interface ICategoriesApiResponse {
  success: boolean;
  data: IProductCategory[];
}

interface IProductsApiResponse {
  success: boolean;
  data: any;
}

async function getCategories(baseUrl: string): Promise<IProductCategory[]> {
  try {
    const res = await fetch(`${baseUrl}/product-categories`, {
      next: { revalidate: 100 },
    });
    if (!res.ok) return [];
    const result: ICategoriesApiResponse = await res.json();
    return result.data || [];
  } catch (error) {
    console.error("Server Category Fetch Error:", error);
    return [];
  }
}

async function getAllProducts(baseUrl: string): Promise<any[]> {
  try {
    const res = await fetch(`${baseUrl}/products?limit=150`, {
      cache: "no-store",
    });
    if (!res.ok) return [];
    const result: IProductsApiResponse = await res.json();

    const rawData = result?.data;
    if (
      rawData &&
      typeof rawData === "object" &&
      "data" in rawData &&
      Array.isArray(rawData.data)
    ) {
      return rawData.data;
    }
    return Array.isArray(rawData) ? rawData : [];
  } catch (error) {
    console.error("Server Product Fetch Error:", error);
    return [];
  }
}

export default async function Page({ params }: PageProps) {
  const { slug } = await params;
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;

  const [categories, allProducts] = await Promise.all([
    getCategories(baseUrl!),
    getAllProducts(baseUrl!),
  ]);

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
      allProducts={allProducts}
      allCategories={categories}
    />
  );
}
