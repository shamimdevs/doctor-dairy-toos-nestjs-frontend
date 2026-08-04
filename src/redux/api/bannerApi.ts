import type { ApiResponse } from "../../types/axios";
import { baseApi } from "./baseApi";
import { tagTypes } from "../tag-types";
import {
  BannerItem,
  BannerPaginatedResponse,
  BannerQueryParams,
  UpdateBannerRequest,
} from "@/src/types/bannerType";

const BANNER_URL = "/banners";

export const bannerApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // 1. CREATE SINGLE BANNER
    createBanner: builder.mutation<ApiResponse<BannerItem>, FormData>({
      query: (formData) => ({
        url: BANNER_URL,
        method: "POST",
        data: formData,
        contentType: true,
      }),
      invalidatesTags: [tagTypes.banners],
    }),

    // 2. BULK CREATE BANNERS (multi-image upload — one banner per image)
    createBannerBulk: builder.mutation<ApiResponse<BannerItem[]>, FormData>({
      query: (formData) => ({
        url: `${BANNER_URL}/bulk`,
        method: "POST",
        data: formData,
        contentType: true,
      }),
      invalidatesTags: [tagTypes.banners],
    }),

    // 3. GET ALL BANNERS (Paginated & Filtered)
    getAllBanners: builder.query<
      BannerPaginatedResponse,
      BannerQueryParams | void
    >({
      query: (params) => ({
        url: BANNER_URL,
        method: "GET",
        params: params || {},
      }),
      providesTags: [tagTypes.banners],
    }),

    // 4. GET SINGLE BANNER BY ID
    getSingleBanner: builder.query<ApiResponse<BannerItem>, string>({
      query: (id) => ({
        url: `${BANNER_URL}/${id}`,
        method: "GET",
      }),
      providesTags: [tagTypes.banners],
    }),

    // 5. UPDATE BANNER
    updateBanner: builder.mutation<ApiResponse<BannerItem>, UpdateBannerRequest>(
      {
        query: ({ id, data }) => ({
          url: `${BANNER_URL}/${id}`,
          method: "PATCH",
          data,
          contentType: data instanceof FormData,
        }),
        invalidatesTags: [tagTypes.banners],
      },
    ),

    // 6. DELETE BANNER
    deleteBanner: builder.mutation<ApiResponse<void>, string>({
      query: (id) => ({
        url: `${BANNER_URL}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [tagTypes.banners],
    }),
  }),
});

export const {
  useCreateBannerMutation,
  useCreateBannerBulkMutation,
  useGetAllBannersQuery,
  useGetSingleBannerQuery,
  useUpdateBannerMutation,
  useDeleteBannerMutation,
} = bannerApi;
