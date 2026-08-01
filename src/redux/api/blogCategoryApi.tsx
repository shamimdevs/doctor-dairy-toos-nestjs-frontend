import { baseApi } from "./baseApi";
import { tagTypes } from "../tag-types";
import type { ApiResponse } from "../../types/axios";
import type {
  BlogCategory,
  CreateBlogCategoryRequest,
  UpdateBlogCategoryRequest,
  BlogCategoryPaginationQuery,
  BlogCategoriesPaginatedResponse,
} from "@/src/types/blogCategoryType";

const BLOG_CATEGORY_PATH = "/blog-category";

export const blogCategoryApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // ------------------------------------------------------------------
    // CREATE BLOG CATEGORY
    // ------------------------------------------------------------------
    createBlogCategory: builder.mutation<
      ApiResponse<BlogCategory>,
      CreateBlogCategoryRequest
    >({
      query: (data) => ({
        url: BLOG_CATEGORY_PATH,
        method: "POST",
        data,
      }),
      invalidatesTags: [tagTypes.blog_category],
    }),

    // ------------------------------------------------------------------
    // GET ALL BLOG CATEGORIES (With Pagination & Filters)
    // ------------------------------------------------------------------
    getAllBlogCategories: builder.query<
      BlogCategoriesPaginatedResponse,
      BlogCategoryPaginationQuery | void
    >({
      query: (params) => ({
        url: BLOG_CATEGORY_PATH,
        method: "GET",
        params,
      }),
      providesTags: [tagTypes.blog_category],
    }),

    // ------------------------------------------------------------------
    // GET SINGLE BLOG CATEGORY BY ID
    // ------------------------------------------------------------------
    getSingleBlogCategory: builder.query<ApiResponse<BlogCategory>, string>({
      query: (id) => ({
        url: `${BLOG_CATEGORY_PATH}/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [
        { type: tagTypes.blog_category, id },
      ],
    }),

    // ------------------------------------------------------------------
    // UPDATE BLOG CATEGORY
    // ------------------------------------------------------------------
    updateBlogCategory: builder.mutation<
      ApiResponse<BlogCategory>,
      UpdateBlogCategoryRequest
    >({
      query: ({ id, data }) => ({
        url: `${BLOG_CATEGORY_PATH}/${id}`,
        method: "PATCH",
        data,
      }),
      invalidatesTags: (result, error, { id }) => [
        tagTypes.blog_category,
        { type: tagTypes.blog_category, id },
      ],
    }),

    // ------------------------------------------------------------------
    // DELETE BLOG CATEGORY
    // ------------------------------------------------------------------
    deleteBlogCategory: builder.mutation<ApiResponse<void>, string>({
      query: (id) => ({
        url: `${BLOG_CATEGORY_PATH}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [tagTypes.blog_category],
    }),
  }),
});

export const {
  useCreateBlogCategoryMutation,
  useGetAllBlogCategoriesQuery,
  useGetSingleBlogCategoryQuery,
  useUpdateBlogCategoryMutation,
  useDeleteBlogCategoryMutation,
} = blogCategoryApi;
