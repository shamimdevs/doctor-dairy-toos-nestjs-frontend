// ==========================================
// 1. Core Entity Model
// ==========================================
export interface BlogCategory {
  id: string;
  category_name: string;
  slug?: string | null;
  description?: string | null;
  status?: boolean;
  added_by?: string;
  created_at?: string;
  updated_at?: string;
}

export interface BlogItem {
  id: string;
  title: string;
  slug?: string | null;
  author_name?: string;
  image?: string;
  excerpt?: string | null;
  content?: string;
  read_time?: string | null;
  tags?: string[] | null;
  position?: number | null;
  is_featured?: boolean;
  status?: boolean;
  category_id?: string;
  category?: BlogCategory;
  added_by?: string;

  // SEO Metadata (Optional fields)
  meta_title?: string | null;
  meta_keywords?: string | null;
  meta_description?: string | null;

  created_at: string;
  updated_at: string;
}

// ==========================================
// 2. Request Payloads
// ==========================================
export interface CreateBlogRequest {
  title: string;
  slug?: string;
  author_name?: string;
  excerpt?: string;
  content?: string;
  read_time?: string;
  tags?: string[];
  position?: number;
  is_featured?: boolean;
  status?: boolean;
  category_id?: string;
  image?: File | string;

  // SEO Metadata
  meta_title?: string;
  meta_keywords?: string;
  meta_description?: string;
}

export interface UpdateBlogRequest {
  id: string;
  data: FormData;
}

// ==========================================
// 3. Query Parameters
// ==========================================
export interface BlogQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  category_id?: string;
  status?: boolean;
  is_featured?: boolean;
  sort_by?: string;
  sort_order?: "ASC" | "DESC";
}

// ==========================================
// 4. API Response Wrappers
// ==========================================
export interface BaseApiResponse {
  apiVersion?: string;
  statusCode?: number;
  status?: number;
  success: boolean;
  message: string;
}

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

export interface SingleBlogResponse extends BaseApiResponse {
  data: BlogItem;
}

export interface BlogPaginatedResponse extends BaseApiResponse {
  meta: PaginationMeta;
  links?: PaginationLinks;
  data: BlogItem[];
}
