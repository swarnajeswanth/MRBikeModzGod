import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type UserRole = "customer" | "retailer";

export interface WishlistItem {
  id: string;
  name: string;
  price: number;
  image?: string;
  category: string;
}

export interface UserState {
  id?: string;
  username: string;
  image: string;
  role: UserRole;
  wishlist: WishlistItem[];
  isLoggedIn: boolean;
  dateOfBirth: string;
  phoneNumber: string;
  // Loading states
  loginLoading: boolean;
  signupLoading: boolean;
  logoutLoading: boolean;
}

const initialState: UserState = {
  username: "",
  image: "",
  role: "customer",
  wishlist: [],
  isLoggedIn: false,
  dateOfBirth: "",
  phoneNumber: "",
  loginLoading: false,
  signupLoading: false,
  logoutLoading: false,
};

type AuthPayload = Omit<
  UserState,
  "isLoggedIn" | "wishlist" | "loginLoading" | "signupLoading" | "logoutLoading"
>;

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<AuthPayload>) => {
      state.id = action.payload.id;
      state.username = action.payload.username;
      state.image = action.payload.image;
      state.role = action.payload.role;
      state.dateOfBirth = action.payload.dateOfBirth;
      state.phoneNumber = action.payload.phoneNumber;
      state.isLoggedIn = true;
    },
    logout: (state) => {
      state.id = undefined;
      state.username = "";
      state.image = "";
      state.role = "customer";
      state.wishlist = [];
      state.isLoggedIn = false;
      state.dateOfBirth = "";
      state.phoneNumber = "";
    },
    toggleWishlist: (state, action: PayloadAction<WishlistItem>) => {
      const existingIndex = state.wishlist.findIndex(
        (item) => item.id === action.payload.id
      );
      if (existingIndex >= 0) {
        state.wishlist.splice(existingIndex, 1);
      } else {
        state.wishlist.push(action.payload);
      }
    },
    syncWishlistWithBackend: (state, action: PayloadAction<WishlistItem[]>) => {
      state.wishlist = action.payload;
    },
    loadWishlistFromBackend: (state, action: PayloadAction<string[]>) => {
      // Convert product IDs to wishlist items (this will be populated with product details later)
      state.wishlist = action.payload.map((id) => ({
        id,
        name: "", // Will be populated when products are loaded
        price: 0,
        category: "",
      }));
    },
    removeFromWishlist: (state, action: PayloadAction<string>) => {
      const existingIndex = state.wishlist.findIndex(
        (item) => item.id === action.payload
      );
      if (existingIndex >= 0) {
        state.wishlist.splice(existingIndex, 1);
      }
    },
    clearWishlist: (state) => {
      state.wishlist = [];
    },
    setLoginLoading: (state, action: PayloadAction<boolean>) => {
      state.loginLoading = action.payload;
    },
    setSignupLoading: (state, action: PayloadAction<boolean>) => {
      state.signupLoading = action.payload;
    },
    setLogoutLoading: (state, action: PayloadAction<boolean>) => {
      state.logoutLoading = action.payload;
    },
  },
});

export const {
  setUser,
  logout,
  toggleWishlist,
  removeFromWishlist,
  clearWishlist,
  syncWishlistWithBackend,
  loadWishlistFromBackend,
  setLoginLoading,
  setSignupLoading,
  setLogoutLoading,
} = userSlice.actions;

export default userSlice.reducer;
