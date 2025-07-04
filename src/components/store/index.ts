"use client";
import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // defaults to localStorage
import { combineReducers } from "redux";
import productReducer from "./productSlice";
import loadingReducer from "./LoadingSlice";
import userReducer from "./UserSlice";
import reviewsReducer from "./ReviewSlice";
import storeSettingsReducer from "./storeSettingsSlice";
import { useSelector } from "react-redux";
import { selectIsPageAccessible } from "@/components/store/storeSettingsSlice";

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

  const wsUrl =
    process.env.NEXT_PUBLIC_WS_URL ||
    "wss://websocket-server-production-ffd1.up.railway.app/sync";
  const ws = new WebSocket(wsUrl);
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
    if (!state || typeof state !== "object") {
      resolve({
        product: productReducer(undefined, { type: "@@INIT" }),
        loading: loadingReducer(undefined, { type: "@@INIT" }),
        user: userReducer(undefined, { type: "@@INIT" }),
        reviews: reviewsReducer(undefined, { type: "@@INIT" }),
        storeSettings: storeSettingsReducer(undefined, { type: "@@INIT" }),
      });
      return;
    }
    // Add missing slices with default values, but don't reset everything
    if (!state.product)
      state.product = productReducer(undefined, { type: "@@INIT" });
    if (!state.loading)
      state.loading = loadingReducer(undefined, { type: "@@INIT" });
    if (!state.user) state.user = userReducer(undefined, { type: "@@INIT" });
    if (!state.reviews)
      state.reviews = reviewsReducer(undefined, { type: "@@INIT" });
    if (!state.storeSettings)
      state.storeSettings = storeSettingsReducer(undefined, { type: "@@INIT" });
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
