import type { ApiResponse } from "../../types/axios";
import { baseApi } from "./baseApi";
import { tagTypes } from "../tag-types";
import type {
  PaginationQuery,
  ProductCategoriesPaginatedResponse,
  ProductCategory,
  UpdateProductCategoryRequest,
} from "@/src/types/productCategoriesType";

const PRODUCT_CATEGORIES_URL = "/product-categories";

export const productCategoriesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // CREATE
    createProductCategory: builder.mutation<
      ApiResponse<ProductCategory>,
      FormData
    >({
      query: (formData) => ({
        url: PRODUCT_CATEGORIES_URL,
        method: "POST",
        data: formData,
        contentType: true,
      }),
      invalidatesTags: [tagTypes.product_categories],
    }),

    // GET ALL
    getAllProductCategories: builder.query<
      ProductCategoriesPaginatedResponse,
      PaginationQuery | void
    >({
      query: (params) => ({
        url: PRODUCT_CATEGORIES_URL,
        method: "GET",
        params: params || {},
      }),
      providesTags: [tagTypes.product_categories],
    }),

    // GET SINGLE
    getSingleProductCategory: builder.query<
      ApiResponse<ProductCategory>,
      string
    >({
      query: (id) => ({
        url: `${PRODUCT_CATEGORIES_URL}/${id}`,
        method: "GET",
      }),
      providesTags: [tagTypes.product_categories],
    }),

    // UPDATE
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

    // DELETE
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
