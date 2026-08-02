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

export interface ProductSpecification {
  label: string;
  value: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  thumbnail?: string;
  images?: string[]; // Additional gallery images (up to 5)
  description?: string;
  specifications?: ProductSpecification[];
  rating_avg?: number | null; // Average rating out of 5
  reviews_count?: number;
  manufacturer?: string;
  is_prescription_required: boolean;
  is_active: boolean;
  price: number; // Regular price
  original_price: number; // Regular price
  discount_price?: number; // Discounted price (optional)
  stock: number; // Stock quantity
  weight?: number; // Product weight
  category?: {
    id: string;
    name: string;
    slug: string;
  };
  brand?: {
    id: string;
    name: string;
  };
  addedBy?: {
    id: string;
    name: string;
    email: string;
    role?: string;
  };
  meta_title?: string;
  meta_description?: string;
  meta_keywords?: string;
  created_at: string;
  updated_at: string;
  // Optional: If you still need these for some cases
  variants?: ProductVariant[];
  price_range?: {
    min: number;
    max: number;
  };
  discount_range?: {
    min: number;
    max: number;
  };
}
