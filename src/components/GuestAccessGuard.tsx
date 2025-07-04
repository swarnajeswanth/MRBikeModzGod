"use client";
import React from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { selectIsCustomerExperienceEnabled } from "@/components/store/storeSettingsSlice";
import { RootState } from "@/components/store";
import { Lock } from "lucide-react";

const GuestAccessGuard: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const isLoggedIn = useSelector((state: RootState) => state.user.isLoggedIn);
  const allowGuestBrowsing = useSelector(
    selectIsCustomerExperienceEnabled("allowGuestBrowsing")
  );
  const router = useRouter();

  if (!allowGuestBrowsing && !isLoggedIn) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-white bg-black/80">
        <Lock className="h-16 w-16 text-gray-400 mb-4" />
        <h2 className="text-2xl font-bold mb-2">Login Required</h2>
        <p className="text-gray-400 mb-4">
          Guest browsing is disabled. Please log in to continue.
        </p>
        <button
          className="mt-4 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
          onClick={() => router.push("/auth")}
        >
          Go to Login
        </button>
      </div>
    );
  }
  return <>{children}</>;
};

export default GuestAccessGuard;
