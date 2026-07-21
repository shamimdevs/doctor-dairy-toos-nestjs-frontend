import { tagTypes } from "../tag-types";
import { baseApi } from "./baseApi";

const PRODUCT_CATEGORY_URL = "/product-categories";

// ==========================================
// TYPE DEFINITIONS
// ==========================================

export interface IProductCategory {
  id: string;
  name: string;
  image: string;
  created_at: string;
  updated_at: string;
}

export interface IMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ILinks {
  first: string;
  last: string;
  current: string;
  next: string;
  previous: string;
}

// Global API Wrapper Type Definition matching your backend structure
export interface IApiResponse<T> {
  apiVersion: string;
  success: boolean;
  message: string;
  status: number;
  meta?: IMeta;
  links?: ILinks;
  data: T;
}

// ==========================================
// API ENDPOINTS
// ==========================================

export const productCategoryApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getAllProductCategories: build.query<
      IApiResponse<IProductCategory[]>,
      Record<string, unknown> | undefined
    >({
      query: (arg) => ({
        url: PRODUCT_CATEGORY_URL,
        method: "GET",
        params: arg,
      }),
      providesTags: [tagTypes.product_categories],
    }),
  }),
});

export const { useGetAllProductCategoriesQuery } = productCategoryApi;
