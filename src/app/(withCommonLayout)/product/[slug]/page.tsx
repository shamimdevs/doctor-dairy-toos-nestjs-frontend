import type { Metadata } from "next";

import ProductDetailsClient from "@/src/components/product/ProductDetailsClient";
import { getProductBySlug } from "@/src/components/services/product.service";

import { notFound } from "next/navigation";
import { Product } from "@/src/types/product";

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

const baseUrl = "https://doctordairytools.com";

/**
 * Fetch product
 */
async function fetchProduct(slug: string): Promise<Product | null> {
  try {
    const response = await getProductBySlug(slug);

    return response?.data?.data ?? null;
  } catch (error) {
    console.error("Failed to fetch product:", error);
    return null;
  }
}

/**
 * Dynamic SEO Metadata
 */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;

  const product = await fetchProduct(slug);

  if (!product) {
    return {
      title: "Product Not Found | Doctor Dairy Tools",
      description:
        "The requested product could not be found on Doctor Dairy Tools.",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const productName = product.name;

  /*
   * Remove HTML from description
   */
  const cleanDescription =
    product.description
      ?.replace(/<[^>]*>/g, "")
      .replace(/\s+/g, " ")
      .trim() || "";

  /*
   * SEO Title
   */
  const title =
    product.meta_title?.trim() || `${productName} | Doctor Dairy Tools`;

  /*
   * SEO Description
   */
  const description =
    product.meta_description?.trim() ||
    cleanDescription.slice(0, 160) ||
    `${productName} available at Doctor Dairy Tools. Shop dairy farm equipment, veterinary tools and livestock supplies across Bangladesh.`;

  /*
   * Canonical URL
   */
  const canonicalUrl = `${baseUrl}/product/${encodeURIComponent(
    product.slug || slug,
  )}`;

  /*
   * Product Image
   */
  const imageUrl = product.thumbnail
    ? product.thumbnail.startsWith("http")
      ? product.thumbnail
      : `${baseUrl}${product.thumbnail}`
    : `${baseUrl}/og-image.jpg`;

  /*
   * Meta Keywords
   */
  const keywords = product.meta_keywords
    ? product.meta_keywords
        .split(",")
        .map((keyword) => keyword.trim())
        .filter(Boolean)
    : [productName];

  return {
    title,
    description,
    keywords,

    authors: [
      {
        name: "Doctor Dairy Tools",
      },
    ],

    creator: "Doctor Dairy Tools",
    publisher: "Doctor Dairy Tools",

    alternates: {
      canonical: canonicalUrl,
    },

    robots: {
      index: product.is_active,
      follow: true,

      googleBot: {
        index: product.is_active,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },

    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: "Doctor Dairy Tools",
      locale: "bn_BD",
      type: "website",

      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: productName,
        },
      ],
    },

    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
  };
}

/**
 * Product Page
 */
export default async function ProductDetailsPage({ params }: Props) {
  const { slug } = await params;

  const product = await fetchProduct(slug);

  if (!product) {
    notFound();
  }

  /*
   * Product Structured Data
   */
  const productUrl = `${baseUrl}/product/${encodeURIComponent(product.slug)}`;

  const imageUrl = product.thumbnail
    ? product.thumbnail.startsWith("http")
      ? product.thumbnail
      : `${baseUrl}${product.thumbnail}`
    : `${baseUrl}/og-image.jpg`;

  const cleanDescription =
    product.description
      ?.replace(/<[^>]*>/g, "")
      .replace(/\s+/g, " ")
      .trim() || product.name;

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",

    name: product.name,

    description: cleanDescription.slice(0, 500),

    image: [imageUrl, ...(product.images?.filter(Boolean) || [])],

    url: productUrl,

    sku: product.id,

    ...(product.category?.name && {
      category: product.category.name,
    }),

    ...(product.rating_avg !== undefined &&
      product.reviews_count !== undefined &&
      product.reviews_count > 0 && {
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: product.rating_avg,
          reviewCount: product.reviews_count,
          bestRating: 5,
          worstRating: 1,
        },
      }),

    offers: {
      "@type": "Offer",

      url: productUrl,

      priceCurrency: "BDT",

      price: product.price,

      availability:
        product.stock !== undefined && product.stock > 0
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",

      itemCondition: "https://schema.org/NewCondition",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(productSchema),
        }}
      />

      <ProductDetailsClient product={product} />
    </>
  );
}
// /* eslint-disable react-hooks/error-boundaries */

// import ProductDetailsClient from "@/src/components/product/ProductDetailsClient";
// import { getProductBySlug } from "@/src/components/services/product.service";

// import { notFound } from "next/navigation";

// type Props = {
//   params: Promise<{
//     slug: string;
//   }>;
// };

// export default async function ProductDetailsPage({ params }: Props) {
//   const { slug } = await params;

//   try {
//     const response = await getProductBySlug(slug);

//     // Safeguard nested data structures based on your JSON schema
//     const product = response?.data?.data;

//     if (!product) {
//       notFound();
//     }

//     return <ProductDetailsClient product={product} />;
//   } catch (error) {
//     console.error("Failed to load product page details:", error);
//     notFound();
//   }
// }
