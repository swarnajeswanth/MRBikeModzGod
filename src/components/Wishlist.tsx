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
import {
  removeFromWishlist,
  clearWishlist,
  toggleWishlist,
} from "./store/UserSlice";
import {
  selectIsFeatureEnabled,
  selectIsCustomerExperienceEnabled,
} from "./store/storeSettingsSlice";
import { toast } from "react-hot-toast";
import LoadingButton from "./Loaders/LoadingButton";
import { useState, useEffect } from "react";

// Sample wishlist data for testing
const sampleWishlistItems = [
  {
    id: "1",
    name: "Premium Brake Pads",
    price: 89.99,
    image:
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop",
    category: "Brakes",
  },
  {
    id: "2",
    name: "Performance Exhaust System",
    price: 299.99,
    image:
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop",
    category: "Exhaust",
  },
  {
    id: "3",
    name: "LED Headlight Kit",
    price: 149.99,
    image:
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop",
    category: "Lighting",
  },
];

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

  // Add sample data to wishlist if empty (for testing)
  // useEffect(() => {
  //   if (wishlist.length === 0) {
  //     // Add sample items to wishlist
  //     sampleWishlistItems.forEach((item) => {
  //       dispatch(toggleWishlist(item));
  //     });
  //   }
  // }, [dispatch, wishlist.length]);

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
      <div className="w-full text-white p-6 rounded-lg shadow-lg">
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
      <div className="w-full text-white p-6 rounded-lg shadow-lg">
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
      <div className="w-full text-white p-6 rounded-lg shadow-lg">
        <div className="flex items-center gap-3 mb-5">
          <Heart className="text-red-400 text-2xl outline-2 outline-red-500 outline-offset-1" />
          <h2 className="text-2xl font-bold">My Wishlist</h2>
        </div>
        <div className="text-center py-8">
          <Heart className="text-gray-400 text-4xl mx-auto mb-4 outline-2 outline-gray-500 outline-offset-1" />
          <p className="text-gray-400">No wishlist items added.</p>
          <button
            className="mt-6 px-6 py-2 rounded-lg bg-[#8e0005] text-white font-semibold shadow hover:bg-[#a80008] transition-colors duration-200"
            onClick={() => router.push("/")}
          >
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full text-white p-6 rounded-lg shadow-lg">
      <div className="flex items-center gap-3 mb-5">
        <Heart className="text-red-400 text-2xl outline-2 outline-red-500 outline-offset-1" />
        <h2 className="text-2xl font-bold">My Wishlist ({wishlist.length})</h2>
      </div>
      <div className="flex justify-end mb-4">
        <button
          className="flex items-center gap-2 px-4 py-2 rounded bg-red-600 text-white font-semibold hover:bg-red-700 transition-colors duration-200"
          onClick={() => {
            if (
              window.confirm("Are you sure you want to clear your wishlist?")
            ) {
              handleRemoveFromWishlist("all");
            }
          }}
          disabled={clearingWishlist}
        >
          <FaTrash className="w-4 h-4" />
          {clearingWishlist ? "Clearing..." : "Clear Wishlist"}
        </button>
      </div>
      {wishlist.map((item) => (
        <div
          key={item.id}
          className="flex flex-col sm:flex-row sm:justify-between sm:items-center bg-[#0f172a] p-4 rounded-lg mb-3 cursor-pointer hover:bg-[#1e293b] transition-colors"
          onClick={() => router.push(`/product/${item.id}`)}
        >
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-3 sm:mb-0">
            <div className="bg-[#334155] p-3 rounded-lg w-full sm:w-auto">
              {item.image ? (
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-32 sm:w-12 sm:h-12 object-cover rounded"
                />
              ) : (
                <FaBox className="text-gray-300 text-xl w-full h-32 sm:w-12 sm:h-12 flex items-center justify-center" />
              )}
            </div>
            <div className="w-full sm:w-auto">
              <p
                className="font-semibold truncate max-w-full sm:max-w-[200px]"
                title={item.name}
              >
                {item.name.length > 25
                  ? `${item.name.substring(0, 25)}...`
                  : item.name}
              </p>
              <p className="text-red-400">₹{item.price.toFixed(2)}</p>
              <p className="text-gray-400 text-sm">{item.category}</p>
            </div>
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <LoadingButton
              onClick={(e) => {
                e?.stopPropagation();
                handleAddToCart(item);
              }}
              loading={addingToCart === item.id}
              loadingText="Adding..."
              variant="primary"
              size="sm"
              className="flex-1 sm:flex-none bg-red-600 hover:bg-red-700"
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
              className="flex-1 sm:flex-none bg-gray-600 hover:bg-gray-700"
              icon={<FaTrash className="text-sm" />}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default Wishlist;
