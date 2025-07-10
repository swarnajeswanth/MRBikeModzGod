"use client";

import { useSelector } from "react-redux";
import { selectIsPageAccessible } from "@/components/store/storeSettingsSlice";
import GuestAccessGuard from "@/components/GuestAccessGuard";
import { RootState } from "@/components/store";
import CustomerCart from "@/components/Cart/CustomerCart";
import RetailerCart from "@/components/Cart/RetailerCart";

export default function CartPage() {
  const isCartAccessible = useSelector(selectIsPageAccessible("cart"));
  const user = useSelector((state: RootState) => state.user);
  const isRetailer = user.role === "retailer";

  if (!isCartAccessible) {
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
      <div className="min-h-screen bg-[#17191e] py-10 px-4 sm:px-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-8 text-center">
          Cart
        </h1>

        {isRetailer ? <RetailerCart /> : <CustomerCart />}
      </div>
    </GuestAccessGuard>
  );
}
