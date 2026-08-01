import type { ApiResponse } from "../../types/axios";
import { baseApi } from "./baseApi";
import { tagTypes } from "../tag-types";
import {
  VideoGallaryItem,
  VideoGallaryPaginatedResponse,
  VideoGallaryQueryParams,
} from "@/src/types/videoGallaryType";

export interface UpdateVideoGallaryRequest {
  id: string;
  data: FormData;
}

const VIDEO_GALLARIES_URL = "/video-gallaries";

export const videoGallaryApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // 1. CREATE VIDEO GALLERY
    createVideoGallary: builder.mutation<
      ApiResponse<VideoGallaryItem>,
      FormData
    >({
      query: (formData) => ({
        url: VIDEO_GALLARIES_URL,
        method: "POST",
        data: formData,
        contentType: true, // Enables multipart/form-data for image file upload
      }),
      invalidatesTags: [tagTypes.video_gallaries],
    }),

    // 2. GET ALL VIDEO GALLERIES (Paginated & Filtered)
    getAllVideoGallaries: builder.query<
      VideoGallaryPaginatedResponse,
      VideoGallaryQueryParams | void
    >({
      query: (params) => ({
        url: VIDEO_GALLARIES_URL,
        method: "GET",
        params: params || {},
      }),
      providesTags: [tagTypes.video_gallaries],
    }),

    // 3. GET SINGLE VIDEO GALLERY BY ID
    getSingleVideoGallary: builder.query<ApiResponse<VideoGallaryItem>, string>(
      {
        query: (id) => ({
          url: `${VIDEO_GALLARIES_URL}/${id}`,
          method: "GET",
        }),
        providesTags: [tagTypes.video_gallaries],
      },
    ),

    // 4. UPDATE VIDEO GALLERY
    updateVideoGallary: builder.mutation<
      ApiResponse<VideoGallaryItem>,
      UpdateVideoGallaryRequest
    >({
      query: ({ id, data }) => ({
        url: `${VIDEO_GALLARIES_URL}/${id}`,
        method: "PATCH",
        data,
        contentType: true, // Enables multipart/form-data for updating image file
      }),
      invalidatesTags: [tagTypes.video_gallaries],
    }),

    // 5. DELETE VIDEO GALLERY
    deleteVideoGallary: builder.mutation<ApiResponse<void>, string>({
      query: (id) => ({
        url: `${VIDEO_GALLARIES_URL}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [tagTypes.video_gallaries],
    }),
  }),
});

// Auto-generated hooks for components
export const {
  useCreateVideoGallaryMutation,
  useGetAllVideoGallariesQuery,
  useGetSingleVideoGallaryQuery,
  useUpdateVideoGallaryMutation,
  useDeleteVideoGallaryMutation,
} = videoGallaryApi;
