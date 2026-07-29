// import { tagTypes } from "../tag-types";
// import { baseApi } from "./baseApi";

// const PRODUCT_CATEGORY_URL = "/product-categories";

// // ==========================================
// // TYPE DEFINITIONS
// // ==========================================

// export interface IProductCategory {
//   id: string;
//   name: string;
//   image: string;
//   created_at: string;
//   updated_at: string;
// }

// export interface IMeta {
//   total: number;
//   page: number;
//   limit: number;
//   totalPages: number;
// }

// export interface ILinks {
//   first: string;
//   last: string;
//   current: string;
//   next: string;
//   previous: string;
// }

// // Global API Wrapper Type Definition matching your backend structure
// export interface IApiResponse<T> {
//   apiVersion: string;
//   success: boolean;
//   message: string;
//   status: number;
//   meta?: IMeta;
//   links?: ILinks;
//   data: T;
// }

// // ==========================================
// // API ENDPOINTS
// // ==========================================

// export const productCategoryApi = baseApi.injectEndpoints({
//   endpoints: (build) => ({
//     getAllProductCategories: build.query<
//       IApiResponse<IProductCategory[]>,
//       Record<string, unknown> | undefined
//     >({
//       query: (arg) => ({
//         url: PRODUCT_CATEGORY_URL,
//         method: "GET",
//         params: arg,
//       }),
//       providesTags: [tagTypes.product_categories],
//     }),
//   }),
// });

// export const { useGetAllProductCategoriesQuery } = productCategoryApi;

import type { ApiResponse } from "../../types/axios";
import { baseApi } from "./baseApi";
import { tagTypes } from "../tag-types";
import {
  PaginationQuery,
  ProductCategoriesPaginatedResponse,
  ProductCategory,
  UpdateProductCategoryRequest,
} from "@/src/types/productCategoriesType";

const PRODUCT_CATEGORIES_URL = "/product-categories";

export const productCategoriesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // ✅ CREATE
    createProductCategory: builder.mutation<
      ApiResponse<ProductCategory>,
      FormData
    >({
      query: (formData) => ({
        url: `${PRODUCT_CATEGORIES_URL}/create`,
        method: "POST",
        data: formData,
        contentType: true,
      }),
      invalidatesTags: [tagTypes.product_categories],
    }),

    // ✅ GET ALL
    getAllProductCategories: builder.query<
      ProductCategoriesPaginatedResponse,
      PaginationQuery
    >({
      query: (params) => ({
        url: PRODUCT_CATEGORIES_URL,
        method: "GET",
        params,
      }),
      providesTags: [tagTypes.product_categories],
    }),

    // ✅ GET SINGLE
    getSingleProductCategory: builder.query<
      ApiResponse<ProductCategory>,
      string
    >({
      query: (id) => ({
        url: `${PRODUCT_CATEGORIES_URL}/id/${id}`,
        method: "GET",
      }),
      providesTags: [tagTypes.product_categories],
    }),

    // ✅ UPDATE
    updateProductCategory: builder.mutation<
      ApiResponse<ProductCategory>,
      UpdateProductCategoryRequest
    >({
      query: ({ id, data }) => ({
        url: `${PRODUCT_CATEGORIES_URL}/${id}`,
        method: "PATCH",
        data,
        contentType: true,
      }),
      invalidatesTags: [tagTypes.product_categories],
    }),

    // ✅ DELETE
    deleteProductCategory: builder.mutation<ApiResponse<void>, string>({
      query: (id) => ({
        url: `${PRODUCT_CATEGORIES_URL}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [tagTypes.product_categories],
    }),
  }),
});

export const {
  useCreateProductCategoryMutation,
  useGetAllProductCategoriesQuery,
  useGetSingleProductCategoryQuery,
  useUpdateProductCategoryMutation,
  useDeleteProductCategoryMutation,
} = productCategoriesApi;
