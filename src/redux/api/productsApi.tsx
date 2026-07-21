/* eslint-disable @typescript-eslint/no-explicit-any */
// src/redux/api/productsApi.ts
import { tagTypes } from "../tag-types";
import { baseApi } from "./baseApi";
import { Product } from "@/src/types/product";
import { slugify } from "@/src/utils/slugify";
import { IApiResponse } from "./productCategoriesApi";

const PRODUCTS_URL = "/products";

// ✅ Extended Product type with slug in category
export interface ProductWithCategorySlug extends Omit<Product, "category"> {
  category: {
    id: string;
    name: string;
    slug: string;
  } | null;
}

// ✅ Response type with extended product
export interface IApiResponseWithSlug<T> {
  apiVersion: string;
  success: boolean;
  message: string;
  status: number;
  data: T;
  meta?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  links?: {
    first: string;
    last: string;
    current: string;
    next: string;
    previous: string;
  };
}

/**
 * ✅ Reusable Helper to safely inject slug properties into product categories
 * Handles both arrays (bulk endpoints) and standalone items (single query endpoints)
 */
const transformProductResponse = (response: any): any => {
  if (!response || !response.data) return response;

  const injectCategorySlug = (product: any) => ({
    ...product,
    category: product.category
      ? {
          id: product.category.id,
          name: product.category.name,
          slug: slugify(product.category.name || ""),
        }
      : null,
  });

  return {
    ...response,
    data: Array.isArray(response.data)
      ? response.data.map(injectCategorySlug)
      : injectCategorySlug(response.data),
  };
};

export const productsApi = baseApi.injectEndpoints({
  // ✅ Crucial fix: Prevents duplicate endpoint injection warnings during HMR/Fast Refresh
  overrideExisting: true,

  endpoints: (build) => ({
    // ✅ Get all products with filters
    getAllProducts: build.query<
      IApiResponseWithSlug<ProductWithCategorySlug[]>,
      {
        page?: number;
        limit?: number;
        category?: string;
        categoryName?: string;
        categoryId?: string;
        search?: string;
        name?: string;
        manufacturer?: string;
        minPrice?: number;
        maxPrice?: number;
        is_prescription_required?: boolean;
        is_active?: boolean;
      } | void
    >({
      query: (params) => ({
        url: PRODUCTS_URL,
        method: "GET",
        params: params || {},
      }),
      transformResponse: transformProductResponse,
      providesTags: [tagTypes.products],
    }),

    // ✅ Get products by category name (uses category param in getAllProducts)
    getProductsByCategory: build.query<
      IApiResponseWithSlug<ProductWithCategorySlug[]>,
      { category: string; limit?: number; page?: number }
    >({
      query: ({ category, limit = 50, page = 1 }) => ({
        url: PRODUCTS_URL,
        method: "GET",
        params: {
          category,
          limit,
          page,
        },
      }),
      transformResponse: transformProductResponse,
      providesTags: [tagTypes.products],
    }),

    // ✅ Get products by category ID (dedicated endpoint)
    getProductsByCategoryId: build.query<
      IApiResponse<Product[]>,
      { categoryId: string; limit?: number; page?: number }
    >({
      query: ({ categoryId, limit = 50, page = 1 }) => ({
        url: `${PRODUCTS_URL}/category/${categoryId}`,
        method: "GET",
        params: { limit, page },
      }),
      providesTags: [tagTypes.products],
    }),

    // ✅ Get products by category name (dedicated endpoint)
    getProductsByCategoryName: build.query<
      IApiResponseWithSlug<ProductWithCategorySlug[]>,
      { name: string; limit?: number; page?: number }
    >({
      query: ({ name, limit = 50, page = 1 }) => ({
        url: `${PRODUCTS_URL}/category-name/${encodeURIComponent(name)}`,
        method: "GET",
        params: { limit, page },
      }),
      transformResponse: transformProductResponse,
      providesTags: [tagTypes.products],
    }),

    // ✅ Get single product by ID
    getProductById: build.query<
      IApiResponseWithSlug<ProductWithCategorySlug>,
      string
    >({
      query: (id) => ({
        url: `${PRODUCTS_URL}/${id}`,
        method: "GET",
      }),
      transformResponse: transformProductResponse,
      providesTags: (result, error, id) => [{ type: tagTypes.products, id }],
    }),

    // ✅ Get product by slug
    getProductBySlug: build.query<
      IApiResponseWithSlug<ProductWithCategorySlug>,
      string
    >({
      query: (slug) => ({
        url: `${PRODUCTS_URL}/slug/${slug}`,
        method: "GET",
      }),
      transformResponse: transformProductResponse,
      providesTags: (result, error, slug) => [
        { type: tagTypes.products, id: slug },
      ],
    }),

    // ✅ Search products
    searchProducts: build.query<
      IApiResponseWithSlug<ProductWithCategorySlug[]>,
      { query: string; limit?: number; page?: number }
    >({
      query: ({ query, limit = 20, page = 1 }) => ({
        url: `${PRODUCTS_URL}/search`,
        method: "GET",
        params: { q: query, limit, page },
      }),
      transformResponse: transformProductResponse,
      providesTags: [tagTypes.products],
    }),

    // ✅ Get featured products
    getFeaturedProducts: build.query<
      IApiResponseWithSlug<ProductWithCategorySlug[]>,
      { limit?: number } | void
    >({
      query: (params) => ({
        url: `${PRODUCTS_URL}/featured`,
        method: "GET",
        params: params || { limit: 10 },
      }),
      transformResponse: transformProductResponse,
      providesTags: [tagTypes.products],
    }),

    // ✅ Get discounted products
    getDiscountedProducts: build.query<
      IApiResponseWithSlug<ProductWithCategorySlug[]>,
      { limit?: number; minDiscount?: number }
    >({
      query: ({ limit = 20, minDiscount = 10 }) => ({
        url: `${PRODUCTS_URL}/discounted`,
        method: "GET",
        params: { limit, minDiscount },
      }),
      transformResponse: transformProductResponse,
      providesTags: [tagTypes.products],
    }),

    // ✅ Get new arrivals
    getNewArrivals: build.query<
      IApiResponseWithSlug<ProductWithCategorySlug[]>,
      { limit?: number } | void
    >({
      query: (params) => ({
        url: `${PRODUCTS_URL}/new-arrivals`,
        method: "GET",
        params: params || { limit: 10 },
      }),
      transformResponse: transformProductResponse,
      providesTags: [tagTypes.products],
    }),

    // ✅ Get related products
    getRelatedProducts: build.query<
      IApiResponseWithSlug<ProductWithCategorySlug[]>,
      { productId: string; limit?: number }
    >({
      query: ({ productId, limit = 10 }) => ({
        url: `${PRODUCTS_URL}/${productId}/related`,
        method: "GET",
        params: { limit },
      }),
      transformResponse: transformProductResponse,
      providesTags: [tagTypes.products],
    }),

    // ✅ Get product reviews
    getProductReviews: build.query<
      IApiResponse<any[]>,
      { productId: string; page?: number; limit?: number }
    >({
      query: ({ productId, page = 1, limit = 10 }) => ({
        url: `${PRODUCTS_URL}/${productId}/reviews`,
        method: "GET",
        params: { page, limit },
      }),
      providesTags: [tagTypes.products],
    }),
  }),
});

// Export hooks
export const {
  useGetAllProductsQuery,
  useGetProductsByCategoryQuery,
  useGetProductsByCategoryIdQuery,
  useGetProductsByCategoryNameQuery,
  useGetProductByIdQuery,
  useGetProductBySlugQuery,
  useSearchProductsQuery,
  useGetFeaturedProductsQuery,
  useGetDiscountedProductsQuery,
  useGetNewArrivalsQuery,
  useGetRelatedProductsQuery,
  useGetProductReviewsQuery,
} = productsApi;
