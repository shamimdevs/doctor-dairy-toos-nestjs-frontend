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

// Endpoints where a 401 means "these credentials/this code are wrong" —
// never attempt a silent token refresh+retry for these. Doing so for e.g.
// /auth/sign-in meant a wrong-password attempt (with no refresh token
// cookie yet, since the user was never logged in) would try to refresh
// anyway, that refresh would itself 401, and — see the queuing fix below —
// that used to hang the original request forever instead of surfacing the
// real "Invalid email or password" error.
const AUTH_ENDPOINTS_TO_SKIP_REFRESH = [
  "/auth/sign-in",
  "/auth/admin-sign-in",
  "/auth/refresh-token",
  "/auth/verify-otp",
  "/auth/resend-otp",
  "/auth/forget-password",
  "/auth/reset-password",
  "/auth/change-password",
  "/users/sign-up",
];

const isAuthEndpoint = (url?: string): boolean =>
  !!url && AUTH_ENDPOINTS_TO_SKIP_REFRESH.some((path) => url.includes(path));

let isRefreshing = false;
let pendingRequests: Array<{
  resolve: (value: unknown) => void;
  reject: (reason: unknown) => void;
  config: RetryAxiosRequestConfig;
}> = [];

instance.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError<ApiErrorResponse>) => {
    const config = error.config as RetryAxiosRequestConfig;

    const shouldAttemptRefresh =
      error.response?.status === 401 &&
      !!config &&
      !config._retry &&
      !isAuthEndpoint(config.url);

    if (shouldAttemptRefresh) {
      config._retry = true;

      if (!isRefreshing) {
        isRefreshing = true;

        try {
          await getNewAccessToken();

          const queued = pendingRequests;
          pendingRequests = [];
          queued.forEach(({ resolve, reject, config: queuedConfig }) => {
            instance(queuedConfig).then(resolve).catch(reject);
          });

          return instance(config);
        } catch (refreshError) {
          // The refresh itself failed — nothing queued behind it can
          // succeed either. Reject them instead of leaving them hanging
          // forever waiting for a refresh that will never come.
          const queued = pendingRequests;
          pendingRequests = [];
          queued.forEach(({ reject }) => reject(refreshError));
          throw refreshError;
        } finally {
          isRefreshing = false;
        }
      }

      return new Promise((resolve, reject) => {
        pendingRequests.push({ resolve, reject, config });
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
