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

export interface ProductCategoriesPaginatedResponse {
  success: boolean;
  message: string;
  data: ProductCategory[];
  meta: PaginationQuery;
}

export interface UpdateProductCategoryRequest {
  id: string;
  data: FormData;
}
export interface PaginationQuery {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}
