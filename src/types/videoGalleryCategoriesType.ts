export interface VideoGalleryCategory {
  id: string;
  title: string;
  added_by: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  deleted_at?: string | null;
  addedBy?: {
    id: string;
    name?: string;
    email?: string;
  };
}

export interface CreateVideoGalleryCategoryRequest {
  title: string;
  is_active?: boolean;
}

export interface UpdateVideoGalleryCategoryRequest {
  id: string;
  data: Partial<CreateVideoGalleryCategoryRequest>;
}

export interface VideoGalleryCategoriesPaginatedResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: VideoGalleryCategory[];
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
