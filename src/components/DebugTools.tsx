"use client";
import React from "react";
import { useDispatch } from "react-redux";
import { fetchStoreSettings } from "./store/storeSettingsSlice";

const DebugTools: React.FC = () => {
  const dispatch = useDispatch();

  const clearLocalStorage = () => {
    try {
      localStorage.removeItem("persist:root");
      console.log("LocalStorage cleared");
      window.location.reload();
    } catch (error) {
      console.error("Failed to clear localStorage:", error);
    }
  };

  const reloadStoreSettings = () => {
    dispatch(fetchStoreSettings() as any);
  };

  const logCurrentState = () => {
    const persistedState = localStorage.getItem("persist:root");
    if (persistedState) {
      console.log("Current persisted state:", JSON.parse(persistedState));
    } else {
      console.log("No persisted state found");
    }
  };

  // Only show in development
  if (process.env.NODE_ENV !== "development") {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 bg-gray-800 text-white p-4 rounded-lg shadow-lg z-50">
      <h3 className="text-sm font-bold mb-2">Debug Tools</h3>
      <div className="space-y-2">
        <button
          onClick={clearLocalStorage}
          className="block w-full text-xs bg-red-600 hover:bg-red-700 px-2 py-1 rounded"
        >
          Clear LocalStorage
        </button>
        <button
          onClick={reloadStoreSettings}
          className="block w-full text-xs bg-blue-600 hover:bg-blue-700 px-2 py-1 rounded"
        >
          Reload Store Settings
        </button>
        <button
          onClick={logCurrentState}
          className="block w-full text-xs bg-green-600 hover:bg-green-700 px-2 py-1 rounded"
        >
          Log State
        </button>
      </div>
    </div>
  );
};

export default DebugTools;
