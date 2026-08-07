import type { ApiResponse } from "../../types/axios";
import { baseApi } from "./baseApi";
import { tagTypes } from "../tag-types";

const REPORTS_URL = "/reports";

// ==========================================
// TYPE DEFINITIONS
// ==========================================

export interface IReportDateRange {
  from?: string;
  to?: string;
}

export interface IStatusCount {
  status: string;
  count: number;
}

export interface IDailyTrendPoint {
  date: string;
  revenue: number;
  orders: number;
}

export interface ISalesSummary {
  range: { from: string | null; to: string | null };
  totalRevenue: number;
  totalOrders: number;
  avgOrderValue: number;
  totalWeight: number;
  statusBreakdown: IStatusCount[];
  paymentBreakdown: IStatusCount[];
  dailyTrend: IDailyTrendPoint[];
}

export interface ITopProduct {
  product_id: string;
  product_name: string;
  quantity_sold: number;
  revenue: number;
}

export interface ICategorySales {
  category_id: string;
  category_name: string;
  revenue: number;
  quantity: number;
}

export interface ILowStockProduct {
  id: string;
  name: string;
  stock: number;
  category_name: string;
}

export interface IOutOfStockProduct {
  id: string;
  name: string;
  category_name: string;
}

export interface IInventoryReport {
  threshold: number;
  lowStock: ILowStockProduct[];
  outOfStock: IOutOfStockProduct[];
}

// ==========================================
// API ENDPOINTS
// ==========================================

export const reportsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSalesSummary: builder.query<ApiResponse<ISalesSummary>, IReportDateRange | void>({
      query: (params) => ({
        url: `${REPORTS_URL}/sales-summary`,
        method: "GET",
        params: params || {},
      }),
      providesTags: [tagTypes.orders],
    }),

    getTopProducts: builder.query<
      ApiResponse<ITopProduct[]>,
      (IReportDateRange & { limit?: number }) | void
    >({
      query: (params) => ({
        url: `${REPORTS_URL}/top-products`,
        method: "GET",
        params: params || {},
      }),
      providesTags: [tagTypes.orders],
    }),

    getCategorySalesReport: builder.query<
      ApiResponse<ICategorySales[]>,
      IReportDateRange | void
    >({
      query: (params) => ({
        url: `${REPORTS_URL}/category-sales`,
        method: "GET",
        params: params || {},
      }),
      providesTags: [tagTypes.orders],
    }),

    getInventoryReport: builder.query<
      ApiResponse<IInventoryReport>,
      { threshold?: number } | void
    >({
      query: (params) => ({
        url: `${REPORTS_URL}/inventory`,
        method: "GET",
        params: params || {},
      }),
      providesTags: [tagTypes.products],
    }),
  }),
});

export const {
  useGetSalesSummaryQuery,
  useGetTopProductsQuery,
  useGetCategorySalesReportQuery,
  useGetInventoryReportQuery,
} = reportsApi;
