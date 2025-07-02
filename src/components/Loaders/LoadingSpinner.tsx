"use client";
import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/components/store/index";
import { stopLoading } from "@/components/store/LoadingSlice";
import "./loadingspinner.css"; // or use a CSS module

const LoadingSpinner = () => {
  const isLoading = useSelector((state: RootState) => state.loading.isLoading);
  const dispatch = useDispatch();

  useEffect(() => {
    const timeout = setTimeout(() => {
      dispatch(stopLoading());
    }, 500);
    return () => clearTimeout(timeout);
  }, []);

  if (!isLoading) return null;

  return (
    <div className="flex items-center justify-center min-h-[200px] fixed inset-0 z-[9999] bg-black/70 ">
      <div className="loader" />
    </div>
  );
};

export default LoadingSpinner;
