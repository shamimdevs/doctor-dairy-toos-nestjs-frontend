import type { AxiosRequestConfig } from "axios";

export interface AxiosBaseQueryArgs {
  url: string;
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH" | "HEAD" | "OPTIONS";
  data?: unknown;
  params?: Record<string, unknown>;
  headers?: Record<string, string>;
  contentType?: boolean;
  meta?: {
    pagination?: {
      limit?: number;
      pageNumber?: number;
      totalData?: number;
    };
  };
}

export interface SuccessResponse<T = unknown> {
  data: T;
  error?: never;
}

export interface ErrorResponse {
  statusCode?: number;
  message: string;
  data?: unknown;
}

export type QueryResponse<T = unknown> = SuccessResponse<T> | ErrorResponse;

export interface AxiosBaseQueryConfig {
  baseUrl?: string;
}

export interface ApiResponse<T = unknown> {
  success?: boolean;
  message?: string;
  data: T;
  meta?: {
    pagination?: {
      total: number;
      page: number;
      limit: number;
      pages: number;
    };
  };
}

export interface CustomAxiosRequestConfig extends AxiosRequestConfig {
  sent?: boolean; // Custom flag to prevent infinite retry loops
}

export interface PendingRequest {
  resolve: (value: unknown) => void;
  reject: (reason?: unknown) => void;
  config: CustomAxiosRequestConfig;
}
