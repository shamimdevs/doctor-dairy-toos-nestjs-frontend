export interface Division {
  id: string;
  name: string;
  created_at?: string;
  updated_at?: string;
}

export interface DivisionQueryParams {
  page?: number;
  limit?: number;
  search?: string;
}

export interface District {
  id: string | number;
  name: string;
  division_id?: string | number;
  division?: {
    id: number;
    name: string;
  };
  created_at?: string;
  updated_at?: string;
}

// Global wrapper for your API responses
export interface ApiResponse<T> {
  success: boolean;
  status: number;
  message: string;
  apiVersion: string;
  data: T; // This can be an array or a single object
}

// Proper Query Params for searching and filtering
export interface DistrictsQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  division_id?: string | number;
}

export interface Upzela {
  // Using singular 'Upzela' for the object
  id: string | number;
  name: string;
  district_id?: string | number;
  district?: {
    id: number;
    name: string;
  };
  created_at?: string;
  updated_at?: string;
}

export interface UpzelasQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  district_id?: string | number; // Added for filtering
}

// Ensure your ApiResponse is accessible here
export interface ApiResponse<T> {
  success: boolean;
  status: number;
  message: string;
  apiVersion: string;
  data: T;
}
