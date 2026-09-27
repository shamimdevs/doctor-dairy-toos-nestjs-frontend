import type { MetadataRoute } from "next";

const baseUrl = "https://doctordairytools.com";
const apiUrl = process.env.NEXT_PUBLIC_API_URL!;

type Product = {
  id: string;
  name: string;
  slug: string;
  updatedAt?: string;
  isActive?: boolean;
};

async function fetchProducts(): Promise<Product[]> {
  try {
    const res = await fetch(`${apiUrl}/products`, {
      next: { revalidate: 20 },
    });

    if (!res.ok) {
      console.error("Failed to fetch products:", res.status);
      return [];
    }

    const result = await res.json();

    // If API returns { data: [...] }
    if (Array.isArray(result?.data)) {
      return result.data;
    }

    // If API directly returns [...]
    if (Array.isArray(result)) {
      return result;
    }

    return [];
  } catch (error) {
    console.error("Sitemap product fetch error:", error);
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = await fetchProducts();

  /*
   * Static pages
   */
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },

    {
      url: `${baseUrl}/products`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },

    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },

    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },

    /*
     * Categories
     */
    {
      url: `${baseUrl}/category/ভেটেরিনারি-সার্জিক্যাল`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },

    {
      url: `${baseUrl}/category/কৃত্রিম-প্রজনন-সামগ্রী`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },

    {
      url: `${baseUrl}/category/ডেইরি-ফার্ম-টুলস`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },

    {
      url: `${baseUrl}/category/ডেইরি-ফার্ম-মেশিনারিজ`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },

    {
      url: `${baseUrl}/category/ভেটেরিনারি-সিরিঞ্জ-কালেকশন`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },

    {
      url: `${baseUrl}/category/পোল্ট্রি-ফার্ম-টুলস`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },

    {
      url: `${baseUrl}/category/ভেটেরিনারি-ল্যাব-আইটেম`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },

    {
      url: `${baseUrl}/category/পেট-শপ`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
  ];

  /*
   * Product pages
   */
  const productPages: MetadataRoute.Sitemap = products
    .filter((product) => product.slug)
    .filter((product) => product.isActive !== false)
    .map((product) => ({
      url: `${baseUrl}/product/${encodeURIComponent(product.slug)}`,
      lastModified: product.updatedAt
        ? new Date(product.updatedAt)
        : new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }));

  return [...staticPages, ...productPages];
}
