"use client";
// app/product/[productId]/page.tsx
import PageTransitionWrapper from "@/components/Loaders/PageTransitionWrapper";
import ProductPage from "@/components/SingleProductPage";
import { useSelector } from "react-redux";
import { selectIsPageAccessible } from "@/components/store/storeSettingsSlice";
import GuestAccessGuard from "@/components/GuestAccessGuard";

interface Props {
  params: { productId: string };
}

export default function Product() {
  const isIndividualProductAccessible = useSelector(
    selectIsPageAccessible("individualProduct")
  );
  if (!isIndividualProductAccessible) {
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
