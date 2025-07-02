import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type UserRole = "customer" | "retailer";

interface UserState {
  username: string;
  image: string;
  role: UserRole;
  wishlist: string[];
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

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    // Login: Sets all user data and marks as logged in
    login: (state, action: PayloadAction<UserState>) => {
      return {
        ...action.payload,
        isLoggedIn: true,
      };
    },

    // Signup: Same as login, but kept separate for clarity
    signup: (state, action: PayloadAction<UserState>) => {
      return {
        ...action.payload,
        isLoggedIn: true,
      };
    },

    // Logout: Clear all user data
    logout: () => initialState,

    // Update profile info (not wishlist or login status)
    updateProfile: (
      state,
      action: PayloadAction<Partial<Omit<UserState, "wishlist" | "isLoggedIn">>>
    ) => {
      Object.assign(state, action.payload);
    },

    // Add product ID to wishlist
    addToWishlist: (state, action: PayloadAction<string>) => {
      if (!state.wishlist.includes(action.payload)) {
        state.wishlist.push(action.payload);
      }
    },

    // Remove product ID from wishlist
    removeFromWishlist: (state, action: PayloadAction<string>) => {
      state.wishlist = state.wishlist.filter((id) => id !== action.payload);
    },
  },
});

export const {
  login,
  signup,
  logout,
  updateProfile,
  addToWishlist,
  removeFromWishlist,
} = userSlice.actions;

export default userSlice.reducer;
