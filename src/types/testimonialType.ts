// ==========================================
// 1. Core Entity Model
// ==========================================
export interface TestimonialUserSummary {
  id: string;
  name?: string;
  email?: string;
  role?: string;
}

export interface TestimonialItem {
  id: string;
  name: string;
  designation: string;
  image?: string;
  description: string;
  rating: number;
  product_id?: string;
  reviewGenerated?: number;
  performance?: number;
  addedBy?: TestimonialUserSummary;
  created_at: string;
  updated_at: string;
  deleted_at?: string;
}

// ==========================================
// 2. Request Payloads
// ==========================================
export interface CreateTestimonialRequest {
  name: string;
  designation: string;
  description: string;
  rating: number;
  product_id?: string;
  reviewGenerated?: number;
  performance?: number;
  image?: File | string;
}

export interface UpdateTestimonialRequest {
  id: string;
  data: FormData;
}

// ==========================================
// 3. Query Parameters
// ==========================================
export interface TestimonialQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  product_id?: string;
  rating?: number;
  sort_by?: string;
  sort_order?: "ASC" | "DESC";
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

export interface PaginationLinks {
  first?: string;
  last?: string;
  current?: string;
  next?: string;
  previous?: string;
}

export interface BaseApiResponse {
  apiVersion?: string;
  statusCode?: number;
  status?: number;
  success: boolean;
  message: string;
}

export interface SingleTestimonialResponse extends BaseApiResponse {
  data: TestimonialItem;
}

export interface TestimonialPaginatedResponse extends BaseApiResponse {
  meta: PaginationMeta;
  links?: PaginationLinks;
  data: TestimonialItem[];
}
