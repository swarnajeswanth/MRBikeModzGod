"use client";
import { useSelector } from "react-redux";
import { RootState } from "@/components/store/index";
import "./loadingspinner.css";

export default function LoadingOverlay() {
  const isLoading = useSelector((state: RootState) => state.loading.isLoading);

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-black/70 flex items-center justify-center">
      <div className="loader" />
    </div>
  );
}
