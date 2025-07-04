// store/index.ts
import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // defaults to localStorage
import { combineReducers } from "redux";
import productReducer from "./productSlice";
import loadingReducer from "./LoadingSlice";
import userReducer from "./UserSlice";
import reviewsReducer from "./ReviewSlice";
import storeSettingsReducer from "./storeSettingsSlice";

// Utility to clear localStorage and fix state structure issues
export const clearReduxStateAndReload = () => {
  try {
    localStorage.removeItem("persist:root");
    console.log("Redux state cleared. Reloading page...");
    window.location.reload();
  } catch (error) {
    console.error("Failed to clear Redux state:", error);
  }
};

// More robust state clearing utility
export const clearStateAndReload = () => {
  try {
    // Clear all persist-related items
    const keysToRemove = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith("persist:")) {
        keysToRemove.push(key);
      }
    }

    keysToRemove.forEach((key) => {
      try {
        localStorage.removeItem(key);
        console.log(`Cleared: ${key}`);
      } catch (e) {
        console.error(`Failed to clear ${key}:`, e);
      }
    });

    console.log("All Redux persist state cleared. Reloading page...");
    window.location.reload();
  } catch (error) {
    console.error("Failed to clear Redux state:", error);
    // Fallback: try to reload anyway
    try {
      window.location.reload();
    } catch (reloadError) {
      console.error("Failed to reload page:", reloadError);
    }
  }
};

// Global function to clear localStorage (can be called from browser console)
if (typeof window !== "undefined") {
  (window as any).clearReduxState = () => {
    try {
      localStorage.removeItem("persist:root");
      console.log("Redux state cleared. Please refresh the page.");
      return true;
    } catch (error) {
      console.error("Failed to clear Redux state:", error);
      return false;
    }
  };

  (window as any).clearReduxStateAndReload = clearReduxStateAndReload;
  (window as any).clearStateAndReload = clearStateAndReload;

  (window as any).logReduxState = () => {
    try {
      const state = localStorage.getItem("persist:root");
      if (state) {
        console.log("Current Redux state:", JSON.parse(state));
      } else {
        console.log("No Redux state found in localStorage");
      }
    } catch (error) {
      console.error("Failed to log Redux state:", error);
    }
  };
}

// Utility to clear old persisted state (uncomment if needed)
// const clearOldState = () => {
//   try {
//     localStorage.removeItem('persist:root');
//     console.log('Old persisted state cleared');
//   } catch (error) {
//     console.error('Failed to clear old state:', error);
//   }
// };

// Migration function to handle old state structure
const migration = (state: any): Promise<any> => {
  return new Promise((resolve) => {
    // Handle null/undefined state (no persisted state)
    if (!state) {
      console.log("No persisted state found, using clean initial state");
      resolve({
        product: productReducer(undefined, { type: "@@INIT" }),
        loading: loadingReducer(undefined, { type: "@@INIT" }),
        user: userReducer(undefined, { type: "@@INIT" }),
        reviews: reviewsReducer(undefined, { type: "@@INIT" }),
        storeSettings: storeSettingsReducer(undefined, { type: "@@INIT" }),
      });
      return;
    }

    // Additional safety check for state that might cause Object.keys to fail
    try {
      console.log("Migration running, current state keys:", Object.keys(state));
    } catch (error) {
      console.error("Error getting state keys:", error);
      console.log("State value:", state);
      console.log("State type:", typeof state);

      // If Object.keys fails, return clean initial state
      resolve({
        product: productReducer(undefined, { type: "@@INIT" }),
        loading: loadingReducer(undefined, { type: "@@INIT" }),
        user: userReducer(undefined, { type: "@@INIT" }),
        reviews: reviewsReducer(undefined, { type: "@@INIT" }),
        storeSettings: storeSettingsReducer(undefined, { type: "@@INIT" }),
      });
      return;
    }

    // Check if state has the expected structure
    const expectedKeys = [
      "product",
      "loading",
      "user",
      "reviews",
      "storeSettings",
    ];

    // Additional safety check for state structure
    if (typeof state !== "object" || state === null) {
      console.log("Invalid state type, using clean initial state");
      resolve({
        product: productReducer(undefined, { type: "@@INIT" }),
        loading: loadingReducer(undefined, { type: "@@INIT" }),
        user: userReducer(undefined, { type: "@@INIT" }),
        reviews: reviewsReducer(undefined, { type: "@@INIT" }),
        storeSettings: storeSettingsReducer(undefined, { type: "@@INIT" }),
      });
      return;
    }

    const hasUnexpectedKeys = Object.keys(state).some(
      (key) => !expectedKeys.includes(key)
    );

    if (hasUnexpectedKeys || !state.storeSettings) {
      console.log(
        "State structure mismatch or missing storeSettings, clearing localStorage"
      );
      try {
        localStorage.removeItem("persist:root");
        console.log("LocalStorage cleared due to state structure issues");
      } catch (error) {
        console.error("Failed to clear localStorage:", error);
      }

      // Return a clean initial state
      resolve({
        product: productReducer(undefined, { type: "@@INIT" }),
        loading: loadingReducer(undefined, { type: "@@INIT" }),
        user: userReducer(undefined, { type: "@@INIT" }),
        reviews: reviewsReducer(undefined, { type: "@@INIT" }),
        storeSettings: storeSettingsReducer(undefined, { type: "@@INIT" }),
      });
      return;
    }

    // If storeSettings is missing, add it with default values
    if (!state.storeSettings) {
      console.log("Adding missing storeSettings to state");
      state.storeSettings = {
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
          maintenanceMessage:
            "Store is under maintenance. Please check back later.",
        },
        customerExperience: {
          allowGuestBrowsing: true,
          requireLoginForPurchase: true,
          requireLoginForWishlist: true,
          showPrices: true,
          showStock: true,
          allowProductSharing: true,
          enableNotifications: true,
        },
      };
    }

    console.log("Migration completed, final state keys:", Object.keys(state));
    resolve(state);
  });
};

// Persist config
const persistConfig = {
  key: "root",
  storage,
  whitelist: ["user", "product", "storeSettings"], // persist user, product, and store settings slices
  migrate: migration,
  version: 3, // Increment version to trigger migration
};

const rootReducer = combineReducers({
  product: productReducer,
  loading: loadingReducer,
  reviews: reviewsReducer,
  user: userReducer,
  storeSettings: storeSettingsReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // required for redux-persist
    }),
});

export const persistor = persistStore(store);

// Debug: Log initial state and handle any issues
try {
  const initialState = store.getState();
  console.log("Store initialized with state keys:", Object.keys(initialState));

  // Check if all expected reducers are present
  const expectedKeys = [
    "product",
    "loading",
    "user",
    "reviews",
    "storeSettings",
  ];
  const missingKeys = expectedKeys.filter((key) => !(key in initialState));

  if (missingKeys.length > 0) {
    console.warn("Missing reducers in store:", missingKeys);
    console.warn(
      "This may cause state structure issues. Consider clearing localStorage."
    );
  }
} catch (error) {
  console.error("Error during store initialization:", error);
  // If there's an error, clear localStorage and reload
  if (typeof window !== "undefined") {
    console.log("Clearing localStorage due to store initialization error");
    try {
      localStorage.removeItem("persist:root");
      console.log("LocalStorage cleared successfully");
    } catch (localStorageError) {
      console.error("Failed to clear localStorage:", localStorageError);
    }
    // Don't auto-reload, let the user handle it
    console.log("Please refresh the page manually to resolve the issue");
  }
}

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Export review actions
export {
  fetchReviews,
  createReview,
  updateReview,
  deleteReview,
  voteReview,
  seedReviews,
} from "./ReviewSlice";
