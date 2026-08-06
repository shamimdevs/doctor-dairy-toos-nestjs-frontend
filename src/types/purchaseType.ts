// ==========================================
// 1. Core Entity Model
// ==========================================
export type PurchaseStatus = "pending" | "received" | "cancelled";

export interface PurchaseAddedBySummary {
  id: string;
  name?: string;
  email?: string;
}

export interface Purchase {
  id: string;
  product_name: string;
  image?: string;
  quantity: number;
  unit_price: number;
  total_amount: number;
  supplier_name: string;
  supplier_phone?: string;
  supplier_email?: string;
  supplier_address?: string;
  purchase_date: string;
  status: PurchaseStatus;
  notes?: string;
  addedBy?: PurchaseAddedBySummary;
  created_at: string;
  updated_at: string;
}

// ==========================================
// 2. Request Payloads
// ==========================================
export interface UpdatePurchaseRequest {
  id: string;
  data: FormData;
}

// ==========================================
// 3. Query Parameters
// ==========================================
export interface PurchaseQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: PurchaseStatus;
}

// ==========================================
// 4. API Response Wrappers
// ==========================================
export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface BaseApiResponse {
  success?: boolean;
  message?: string;
}

export interface SinglePurchaseResponse extends BaseApiResponse {
  data: Purchase;
}

export interface PurchasesPaginatedResponse extends BaseApiResponse {
  meta: PaginationMeta;
  data: Purchase[];
}
