// components/store/persistedStore.ts
"use client";

import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import productReducer from "@/components/store/productSlice";
import loadingReducer from "@/components/store/LoadingSlice";
import userReducer from "@/components/store/UserSlice";
import reviewsReducer from "@/components/store/ReviewSlice";

// Custom storage that handles SSR
const createNoopStorage = () => {
  return {
    getItem(_key: string) {
      return Promise.resolve(null);
    },
    setItem(_key: string, value: any) {
      return Promise.resolve(value);
    },
    removeItem(_key: string) {
      return Promise.resolve();
    },
  };
};

const storage =
  typeof window !== "undefined"
    ? require("redux-persist/lib/storage").default
    : createNoopStorage();

const rootReducer = combineReducers({
  product: productReducer,
  loading: loadingReducer,
  user: userReducer,
  reviews: reviewsReducer,
});

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["user", "product"], // Persist both user and product
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
