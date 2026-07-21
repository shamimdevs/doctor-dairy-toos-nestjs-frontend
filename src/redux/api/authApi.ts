// src/redux/api/authApi.ts
import {
  EmailRequest,
  LoginResponse,
  ResetPasswordRequest,
  SignInRequest,
  UserProfileResponse,
  VerifyApiResponse,
  VerifyOtpRequest,
  VerifyResponse,
} from "@/src/types/authType";
import { tagTypes } from "../tag-types";
import { baseApi } from "./baseApi";

const AUTH_URL = "/auth";

// ✅ Add SignOutResponse type
export interface SignOutResponse {
  message: string;
}

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // ✅ LOGIN
    login: builder.mutation<LoginResponse, SignInRequest>({
      query: (data) => ({
        url: `${AUTH_URL}/sign-in`,
        method: "POST",
        data,
      }),
      invalidatesTags: [tagTypes.user],
    }),
    // ✅ LOGOUT - Fix response type
    signOut: builder.mutation<SignOutResponse, void>({
      query: () => ({
        url: `${AUTH_URL}/sign-out`,
        method: "POST",
      }),
      invalidatesTags: [tagTypes.auth],
    }),
    // ✅ useVerifyMutation
    verify: builder.mutation<VerifyApiResponse, void>({
      query: () => ({
        url: `${AUTH_URL}/verify`,
        method: "GET",
      }),
    }),
    // ✅ VERIFY OTP
    verifyOTP: builder.mutation<VerifyResponse, VerifyOtpRequest>({
      query: (data) => ({
        url: `${AUTH_URL}/verify-otp`,
        method: "POST",
        data,
      }),
      invalidatesTags: [tagTypes.auth],
    }),
    // ✅ RESEND OTP
    resendOTP: builder.mutation<void, EmailRequest>({
      query: (data) => ({
        url: `${AUTH_URL}/resend-otp`,
        method: "POST",
        data,
      }),
      invalidatesTags: [tagTypes.auth],
    }),
    // ✅ FORGET PASSWORD
    forgetPassword: builder.mutation<void, EmailRequest>({
      query: (data) => ({
        url: `${AUTH_URL}/forget-password`,
        method: "POST",
        data,
      }),
      invalidatesTags: [tagTypes.auth],
    }),
    // ✅ FORGET PASSWORD RESEND OTP
    forgetPasswordResendOtp: builder.mutation<void, EmailRequest>({
      query: (data) => ({
        url: `${AUTH_URL}/forget-password/resend-otp`,
        method: "POST",
        data,
      }),
      invalidatesTags: [tagTypes.auth],
    }),
    // ✅ RESET PASSWORD
    resetPassword: builder.mutation<void, ResetPasswordRequest>({
      query: (data) => ({
        url: `${AUTH_URL}/reset-password`,
        method: "POST",
        data,
      }),
      invalidatesTags: [tagTypes.auth],
    }),
    // ✅ GET MY PROFILE
    getMyProfile: builder.query<UserProfileResponse, void>({
      query: () => ({
        url: `${AUTH_URL}/get-me`,
        method: "GET",
      }),
      providesTags: [tagTypes.auth],
    }),
  }),
});

// Export hooks
export const {
  useLoginMutation,
  useSignOutMutation,
  useVerifyOTPMutation,
  useResendOTPMutation,
  useForgetPasswordMutation,
  useResetPasswordMutation,
  useGetMyProfileQuery,
  useForgetPasswordResendOtpMutation,
  useVerifyMutation,
} = authApi;
