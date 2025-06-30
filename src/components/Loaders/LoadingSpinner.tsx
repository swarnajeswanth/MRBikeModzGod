"use client";
import React from "react";
import "./loadingspinner.css"; // or use a CSS module

const LoadingSpinner = () => {
  return (
    <div className="flex items-center justify-center min-h-[200px]">
      <div className="loader" />
    </div>
  );
};

export default LoadingSpinner;
