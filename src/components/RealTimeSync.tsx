"use client";
import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "./store";
import { fetchProducts } from "./store/productSlice";
import { fetchReviews } from "./store/ReviewSlice";
import { fetchStoreSettings } from "./store/storeSettingsSlice";
import { toast } from "react-hot-toast";

interface SyncMessage {
  type:
    | "PRODUCTS_UPDATED"
    | "REVIEWS_UPDATED"
    | "STORE_SETTINGS_UPDATED"
    | "ALL_DATA_UPDATED";
  timestamp: number;
  source: string;
  instanceId: string;
}

const RealTimeSync: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionAttempts, setConnectionAttempts] = useState(0);
  const maxReconnectAttempts = 3;
  const [forceUpdate, setForceUpdate] = useState(0);

  // Add debounce mechanism to prevent multiple rapid updates
  const lastUpdateRef = useRef<{ [key: string]: number }>({});
  const updateTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Generate a unique instance ID for this browser tab
  const instanceId = useRef(
    `instance-${Math.random().toString(36).substr(2, 9)}`
  ).current;

  const connectWebSocket = () => {
    // Only run in browser
    if (typeof window === "undefined") return;
    // Use Railway URL in production, fallback to localhost for dev
    const wsUrl =
      process.env.NEXT_PUBLIC_WS_URL ||
      "wss://websocket-server-production-ffd1.up.railway.app/sync";

    // Don't attempt to connect if we've exceeded max attempts
    if (connectionAttempts >= maxReconnectAttempts) {
      console.log(
        "Max WebSocket connection attempts reached, using polling fallback"
      );
      startPolling();
      return;
    }

    try {
      // Check if WebSocket is supported
      if (typeof WebSocket === "undefined") {
        console.log("WebSocket not supported, using polling fallback");
        startPolling();
        return;
      }

      const ws = new WebSocket(wsUrl);

      ws.onopen = () => {
        console.log("Real-time sync connected");
        setIsConnected(true);
        setConnectionAttempts(0); // Reset attempts on successful connection

        // Ensure broadcast function is available immediately
        if (typeof window !== "undefined") {
          (window as any).broadcastDataUpdate = broadcastUpdate;
        }
      };

      ws.onmessage = (event) => {
        try {
          const message: SyncMessage = JSON.parse(event.data);
          handleSyncMessage(message);
        } catch (error) {
          console.error("Failed to parse sync message:", error);
        }
      };

      ws.onclose = (event) => {
        console.log("Real-time sync disconnected", event.code, event.reason);
        setIsConnected(false);

        // Only attempt reconnection if it wasn't a clean close
        if (event.code !== 1000 && connectionAttempts < maxReconnectAttempts) {
          console.log(
            `Attempting to reconnect... (${
              connectionAttempts + 1
            }/${maxReconnectAttempts})`
          );
          setConnectionAttempts((prev) => prev + 1);

          // Attempt to reconnect after 5 seconds
          reconnectTimeoutRef.current = setTimeout(() => {
            connectWebSocket();
          }, 5000);
        } else if (connectionAttempts >= maxReconnectAttempts) {
          console.log(
            "Max reconnection attempts reached, switching to polling"
          );
          startPolling();
        }
      };

      ws.onerror = (error) => {
        console.log("WebSocket connection failed, will attempt fallback");
        // Don't log the full error object to avoid console spam
        setIsConnected(false);
      };

      wsRef.current = ws;
    } catch (error) {
      console.log("Failed to create WebSocket connection:", error);
      setConnectionAttempts((prev) => prev + 1);

      if (connectionAttempts >= maxReconnectAttempts) {
        startPolling();
      } else {
        // Retry after a delay
        setTimeout(() => {
          connectWebSocket();
        }, 3000);
      }
    }
  };

  const handleSyncMessage = async (message: SyncMessage) => {
    const now = Date.now();
    const messageAge = now - message.timestamp;

    // Only process messages that are less than 30 seconds old
    if (messageAge > 30000) {
      console.log("Ignoring old message:", message.type, "age:", messageAge);
      return;
    }

    // Don't process messages from the same instance
    if (message.instanceId === instanceId) {
      console.log("Ignoring message from same instance:", message.type);
      return;
    }

    // Debounce rapid updates of the same type
    const lastUpdate = lastUpdateRef.current[message.type] || 0;
    const timeSinceLastUpdate = now - lastUpdate;

    if (timeSinceLastUpdate < 2000) {
      // 2 second debounce
      console.log(
        "Debouncing rapid update:",
        message.type,
        "time since last:",
        timeSinceLastUpdate
      );
      return;
    }

    // Update the last update time
    lastUpdateRef.current[message.type] = now;

    try {
      switch (message.type) {
        case "PRODUCTS_UPDATED":
          console.log(
            "[RealTimeSync] PRODUCTS_UPDATED message received, dispatching fetchProducts()"
          );
          await dispatch(fetchProducts());
          toast.success("Products updated from another instance");
          break;
        case "REVIEWS_UPDATED":
          await dispatch(fetchReviews());
          toast.success("Reviews updated from another instance");
          break;
        case "STORE_SETTINGS_UPDATED":
          console.log("[RealTimeSync] STORE_SETTINGS_UPDATED message received");

          // Clear any existing timeout
          if (updateTimeoutRef.current) {
            clearTimeout(updateTimeoutRef.current);
          }

          // Debounce the actual update to prevent multiple rapid updates
          updateTimeoutRef.current = setTimeout(async () => {
            try {
              // Clear storeSettings from persisted state to force fresh fetch
              const persistedState = localStorage.getItem("persist:root");
              if (persistedState) {
                const parsedState = JSON.parse(persistedState);
                if (parsedState.storeSettings) {
                  console.log(
                    "Clearing cached storeSettings from localStorage"
                  );
                  delete parsedState.storeSettings;
                  localStorage.setItem(
                    "persist:root",
                    JSON.stringify(parsedState)
                  );
                }
              }

              // Fetch fresh store settings
              const result = await dispatch(fetchStoreSettings());
              console.log("Store settings fetch result:", result);

              setForceUpdate((n) => n + 1); // Force re-render

              // Show notification only once
              toast.success("Store settings updated");
            } catch (error) {
              console.error("Failed to update store settings:", error);
              toast.error("Failed to update store settings");
            }
          }, 500); // 500ms debounce

          break;
        case "ALL_DATA_UPDATED":
          await Promise.all([
            dispatch(fetchProducts()),
            dispatch(fetchReviews()),
            dispatch(fetchStoreSettings()),
          ]);
          setForceUpdate((n) => n + 1); // Force re-render
          if (
            typeof window !== "undefined" &&
            !window.location.pathname.includes("dashboard")
          ) {
            window.location.reload();
          }
          toast.success("All data updated from another instance");
          break;
      }
    } catch (error) {
      console.error("Failed to sync data:", error);
    }
  };

  const startPolling = () => {
    console.log("Starting polling fallback mechanism");

    // Fallback polling mechanism
    const pollInterval = setInterval(async () => {
      try {
        await Promise.all([
          dispatch(fetchProducts()),
          dispatch(fetchReviews()),
          dispatch(fetchStoreSettings()),
        ]);
      } catch (error) {
        console.error("Polling failed:", error);
      }
    }, 30000); // Poll every 30 seconds

    // Store the interval ID for cleanup
    const intervalId = pollInterval;

    // Clean up on unmount
    return () => {
      clearInterval(intervalId);
    };
  };

  const broadcastUpdate = (type: SyncMessage["type"]) => {
    // Debounce broadcasts to prevent spam
    const now = Date.now();
    const lastBroadcast = lastUpdateRef.current[`broadcast_${type}`] || 0;
    const timeSinceLastBroadcast = now - lastBroadcast;

    if (timeSinceLastBroadcast < 1000) {
      // 1 second debounce for broadcasts
      console.log(
        "Debouncing broadcast:",
        type,
        "time since last:",
        timeSinceLastBroadcast
      );
      return;
    }

    lastUpdateRef.current[`broadcast_${type}`] = now;

    if (wsRef.current?.readyState === WebSocket.OPEN) {
      const message: SyncMessage = {
        type,
        timestamp: Date.now(),
        source: `app-${Math.random().toString(36).substr(2, 9)}`,
        instanceId,
      };
      console.log("Broadcasting update:", type, "from instance:", instanceId);
      wsRef.current.send(JSON.stringify(message));
    } else {
      console.log(
        "WebSocket not connected, skipping broadcast. ReadyState:",
        wsRef.current?.readyState
      );
    }
  };

  useEffect(() => {
    // Only attempt WebSocket connection in browser environment
    if (typeof window !== "undefined") {
      connectWebSocket();
    }

    return () => {
      if (wsRef.current) {
        wsRef.current.close(1000, "Component unmounting");
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (updateTimeoutRef.current) {
        clearTimeout(updateTimeoutRef.current);
      }
    };
  }, []);

  // Expose broadcast function globally for other components to use
  useEffect(() => {
    if (typeof window !== "undefined") {
      (window as any).broadcastDataUpdate = broadcastUpdate;

      return () => {
        delete (window as any).broadcastDataUpdate;
      };
    }
  }, [isConnected]);

  return null; // This component doesn't render anything
};

export default RealTimeSync;
