"use client";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../store";
import { seedProducts } from "../store/productSlice";
import { seedReviews } from "../store/ReviewSlice";
import { toast } from "react-hot-toast";
import { Database, Loader2, RefreshCw, AlertTriangle } from "lucide-react";
import ConnectionStatus from "../ConnectionStatus";

const SeedDataManager: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [seedingProducts, setSeedingProducts] = useState(false);
  const [seedingReviews, setSeedingReviews] = useState(false);
  const [seedingAll, setSeedingAll] = useState(false);

  const { products, loading: productsLoading } = useSelector(
    (state: RootState) => state.product
  );
  const { reviews, loading: reviewsLoading } = useSelector(
    (state: RootState) => state.reviews
  );

  const handleSeedProducts = async () => {
    if (
      window.confirm(
        "This will add dummy products to the database and update all app instances. Continue?"
      )
    ) {
      setSeedingProducts(true);
      try {
        console.log("[SeedDataManager] Seeding products...");
        await dispatch(seedProducts()).unwrap();
        toast.success(
          "Products seeded successfully! All app instances updated."
        );
        console.log(
          "[SeedDataManager] Products seeded, broadcasting update..."
        );
        // Broadcast update to other instances
        if ((window as any).broadcastDataUpdate) {
          (window as any).broadcastDataUpdate("PRODUCTS_UPDATED");
          console.log("[SeedDataManager] PRODUCTS_UPDATED broadcast sent");
        } else {
          console.log(
            "[SeedDataManager] Broadcast function not available - WebSocket may not be connected"
          );
        }
      } catch (error) {
        console.error("[SeedDataManager] Failed to seed products:", error);
        toast.error("Failed to seed products");
      } finally {
        setSeedingProducts(false);
      }
    }
  };

  const handleSeedReviews = async () => {
    if (
      window.confirm(
        "This will add dummy reviews to the database and update all app instances. Continue?"
      )
    ) {
      setSeedingReviews(true);
      try {
        await dispatch(seedReviews()).unwrap();
        toast.success(
          "Reviews seeded successfully! All app instances updated."
        );

        // Broadcast update to other instances
        if ((window as any).broadcastDataUpdate) {
          console.log("Broadcasting reviews update to other instances");
          (window as any).broadcastDataUpdate("REVIEWS_UPDATED");
        } else {
          console.log(
            "Broadcast function not available - WebSocket may not be connected"
          );
        }
      } catch (error) {
        console.error("Failed to seed reviews:", error);
        toast.error("Failed to seed reviews");
      } finally {
        setSeedingReviews(false);
      }
    }
  };

  const handleSeedAll = async () => {
    if (
      window.confirm(
        "This will seed both products and reviews, updating all app instances. Continue?"
      )
    ) {
      setSeedingAll(true);
      try {
        // Seed products first
        await dispatch(seedProducts()).unwrap();
        toast.success("Products seeded successfully!");

        // Then seed reviews
        await dispatch(seedReviews()).unwrap();
        toast.success("Reviews seeded successfully!");

        toast.success(
          "All data seeded successfully! All app instances updated."
        );

        // Broadcast update to other instances
        if ((window as any).broadcastDataUpdate) {
          console.log("Broadcasting all data update to other instances");
          (window as any).broadcastDataUpdate("ALL_DATA_UPDATED");
        } else {
          console.log(
            "Broadcast function not available - WebSocket may not be connected"
          );
        }
      } catch (error) {
        console.error("Failed to seed data:", error);
        toast.error("Failed to seed data");
      } finally {
        setSeedingAll(false);
      }
    }
  };

  const handleRefreshData = async () => {
    try {
      // Refresh products
      await dispatch(seedProducts()).unwrap();
      // Refresh reviews
      await dispatch(seedReviews()).unwrap();
      toast.success("Data refreshed successfully!");
    } catch (error) {
      console.error("Failed to refresh data:", error);
      toast.error("Failed to refresh data");
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center space-x-2 mb-6">
        <Database className="h-6 w-6 text-blue-600" />
        <h2 className="text-xl font-semibold text-gray-800">
          Data Seeding Manager
        </h2>
      </div>

      {/* Current Data Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-blue-800">Products</h3>
              <p className="text-sm text-blue-600">
                {products.length} products in database
              </p>
            </div>
            <div className="text-right">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                Active
              </span>
            </div>
          </div>
        </div>

        <div className="bg-purple-50 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-purple-800">Reviews</h3>
              <p className="text-sm text-purple-600">
                {reviews.length} reviews in database
              </p>
            </div>
            <div className="text-right">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                Active
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Seeding Actions */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={handleSeedProducts}
            disabled={seedingProducts || seedingAll}
            className="flex-1 flex items-center justify-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {seedingProducts ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Database className="h-4 w-4" />
            )}
            <span>
              {seedingProducts ? "Seeding Products..." : "Seed Products"}
            </span>
          </button>

          <button
            onClick={handleSeedReviews}
            disabled={seedingReviews || seedingAll}
            className="flex-1 flex items-center justify-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {seedingReviews ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Database className="h-4 w-4" />
            )}
            <span>
              {seedingReviews ? "Seeding Reviews..." : "Seed Reviews"}
            </span>
          </button>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={handleSeedAll}
            disabled={seedingProducts || seedingReviews || seedingAll}
            className="flex-1 flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {seedingAll ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Database className="h-4 w-4" />
            )}
            <span>{seedingAll ? "Seeding All..." : "Seed All Data"}</span>
          </button>

          <button
            onClick={handleRefreshData}
            disabled={productsLoading || reviewsLoading}
            className="flex-1 flex items-center justify-center space-x-2 bg-gray-600 hover:bg-gray-700 text-white px-4 py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <RefreshCw className="h-4 w-4" />
            <span>Refresh Data</span>
          </button>
        </div>
      </div>

      {/* Connection Status */}
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-medium text-blue-800">Connection Status</h4>
            <p className="text-sm text-blue-600 mt-1">
              Monitor real-time synchronization status
            </p>
          </div>
          <ConnectionStatus />
        </div>
        <div className="mt-2 text-xs text-blue-600">
          <p>
            WebSocket Status:{" "}
            {typeof (window as any).broadcastDataUpdate === "function"
              ? "✅ Connected"
              : "❌ Not Connected"}
          </p>
          <p>
            Broadcast Function:{" "}
            {typeof (window as any).broadcastDataUpdate === "function"
              ? "Available"
              : "Not Available"}
          </p>
        </div>
      </div>

      {/* Information Panel */}
      <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-start space-x-2">
          <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
          <div>
            <h4 className="font-medium text-yellow-800">Important Notes</h4>
            <ul className="mt-2 text-sm text-yellow-700 space-y-1">
              <li>
                • Seeding will update the database and all connected app
                instances
              </li>
              <li>• Products seeding will replace existing products</li>
              <li>• Reviews seeding will only add if no reviews exist</li>
              <li>
                • All changes are immediately reflected across the application
              </li>
              <li>• Use "Refresh Data" to sync with latest database state</li>
              <li>• WebSocket server must be running for real-time updates</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeedDataManager;
