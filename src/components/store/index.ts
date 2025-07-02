// store/index.ts
import { configureStore } from "@reduxjs/toolkit";
import productReducer from "./productSlice";
import loadingReducer from "./LoadingSlice";
import userReducer from "./UserSlice";
import reviewsReducer from "./ReviewSlice";
export const store = configureStore({
  reducer: {
    product: productReducer,
    loading: loadingReducer,
    reviews: reviewsReducer,
    user: userReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
