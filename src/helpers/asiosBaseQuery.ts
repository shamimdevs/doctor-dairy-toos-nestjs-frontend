import type { BaseQueryFn } from "@reduxjs/toolkit/query";
import { AxiosError, type AxiosRequestConfig } from "axios";
import { instance as axiosInstance } from "./axiosInstance";

interface AxiosBaseQueryArgs {
  url: string;
  method: AxiosRequestConfig["method"];
  data?: AxiosRequestConfig["data"];
  params?: AxiosRequestConfig["params"];
  headers?: AxiosRequestConfig["headers"];
  contentType?: boolean;
}

interface ApiErrorResponse {
  message?: string | string[];
}

interface BaseQueryError {
  status: number;
  message: string;
  data?: ApiErrorResponse;
}

export const axiosBaseQuery =
  (
    { baseUrl }: { baseUrl?: string } = {
      baseUrl: process.env.NEXT_PUBLIC_API_URL,
    },
  ): BaseQueryFn<AxiosBaseQueryArgs, unknown, BaseQueryError> =>
  async ({ url, method, data, params, headers, contentType }) => {
    try {
      const result = await axiosInstance({
        url: `${baseUrl}${url}`,
        method,
        data,
        params,
        headers: {
          ...headers,
          // For multipart/form-data (FormData bodies), let axios/the browser
          // set the Content-Type itself — it must include a `boundary=...`
          // parameter that we cannot generate here, and hard-coding the
          // header without one corrupts multipart parsing on the backend.
          ...(contentType ? {} : { "Content-Type": "application/json" }),
        },
        withCredentials: true,
      });

      return { data: result.data };
    } catch (axiosError) {
      // axiosInstance.ts's own response interceptor normalizes most
      // rejections into a flat `{ statusCode, message }` object (to keep
      // its refresh-token retry logic simple), which strips off `.response`
      // entirely before the error ever reaches here — so `err.response` is
      // frequently undefined even for a real HTTP error. Handle both the
      // raw AxiosError shape and that normalized shape so `err.data.message`
      // is reliably populated for every caller across the app.
      const err = axiosError as AxiosError<ApiErrorResponse> &
        Partial<{ statusCode: number; message: string }>;

      // Backend validation/auth errors can come back as a single string or
      // (from class-validator) an array of messages — normalize to one
      // string so callers' `err.data.message` is always a plain message.
      const responseMessage = Array.isArray(err.response?.data?.message)
        ? err.response?.data?.message[0]
        : err.response?.data?.message;

      const message =
        responseMessage || err.message || "Something went wrong.";

      return {
        error: {
          // Extract status code from error response
          status: err.response?.status || err.statusCode || 500,
          // Prefer the backend's actual error message (e.g. "Invalid email
          // or password.") over axios's generic "Request failed with
          // status code 401" — every caller reads `err.data.message` first.
          message,
          data: err.response?.data ?? { message },
        },
      };
    }
  };
