"use client";
import { useSelector } from "react-redux";
import { selectIsPageAccessible } from "@/components/store/storeSettingsSlice";
import GuestAccessGuard from "@/components/GuestAccessGuard";
import Wishlist from "@/components/Wishlist";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function WishlistPage() {
  const router = useRouter();
  const isWishlistAccessible = useSelector(selectIsPageAccessible("wishlist"));

  if (!isWishlistAccessible) {
    return (
      <div className="min-h-screen bg-[#501518] text-white">
        <div className="container mx-auto px-4 py-8">
          <button
            onClick={() => router.push("/")}
            className="flex items-center gap-2 text-white hover:text-gray-300 transition-colors mb-6"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Home
          </button>
          <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <h2 className="text-2xl font-bold mb-2">Access Restricted</h2>
            <p className="text-gray-300">
              This page is currently not accessible.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#270001]">
      <div className="container mx-auto px-4 py-8">
        <button
          onClick={() => router.push("/")}
          className="flex items-center gap-2 text-white hover:text-gray-300 transition-colors mb-6 "
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Home
        </button>
        <GuestAccessGuard>
          <Wishlist />
        </GuestAccessGuard>
      </div>
    </div>
  );
}
