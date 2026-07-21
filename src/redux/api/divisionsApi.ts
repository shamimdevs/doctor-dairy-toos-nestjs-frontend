import {
  ApiResponse,
  Division,
  DivisionQueryParams,
} from "@/src/types/divisionTypes";
import { baseApi } from "./baseApi";
import { tagTypes } from "../tag-types";

const DIVISIONS_URL = "/divisions";

export const divisionsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllDivisions: builder.query<
      ApiResponse<Division[]>,
      DivisionQueryParams | void
    >({
      query: (params) => ({
        url: DIVISIONS_URL,
        method: "GET",
        params,
      }),
      providesTags: [tagTypes.divisions],
    }),
  }),
});

export const { useGetAllDivisionsQuery } = divisionsApi;
