import type { AxiosResponse } from "axios";
import { instance as axiosInstance } from "../helpers/axiosInstance";

export interface RefreshTokenResponse {
  accessToken: string;
}

export const getNewAccessToken = async (): Promise<
  AxiosResponse<RefreshTokenResponse>
> => {
  return axiosInstance.post<RefreshTokenResponse>(
    `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh-token`,
    {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    },
  );
};
