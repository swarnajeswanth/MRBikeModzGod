"use client";
import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { Star, ShoppingCart, Heart } from "lucide-react";
import AddToCartButton from "../Cart/AddToCart";
import { RootState, AppDispatch } from "@/components/store";
import {
  selectAllProducts,
  fetchProducts,
} from "@/components/store/productSlice";
import { selectIsCustomerExperienceEnabled } from "@/components/store/storeSettingsSlice";
import { toggleWishlist } from "@/components/store/UserSlice";
import { toast } from "react-hot-toast";
import { FaRegHeart, FaHeart } from "react-icons/fa";
import { useEffect } from "react";
import { useWishlist } from "../hooks/useWishlist";

interface WishlistGridProps {
  title?: string;
  description?: string;
  maxItems?: number;
  showEmptyState?: boolean;
  className?: string;
}

const WishlistGrid: React.FC<WishlistGridProps> = ({
  title = "My Wishlist",
  description = "Your saved items for later",
  maxItems,
  showEmptyState = true,
  className = "",
}) => {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  // Get products and wishlist from Redux
  const products = useSelector(selectAllProducts);
  const { wishlist, isLoggedIn } = useSelector(
    (state: RootState) => state.user
  );
  const requireLoginForWishlist = useSelector(
    selectIsCustomerExperienceEnabled("requireLoginForWishlist")
  );
  const { isInWishlist, toggleWishlistItem } = useWishlist();

  // Load products if not already loaded
  useEffect(() => {
    if (products.length === 0) {
      dispatch(fetchProducts());
    }
  }, [dispatch, products.length]);

  // Get wishlist items with full product data
  const wishlistItems = wishlist
    .map((wishlistItem) => {
      const product = products.find((p) => p.id === wishlistItem.id);
      return product ? { ...product, ...wishlistItem } : null;
    })
    .filter((item): item is any => item !== null)
    .slice(0, maxItems);

  const handleToggleWishlist = (product: any, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent navigation to product page

    // Check if login is required for wishlist and user is not logged in
    if (requireLoginForWishlist && !isLoggedIn) {
      toast.error("Please log in to use the wishlist.");
      router.push("/auth");
      return;
    }

    const wishlistItem = {
      id: product.id,
      name: product.name,
      price: product.price,
      image:
        product.images && product.images.length > 0 ? product.images[0] : "",
      category: product.category,
    };

    toggleWishlistItem(wishlistItem);
  };

  const handleProductClick = (productId: string) => {
    router.push(`/product/${productId}`);
  };

  // Show empty state if no wishlist items and showEmptyState is true
  if (wishlistItems.length === 0 && showEmptyState) {
    return (
      <section className={`py-8 bg-gray-900/50 ${className}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="text-6xl mb-4">💝</div>
            <h2 className="text-2xl font-bold text-white mb-2">{title}</h2>
            <p className="text-gray-400 mb-6">{description}</p>
            <p className="text-gray-500">
              {isLoggedIn
                ? "Your wishlist is empty. Start adding items you love!"
                : "Please log in to view your wishlist."}
            </p>
            {!isLoggedIn && (
              <button
                onClick={() => router.push("/auth")}
                className="mt-4 bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg transition-colors"
              >
                Login to View Wishlist
              </button>
            )}
          </div>
        </div>
      </section>
    );
  }

  // Don't render anything if no items and showEmptyState is false
  if (wishlistItems.length === 0) {
    return null;
  }

  return (
    <section className={`py-8 bg-gray-900/50 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
            {title}
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            {description}
          </p>
        </div>

        {/* Wishlist Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {wishlistItems.map((product) => (
            <div
              key={product.id}
              className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 hover:border-red-500/30 transition-all duration-300 rounded-lg overflow-hidden cursor-pointer group"
            >
              <div
                className="h-48 relative flex items-center justify-center cursor-pointer bg-gray-700"
                onClick={() => handleProductClick(product.id)}
              >
                {product.label && (
                  <span
                    className={`absolute top-4 left-4 px-2 py-1 text-sm text-white rounded`}
                    style={{ backgroundColor: product.backgroundColor }}
                  >
                    {product.label}
                  </span>
                )}

                <button
                  className="absolute top-4 right-4 p-1 rounded-full bg-white/10 hover:bg-white/20 transition-all z-10"
                  onClick={(e) => handleToggleWishlist(product, e)}
                >
                  <FaHeart className="w-5 h-5 text-red-500 transition-transform duration-200 scale-110" />
                </button>

                {product.images && product.images.length > 0 ? (
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="text-white text-6xl font-bold opacity-20">
                    {product.name.charAt(0)}
                  </div>
                )}
              </div>

              <div className="p-4">
                <h3
                  className="text-lg font-semibold text-white mb-2 line-clamp-2 cursor-pointer"
                  onClick={() => handleProductClick(product.id)}
                >
                  {product.name}
                </h3>

                {/* Rating Section */}
                <div className="flex items-center mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < Math.floor(product.rating)
                          ? "text-yellow-400"
                          : "text-gray-600"
                      }`}
                    />
                  ))}
                  <span className="text-gray-400 text-sm ml-2">
                    {product.rating} ({product.reviews})
                  </span>
                </div>

                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-xl font-bold text-white">
                      ₹{product.price}
                    </span>
                    {product.originalPrice && (
                      <span className="text-sm text-gray-500 line-through">
                        ₹{product.originalPrice}
                      </span>
                    )}
                  </div>
                  {product.originalPrice && (
                    <span className="bg-green-600 text-white text-xs px-2 py-1 rounded">
                      {Math.round(
                        ((product.originalPrice - product.price) /
                          product.originalPrice) *
                          100
                      )}
                      % OFF
                    </span>
                  )}
                </div>

                <AddToCartButton product={product} />
              </div>
            </div>
          ))}
        </div>

        {/* View All Wishlist Button */}
        {maxItems && wishlist.length > maxItems && (
          <div className="text-center mt-8">
            <button
              onClick={() => router.push("/wishlist")}
              className="border-red-600 text-red-400 hover:bg-red-600 hover:text-white px-8 py-2 rounded-lg transition-colors"
            >
              View All Wishlist Items ({wishlist.length})
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default WishlistGrid;
