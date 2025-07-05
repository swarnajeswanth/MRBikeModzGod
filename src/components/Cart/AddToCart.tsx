"use client";
import { useState } from "react";
import { ShoppingCart, Lock, XCircle } from "lucide-react";
import { toast } from "react-hot-toast";
import { useSelector } from "react-redux";
import { RootState } from "@/components/store";
import {
  selectIsFeatureEnabled,
  selectIsCustomerExperienceEnabled,
} from "@/components/store/storeSettingsSlice";
import { useRouter } from "next/navigation";

interface AddToCartButtonProps {
  product?: any;
  className?: string;
}

const AddToCartButton = ({ product, className = "" }: AddToCartButtonProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const isAddToCartEnabled = useSelector(selectIsFeatureEnabled("addToCart"));
  const allowGuestBrowsing = useSelector(
    selectIsCustomerExperienceEnabled("allowGuestBrowsing")
  );
  const { isLoggedIn } = useSelector((state: RootState) => state.user);

  const handleAddToCart = async () => {
    if (!isAddToCartEnabled) {
      toast.error("Add to cart feature is currently disabled");
      return;
    }

    // Check if guest browsing is allowed or user is logged in
    if (!allowGuestBrowsing && !isLoggedIn) {
      toast.error("Please log in to add items to cart.");
      router.push("/auth");
      return;
    }

    setIsLoading(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    toast.success(
      product ? `${product.name} added to cart!` : "Product added to cart!"
    );

    setIsLoading(false);
  };

  if (!isAddToCartEnabled) {
    return (
      <button
        disabled
        className={`bg-gray-400 text-gray-600 px-4 py-2 rounded-lg cursor-not-allowed flex items-center justify-center gap-2 ${className}`}
        title="Add to cart feature is disabled"
      >
        <XCircle className="h-4 w-4" />
        Add to Cart (Disabled)
      </button>
    );
  }

  // Show login required message if guest browsing is disabled and user is not logged in
  if (!allowGuestBrowsing && !isLoggedIn) {
    return (
      <button
        onClick={() => {
          toast.error("Please log in to add items to cart.");
          router.push("/auth");
        }}
        className={`bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center justify-center gap-2 ${className}`}
        title="Login required to add to cart"
      >
        <Lock className="h-4 w-4" />
        Login to Add to Cart
      </button>
    );
  }

  return (
    <button
      onClick={handleAddToCart}
      disabled={isLoading}
      className={`bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2 ${className}`}
    >
      {isLoading ? (
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
      ) : (
        <ShoppingCart className="h-4 w-4" />
      )}
      {isLoading ? "Adding..." : "Add to Cart"}
    </button>
  );
};

export default AddToCartButton;
