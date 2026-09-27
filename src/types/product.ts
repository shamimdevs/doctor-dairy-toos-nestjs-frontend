// src/types/product.ts

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

export interface ProductCategory {
  id: string;
  name: string;
  slug: string;
}

export interface ProductBrand {
  id: string;
  name: string;
}

export interface ProductAddedBy {
  id: string;
  name?: string;
  email?: string;
  role?: string;
}

export interface Product {
  // Basic information
  id: string;
  category_id: string;
  name: string;
  slug: string;

  // Pricing
  price: number;
  original_price?: number;
  discount_price?: number;

  // Inventory
  stock?: number;
  weight?: number;

  // Images
  thumbnail?: string;
  images?: string[];

  // Status
  is_active: boolean;

  // Description
  description?: string;

  // Specifications
  specifications?: ProductSpecification[];

  // Reviews
  rating_avg?: number | null;
  reviews_count?: number;

  // Display
  position?: number;

  // Optional product information
  manufacturer?: string;
  is_prescription_required?: boolean;

  // Relations
  category?: ProductCategory;
  brand?: ProductBrand;
  addedBy?: ProductAddedBy;

  // SEO
  meta_title?: string;
  meta_description?: string;
  meta_keywords?: string;

  // Dates
  created_at: string;
  updated_at: string;

  // Optional variants
  variants?: ProductVariant[];

  // Optional price range
  price_range?: {
    min: number;
    max: number;
  };

  // Optional discount range
  discount_range?: {
    min: number;
    max: number;
  };
}
