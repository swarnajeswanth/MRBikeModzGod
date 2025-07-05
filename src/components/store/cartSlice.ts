import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  category: string;
  originalPrice?: number;
  discount?: string;
}

interface CartState {
  items: CartItem[];
  loading: boolean;
  error: string | null;
  // Individual operation loading states
  addLoading: boolean;
  removeLoading: boolean;
  updateLoading: boolean;
  clearLoading: boolean;
}

const initialState: CartState = {
  items: [],
  loading: false,
  error: null,
  addLoading: false,
  removeLoading: false,
  updateLoading: false,
  clearLoading: false,
};

// Async thunks for cart operations
export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async (product: Omit<CartItem, "quantity">, { dispatch }) => {
    dispatch(setAddLoading(true));
    try {
      // Simulate API call for now
      await new Promise((resolve) => setTimeout(resolve, 500));

      // In a real app, you would make an API call here
      // const response = await fetch("/api/cart/add", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify(product),
      // });

      return { ...product, quantity: 1 };
    } finally {
      dispatch(setAddLoading(false));
    }
  }
);

export const removeFromCart = createAsyncThunk(
  "cart/removeFromCart",
  async (productId: string, { dispatch }) => {
    dispatch(setRemoveLoading(true));
    try {
      // Simulate API call for now
      await new Promise((resolve) => setTimeout(resolve, 300));

      // In a real app, you would make an API call here
      // const response = await fetch(`/api/cart/remove/${productId}`, {
      //   method: "DELETE",
      // });

      return productId;
    } finally {
      dispatch(setRemoveLoading(false));
    }
  }
);

export const updateCartItemQuantity = createAsyncThunk(
  "cart/updateQuantity",
  async (
    { productId, quantity }: { productId: string; quantity: number },
    { dispatch }
  ) => {
    dispatch(setUpdateLoading(true));
    try {
      // Simulate API call for now
      await new Promise((resolve) => setTimeout(resolve, 300));

      // In a real app, you would make an API call here
      // const response = await fetch(`/api/cart/update/${productId}`, {
      //   method: "PUT",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({ quantity }),
      // });

      return { productId, quantity };
    } finally {
      dispatch(setUpdateLoading(false));
    }
  }
);

export const clearCart = createAsyncThunk(
  "cart/clearCart",
  async (_, { dispatch }) => {
    dispatch(setClearLoading(true));
    try {
      // Simulate API call for now
      await new Promise((resolve) => setTimeout(resolve, 500));

      // In a real app, you would make an API call here
      // const response = await fetch("/api/cart/clear", {
      //   method: "DELETE",
      // });

      return true;
    } finally {
      dispatch(setClearLoading(false));
    }
  }
);

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setAddLoading: (state, action: PayloadAction<boolean>) => {
      state.addLoading = action.payload;
    },
    setRemoveLoading: (state, action: PayloadAction<boolean>) => {
      state.removeLoading = action.payload;
    },
    setUpdateLoading: (state, action: PayloadAction<boolean>) => {
      state.updateLoading = action.payload;
    },
    setClearLoading: (state, action: PayloadAction<boolean>) => {
      state.clearLoading = action.payload;
    },

    // Add item to cart (immediate state update)
    addItem: (state, action: PayloadAction<CartItem>) => {
      const existingItem = state.items.find(
        (item) => item.id === action.payload.id
      );
      if (existingItem) {
        existingItem.quantity += action.payload.quantity || 1;
      } else {
        state.items.push({
          ...action.payload,
          quantity: action.payload.quantity || 1,
        });
      }
    },

    // Remove item from cart (immediate state update)
    removeItem: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },

    // Update item quantity (immediate state update)
    updateItemQuantity: (
      state,
      action: PayloadAction<{ productId: string; quantity: number }>
    ) => {
      const item = state.items.find(
        (item) => item.id === action.payload.productId
      );
      if (item) {
        if (action.payload.quantity <= 0) {
          state.items = state.items.filter(
            (item) => item.id !== action.payload.productId
          );
        } else {
          item.quantity = action.payload.quantity;
        }
      }
    },

    // Clear all items (immediate state update)
    clearItems: (state) => {
      state.items = [];
    },

    // Set cart items (for initial load)
    setCartItems: (state, action: PayloadAction<CartItem[]>) => {
      state.items = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Add to cart
    builder
      .addCase(addToCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.loading = false;
        const existingItem = state.items.find(
          (item) => item.id === action.payload.id
        );
        if (existingItem) {
          existingItem.quantity += 1;
        } else {
          state.items.push(action.payload);
        }
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to add item to cart";
      });

    // Remove from cart
    builder
      .addCase(removeFromCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.loading = false;
        state.items = state.items.filter((item) => item.id !== action.payload);
      })
      .addCase(removeFromCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to remove item from cart";
      });

    // Update quantity
    builder
      .addCase(updateCartItemQuantity.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCartItemQuantity.fulfilled, (state, action) => {
        state.loading = false;
        const item = state.items.find(
          (item) => item.id === action.payload.productId
        );
        if (item) {
          if (action.payload.quantity <= 0) {
            state.items = state.items.filter(
              (item) => item.id !== action.payload.productId
            );
          } else {
            item.quantity = action.payload.quantity;
          }
        }
      })
      .addCase(updateCartItemQuantity.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to update cart item";
      });

    // Clear cart
    builder
      .addCase(clearCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(clearCart.fulfilled, (state) => {
        state.loading = false;
        state.items = [];
      })
      .addCase(clearCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to clear cart";
      });
  },
});

export default cartSlice.reducer;

export const {
  setLoading,
  setError,
  setAddLoading,
  setRemoveLoading,
  setUpdateLoading,
  setClearLoading,
  addItem,
  removeItem,
  updateItemQuantity,
  clearItems,
  setCartItems,
} = cartSlice.actions;

// Selectors
export const selectCartItems = (state: { cart: CartState }) => state.cart.items;
export const selectCartLoading = (state: { cart: CartState }) =>
  state.cart.loading;
export const selectCartError = (state: { cart: CartState }) => state.cart.error;
export const selectAddCartLoading = (state: { cart: CartState }) =>
  state.cart.addLoading;
export const selectRemoveCartLoading = (state: { cart: CartState }) =>
  state.cart.removeLoading;
export const selectUpdateCartLoading = (state: { cart: CartState }) =>
  state.cart.updateLoading;
export const selectClearCartLoading = (state: { cart: CartState }) =>
  state.cart.clearLoading;

// Computed selectors
export const selectCartItemCount = (state: { cart: CartState }) =>
  state.cart.items.reduce((total, item) => total + item.quantity, 0);

export const selectCartTotal = (state: { cart: CartState }) =>
  state.cart.items.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

export const selectCartItemById = (
  state: { cart: CartState },
  productId: string
) => state.cart.items.find((item) => item.id === productId);

export const selectIsItemInCart = (
  state: { cart: CartState },
  productId: string
) => state.cart.items.some((item) => item.id === productId);
