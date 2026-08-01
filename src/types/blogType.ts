// ==========================================
// 1. Core Entity Model
// ==========================================
export interface BlogItem {
  id: string;
  title: string;
  slug?: string;
  author_name?: string;
  image?: string;
  excerpt?: string;
  content?: string;
  read_time?: string;
  tags?: string[];
  position?: number;
  is_featured?: boolean;
  status?: boolean;
  category_id?: string;
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
export interface SingleBlogResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: BlogItem;
}

export interface BlogPaginatedResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: BlogItem[];
  meta?: {
    total: number;
    page: number;
    limit: number;
    total_pages: number;
    has_more?: boolean;
  };
}
