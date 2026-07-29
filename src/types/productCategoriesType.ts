export interface ProductCategory {
  id: string;
  name: string;
  slug: string;
  image?: string;
  addedBy?: {
    id: string;
    name?: string;
    email?: string;
    role?: string;
  };
  created_at: string;
  updated_at: string;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ProductCategoryQueryParams {
  page?: number;
  limit?: number;
  search?: string;
}

export interface PaginationQuery {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface ProductCategoriesPaginatedResponse {
  success: boolean;
  message: string;
  data: ProductCategory[];
  meta: PaginationMeta;
}

export interface UpdateProductCategoryRequest {
  id: string;
  data: FormData;
}
