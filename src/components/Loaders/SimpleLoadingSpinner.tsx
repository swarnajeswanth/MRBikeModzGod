"use client";
import React from "react";
import "./loadingspinner.css";

interface SimpleLoadingSpinnerProps {
  isLoading: boolean;
  message?: string;
  className?: string;
}

const SimpleLoadingSpinner: React.FC<SimpleLoadingSpinnerProps> = ({
  isLoading,
  message = "Loading...",
  className = "",
}) => {
  if (!isLoading) return null;

  return (
    <div
      className={`flex items-center justify-center min-h-[200px] ${className}`}
    >
      <div className="flex flex-col items-center gap-4">
        <div className="loader" />
        {message && (
          <p className="text-white text-center max-w-md px-4">{message}</p>
        )}
      </div>
    </div>
  );
};

export default SimpleLoadingSpinner;
