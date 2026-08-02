import type { ApiResponse } from "../../types/axios";
import { baseApi } from "./baseApi";
import { tagTypes } from "../tag-types";
import type {
  AutocompleteQueryParams,
  Product,
  ProductQueryParams,
  ProductsPaginatedResponse,
  QuickSearchQueryParams,
  QuickSearchResult,
  SimilarProductsQueryParams,
  UpdateProductRequest,
} from "@/src/types/productsType";

const PRODUCTS_URL = "/products";

export const productsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // 1. CREATE PRODUCT
    createProduct: builder.mutation<ApiResponse<Product>, FormData>({
      query: (formData) => ({
        url: PRODUCTS_URL,
        method: "POST",
        data: formData,
        contentType: true, // Enables multipart/form-data for file upload
      }),
      invalidatesTags: [tagTypes.products],
    }),

    // 2. GET ALL PRODUCTS (Paginated & Filtered)
    getAllProducts: builder.query<
      ProductsPaginatedResponse,
      ProductQueryParams | void
    >({
      query: (params) => ({
        url: PRODUCTS_URL,
        method: "GET",
        params: params || {},
      }),
      providesTags: [tagTypes.products],
    }),

    // 3. GET PRODUCTS BY CATEGORY ID
    getProductsByCategory: builder.query<
      ProductsPaginatedResponse,
      { categoryId: string; params?: ProductQueryParams }
    >({
      query: ({ categoryId, params }) => ({
        url: `${PRODUCTS_URL}/category/${categoryId}`,
        method: "GET",
        params,
      }),
      providesTags: [tagTypes.products],
    }),

    // 4. GET PRODUCTS BY CATEGORY NAME
    getProductsByCategoryName: builder.query<
      ProductsPaginatedResponse,
      { name: string; params?: ProductQueryParams }
    >({
      query: ({ name, params }) => ({
        url: `${PRODUCTS_URL}/category-name/${encodeURIComponent(name)}`,
        method: "GET",
        params,
      }),
      providesTags: [tagTypes.products],
    }),

    // 5. GET PRODUCT BY SLUG (SEO Friendly)
    getProductBySlug: builder.query<ApiResponse<Product>, string>({
      query: (slug) => ({
        url: `${PRODUCTS_URL}/slug/${slug}`,
        method: "GET",
      }),
      providesTags: [tagTypes.products],
    }),

    // 6. GET SINGLE PRODUCT BY ID
    getSingleProduct: builder.query<ApiResponse<Product>, string>({
      query: (id) => ({
        url: `${PRODUCTS_URL}/${id}`,
        method: "GET",
      }),
      providesTags: [tagTypes.products],
    }),

    // 7. UPDATE PRODUCT
    updateProduct: builder.mutation<ApiResponse<Product>, UpdateProductRequest>(
      {
        query: ({ id, data }) => ({
          url: `${PRODUCTS_URL}/${id}`,
          method: "PATCH",
          data,
          contentType: true,
        }),
        invalidatesTags: [tagTypes.products],
      },
    ),

    // 8. SEARCH PRODUCTS
    searchProducts: builder.query<
      ProductsPaginatedResponse,
      ProductQueryParams
    >({
      query: (params) => ({
        url: `${PRODUCTS_URL}/search`,
        method: "GET",
        params,
      }),
      providesTags: [tagTypes.products],
    }),

    // 9. AUTOCOMPLETE SUGGESTIONS
    getAutocompleteSuggestions: builder.query<
      ApiResponse<string[] | Product[]>,
      AutocompleteQueryParams
    >({
      query: (params) => ({
        url: `${PRODUCTS_URL}/autocomplete`,
        method: "GET",
        params,
      }),
    }),

    // 10. NAVBAR QUICK SEARCH (categories + popular/matching products)
    quickSearchProducts: builder.query<
      ApiResponse<QuickSearchResult>,
      QuickSearchQueryParams | void
    >({
      query: (params) => ({
        url: `${PRODUCTS_URL}/quick-search`,
        method: "GET",
        params: params || {},
      }),
    }),

    // 11. GET SIMILAR PRODUCTS
    getSimilarProducts: builder.query<
      ApiResponse<Product[]>,
      SimilarProductsQueryParams
    >({
      query: ({ id, limit = 10 }) => ({
        url: `${PRODUCTS_URL}/${id}/similar`,
        method: "GET",
        params: { limit },
      }),
      providesTags: [tagTypes.products],
    }),

    // 12. DELETE PRODUCT
    deleteProduct: builder.mutation<ApiResponse<void>, string>({
      query: (id) => ({
        url: `${PRODUCTS_URL}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [tagTypes.products],
    }),
  }),
});

// Auto-generated hooks for components
export const {
  useCreateProductMutation,
  useGetAllProductsQuery,
  useGetProductsByCategoryQuery,
  useGetProductsByCategoryNameQuery,
  useGetProductBySlugQuery,
  useGetSingleProductQuery,
  useUpdateProductMutation,
  useSearchProductsQuery,
  useGetAutocompleteSuggestionsQuery,
  useGetSimilarProductsQuery,
  useQuickSearchProductsQuery,
  useDeleteProductMutation,
} = productsApi;
