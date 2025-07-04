"use client";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { fetchStoreSettings } from "@/components/store/storeSettingsSlice";

const StoreSettingsInitializer = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const dispatch = useDispatch();
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const initializeStoreSettings = async () => {
      try {
        console.log("Initializing store settings...");

        // Check if we need to clear old state
        const persistedState = localStorage.getItem("persist:root");
        if (persistedState) {
          const parsedState = JSON.parse(persistedState);
          if (!parsedState.storeSettings) {
            console.log(
              "Old state detected without storeSettings, clearing..."
            );
            localStorage.removeItem("persist:root");
          }
        }

        // Fetch store settings when the app loads, but don't block rendering
        await dispatch(fetchStoreSettings() as any);
        console.log("Store settings initialized successfully");
      } catch (error) {
        console.warn("Store settings fetch failed, using defaults:", error);
      } finally {
        setIsInitialized(true);
      }
    };

    initializeStoreSettings();
  }, [dispatch]);

  // Always render children immediately, don't block the app
  return <>{children}</>;
};

export default StoreSettingsInitializer;
