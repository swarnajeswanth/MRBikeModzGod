// app/provider.tsx
"use client";

import React from "react";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "@/components/persistedStore";
import LoadingSpinner from "@/components/Loaders/LoadingSpinner";
import StoreSettingsInitializer from "@/components/StoreSettingsInitializer";

export function ReduxProvider({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <PersistGate loading={<LoadingSpinner />} persistor={persistor}>
        <StoreSettingsInitializer>{children}</StoreSettingsInitializer>
      </PersistGate>
    </Provider>
  );
}
