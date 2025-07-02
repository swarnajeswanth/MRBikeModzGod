// store/index.ts
import { configureStore } from "@reduxjs/toolkit";
import productReducer from "./productSlice";
import loadingReducer from "./LoadingSlice";

export const store = configureStore({
  reducer: {
    product: productReducer,
    loading: loadingReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
