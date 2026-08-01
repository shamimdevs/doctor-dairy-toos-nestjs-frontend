import type { ApiResponse } from "../../types/axios";
import { baseApi } from "./baseApi";
import { tagTypes } from "../tag-types";
import {
  BlogItem,
  BlogPaginatedResponse,
  BlogQueryParams,
  UpdateBlogRequest,
} from "@/src/types/blogType";

const BLOG_URL = "/blog";

export const blogApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // 1. CREATE BLOG POST
    createBlog: builder.mutation<ApiResponse<BlogItem>, FormData>({
      query: (formData) => ({
        url: BLOG_URL,
        method: "POST",
        data: formData,
        contentType: true, // Enables multipart/form-data for file upload
      }),
      invalidatesTags: [tagTypes.blogs],
    }),

    // 2. GET ALL BLOG POSTS (Paginated & Filtered)
    getAllBlogs: builder.query<BlogPaginatedResponse, BlogQueryParams | void>({
      query: (params) => ({
        url: BLOG_URL,
        method: "GET",
        params: params || {},
      }),
      providesTags: [tagTypes.blogs],
    }),

    // 3. GET BLOG POSTS FOR INFINITE SCROLL
    getInfiniteBlogs: builder.query<
      BlogPaginatedResponse,
      BlogQueryParams | void
    >({
      query: (params) => ({
        url: `${BLOG_URL}/infinite-scroll`,
        method: "GET",
        params: params || {},
      }),
      providesTags: [tagTypes.blogs],
    }),

    // 4. GET SINGLE BLOG POST BY SLUG
    getBlogBySlug: builder.query<ApiResponse<BlogItem>, string>({
      query: (slug) => ({
        url: `${BLOG_URL}/slug/${slug}`,
        method: "GET",
      }),
      providesTags: [tagTypes.blogs],
    }),

    // 5. GET SINGLE BLOG POST BY ID
    getSingleBlog: builder.query<ApiResponse<BlogItem>, string>({
      query: (id) => ({
        url: `${BLOG_URL}/${id}`,
        method: "GET",
      }),
      providesTags: [tagTypes.blogs],
    }),

    // 6. UPDATE BLOG POST
    updateBlog: builder.mutation<ApiResponse<BlogItem>, UpdateBlogRequest>({
      query: ({ id, data }) => ({
        url: `${BLOG_URL}/${id}`,
        method: "PATCH",
        data,
        contentType: true, // Enables multipart/form-data for file upload
      }),
      invalidatesTags: [tagTypes.blogs],
    }),

    // 7. DELETE BLOG POST
    deleteBlog: builder.mutation<ApiResponse<void>, string>({
      query: (id) => ({
        url: `${BLOG_URL}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [tagTypes.blogs],
    }),
  }),
});

// Auto-generated hooks for components
export const {
  useCreateBlogMutation,
  useGetAllBlogsQuery,
  useGetInfiniteBlogsQuery,
  useGetBlogBySlugQuery,
  useGetSingleBlogQuery,
  useUpdateBlogMutation,
  useDeleteBlogMutation,
} = blogApi;
