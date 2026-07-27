// redux/features/cartSlice.ts
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  maxQuantity?: number;
  weight?: number;
  discount?: number;
  originalPrice?: number;
}

interface CartState {
  cartItems: CartItem[];
  totalAmount: number;
  totalQuantity: number;
}

const initialState: CartState = {
  cartItems: [],
  totalAmount: 0,
  totalQuantity: 0,
};

const calculateTotals = (state: CartState) => {
  state.totalQuantity = state.cartItems.reduce(
    (total, item) => total + item.quantity,
    0,
  );
  state.totalAmount = state.cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    ADD_TO_CART: (state, action: PayloadAction<CartItem>) => {
      const newItem = action.payload;
      const existingItem = state.cartItems.find(
        (item) => item.id === newItem.id,
      );

      if (!existingItem) {
        state.cartItems.push({
          ...newItem,
          quantity: newItem.quantity || 1,
        });
      } else {
        if (
          newItem.maxQuantity &&
          existingItem.quantity >= newItem.maxQuantity
        ) {
          return;
        }
        existingItem.quantity += newItem.quantity || 1;
      }
      calculateTotals(state);
    },

    REMOVE_FROM_CART: (state, action: PayloadAction<{ id: string }>) => {
      const { id } = action.payload;
      const existingItem = state.cartItems.find((item) => item.id === id);

      if (existingItem) {
        if (existingItem.quantity === 1) {
          state.cartItems = state.cartItems.filter((item) => item.id !== id);
        } else {
          existingItem.quantity--;
        }
      }
      calculateTotals(state);
    },

    DELETE_ITEM: (state, action: PayloadAction<{ id: string }>) => {
      const { id } = action.payload;
      state.cartItems = state.cartItems.filter((item) => item.id !== id);
      calculateTotals(state);
    },

    CLEAR_CART: (state) => {
      state.cartItems = [];
      state.totalAmount = 0;
      state.totalQuantity = 0;
    },

    UPDATE_QUANTITY: (
      state,
      action: PayloadAction<{
        id: string;
        quantity: number;
      }>,
    ) => {
      const { id, quantity } = action.payload;
      const item = state.cartItems.find((item) => item.id === id);

      if (item && quantity > 0) {
        if (item.maxQuantity && quantity > item.maxQuantity) {
          item.quantity = item.maxQuantity;
        } else {
          item.quantity = quantity;
        }
      }
      calculateTotals(state);
    },
  },
});

export const {
  ADD_TO_CART,
  REMOVE_FROM_CART,
  DELETE_ITEM,
  CLEAR_CART,
  UPDATE_QUANTITY,
} = cartSlice.actions;

export default cartSlice.reducer;
