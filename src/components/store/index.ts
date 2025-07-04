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
    console.log("Migration running, current state keys:", Object.keys(state));

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
  version: 2, // Increment version to trigger migration
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

// Debug: Log initial state
console.log(
  "Store initialized with state keys:",
  Object.keys(store.getState())
);

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
