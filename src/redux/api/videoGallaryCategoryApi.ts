import type { ApiResponse } from "../../types/axios";
import { baseApi } from "./baseApi";
import { tagTypes } from "../tag-types";
import type { PaginationQuery } from "@/src/types/productCategoriesType";
import type {
  CreateVideoGalleryCategoryRequest,
  UpdateVideoGalleryCategoryRequest,
  VideoGalleryCategoriesPaginatedResponse,
  VideoGalleryCategory,
} from "@/src/types/videoGalleryCategoriesType";

const VIDEO_GALLERY_CATEGORY_PATH = "/video-gallary-categories";

export const videoGalleryCategoriesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // CREATE
    createVideoGalleryCategory: builder.mutation<
      ApiResponse<VideoGalleryCategory>,
      CreateVideoGalleryCategoryRequest
    >({
      query: (data) => ({
        url: VIDEO_GALLERY_CATEGORY_PATH,
        method: "POST",
        data,
      }),
      invalidatesTags: [tagTypes.video_gallery_categories],
    }),

    // GET ALL
    getAllVideoGalleryCategories: builder.query<
      VideoGalleryCategoriesPaginatedResponse,
      PaginationQuery | void
    >({
      query: (params) => ({
        url: VIDEO_GALLERY_CATEGORY_PATH,
        method: "GET",
        params,
      }),
      providesTags: [tagTypes.video_gallery_categories],
    }),

    // GET SINGLE
    getSingleVideoGalleryCategory: builder.query<
      ApiResponse<VideoGalleryCategory>,
      string
    >({
      query: (id) => ({
        url: `${VIDEO_GALLERY_CATEGORY_PATH}/${id}`,
        method: "GET",
      }),
      providesTags: [tagTypes.video_gallery_categories],
    }),

    // UPDATE
    updateVideoGalleryCategory: builder.mutation<
      ApiResponse<VideoGalleryCategory>,
      UpdateVideoGalleryCategoryRequest
    >({
      query: ({ id, data }) => ({
        url: `${VIDEO_GALLERY_CATEGORY_PATH}/${id}`,
        method: "PATCH",
        data,
      }),
      invalidatesTags: [tagTypes.video_gallery_categories],
    }),

    // DELETE
    deleteVideoGalleryCategory: builder.mutation<ApiResponse<void>, string>({
      query: (id) => ({
        url: `${VIDEO_GALLERY_CATEGORY_PATH}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [tagTypes.video_gallery_categories],
    }),
  }),
});

export const {
  useCreateVideoGalleryCategoryMutation,
  useGetAllVideoGalleryCategoriesQuery,
  useGetSingleVideoGalleryCategoryQuery,
  useUpdateVideoGalleryCategoryMutation,
  useDeleteVideoGalleryCategoryMutation,
} = videoGalleryCategoriesApi;
