import {
  ApiResponse,
  District,
  DistrictsQueryParams,
} from "@/src/types/divisionTypes";
import { tagTypes } from "../tag-types";
import { baseApi } from "./baseApi";

const DISTRICTS_URL = "/districts";

export const districtsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllDistricts: builder.query<
      ApiResponse<District[]>,
      DistrictsQueryParams | void
    >({
      query: (params) => ({
        url: DISTRICTS_URL,
        method: "GET",
        params,
      }),
      providesTags: [tagTypes.districts],
    }),
  }),
});

export const { useGetAllDistrictsQuery } = districtsApi;
