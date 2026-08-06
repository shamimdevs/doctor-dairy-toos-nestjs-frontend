import type { ApiResponse } from "../../types/axios";
import { baseApi } from "./baseApi";
import { tagTypes } from "../tag-types";
import {
  Purchase,
  PurchaseQueryParams,
  PurchasesPaginatedResponse,
  UpdatePurchaseRequest,
} from "@/src/types/purchaseType";

const PURCHASES_URL = "/purchases";

export const purchaseApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // 1. CREATE PURCHASE
    createPurchase: builder.mutation<ApiResponse<Purchase>, FormData>({
      query: (formData) => ({
        url: PURCHASES_URL,
        method: "POST",
        data: formData,
        contentType: true,
      }),
      invalidatesTags: [tagTypes.purchases],
    }),

    // 2. GET ALL PURCHASES (Paginated & Filtered)
    getAllPurchases: builder.query<
      PurchasesPaginatedResponse,
      PurchaseQueryParams | void
    >({
      query: (params) => ({
        url: PURCHASES_URL,
        method: "GET",
        params: params || {},
      }),
      providesTags: [tagTypes.purchases],
    }),

    // 3. GET SINGLE PURCHASE BY ID
    getSinglePurchase: builder.query<ApiResponse<Purchase>, string>({
      query: (id) => ({
        url: `${PURCHASES_URL}/${id}`,
        method: "GET",
      }),
      providesTags: [tagTypes.purchases],
    }),

    // 4. UPDATE PURCHASE
    updatePurchase: builder.mutation<
      ApiResponse<Purchase>,
      UpdatePurchaseRequest
    >({
      query: ({ id, data }) => ({
        url: `${PURCHASES_URL}/${id}`,
        method: "PATCH",
        data,
        contentType: true,
      }),
      invalidatesTags: [tagTypes.purchases],
    }),

    // 5. DELETE PURCHASE
    deletePurchase: builder.mutation<ApiResponse<void>, string>({
      query: (id) => ({
        url: `${PURCHASES_URL}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [tagTypes.purchases],
    }),
  }),
});

export const {
  useCreatePurchaseMutation,
  useGetAllPurchasesQuery,
  useGetSinglePurchaseQuery,
  useUpdatePurchaseMutation,
  useDeletePurchaseMutation,
} = purchaseApi;
