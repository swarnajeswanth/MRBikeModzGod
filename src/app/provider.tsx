// app/provider.tsx
"use client";

import React from "react";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "@/components/store/index";
import LoadingSpinner from "@/components/Loaders/LoadingSpinner";
import StoreSettingsInitializer from "@/components/StoreSettingsInitializer";
import CartInitializer from "@/components/CartInitializer";

export function ReduxProvider({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <PersistGate loading={<LoadingSpinner />} persistor={persistor}>
        <StoreSettingsInitializer>
          <CartInitializer>{children}</CartInitializer>
        </StoreSettingsInitializer>
      </PersistGate>
    </Provider>
  );
}
