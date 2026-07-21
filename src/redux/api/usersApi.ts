import { tagTypes } from "../tag-types";
import { baseApi } from "./baseApi";

const USER_URL = "/users";

export const userApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    createUser: build.mutation({
      query: (data) => ({
        url: `${USER_URL}/sign-up`,
        method: "POST",
        data,
      }),
      invalidatesTags: [tagTypes.user],
    }),

    getUsers: build.query({
      query: (arg) => ({
        url: USER_URL,
        method: "GET",
        params: arg,
      }),
      providesTags: [tagTypes.user],
    }),

    getSingleUser: build.query({
      query: (id) => ({
        url: `${USER_URL}/${id}`,
        method: "GET",
      }),
      providesTags: [tagTypes.user],
    }),

    getSingleUserForResendOTP: build.query({
      query: (id) => ({
        url: `${USER_URL}/for-resend-otp/${id}`,
        method: "GET",
      }),
      providesTags: [tagTypes.user],
    }),

    updateMyProfile: build.mutation({
      query: ({ id, data }) => ({
        url: `${USER_URL}/${id}`,
        method: "PATCH",
        contentType: true,
        data: data,
      }),
      invalidatesTags: [tagTypes.user, tagTypes.auth],
    }),

    updateEmail: build.mutation({
      query: (data) => ({
        url: `${USER_URL}/update-email`,
        method: "PATCH",
        data: data,
      }),
      invalidatesTags: [tagTypes.user, tagTypes.auth],
    }),

    deleteUser: build.mutation({
      query: (id) => ({
        url: `${USER_URL}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [tagTypes.user],
    }),
  }),
});

export const {
  useCreateUserMutation,
  useGetSingleUserQuery,
  useGetUsersQuery,
  useGetSingleUserForResendOTPQuery,
  useDeleteUserMutation,
  useUpdateMyProfileMutation,
  useUpdateEmailMutation,
} = userApi;
