// Bullet Item (used inside a blog section)
export interface BlogDetailBulletItem {
  title: string;
  text: string;
}

// Base Blog Detail (Section) Interface
export interface BlogDetail {
  id: string;
  blog_id: string;
  section_key?: string;
  heading?: string;
  body?: string;
  titles?: string[];
  bullets?: BlogDetailBulletItem[];
  image?: string;
  position: number;
  status: boolean;
  added_by?: string;
  added_by_user?: {
    id: string;
    name?: string;
    email?: string;
  };
  blog?: {
    id: string;
    title: string;
    slug?: string;
  };
  created_at: string;
  updated_at: string;
}

// Search & Filter Query Parameters
export interface BlogDetailQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  blog_id?: string;
  added_by?: string;
  status?: boolean;
  sort_by?: string;
  sort_order?: "ASC" | "DESC";
}

export interface BlogDetailsListPayload {
  data: BlogDetail[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Paginated Response Interface
// NOTE: the `/blog-details` list endpoint does not return `links`, so the
// global response interceptor does NOT flatten it — `meta`/`data` stay
// nested one level deeper than the other paginated endpoints.
export interface BlogDetailsPaginatedResponse {
  success: boolean;
  message: string;
  data: BlogDetailsListPayload;
}

// Request Types
export interface UpdateBlogDetailRequest {
  id: string;
  data: FormData; // Using FormData to handle multipart optional section image upload
}

export interface ReorderBlogDetailItem {
  id: string;
  position: number;
}

export interface ReorderBlogDetailsRequest {
  items: ReorderBlogDetailItem[];
}
