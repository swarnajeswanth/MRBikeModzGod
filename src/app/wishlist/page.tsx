"use client";
import { useSelector } from "react-redux";
import { selectIsPageAccessible } from "@/components/store/storeSettingsSlice";
import GuestAccessGuard from "@/components/GuestAccessGuard";
import Wishlist from "@/components/Wishlist";

export default function WishlistPage() {
  const isWishlistAccessible = useSelector(selectIsPageAccessible("wishlist"));
  if (!isWishlistAccessible) {
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
      <Wishlist />
    </GuestAccessGuard>
  );
}
