"use client";
import React, { useState, useEffect } from "react";
import { Wifi, WifiOff, RefreshCw } from "lucide-react";

interface ConnectionStatusProps {
  className?: string;
}

const ConnectionStatus: React.FC<ConnectionStatusProps> = ({
  className = "",
}) => {
  const [isConnected, setIsConnected] = useState(false);
  const [isPolling, setIsPolling] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  useEffect(() => {
    // Listen for connection status changes
    const checkConnection = () => {
      // Check if WebSocket is connected by looking for the global broadcast function
      const hasBroadcast =
        typeof (window as any).broadcastDataUpdate === "function";
      setIsConnected(hasBroadcast);

      // Check if we're in polling mode by looking for console messages
      // This is a simple heuristic - in a real app you'd have a more robust way
      setIsPolling(!hasBroadcast);
    };

    // Check immediately
    checkConnection();

    // Check periodically
    const interval = setInterval(checkConnection, 5000);

    // Listen for custom events that might indicate connection changes
    const handleConnectionChange = () => {
      checkConnection();
      setLastUpdate(new Date());
    };

    window.addEventListener("connection-status-change", handleConnectionChange);

    return () => {
      clearInterval(interval);
      window.removeEventListener(
        "connection-status-change",
        handleConnectionChange
      );
    };
  }, []);

  const getStatusText = () => {
    if (isConnected) return "Real-time sync active";
    if (isPolling) return "Polling mode active";
    return "No connection";
  };

  const getStatusColor = () => {
    if (isConnected) return "text-green-500";
    if (isPolling) return "text-yellow-500";
    return "text-red-500";
  };

  const getIcon = () => {
    if (isConnected) return <Wifi className="h-4 w-4" />;
    if (isPolling) return <RefreshCw className="h-4 w-4 animate-spin" />;
    return <WifiOff className="h-4 w-4" />;
  };

  const handleManualRefresh = () => {
    // Trigger a manual data refresh
    if (typeof window !== "undefined") {
      // Dispatch a custom event to trigger refresh
      window.dispatchEvent(new CustomEvent("manual-refresh"));
      setLastUpdate(new Date());
    }
  };

  return (
    <div className={`flex items-center space-x-2 text-sm ${className}`}>
      <div className="flex items-center space-x-1">
        {getIcon()}
        <span className={getStatusColor()}>{getStatusText()}</span>
      </div>

      {lastUpdate && (
        <span className="text-gray-500 text-xs">
          Last: {lastUpdate.toLocaleTimeString()}
        </span>
      )}

      <button
        onClick={handleManualRefresh}
        className="text-blue-500 hover:text-blue-700 text-xs underline"
        title="Manual refresh"
      >
        Refresh
      </button>
    </div>
  );
};

export default ConnectionStatus;
