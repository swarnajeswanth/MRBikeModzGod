"use client";
import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/components/store/index";
import { stopLoading } from "@/components/store/LoadingSlice";
import "./loadingspinner.css";

const LoadingSpinner = () => {
  const isLoading = useSelector((state: RootState) => state.loading.isLoading);
  const loadingMessage = useSelector(
    (state: RootState) => state.loading.loadingMessages.global || ""
  );
  const dispatch = useDispatch();

  useEffect(() => {
    const timeout = setTimeout(() => {
      dispatch(stopLoading());
    }, 500);
    return () => clearTimeout(timeout);
  }, [dispatch]);

  if (!isLoading) return null;

  return (
    <div className="flex items-center justify-center min-h-[200px] fixed inset-0 z-[9999] bg-black/70 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-4">
        <div className="loader" />
        {loadingMessage && (
          <p className="text-white text-center max-w-md px-4">
            {loadingMessage}
          </p>
        )}
      </div>
    </div>
  );
};

export default LoadingSpinner;
