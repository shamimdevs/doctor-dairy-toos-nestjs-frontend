import { tagTypes } from "../tag-types";
import { baseApi } from "./baseApi";
import {
  ApiResponse,
  Upzela,
  UpzelasQueryParams,
} from "@/src/types/divisionTypes";

const UPZELAS_URL = "/upzelas";

export const upzelasApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllUpzelas: builder.query<
      ApiResponse<Upzela[]>,
      UpzelasQueryParams | void
    >({
      query: (params) => ({
        url: UPZELAS_URL,
        method: "GET",
        params,
      }),
      providesTags: [tagTypes.upzelas],
    }),
  }),
});

export const { useGetAllUpzelasQuery } = upzelasApi;
