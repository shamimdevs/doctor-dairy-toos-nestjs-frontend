// src/redux/api/addressApi.ts
import { tagTypes } from "../tag-types";
import { baseApi } from "./baseApi";

const ADDRESS_URL = "/addresses";

export interface IAddress {
  id: string;
  user_id: string;
  full_name?: string;
  phone: string;
  email?: string;
  area?: string;
  division?: string;
  district?: string;
  city?: string;
  state?: string;
  zip?: string;
  country?: string;
  address: string;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

export interface ICreateAddressDto {
  user_id: string;
  full_name?: string;
  phone: string;
  email?: string;
  area?: string;
  division?: string;
  district?: string;
  city?: string;
  state?: string;
  zip?: string;
  country?: string;
  address: string;
  is_default?: boolean;
}

export interface IUpdateAddressDto {
  full_name?: string;
  phone?: string;
  email?: string;
  area?: string;
  division?: string;
  district?: string;
  city?: string;
  state?: string;
  zip?: string;
  country?: string;
  address?: string;
  is_default?: boolean;
}

export interface IApiResponse<T> {
  apiVersion: string;
  success: boolean;
  message: string;
  status: number;
  data: T;
  meta?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export const addressApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    // Get My Addresses
    getMyAddresses: build.query<IApiResponse<IAddress[]>, void>({
      query: () => ({
        url: `${ADDRESS_URL}/my-addresses`,
        method: "GET",
      }),
      providesTags: [tagTypes.addresses],
    }),

    // Get All Addresses (Admin)
    getAllAddresses: build.query<
      IApiResponse<IAddress[]>,
      { page?: number; limit?: number } | void
    >({
      query: (params) => ({
        url: ADDRESS_URL,
        method: "GET",
        params: params || {},
      }),
      providesTags: [tagTypes.addresses],
    }),

    // Get Single Address
    getAddressById: build.query<IApiResponse<IAddress>, string>({
      query: (id) => ({
        url: `${ADDRESS_URL}/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: tagTypes.addresses, id }],
    }),

    // Create Address
    createAddress: build.mutation<IApiResponse<IAddress>, ICreateAddressDto>({
      query: (data) => ({
        url: `${ADDRESS_URL}/create`,
        method: "POST",
        data,
      }),
      invalidatesTags: [tagTypes.addresses],
    }),

    // Update Address
    updateAddress: build.mutation<
      IApiResponse<IAddress>,
      { id: string; data: IUpdateAddressDto }
    >({
      query: ({ id, data }) => ({
        url: `${ADDRESS_URL}/${id}`,
        method: "PATCH",
        data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: tagTypes.addresses, id },
        tagTypes.addresses,
      ],
    }),

    // Delete Address
    deleteAddress: build.mutation<IApiResponse<void>, string>({
      query: (id) => ({
        url: `${ADDRESS_URL}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [tagTypes.addresses],
    }),
  }),
});

// Export hooks
export const {
  useGetMyAddressesQuery,
  useGetAllAddressesQuery,
  useGetAddressByIdQuery,
  useCreateAddressMutation,
  useUpdateAddressMutation,
  useDeleteAddressMutation,
} = addressApi;
