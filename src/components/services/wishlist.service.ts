/* eslint-disable @typescript-eslint/no-explicit-any */
// src/services/wishlist.service.ts
const API_URL = process.env.NEXT_PUBLIC_API_URL;

export interface IWishlistProduct {
  id: string;
  name: string;
  slug: string;
  thumbnail?: string;
  price?: number;
  discount_price?: number;
  variants?: any[];
  price_range?: {
    min: number;
    max: number;
  };
}

export interface IWishlistItem {
  id: string;
  user_id: string;
  product_id: string;
  product: IWishlistProduct;
  created_at: string;
  updated_at: string;
}

export interface IWishlistResponse {
  apiVersion: string;
  success: boolean;
  message: string;
  status: number;
  data: IWishlistItem[];
  meta?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

// ✅ Server-side function to fetch wishlist
export async function getWishlist(cookie?: string): Promise<IWishlistResponse> {
  if (!API_URL) {
    throw new Error("NEXT_PUBLIC_API_URL is not defined");
  }

  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  // ✅ Add cookie if provided
  if (cookie) {
    headers["Cookie"] = cookie;
  }

  const res = await fetch(`${API_URL}/wishlists`, {
    cache: "no-store",
    headers,
  });

  if (!res.ok) {
    throw new Error("Failed to fetch wishlist");
  }

  return res.json();
}

// ✅ Server-side function to remove from wishlist
export async function removeFromWishlist(
  id: string,
  cookie?: string,
): Promise<any> {
  if (!API_URL) {
    throw new Error("NEXT_PUBLIC_API_URL is not defined");
  }

  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  if (cookie) {
    headers["Cookie"] = cookie;
  }

  const res = await fetch(`${API_URL}/wishlists/${id}`, {
    method: "DELETE",
    headers,
  });

  if (!res.ok) {
    throw new Error("Failed to remove from wishlist");
  }

  return res.json();
}
