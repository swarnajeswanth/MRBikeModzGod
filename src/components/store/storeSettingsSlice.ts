import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { Store } from "@reduxjs/toolkit";

// Extend the Window interface to include the Redux store
declare global {
  interface Window {
    __REDUX_STORE__?: Store;
  }
}

export interface StoreSettings {
  // Feature Controls
  features: {
    addToCart: boolean;
    wishlist: boolean;
    reviews: boolean;
    ratings: boolean;
    search: boolean;
    filters: boolean;
    categories: boolean;
    productImages: boolean;
    productDetails: boolean;
    priceDisplay: boolean;
    stockDisplay: boolean;
    discountDisplay: boolean;
    relatedProducts: boolean;
    shareProducts: boolean;
  };

  // Page Access Controls
  pages: {
    home: boolean;
    allProducts: boolean;
    individualProduct: boolean;
    category: boolean;
    wishlist: boolean;
    cart: boolean;
    customerDashboard: boolean;
    auth: boolean;
  };

  // Store Information
  storeInfo: {
    name: string;
    description: string;
    logo: string;
    theme: "dark" | "light" | "auto";
    maintenanceMode: boolean;
    maintenanceMessage: string;
  };

  // Customer Experience
  customerExperience: {
    allowGuestBrowsing: boolean;
    requireLoginForPurchase: boolean;
    requireLoginForWishlist: boolean;
    showPrices: boolean;
    showStock: boolean;
    allowProductSharing: boolean;
    enableNotifications: boolean;
    enableWhatsAppChat: boolean;
    enableWishlistAnalytics: boolean;
  };
}

interface StoreSettingsState extends StoreSettings {
  loading: boolean;
  error: string | null;
  // Individual operation loading states
  fetchLoading: boolean;
  updateLoading: boolean;
  resetLoading: boolean;
}

export const initialState: StoreSettings = {
  features: {
    addToCart: true,
    wishlist: true,
    reviews: true,
    ratings: true,
    search: true,
    filters: true,
    categories: true,
    productImages: true,
    productDetails: true,
    priceDisplay: true,
    stockDisplay: true,
    discountDisplay: true,
    relatedProducts: true,
    shareProducts: true,
  },
  pages: {
    home: true,
    allProducts: true,
    individualProduct: true,
    category: true,
    wishlist: true,
    cart: true,
    customerDashboard: true,
    auth: true,
  },
  storeInfo: {
    name: "MrBikeModzGod",
    description: "Premium bike parts and accessories",
    logo: "",
    theme: "dark",
    maintenanceMode: false,
    maintenanceMessage: "Store is under maintenance. Please check back later.",
  },
  customerExperience: {
    allowGuestBrowsing: true,
    requireLoginForPurchase: true,
    requireLoginForWishlist: true,
    showPrices: true,
    showStock: true,
    allowProductSharing: true,
    enableNotifications: true,
    enableWhatsAppChat: true,
    enableWishlistAnalytics: true,
  },
};

const initialStateWithLoading: StoreSettingsState = {
  ...initialState,
  loading: false,
  error: null,
  fetchLoading: false,
  updateLoading: false,
  resetLoading: false,
};

// Async thunks for API operations
export const fetchStoreSettings = createAsyncThunk(
  "storeSettings/fetchStoreSettings",
  async (_, { dispatch }) => {
    dispatch(setFetchLoading(true));
    try {
      const response = await fetch("/api/store-settings");
      if (!response.ok) {
        throw new Error("Failed to fetch store settings");
      }
      const data = await response.json();
      return data;
    } finally {
      dispatch(setFetchLoading(false));
    }
  }
);

export const updateStoreSettings = createAsyncThunk(
  "storeSettings/updateStoreSettings",
  async (settings: Partial<StoreSettings>, { dispatch }) => {
    dispatch(setUpdateLoading(true));
    try {
      const response = await fetch("/api/store-settings", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(settings),
      });

      if (!response.ok) {
        throw new Error("Failed to update store settings");
      }

      const data = await response.json();
      return data.settings;
    } finally {
      dispatch(setUpdateLoading(false));
    }
  }
);

// Utility function to force refresh store settings
export const forceRefreshStoreSettings = createAsyncThunk(
  "storeSettings/forceRefresh",
  async (_, { dispatch }) => {
    // Clear any cached state
    if (typeof window !== "undefined") {
      try {
        localStorage.removeItem("persist:root");
        console.log("Cleared persisted state for store settings refresh");
      } catch (error) {
        console.warn("Failed to clear persisted state:", error);
      }
    }

    // Fetch fresh settings
    return dispatch(fetchStoreSettings() as any);
  }
);

const storeSettingsSlice = createSlice({
  name: "storeSettings",
  initialState: initialStateWithLoading,
  reducers: {
    // Feature toggles
    toggleFeature: (
      state,
      action: PayloadAction<keyof StoreSettings["features"]>
    ) => {
      state.features[action.payload] = !state.features[action.payload];
    },

    // Page access toggles
    togglePageAccess: (
      state,
      action: PayloadAction<keyof StoreSettings["pages"]>
    ) => {
      state.pages[action.payload] = !state.pages[action.payload];
    },

    // Customer experience toggles
    toggleCustomerExperience: (
      state,
      action: PayloadAction<keyof StoreSettings["customerExperience"]>
    ) => {
      state.customerExperience[action.payload] =
        !state.customerExperience[action.payload];
    },

    // Update store info
    updateStoreInfo: (
      state,
      action: PayloadAction<Partial<StoreSettings["storeInfo"]>>
    ) => {
      state.storeInfo = { ...state.storeInfo, ...action.payload };
    },

    // Bulk update features
    updateFeatures: (
      state,
      action: PayloadAction<Partial<StoreSettings["features"]>>
    ) => {
      state.features = { ...state.features, ...action.payload };
    },

    // Bulk update pages
    updatePages: (
      state,
      action: PayloadAction<Partial<StoreSettings["pages"]>>
    ) => {
      state.pages = { ...state.pages, ...action.payload };
    },

    // Bulk update customer experience
    updateCustomerExperience: (
      state,
      action: PayloadAction<Partial<StoreSettings["customerExperience"]>>
    ) => {
      state.customerExperience = {
        ...state.customerExperience,
        ...action.payload,
      };
    },

    // Reset to defaults
    resetToDefaults: (state) => {
      return initialStateWithLoading;
    },

    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    setFetchLoading: (state, action) => {
      state.fetchLoading = action.payload;
    },
    setUpdateLoading: (state, action) => {
      state.updateLoading = action.payload;
    },
    setResetLoading: (state, action) => {
      state.resetLoading = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchStoreSettings.pending, (state) => {
        // Handle loading state if needed
        console.log("Fetching store settings...");
      })
      .addCase(fetchStoreSettings.fulfilled, (state, action) => {
        console.log(
          "Store settings loaded:",
          action.payload ? "from API" : "using defaults"
        );
        console.log("API Response:", action.payload);
        // The API returns the settings directly, not wrapped in a 'settings' property
        const newState = { ...state, ...action.payload };
        setTimeout(() => {
          try {
            // Attach the Redux store to window for debugging if not already done
            if (typeof window !== "undefined" && window.__REDUX_STORE__) {
              console.log(
                "Redux state after fetch:",
                window.__REDUX_STORE__.getState().storeSettings
              );
            }
          } catch (e) {}
        }, 100);
        return newState;
      })
      .addCase(fetchStoreSettings.rejected, (state, action) => {
        console.error("Store settings fetch rejected:", action.error);
        // Don't change state, keep using defaults
      })
      .addCase(updateStoreSettings.fulfilled, (state, action) => {
        return { ...state, ...action.payload };
      })
      .addCase(updateStoreSettings.rejected, (state, action) => {
        console.error("Store settings update rejected:", action.payload);
        // Don't change state on update failure
      })
      .addCase(forceRefreshStoreSettings.fulfilled, (state, action) => {
        console.log("Store settings force refreshed");
        // The action.payload will be the result of fetchStoreSettings
        if (action.payload?.payload) {
          return { ...state, ...action.payload.payload };
        }
      });
  },
});

export const {
  toggleFeature,
  togglePageAccess,
  toggleCustomerExperience,
  updateStoreInfo,
  updateFeatures,
  updatePages,
  updateCustomerExperience,
  resetToDefaults,
  setLoading,
  setError,
  setFetchLoading,
  setUpdateLoading,
  setResetLoading,
} = storeSettingsSlice.actions;

// Selectors
export const selectStoreSettings = (state: {
  storeSettings: StoreSettingsState;
}) => state.storeSettings;

export const selectStoreSettingsLoading = (state: {
  storeSettings: StoreSettingsState;
}) => state.storeSettings.loading;

export const selectStoreSettingsError = (state: {
  storeSettings: StoreSettingsState;
}) => state.storeSettings.error;

export const selectFetchStoreSettingsLoading = (state: {
  storeSettings: StoreSettingsState;
}) => state.storeSettings.fetchLoading;

export const selectUpdateStoreSettingsLoading = (state: {
  storeSettings: StoreSettingsState;
}) => state.storeSettings.updateLoading;

export const selectResetStoreSettingsLoading = (state: {
  storeSettings: StoreSettingsState;
}) => state.storeSettings.resetLoading;

export const selectFeatures = (state: { storeSettings: StoreSettings }) =>
  state.storeSettings?.features || initialState.features;
export const selectPages = (state: { storeSettings: StoreSettings }) =>
  state.storeSettings?.pages || initialState.pages;
export const selectStoreInfo = (state: { storeSettings: StoreSettings }) =>
  state.storeSettings?.storeInfo || initialState.storeInfo;
export const selectCustomerExperience = (state: {
  storeSettings: StoreSettings;
}) =>
  state.storeSettings?.customerExperience || initialState.customerExperience;

// Feature-specific selectors
export const selectIsFeatureEnabled =
  (feature: keyof StoreSettings["features"]) =>
  (state: { storeSettings: StoreSettings }) =>
    state.storeSettings?.features?.[feature] ?? initialState.features[feature];

export const selectIsPageAccessible =
  (page: keyof StoreSettings["pages"]) =>
  (state: { storeSettings: StoreSettings }) =>
    state.storeSettings?.pages?.[page] ?? initialState.pages[page];

export const selectIsCustomerExperienceEnabled =
  (setting: keyof StoreSettings["customerExperience"]) =>
  (state: { storeSettings: StoreSettings }) =>
    state.storeSettings?.customerExperience?.[setting] ??
    initialState.customerExperience[setting];

export default storeSettingsSlice.reducer;
