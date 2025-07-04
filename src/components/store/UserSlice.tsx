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
  username: string;
  image: string;
  role: UserRole;
  wishlist: WishlistItem[];
  isLoggedIn: boolean;
  dateOfBirth: string;
  phoneNumber: string;
}

const initialState: UserState = {
  username: "",
  image: "",
  role: "customer",
  wishlist: [],
  isLoggedIn: false,
  dateOfBirth: "",
  phoneNumber: "",
};

// Payload from login/signup (excluding isLoggedIn and wishlist)
type AuthPayload = Omit<UserState, "isLoggedIn" | "wishlist">;

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    login: (state, action: PayloadAction<AuthPayload>) => {
      return {
        ...state,
        ...action.payload,
        isLoggedIn: true,
      };
    },

    logout: () => initialState,

    updateProfile: (
      state,
      action: PayloadAction<Partial<Omit<UserState, "wishlist" | "isLoggedIn">>>
    ) => {
      Object.assign(state, action.payload);
    },

    addToWishlist: (state, action: PayloadAction<WishlistItem>) => {
      const existingItem = state.wishlist.find(
        (item) => item.id === action.payload.id
      );
      if (!existingItem) {
        state.wishlist.push(action.payload);
      }
    },

    removeFromWishlist: (state, action: PayloadAction<string>) => {
      state.wishlist = state.wishlist.filter(
        (item) => item.id !== action.payload
      );
    },

    clearWishlist: (state) => {
      state.wishlist = [];
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
  },
});

export const {
  login,
  logout,
  updateProfile,
  addToWishlist,
  removeFromWishlist,
  clearWishlist,
  toggleWishlist,
} = userSlice.actions;

export default userSlice.reducer;
