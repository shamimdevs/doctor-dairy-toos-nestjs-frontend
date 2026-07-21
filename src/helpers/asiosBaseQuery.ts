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
          "Content-Type": contentType
            ? "multipart/form-data"
            : "application/json",
        },
        withCredentials: true,
      });

      return { data: result.data };
    } catch (axiosError) {
      console.log("axiosError", axiosError);
      const err = axiosError as AxiosError<ApiErrorResponse>;

      if (Array.isArray(err?.message)) {
        err.message = err.message[0];
      }
      //   return {
      //     error: {
      //       status: err.response?.status || 500,
      //       message: Array.isArray(err.response?.data?.message)
      //         ? err.response?.data?.message[0]
      //         : err.response?.data?.message || err.message,
      //     },
      //   };
      return {
        error: {
          // Extract status code from error response
          status: err.response?.status || 500,
          // Extract error data from error response or use error message
          message: err.message,
        },
      };
    }
  };
