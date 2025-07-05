"use client";
import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CategoryClient from "@/components/Category/CategoryClient";
import { useSelector } from "react-redux";
import { selectIsPageAccessible } from "@/components/store/storeSettingsSlice";
import GuestAccessGuard from "@/components/GuestAccessGuard";

// Define the props type for the main page function
interface PageProps {
  params: Promise<{
    categoryName: string;
  }>;
}

// ✅ Page component — using React.use() to unwrap params Promise
export default function CategoryPage({ params }: PageProps) {
  // Unwrap the params Promise using React.use()
  const resolvedParams = React.use(params);

  const isCategoryAccessible = useSelector(selectIsPageAccessible("category"));
  if (!isCategoryAccessible) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-white bg-black/80">
        <h2 className="text-2xl font-bold mb-2">Access Restricted</h2>
        <p className="text-gray-400 mb-4">
          This page is currently not accessible.
        </p>
      </div>
    );
  }
  return (
    <GuestAccessGuard>
      <CategoryClient categoryName={resolvedParams.categoryName} />
    </GuestAccessGuard>
  );
}
