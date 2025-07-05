import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

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
    // New bike-specific features
    bikeCompatibility: boolean;
    installationGuides: boolean;
    warrantyInfo: boolean;
    returnPolicy: boolean;
    bulkOrdering: boolean;
    customModifications: boolean;
    performanceMetrics: boolean;
    brandFiltering: boolean;
    priceAlerts: boolean;
    stockNotifications: boolean;
    comparisonTool: boolean;
    fitmentGuides: boolean;
    maintenanceSchedules: boolean;
    partCompatibility: boolean;
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
    // New bike-specific pages
    installationGuides: boolean;
    warrantyInfo: boolean;
    returnPolicy: boolean;
    bulkOrdering: boolean;
    customModifications: boolean;
    performanceMetrics: boolean;
    comparisonTool: boolean;
    fitmentGuides: boolean;
    maintenanceSchedules: boolean;
    partCompatibility: boolean;
    dealerLocator: boolean;
    serviceCenters: boolean;
    trainingVideos: boolean;
    blog: boolean;
    support: boolean;
  };

  // Store Information
  storeInfo: {
    name: string;
    description: string;
    logo: string;
    theme: "dark" | "light" | "auto";
    maintenanceMode: boolean;
    maintenanceMessage: string;
    // New bike-specific store info
    phoneNumber: string;
    email: string;
    address: string;
    businessHours: string;
    emergencyContact: string;
    warrantyPolicy: string;
    returnPolicy: string;
    shippingPolicy: string;
    paymentMethods: string[];
    acceptedBrands: string[];
    serviceAreas: string[];
    certifications: string[];
    socialMedia: {
      facebook: string;
      instagram: string;
      youtube: string;
      whatsapp: string;
    };
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
    // New bike-specific customer experience
    showInstallationGuides: boolean;
    showWarrantyInfo: boolean;
    showReturnPolicy: boolean;
    allowBulkOrdering: boolean;
    allowCustomModifications: boolean;
    showPerformanceMetrics: boolean;
    enableBrandFiltering: boolean;
    enablePriceAlerts: boolean;
    enableStockNotifications: boolean;
    enableComparisonTool: boolean;
    showFitmentGuides: boolean;
    showMaintenanceSchedules: boolean;
    showPartCompatibility: boolean;
    enableDealerLocator: boolean;
    enableServiceCenters: boolean;
    showTrainingVideos: boolean;
    enableBlog: boolean;
    enableSupport: boolean;
    requireVINVerification: boolean;
    showBikeCompatibility: boolean;
    enableExpertConsultation: boolean;
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
    // New bike-specific features
    bikeCompatibility: true,
    installationGuides: true,
    warrantyInfo: true,
    returnPolicy: true,
    bulkOrdering: true,
    customModifications: true,
    performanceMetrics: true,
    brandFiltering: true,
    priceAlerts: true,
    stockNotifications: true,
    comparisonTool: true,
    fitmentGuides: true,
    maintenanceSchedules: true,
    partCompatibility: true,
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
    // New bike-specific pages
    installationGuides: true,
    warrantyInfo: true,
    returnPolicy: true,
    bulkOrdering: true,
    customModifications: true,
    performanceMetrics: true,
    comparisonTool: true,
    fitmentGuides: true,
    maintenanceSchedules: true,
    partCompatibility: true,
    dealerLocator: true,
    serviceCenters: true,
    trainingVideos: true,
    blog: true,
    support: true,
  },
  storeInfo: {
    name: "MrBikeModzGod",
    description: "Premium bike parts and accessories",
    logo: "",
    theme: "dark",
    maintenanceMode: false,
    maintenanceMessage: "Store is under maintenance. Please check back later.",
    // New bike-specific store info
    phoneNumber: "+91 6304187805",
    email: "mrbikemodz@gmail.com",
    address:
      "Anitha, Uma, Maheswari tample, VRC Centre, Nellore, Andhra Pradesh 524001",
    businessHours: "Mon-Sat: 9:00 AM - 8:00 PM, Sun: 10:00 AM - 6:00 PM",
    emergencyContact: "+91 6304187805",
    warrantyPolicy: "1 year manufacturer warranty on all parts",
    returnPolicy: "30-day return policy for unused items",
    shippingPolicy: "Free shipping on orders above ₹1000",
    paymentMethods: ["Cash", "UPI", "Credit Card", "Debit Card", "Net Banking"],
    acceptedBrands: [
      "Honda",
      "Yamaha",
      "Bajaj",
      "TVS",
      "Royal Enfield",
      "KTM",
      "Suzuki",
    ],
    serviceAreas: ["Nellore", "Gudur", "Kavali", "Ongole", "Vijayawada"],
    certifications: ["ISO 9001", "Authorized Dealer", "Certified Mechanic"],
    socialMedia: {
      facebook: "https://www.facebook.com/share/1HUtQoEnwq/",
      instagram: "https://www.instagram.com/mrbikemodz?igsh=d250Ym1tb3NtcDZw",
      youtube: "#",
      whatsapp: "https://wa.me/916304187805",
    },
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
    // New bike-specific customer experience
    showInstallationGuides: true,
    showWarrantyInfo: true,
    showReturnPolicy: true,
    allowBulkOrdering: true,
    allowCustomModifications: true,
    showPerformanceMetrics: true,
    enableBrandFiltering: true,
    enablePriceAlerts: true,
    enableStockNotifications: true,
    enableComparisonTool: true,
    showFitmentGuides: true,
    showMaintenanceSchedules: true,
    showPartCompatibility: true,
    enableDealerLocator: true,
    enableServiceCenters: true,
    showTrainingVideos: true,
    enableBlog: true,
    enableSupport: true,
    requireVINVerification: true,
    showBikeCompatibility: true,
    enableExpertConsultation: true,
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
      return data.settings;
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
        return { ...state, ...action.payload };
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
