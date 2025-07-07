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
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import LoadingButton from "./Loaders/LoadingButton";
import { useState } from "react";

// Sample wishlist data - you can replace this with your own data
const sampleWishlistItems = [
  {
    id: "1",
    name: "Premium Brake Pads",
    price: 89.99,
    category: "Brakes",
    image:
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=100&h=100&fit=crop",
  },
  {
    id: "2",
    name: "Performance Exhaust System",
    price: 299.99,
    category: "Exhaust",
    image:
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=100&h=100&fit=crop",
  },
  {
    id: "3",
    name: "LED Headlight Kit",
    price: 149.99,
    category: "Lighting",
    image:
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=100&h=100&fit=crop",
  },
];

const Wishlist: React.FC = () => {
  const router = useRouter();
  const [wishlistItems, setWishlistItems] = useState(sampleWishlistItems);
  const [removingItem, setRemovingItem] = useState<string | null>(null);
  const [clearingWishlist, setClearingWishlist] = useState(false);
  const [addingToCart, setAddingToCart] = useState<string | null>(null);

  const handleRemoveFromWishlist = async (productId: string) => {
    if (productId === "all") {
      setClearingWishlist(true);
      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setWishlistItems([]);
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
        setWishlistItems((prev) =>
          prev.filter((item) => item.id !== productId)
        );
        toast.success("Removed from wishlist");
      } catch (error) {
        toast.error("Failed to remove item");
      } finally {
        setRemovingItem(null);
      }
    }
  };

  const handleAddToCart = async (product: any) => {
    setAddingToCart(product.id);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success("Added to cart");
    } catch (error) {
      toast.error("Failed to add to cart");
    } finally {
      setAddingToCart(null);
    }
  };

  if (wishlistItems.length === 0) {
    return (
      <div className="w-full text-white p-6 rounded-lg shadow-lg">
        <div className="flex items-center gap-3 mb-5">
          <Heart className="text-red-400 text-2xl outline-2 outline-red-500 outline-offset-1" />
          <h2 className="text-2xl font-bold">My Wishlist</h2>
        </div>
        <div className="text-center py-8">
          <Heart className="text-gray-400 text-4xl mx-auto mb-4 outline-2 outline-gray-500 outline-offset-1" />
          <p className="text-gray-400">Your wishlist is empty</p>
          <p className="text-gray-500 text-sm">
            Start adding products to your wishlist!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-fi text-white p-6 rounded-lg shadow-lg bg-[#270001]">
      <div className="flex items-center gap-3 mb-5">
        <Heart className="text-red-400 text-2xl outline-2 outline-red-500 outline-offset-1" />
        <h2 className="text-2xl font-bold">
          My Wishlist ({wishlistItems.length})
        </h2>
      </div>
      {wishlistItems.map((item) => (
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
              <p className="text-red-400">${item.price}</p>
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
