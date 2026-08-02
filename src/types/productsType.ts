export interface ProductSpecification {
  label: string;
  value: string;
}

// Base Product Interface
export interface Product {
  id: string;
  category_id: string;
  name: string;
  price: number;
  discount_price?: number;
  original_price: number;
  stock?: number;
  weight?: number;
  slug: string;
  thumbnail?: string;
  images?: string[];
  description?: string;
  specifications?: ProductSpecification[];
  rating_avg?: number | null;
  reviews_count?: number;
  is_active: boolean;
  meta_title?: string;
  meta_keywords?: string;
  meta_description?: string;
  category?: {
    id: string;
    name: string;
    slug: string;
  };
  addedBy?: {
    id: string;
    name?: string;
    email?: string;
    role?: string;
  };
  created_at: string;
  updated_at: string;
}

// Search & Filter Query Parameters
export interface ProductQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  category_id?: string;
  min_price?: number;
  max_price?: number;
  sort_by?: string;
  sort_order?: "ASC" | "DESC";
  is_active?: boolean;
}

// Paginated Response Interface
export interface ProductsPaginatedResponse {
  statusCode: number;
  message: string;
  data: Product[];
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Request Types
export interface UpdateProductRequest {
  id: string;
  data: FormData; // Using FormData to handle multipart optional thumbnail upload
}

export interface AutocompleteQueryParams {
  search: string;
  limit?: number;
}

export interface SimilarProductsQueryParams {
  id: string;
  limit?: number;
}

export interface QuickSearchCategory {
  id: string;
  name: string;
  slug: string;
  image?: string;
}

export interface QuickSearchQueryParams {
  search?: string;
  limit?: number;
}

export interface QuickSearchResult {
  categories: QuickSearchCategory[];
  products: Product[];
}
