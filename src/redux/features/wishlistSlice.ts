/* eslint-disable @typescript-eslint/no-explicit-any */
// src/redux/features/wishlistSlice.ts
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { IWishlistItem } from "../api/wishlistApi";

export interface WishlistState {
  items: IWishlistItem[];
  totalItems: number;
  isLoading: boolean;
  error: string | null;
  isWishlistOpen: boolean;
}

const initialState: WishlistState = {
  items: [],
  totalItems: 0,
  isLoading: false,
  error: null,
  isWishlistOpen: false,
};

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    // ✅ Set all wishlist items
    setWishlistItems: (state, action: PayloadAction<IWishlistItem[]>) => {
      state.items = Array.isArray(action.payload) ? action.payload : [];
      state.totalItems = state.items.length;
    },

    // ✅ Add item to wishlist
    addToWishlistLocal: (state, action: PayloadAction<IWishlistItem>) => {
      const exists = state.items.some(
        (item) => item.product_id === action.payload.product_id,
      );
      if (!exists) {
        state.items.push(action.payload);
        state.totalItems = state.items.length;
      }
    },

    // ✅ Remove item from wishlist
    removeFromWishlistLocal: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(
        (item) => item.product_id !== action.payload,
      );
      state.totalItems = state.items.length;
    },

    // ✅ Clear all wishlist items
    clearWishlist: (state) => {
      state.items = [];
      state.totalItems = 0;
    },

    // ✅ Set loading state
    setWishlistLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },

    // ✅ Set error state
    setWishlistError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },

    // ✅ Open wishlist drawer
    openWishlist: (state) => {
      state.isWishlistOpen = true;
    },

    // ✅ Close wishlist drawer
    closeWishlist: (state) => {
      state.isWishlistOpen = false;
    },

    // ✅ Toggle wishlist drawer
    toggleWishlist: (state) => {
      state.isWishlistOpen = !state.isWishlistOpen;
    },
  },
});

export const {
  setWishlistItems,
  addToWishlistLocal,
  removeFromWishlistLocal,
  clearWishlist,
  setWishlistLoading,
  setWishlistError,
  openWishlist,
  closeWishlist,
  toggleWishlist,
} = wishlistSlice.actions;

// ✅ Selectors with proper array fallbacks
export const selectWishlistItems = (state: any): IWishlistItem[] => {
  const items = state?.wishlist?.items;
  return Array.isArray(items) ? items : [];
};

export const selectWishlistTotal = (state: any): number => {
  return state?.wishlist?.totalItems || 0;
};

export const selectWishlistLoading = (state: any): boolean => {
  return state?.wishlist?.isLoading || false;
};

export const selectWishlistError = (state: any): string | null => {
  return state?.wishlist?.error || null;
};

export const selectWishlistOpen = (state: any): boolean => {
  return state?.wishlist?.isWishlistOpen || false;
};

export const selectIsInWishlist = (state: any, productId: string): boolean => {
  const items = state?.wishlist?.items;
  if (!Array.isArray(items)) return false;
  return items.some((item: IWishlistItem) => item.product_id === productId);
};

export default wishlistSlice.reducer;
