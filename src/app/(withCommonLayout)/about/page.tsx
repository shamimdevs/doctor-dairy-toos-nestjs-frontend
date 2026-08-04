import type { Metadata } from "next";
import AboutPage from "@/src/components/About/AboutPage";
import { ProductCategory } from "@/src/types/productCategoriesType";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Learn about Doctor Dairy Tools — Bangladesh's trusted online source for veterinary surgical instruments, AI supplies, dairy farm tools, and poultry equipment.",
};

interface ICategoriesApiResponse {
  apiVersion: string;
  success: boolean;
  message: string;
  status: number;
  data: ProductCategory[];
}

async function fetchCategories(baseUrl: string) {
  const res = await fetch(`${baseUrl}/product-categories`, {
    next: { revalidate: 100 },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch categories");
  }

  const result: ICategoriesApiResponse = await res.json();
  return result.data || [];
}

const Page = async () => {
  let categories: ProductCategory[] = [];
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;

  if (baseUrl) {
    try {
      categories = await fetchCategories(baseUrl);
    } catch (error) {
      console.error("Failed to fetch product categories:", error);
      categories = [];
    }
  }

  return <AboutPage categories={categories} />;
};

export default Page;
