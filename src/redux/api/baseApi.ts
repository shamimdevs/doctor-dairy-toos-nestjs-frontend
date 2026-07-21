import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "@/src/helpers/asiosBaseQuery";
import { tagTypesList } from "../tag-types";

export const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery: axiosBaseQuery({ baseUrl: `${process.env.NEXT_PUBLIC_API_URL}` }),
  // credentials: "include",
  endpoints: () => ({}),

  tagTypes: tagTypesList,
});
