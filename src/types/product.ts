// types/product.ts
export interface PackSize {
  id: string;
  label: string;
  quantity: number;
  stripCount?: number;
  price: number;
  originalPrice: number;
  discount: number;
  inStock?: boolean;
}

// types/product.ts
export interface ProductVariant {
  id: string;
  strength: string;
  pack_size: string;
  sku: string;
  price: number;
  discount_price?: number;
  stock: number;
  weight?: number;
  expiry_date?: string;
  is_active: boolean;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  thumbnail?: string;
  manufacturer?: string;
  is_prescription_required: boolean;
  is_active: boolean;
  category?: {
    id: string;
    name: string;
    slug: string;
  };
  brand?: {
    id: string;
    name: string;
  };
  variants: ProductVariant[];
  price_range: {
    min: number;
    max: number;
  };
  discount_range?: {
    min: number;
    max: number;
  };
  created_at: string;
  updated_at: string;
}
