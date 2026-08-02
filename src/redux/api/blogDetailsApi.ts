import type { ApiResponse } from "@/src/types/axios";
import type {
  BlogDetail,
  BlogDetailQueryParams,
  BlogDetailsPaginatedResponse,
} from "@/src/types/blogDetailsType";
import { tagTypes } from "../tag-types";
import { baseApi } from "./baseApi";

const BLOG_DETAILS_PATH = "/blog-details";

export const tizaraBlogDetailsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    createTizaraBlogDetail: build.mutation<ApiResponse<BlogDetail>, FormData>({
      query: (data) => ({
        url: BLOG_DETAILS_PATH,
        method: "POST",
        contentType: true,
        data,
      }),
      invalidatesTags: [tagTypes.blog_details],
    }),

    getAllTizaraBlogDetails: build.query<
      BlogDetailsPaginatedResponse,
      BlogDetailQueryParams | void
    >({
      query: (params) => ({
        url: BLOG_DETAILS_PATH,
        method: "GET",
        params: params || {},
      }),
      providesTags: [tagTypes.blog_details],
    }),

    getSingleTizaraBlogDetail: build.query<ApiResponse<BlogDetail>, string>({
      query: (id) => ({
        url: `${BLOG_DETAILS_PATH}/${id}`,
        method: "GET",
      }),
      providesTags: [tagTypes.blog_details],
    }),

    updateTizaraBlogDetail: build.mutation<
      ApiResponse<BlogDetail>,
      { id: string; data: FormData }
    >({
      query: ({ id, data }) => ({
        url: `${BLOG_DETAILS_PATH}/${id}`,
        method: "PATCH",
        contentType: true,
        data,
      }),
      invalidatesTags: [tagTypes.blog_details],
    }),

    getBlogDetailsByBlog: build.query<ApiResponse<BlogDetail[]>, string>({
      query: (blogId) => ({
        url: `${BLOG_DETAILS_PATH}/by-blog/${blogId}`,
        method: "GET",
      }),
      providesTags: [tagTypes.blog_details],
    }),

    deleteTizaraBlogDetail: build.mutation<ApiResponse<void>, string>({
      query: (id) => ({
        url: `${BLOG_DETAILS_PATH}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [tagTypes.blog_details],
    }),
  }),
});

export const {
  useCreateTizaraBlogDetailMutation,
  useGetAllTizaraBlogDetailsQuery,
  useGetSingleTizaraBlogDetailQuery,
  useGetBlogDetailsByBlogQuery,
  useUpdateTizaraBlogDetailMutation,
  useDeleteTizaraBlogDetailMutation,
} = tizaraBlogDetailsApi;
