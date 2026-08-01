// Define Types for Video Gallery
export interface VideoGallaryItem {
  id: string;
  title: string;
  description: string;
  thumbnail?: string;
  video_url?: string;
  is_active?: boolean;
  added_by: string;
  video_gallary_category_id: string;
  addedBy?: {
    id: string;
    name?: string;
    email?: string;
    role?: string;
  };
  videoGallaryCategory?: {
    id: string;
    title?: string;
  };
  created_at: string;
  updated_at: string;
  deleted_at?: string;
}

export interface VideoGallaryQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: "ASC" | "DESC";
  video_gallary_category_id?: string;
  is_active?: boolean;
}

export interface VideoGallaryPaginatedResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: VideoGallaryItem[];
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
