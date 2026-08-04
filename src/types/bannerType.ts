// ==========================================
// 1. Core Entity Model
// ==========================================
export type BannerType = "hero_slider" | "hero_side";

export interface BannerUserSummary {
  id: string;
  name?: string;
  email?: string;
}

export interface BannerItem {
  id: string;
  title: string;
  type: BannerType;
  image_url: string;
  redirect_url?: string;
  position: number;
  is_active: boolean;
  addedBy?: BannerUserSummary;
  created_at: string;
  updated_at: string;
}

// ==========================================
// 2. Request Payloads
// ==========================================
export interface UpdateBannerRequest {
  id: string;
  data: FormData | Partial<Record<string, unknown>>;
}

// ==========================================
// 3. Query Parameters
// ==========================================
export interface BannerQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  type?: BannerType;
  is_active?: boolean;
}

// ==========================================
// 4. API Response Wrappers
// ==========================================
export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface BaseApiResponse {
  success?: boolean;
  message?: string;
}

export interface SingleBannerResponse extends BaseApiResponse {
  data: BannerItem;
}

export interface BannerPaginatedResponse extends BaseApiResponse {
  meta: PaginationMeta;
  data: BannerItem[];
}
