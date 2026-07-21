// redux/rootReducer.ts
import { combineReducers } from "redux";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { baseApi } from "./api/baseApi";
import sidebarSlice from "./features/sidebarSlice";
import otpSlice from "./features/otpSlice";
import authSlice from "./features/auth/authSlice";
import cartSlice from "./features/cartSlice";
import wishlistSlice from "./features/wishlistSlice";

// Individual persist configs with different keys
const sidebarPersistConfig = {
  key: "sidebar",
  storage,
};

const authPersistConfig = {
  key: "auth",
  storage,
};

const otpPersistConfig = {
  key: "otp",
  storage,
};

const cartPersistConfig = {
  key: "cart",
  storage,
  // Whitelist specific reducers to persist
  whitelist: ["cartItems", "totalAmount", "totalQuantity"],
};

const wishlistPersistConfig = {
  key: "wishlist",
  storage,
  whitelist: ["items", "totalItems", "isWishlistOpen"],
};

const persistedSideBarTree = persistReducer(sidebarPersistConfig, sidebarSlice);
const persistedAuth = persistReducer(authPersistConfig, authSlice);
const persistedOtp = persistReducer(otpPersistConfig, otpSlice);
const persistedCart = persistReducer(cartPersistConfig, cartSlice);
const persistedWishlist = persistReducer(wishlistPersistConfig, wishlistSlice);

// Combine all reducers
export const rootReducer = combineReducers({
  [baseApi.reducerPath]: baseApi.reducer,
  auth: persistedAuth,
  otp: persistedOtp,
  cart: persistedCart,
  wishlist: persistedWishlist,
  adminTree: persistedSideBarTree,
});

export type RootReducerType = ReturnType<typeof rootReducer>;
