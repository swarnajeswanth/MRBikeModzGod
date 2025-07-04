"use client";
import GuestAccessGuard from "@/components/GuestAccessGuard";
import ProductPage from "@/components/AllProducts";
import { useSelector } from "react-redux";
import { selectIsPageAccessible } from "@/components/store/storeSettingsSlice";

export default function AllProductsPage() {
  const isAllProductsAccessible = useSelector(
    selectIsPageAccessible("allProducts")
  );
  if (!isAllProductsAccessible) {
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
      <ProductPage />
    </GuestAccessGuard>
  );
}
