export interface BlogCategory {
  id: string;
  category_name: string;
  slug?: string;
  description?: string;
  status?: boolean;
  added_by: string;
  created_at: string;
  updated_at: string;
}

export interface CreateBlogCategoryRequest {
  category_name: string;
  description?: string;
  status?: boolean;
}

export interface UpdateBlogCategoryRequest {
  id: string;
  data: Partial<CreateBlogCategoryRequest>;
}

export interface BlogCategoryPaginationQuery {
  page?: number;
  limit?: number;
  search?: string;
  status?: boolean;
  sortBy?: string;
  sortOrder?: "ASC" | "DESC";
}

export interface BlogCategoriesPaginatedResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: BlogCategory[];
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
