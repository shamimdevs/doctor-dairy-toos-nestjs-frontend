// src/redux/api/cartApi.ts
import { tagTypes } from "../tag-types";
import { baseApi } from "./baseApi";

const CART_URL = "/carts";

export interface ICartItem {
  id: string;
  product_id: string;
  product_name: string;
  quantity: number;
  price: number;
  total_price: number;
  image?: string;
  pack_size_id?: string;
  pack_size_label?: string;
  sku?: string;
}

export interface ICart {
  id: string;
  user_id: string;
  items: ICartItem[];
  subtotal: number;
  total: number;
  created_at: string;
  updated_at: string;
}

export interface IAddToCartDto {
  product_id: string;
  quantity: number;
  pack_size_id?: string;
}

export interface IUpdateCartDto {
  quantity: number;
  pack_size_id?: string;
}

export interface IApiResponse<T> {
  apiVersion: string;
  success: boolean;
  message: string;
  status: number;
  data: T;
}

export const cartApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    // Get My Cart
    getMyCart: build.query<IApiResponse<ICart>, void>({
      query: () => ({
        url: `${CART_URL}/my-cart`,
        method: "GET",
      }),
      providesTags: [tagTypes.cart],
    }),

    // Add to Cart
    addToCart: build.mutation<IApiResponse<ICart>, IAddToCartDto>({
      query: (data) => ({
        url: `${CART_URL}/add`,
        method: "POST",
        data,
      }),
      invalidatesTags: [tagTypes.cart],
    }),

    // Update Cart Item
    updateCartItem: build.mutation<
      IApiResponse<ICart>,
      { id: string; data: IUpdateCartDto }
    >({
      query: ({ id, data }) => ({
        url: `${CART_URL}/${id}`,
        method: "PATCH",
        data,
      }),
      invalidatesTags: [tagTypes.cart],
    }),

    // Remove from Cart
    removeFromCart: build.mutation<IApiResponse<void>, string>({
      query: (id) => ({
        url: `${CART_URL}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [tagTypes.cart],
    }),

    // Clear Cart
    clearCart: build.mutation<IApiResponse<void>, void>({
      query: () => ({
        url: `${CART_URL}/clear`,
        method: "DELETE",
      }),
      invalidatesTags: [tagTypes.cart],
    }),
  }),
});

// Export hooks
export const {
  useGetMyCartQuery,
  useAddToCartMutation,
  useUpdateCartItemMutation,
  useRemoveFromCartMutation,
  useClearCartMutation,
} = cartApi;
