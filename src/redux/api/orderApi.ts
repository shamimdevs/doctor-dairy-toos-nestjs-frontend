import { tagTypes } from "../tag-types";
import { baseApi } from "./baseApi";

const ORDER_URL = "/orders";

// ==========================================
// TYPE DEFINITIONS
// ==========================================

export interface IOrderItem {
  product_id: string;
  product_name: string;
  quantity: number;
  price: number;
  weight?: number;
  total_price: number;
  image?: string | null;
}

export interface IOrder {
  id: string;
  order_number: string;
  user_id?: string;
  customer_name: string;
  phone: string;
  address: string;
  notes?: string;
  subtotal: number;
  delivery_charge: number;
  total_amount: number;
  total_weight: number;
  order_status: string; // 'pending' | 'processing' | 'delivered' | 'cancelled'
  payment_method: string;
  payment_status: string; // 'pending' | 'paid' | 'failed'
  items: IOrderItem[];
  created_at: string;
  updated_at: string;
}

export interface IOrderItemDto {
  product_id: string;
  product_name: string;
  quantity: number;
  price: number;
  weight?: number;
  image?: string;
}

export interface ICreateOrderDto {
  fullName: string;
  phone: string;
  address: string;
  notes?: string;
  items: IOrderItemDto[];
}

export interface IUpdateOrderDto {
  order_status?: "pending" | "processing" | "delivered" | "cancelled";
  payment_status?: "pending" | "paid" | "failed";
  notes?: string;
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

export interface IApiResponse<T> {
  apiVersion?: string;
  success: boolean;
  message: string;
  status?: number;
  meta?: IMeta;
  links?: ILinks;
  data: T;
}

// ==========================================
// API ENDPOINTS
// ==========================================

export const orderApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    // Create Order
    createOrder: build.mutation<IApiResponse<IOrder>, ICreateOrderDto>({
      query: (data) => ({
        url: ORDER_URL,
        method: "POST",
        data,
      }),
      invalidatesTags: [tagTypes.orders],
    }),

    // Get All Orders (Admin)
    getAllOrders: build.query<
      IApiResponse<IOrder[]> | IOrder[],
      { page?: number; limit?: number; order_status?: string } | void
    >({
      query: (params) => ({
        url: ORDER_URL,
        method: "GET",
        params: params || {},
      }),
      providesTags: [tagTypes.orders],
    }),

    // Get My Orders (User's own orders)
    getMyOrders: build.query<
      IApiResponse<IOrder[]> | IOrder[],
      { page?: number; limit?: number; order_status?: string } | void
    >({
      query: (params) => ({
        url: `${ORDER_URL}/my-orders`,
        method: "GET",
        params: params || {},
      }),
      providesTags: [tagTypes.orders],
    }),

    // Get Single Order by ID
    getOrderById: build.query<IApiResponse<IOrder> | IOrder, string>({
      query: (id) => ({
        url: `${ORDER_URL}/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: tagTypes.orders, id }],
    }),

    // Get User's Orders
    getUserOrders: build.query<
      IApiResponse<IOrder[]> | IOrder[],
      { page?: number; limit?: number; order_status?: string } | void
    >({
      query: (params) => ({
        url: `${ORDER_URL}/user`,
        method: "GET",
        params: params || {},
      }),
      providesTags: [tagTypes.orders],
    }),

    // Update Order
    updateOrder: build.mutation<
      IApiResponse<IOrder>,
      { id: string; data: IUpdateOrderDto }
    >({
      query: ({ id, data }) => ({
        url: `${ORDER_URL}/${id}`,
        method: "PATCH",
        data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: tagTypes.orders, id },
        tagTypes.orders,
      ],
    }),

    // Cancel Order
    cancelOrder: build.mutation<IApiResponse<IOrder>, string>({
      query: (id) => ({
        url: `${ORDER_URL}/${id}/cancel`,
        method: "PUT",
      }),
      invalidatesTags: (result, error, id) => [
        { type: tagTypes.orders, id },
        tagTypes.orders,
      ],
    }),

    // Delete Order (Admin only)
    deleteOrder: build.mutation<IApiResponse<void>, string>({
      query: (id) => ({
        url: `${ORDER_URL}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [tagTypes.orders],
    }),
  }),
});

// Export hooks
export const {
  useCreateOrderMutation,
  useGetAllOrdersQuery,
  useGetOrderByIdQuery,
  useGetMyOrdersQuery,
  useGetUserOrdersQuery,
  useUpdateOrderMutation,
  useCancelOrderMutation,
  useDeleteOrderMutation,
} = orderApi;
