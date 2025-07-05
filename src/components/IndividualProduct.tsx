"use client";

import React from "react";
import "./individualproduct.css";
import { FaStar, FaRegHeart, FaHeart } from "react-icons/fa";
import { Heart, XCircle, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import AddToCartButton from "@/components/Cart/AddToCart"; // Adjust path if needed
import { useDispatch, useSelector } from "react-redux";
import { startLoading, stopLoading } from "@/components/store/LoadingSlice";
import { useTransition } from "react";
import { RootState } from "@/components/store";
import {
  selectFeatures,
  selectIsCustomerExperienceEnabled,
} from "@/components/store/storeSettingsSlice";
import { toast } from "react-hot-toast";
import { ProductRatingShimmer } from "./Loaders/RatingShimmer";
import { useWishlist } from "./hooks/useWishlist";

interface ProductCardProps {
  id?: string; // Add product ID
  label?: string;
  labelType?: string;
  backgroundColor: string;
  category: string;
  title: string;
  rating: number;
  reviews: number;
  price: number;
  originalPrice?: number;
  discount?: string;
  images?: string[];
  loading?: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({
  id,
  label,
  labelType,
  backgroundColor,
  category,
  title,
  rating,
  reviews,
  price,
  originalPrice,
  discount,
  images,
  loading = false,
}) => {
  const [isPending, startTransition] = useTransition();
  const { wishlist, isLoggedIn } = useSelector(
    (state: RootState) => state.user
  );
  const features = useSelector(selectFeatures);
  const requireLoginForWishlist = useSelector(
    selectIsCustomerExperienceEnabled("requireLoginForWishlist")
  );
  const { isInWishlist, toggleWishlistItem } = useWishlist();

  const handleProductClick = (productId: string) => {
    if (!productId) {
      toast.error("Product ID not found");
      return;
    }
    dispatch(startLoading());
    startTransition(() => {
      router.push(`/product/${productId}`);
      // stopLoading should ideally happen after route load
      // but for now we simulate delay if needed
      setTimeout(() => {
        dispatch(stopLoading());
      }, 800); // adjust if your route loads slowly
    });
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent navigation to product page

    // Check if login is required for wishlist and user is not logged in
    if (requireLoginForWishlist && !isLoggedIn) {
      toast.error("Please log in to use the wishlist.");
      router.push("/auth");
      return;
    }

    const wishlistItem = {
      id: id || "",
      name: title,
      price: price,
      image: images && images.length > 0 ? images[0] : "",
      category: category,
    };

    toggleWishlistItem(wishlistItem);
  };

  const router = useRouter();
  const dispatch = useDispatch();

  // Show disabled state if product display is disabled
  if (!features?.productImages && !features?.productDetails) {
    return (
      <div className="product-card">
        <div className="product-image bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
          <div className="text-center">
            <EyeOff className="h-8 w-8 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-500 text-sm">Product display disabled</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="product-card">
      <div className="product-image" style={{ backgroundColor }}>
        {features?.discountDisplay && label && (
          <div className={`label ${labelType}`}>{label}</div>
        )}

        {/* Wishlist Button - Only show if wishlist feature is enabled */}
        {features?.wishlist && (
          <button
            onClick={handleToggleWishlist}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-all z-10"
          >
            {isInWishlist(id || "") ? (
              <FaHeart className="w-5 h-5 text-red-500 transition-transform duration-200 scale-110" />
            ) : (
              <FaRegHeart className="w-5 h-5 text-white" />
            )}
          </button>
        )}

        {/* Product Image - Only show if product images feature is enabled */}
        {features?.productImages && images && images.length > 0 ? (
          <img
            src={images[0]}
            alt={title}
            className="w-full h-full object-cover rounded-t-lg"
          />
        ) : (
          <span className="product-letter">{title.charAt(0)}</span>
        )}
      </div>

      <div className="product-info">
        <span className="category-tag">{category}</span>
        <h3
          className="cursor-pointer hover:text-red-400 transition-colors duration-200"
          onClick={() => handleProductClick(id || title)}
        >
          {title}
        </h3>

        {/* Rating - Show shimmer while loading or actual rating when loaded */}
        {features?.ratings &&
          (loading ? (
            <ProductRatingShimmer />
          ) : (
            <div className="rating">
              <FaStar color="#FFD700" />
              <span>{rating}</span>
              {features?.reviews && (
                <span className="reviews">({reviews} reviews)</span>
              )}
            </div>
          ))}

        {/* Price - Only show if price display feature is enabled */}
        {features?.priceDisplay && (
          <div className="price-row">
            <span className="price">₹{price.toFixed(2)}</span>
            {originalPrice && (
              <>
                <span className="original-price">
                  ₹{originalPrice.toFixed(2)}
                </span>
                {features?.discountDisplay && discount && (
                  <span className="discount-badge">SAVE {discount}</span>
                )}
              </>
            )}
          </div>
        )}

        {/* Add to Cart Button - Only show if add to cart feature is enabled */}
        {features?.addToCart && (
          <AddToCartButton
            product={{
              id: id || "",
              name: title,
              price: price,
              image: images && images.length > 0 ? images[0] : "",
              category: category,
              originalPrice: originalPrice,
              discount: discount,
            }}
          />
        )}
      </div>
    </div>
  );
};

export default ProductCard;
