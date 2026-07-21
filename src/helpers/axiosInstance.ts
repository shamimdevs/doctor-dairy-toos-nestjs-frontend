// import axios, {
//   AxiosError,
//   type AxiosInstance,
//   type AxiosResponse,
//   type InternalAxiosRequestConfig,
// } from "axios";
// import { getNewAccessToken } from "../services/auth.services";

// interface RetryAxiosRequestConfig extends InternalAxiosRequestConfig {
//   _retry?: boolean;
// }

// interface ApiErrorResponse {
//   message?: string | string[];
// }

// interface NormalizedError {
//   statusCode: number;
//   message: string;
// }

// const instance: AxiosInstance = axios.create({
//   withCredentials: true,
//   timeout: 60000,
// });

// let isRefreshing = false;
// let pendingRequests: Array<() => void> = [];

// instance.interceptors.response.use(
//   (response: AxiosResponse) => response,
//   async (error: AxiosError<ApiErrorResponse>) => {
//     const config = error.config as RetryAxiosRequestConfig;

//     if (
//       (error.response?.status === 401 || error.response?.status === 403) &&
//       config &&
//       !config._retry &&
//       !config.url?.includes("/auth/refresh-token")
//     ) {
//       config._retry = true;

//       if (!isRefreshing) {
//         isRefreshing = true;

//         try {
//           await getNewAccessToken();
//           pendingRequests.forEach((cb) => cb());
//           pendingRequests = [];
//           return instance(config);
//         } catch (refreshError) {
//           window.location.href = "/login";
//           return Promise.reject(refreshError);
//         } finally {
//           isRefreshing = false;
//         }
//       }
//       return new Promise((resolve) => {
//         pendingRequests.push(() => resolve(instance(config)));
//       });
//     }

//     const responseObject: NormalizedError = {
//       statusCode: error.response?.status ?? 500,
//       message: Array.isArray(error.response?.data?.message)
//         ? error.response?.data?.message[0]
//         : (error.response?.data?.message ??
//           error.message ??
//           "Something went wrong!"),
//     };

//     return Promise.reject(responseObject);
//   },
// );

// export { instance };

import axios, {
  AxiosError,
  type AxiosInstance,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from "axios";
import { getNewAccessToken } from "../services/auth.services";

interface RetryAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

interface ApiErrorResponse {
  message?: string | string[];
}

interface NormalizedError {
  statusCode: number;
  message: string;
}

const instance: AxiosInstance = axios.create({
  withCredentials: true,
  timeout: 60000,
});

let isRefreshing = false;
let pendingRequests: Array<() => void> = [];

instance.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError<ApiErrorResponse>) => {
    const config = error.config as RetryAxiosRequestConfig;

    if (error.response?.status === 401 && config && !config._retry) {
      config._retry = true;

      if (!isRefreshing) {
        isRefreshing = true;

        try {
          await getNewAccessToken();
          pendingRequests.forEach((cb) => cb());
          pendingRequests = [];

          return instance(config);
        } finally {
          isRefreshing = false;
        }
      }

      return new Promise((resolve) => {
        pendingRequests.push(() => resolve(instance(config)));
      });
    }

    const responseObject: NormalizedError = {
      statusCode: error.response?.status ?? 500,
      message: Array.isArray(error.response?.data?.message)
        ? error.response?.data?.message[0]
        : (error.response?.data?.message ??
          error.message ??
          "Something went wrong!"),
    };

    return Promise.reject(responseObject);
  },
);

export { instance };
