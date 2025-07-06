"use client";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/components/store";
import {
  selectFeatures,
  selectPages,
  selectCustomerExperience,
  forceRefreshStoreSettings,
} from "@/components/store/storeSettingsSlice";
import { toast } from "react-hot-toast";

const DebugStoreSettings = () => {
  const dispatch = useDispatch();
  const features = useSelector(selectFeatures);
  const pages = useSelector(selectPages);
  const customerExp = useSelector(selectCustomerExperience);

  const handleForceRefresh = () => {
    dispatch(forceRefreshStoreSettings() as any);
    window.location.reload();
  };

  const handleClearLocalStorage = () => {
    localStorage.removeItem("persist:root");
    window.location.reload();
  };

  const handleManualBroadcast = () => {
    if ((window as any).broadcastDataUpdate) {
      (window as any).broadcastDataUpdate("STORE_SETTINGS_UPDATED");
      toast.success("Manual broadcast sent");
    } else {
      toast.error("Broadcast function not available");
    }
  };

  return (
    <div className="fixed bottom-4 right-4 bg-black/90 text-white p-4 rounded-lg border border-red-500 max-w-md z-50">
      <h3 className="text-lg font-bold mb-2">Store Settings Debug</h3>

      <div className="mb-4">
        <h4 className="font-semibold text-red-400">Features:</h4>
        <div className="text-sm space-y-1">
          {Object.entries(features).map(([key, value]) => (
            <div
              key={key}
              className={`${value ? "text-green-400" : "text-red-400"}`}
            >
              {key}: {value ? "✅" : "❌"}
            </div>
          ))}
        </div>
      </div>

      <div className="mb-4">
        <h4 className="font-semibold text-red-400">Pages:</h4>
        <div className="text-sm space-y-1">
          {Object.entries(pages).map(([key, value]) => (
            <div
              key={key}
              className={`${value ? "text-green-400" : "text-red-400"}`}
            >
              {key}: {value ? "✅" : "❌"}
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-2 flex-wrap">
        <button
          onClick={handleForceRefresh}
          className="px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded text-sm"
        >
          Force Refresh
        </button>
        <button
          onClick={handleClearLocalStorage}
          className="px-3 py-1 bg-red-600 hover:bg-red-700 rounded text-sm"
        >
          Clear Cache
        </button>
        <button
          onClick={handleManualBroadcast}
          className="px-3 py-1 bg-green-600 hover:bg-green-700 rounded text-sm"
        >
          Test Broadcast
        </button>
      </div>
    </div>
  );
};

export default DebugStoreSettings;
