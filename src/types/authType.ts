export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  mobile?: string;
}

export interface UserProfileResponse {
  apiVersion: string;
  success: boolean;
  message: string;
  status: number;
  data: {
    user: User;
  };
}

// // This matches exactly what the backend returns
export interface VerifyResponse {
  success: boolean;
  message: string;
  data: {
    role_status?: boolean;
    [key: string]: unknown;
  };
}

export interface VerifyApiResponse {
  apiVersion: string;
  success: boolean;
  message: string;
  status: number;
  data: {
    apiVersion: string;
    success: boolean;
    message: string;
    status: number;
    data: {
      verified: boolean;
      role: string;
    };
  };
}
export interface EmailRequest {
  email: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data: OtpData;
}

export interface ResetPasswordRequest {
  email: string;
  otp: string;
  password: string;
}

export interface SignInRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  apiVersion: string;
  success: boolean;
  message: string;
  status: number;
  data: OtpData;
  links: AuthLinks;
}

export interface OtpData {
  id: string;
  added_by: string;
  attempt: number;
  expire_at: string;
  created_at: string;
  updated_at: string;
}

export interface AuthLinks {
  self: string;
  get: string;
  update: string;
  delete: string;
}

export interface VerifyOtpRequest {
  user_id: string;
  otp_code: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  accessToken: string;
  data: string;
  user: {
    id: string;
    email: string;
    name: string;
  };
}

export interface ApiError {
  data?: {
    message?: string;
  };
  message?: string;
}
