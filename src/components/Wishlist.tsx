"use client";

import { FaBox, FaHeart, FaTrash } from "react-icons/fa";
import {
  Heart,
  XCircle,
  Lock,
  HeartOff,
  ShoppingCart,
  MinusCircle,
  Star,
  StarOff,
} from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { RootState } from "./store";
import { removeFromWishlist, clearWishlist } from "./store/UserSlice";
import {
  selectIsFeatureEnabled,
  selectIsCustomerExperienceEnabled,
} from "./store/storeSettingsSlice";
import { toast } from "react-hot-toast";
import LoadingButton from "./Loaders/LoadingButton";
import { useState } from "react";

const featureIcons = {
  wishlist: {
    enabled: <Heart className="text-pink-500" />,
    disabled: <HeartOff className="text-gray-400" />,
  },
  addToCart: {
    enabled: <ShoppingCart className="text-green-500" />,
    disabled: <MinusCircle className="text-gray-400" />,
  },
  reviews: {
    enabled: <Star className="text-yellow-400" />,
    disabled: <StarOff className="text-gray-400" />,
  },
  // ...add for all features
};

const Wishlist: React.FC = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { wishlist, isLoggedIn } = useSelector(
    (state: RootState) => state.user
  );
  const isWishlistEnabled = useSelector(selectIsFeatureEnabled("wishlist"));
  const requireLoginForWishlist = useSelector(
    selectIsCustomerExperienceEnabled("requireLoginForWishlist")
  );

  // Loading states
  const [removingItem, setRemovingItem] = useState<string | null>(null);
  const [clearingWishlist, setClearingWishlist] = useState(false);
  const [addingToCart, setAddingToCart] = useState<string | null>(null);

  const handleRemoveFromWishlist = async (productId: string) => {
    // Check if login is required for wishlist and user is not logged in
    if (requireLoginForWishlist && !isLoggedIn) {
      toast.error("Please log in to manage your wishlist.");
      router.push("/auth");
      return;
    }

    if (productId === "all") {
      setClearingWishlist(true);
      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000));
        dispatch(clearWishlist());
        toast.success("Wishlist cleared");
      } catch (error) {
        toast.error("Failed to clear wishlist");
      } finally {
        setClearingWishlist(false);
      }
    } else {
      setRemovingItem(productId);
      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 500));
        dispatch(removeFromWishlist(productId));
        toast.success("Removed from wishlist");
      } catch (error) {
        toast.error("Failed to remove item");
      } finally {
        setRemovingItem(null);
      }
    }
  };

  const handleAddToCart = async (product: any) => {
    // Check if login is required for wishlist and user is not logged in
    if (requireLoginForWishlist && !isLoggedIn) {
      toast.error("Please log in to manage your wishlist.");
      router.push("/auth");
      return;
    }

    setAddingToCart(product.id);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      // TODO: Implement actual add to cart functionality
      toast.success("Added to cart");
    } catch (error) {
      toast.error("Failed to add to cart");
    } finally {
      setAddingToCart(null);
    }
  };

  // Hide wishlist if requireLoginForWishlist is true and user is not logged in
  if (requireLoginForWishlist && !isLoggedIn) {
    return (
      <div className="w-full bg-[#101828] text-white p-6 rounded-lg shadow-lg">
        <div className="flex items-center gap-3 mb-5">
          <XCircle className="text-gray-400 text-2xl" />
          <h2 className="text-2xl font-bold text-gray-400">
            My Wishlist (Login Required)
          </h2>
        </div>
        <div className="text-center py-8">
          <Lock className="text-gray-400 text-4xl mx-auto mb-4" />
          <p className="text-gray-400">
            Please log in to use the wishlist feature
          </p>
        </div>
      </div>
    );
  }

  // Show disabled state if wishlist feature is disabled
  if (!isWishlistEnabled) {
    return (
      <div className="w-full bg-[#101828] text-white p-6 rounded-lg shadow-lg">
        <div className="flex items-center gap-3 mb-5">
          <XCircle className="text-gray-400 text-2xl" />
          <h2 className="text-2xl font-bold text-gray-400">
            My Wishlist (Disabled)
          </h2>
        </div>
        <div className="text-center py-8">
          <Lock className="text-gray-400 text-4xl mx-auto mb-4" />
          <p className="text-gray-400">
            Wishlist feature is currently disabled
          </p>
          <p className="text-gray-500 text-sm">
            Contact the store administrator to enable this feature
          </p>
        </div>
      </div>
    );
  }

  if (wishlist.length === 0) {
    return (
      <div className="w-full bg-[#101828] text-white p-6 rounded-lg shadow-lg">
        <div className="flex items-center gap-3 mb-5">
          <Heart className="text-red-400 text-2xl" />
          <h2 className="text-2xl font-bold">My Wishlist</h2>
        </div>
        <div className="text-center py-8">
          <Heart className="text-gray-400 text-4xl mx-auto mb-4" />
          <p className="text-gray-400">Your wishlist is empty</p>
          <p className="text-gray-500 text-sm">
            Start adding products to your wishlist!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-[#101828] text-white p-6 rounded-lg shadow-lg">
      <div className="flex items-center gap-3 mb-5">
        <Heart className="text-red-400 text-2xl" />
        <h2 className="text-2xl font-bold">My Wishlist ({wishlist.length})</h2>
      </div>
      {wishlist.map((item) => (
        <div
          key={item.id}
          className="flex justify-between items-center bg-[#1D2939] p-4 rounded-lg mb-3 cursor-pointer hover:bg-[#2A3A4A] transition-colors"
          onClick={() => router.push(`/product/${item.id}`)}
        >
          <div className="flex items-center gap-3">
            <div className="bg-[#344054] p-3 rounded-lg">
              {item.image ? (
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-12 h-12 object-cover rounded"
                />
              ) : (
                <FaBox className="text-gray-300 text-xl" />
              )}
            </div>
            <div>
              <p className="font-semibold">{item.name}</p>
              <p className="text-red-400">${item.price}</p>
              <p className="text-gray-400 text-sm">{item.category}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <LoadingButton
              onClick={(e) => {
                e?.stopPropagation();
                handleAddToCart(item);
              }}
              loading={addingToCart === item.id}
              loadingText="Adding..."
              variant="primary"
              size="sm"
              className="bg-red-600 hover:bg-red-700"
            >
              Add to Cart
            </LoadingButton>
            <LoadingButton
              onClick={(e) => {
                e?.stopPropagation();
                handleRemoveFromWishlist(item.id);
              }}
              loading={removingItem === item.id}
              loadingText=""
              variant="danger"
              size="sm"
              className="bg-gray-600 hover:bg-gray-700"
              icon={<FaTrash className="text-sm" />}
            />
          </div>
        </div>
      ))}
      <LoadingButton
        onClick={() => handleRemoveFromWishlist("all")}
        loading={clearingWishlist}
        loadingText="Clearing..."
        variant="danger"
        size="lg"
        className="w-full mt-4 bg-red-600 hover:bg-red-700"
      >
        Clear Wishlist
      </LoadingButton>
    </div>
  );
};

export default Wishlist;
