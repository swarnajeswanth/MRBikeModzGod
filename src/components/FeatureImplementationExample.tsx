"use client";
/**
 * Feature Implementation Example
 *
 * This component demonstrates how to properly implement feature hiding
 * throughout your application using the Store Settings system.
 *
 * There are two main approaches:
 * 1. Using StoreSettingsWrapper (Recommended for simple cases)
 * 2. Using selectIsFeatureEnabled directly (For more complex logic)
 */

import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/components/store";
import { selectIsFeatureEnabled } from "@/components/store/storeSettingsSlice";
import StoreSettingsWrapper from "@/components/StoreSettingsWrapper";
import {
  ShoppingCart,
  Heart,
  Star,
  Search,
  Filter,
  Grid,
  Image,
  FileText,
  DollarSign,
  Package,
  Tag,
  Share,
  XCircle,
  Lock,
  EyeOff,
} from "lucide-react";

// Example 1: Using StoreSettingsWrapper (Simple approach)
const WishlistButton = () => {
  return (
    <StoreSettingsWrapper
      feature="wishlist"
      fallback={
        <button
          disabled
          className="bg-gray-400 text-gray-600 px-4 py-2 rounded-lg cursor-not-allowed flex items-center gap-2"
          title="Wishlist feature is disabled"
        >
          <XCircle className="h-4 w-4" />
          Wishlist (Disabled)
        </button>
      }
    >
      <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center gap-2">
        <Heart className="h-4 w-4" />
        Add to Wishlist
      </button>
    </StoreSettingsWrapper>
  );
};

// Example 2: Using selectIsFeatureEnabled directly (Complex logic)
const ProductCard = ({ product }: { product: any }) => {
  const isAddToCartEnabled = useSelector(selectIsFeatureEnabled("addToCart"));
  const isWishlistEnabled = useSelector(selectIsFeatureEnabled("wishlist"));
  const isRatingsEnabled = useSelector(selectIsFeatureEnabled("ratings"));
  const isReviewsEnabled = useSelector(selectIsFeatureEnabled("reviews"));
  const isPriceDisplayEnabled = useSelector(
    selectIsFeatureEnabled("priceDisplay")
  );
  const isStockDisplayEnabled = useSelector(
    selectIsFeatureEnabled("stockDisplay")
  );
  const isDiscountDisplayEnabled = useSelector(
    selectIsFeatureEnabled("discountDisplay")
  );
  const isProductImagesEnabled = useSelector(
    selectIsFeatureEnabled("productImages")
  );
  const isShareProductsEnabled = useSelector(
    selectIsFeatureEnabled("shareProducts")
  );

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      {/* Product Image - Hidden if disabled */}
      {isProductImagesEnabled ? (
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-48 object-cover rounded-lg"
        />
      ) : (
        <div className="w-full h-48 bg-gray-200 rounded-lg flex items-center justify-center">
          <Image className="h-8 w-8 text-gray-400" />
          <span className="ml-2 text-gray-500">Image not available</span>
        </div>
      )}

      <div className="mt-4">
        <h3 className="font-semibold text-lg">{product.name}</h3>

        {/* Category - Always shown */}
        <p className="text-gray-600 text-sm">{product.category}</p>

        {/* Ratings - Hidden if disabled */}
        {isRatingsEnabled && (
          <div className="flex items-center gap-1 mt-2">
            <Star className="h-4 w-4 text-yellow-400 fill-current" />
            <span className="text-sm">{product.rating}</span>
            {isReviewsEnabled && (
              <span className="text-sm text-gray-500">
                ({product.reviews} reviews)
              </span>
            )}
          </div>
        )}

        {/* Price - Hidden if disabled */}
        {isPriceDisplayEnabled && (
          <div className="mt-2">
            <span className="text-xl font-bold">₹{product.price}</span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-gray-500 line-through ml-2">
                ₹{product.originalPrice}
              </span>
            )}
            {isDiscountDisplayEnabled && product.discount && (
              <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded ml-2">
                {product.discount} OFF
              </span>
            )}
          </div>
        )}

        {/* Stock - Hidden if disabled */}
        {isStockDisplayEnabled && (
          <div className="mt-2 flex items-center gap-2">
            <Package className="h-4 w-4 text-gray-400" />
            <span className="text-sm text-gray-600">
              {product.inStock
                ? `${product.stockCount} in stock`
                : "Out of stock"}
            </span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="mt-4 flex gap-2">
          {/* Add to Cart - Hidden if disabled */}
          {isAddToCartEnabled ? (
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2">
              <ShoppingCart className="h-4 w-4" />
              Add to Cart
            </button>
          ) : (
            <button
              disabled
              className="bg-gray-400 text-gray-600 px-4 py-2 rounded-lg cursor-not-allowed flex items-center gap-2"
              title="Add to cart feature is disabled"
            >
              <XCircle className="h-4 w-4" />
              Add to Cart (Disabled)
            </button>
          )}

          {/* Wishlist - Hidden if disabled */}
          {isWishlistEnabled && (
            <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center gap-2">
              <Heart className="h-4 w-4" />
              Wishlist
            </button>
          )}

          {/* Share - Hidden if disabled */}
          {isShareProductsEnabled && (
            <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2">
              <Share className="h-4 w-4" />
              Share
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// Example 3: Search Component with Feature Control
const SearchComponent = () => {
  const isSearchEnabled = useSelector(selectIsFeatureEnabled("search"));
  const isFiltersEnabled = useSelector(selectIsFeatureEnabled("filters"));

  if (!isSearchEnabled) {
    return (
      <div className="bg-gray-100 p-4 rounded-lg text-center">
        <Search className="h-8 w-8 text-gray-400 mx-auto mb-2" />
        <p className="text-gray-500">
          Search functionality is currently disabled
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Search products..."
          className="flex-1 px-3 py-2 border rounded-lg"
        />
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2">
          <Search className="h-4 w-4" />
          Search
        </button>
      </div>

      {/* Filters - Only show if enabled */}
      {isFiltersEnabled && (
        <div className="mt-4 pt-4 border-t">
          <h4 className="font-semibold mb-2">Filters</h4>
          <div className="flex gap-2">
            <select className="px-3 py-2 border rounded-lg">
              <option>Category</option>
            </select>
            <select className="px-3 py-2 border rounded-lg">
              <option>Price Range</option>
            </select>
            <select className="px-3 py-2 border rounded-lg">
              <option>Rating</option>
            </select>
          </div>
        </div>
      )}
    </div>
  );
};

// Example 4: Category Navigation with Feature Control
const CategoryNavigation = () => {
  const isCategoriesEnabled = useSelector(selectIsFeatureEnabled("categories"));

  if (!isCategoriesEnabled) {
    return (
      <div className="bg-gray-100 p-6 rounded-lg text-center">
        <Grid className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-600 mb-2">
          Category Browsing Disabled
        </h3>
        <p className="text-gray-500">
          Category navigation is currently unavailable
        </p>
      </div>
    );
  }

  const categories = [
    { name: "Bikes", icon: "🚲" },
    { name: "Parts", icon: "🔧" },
    { name: "Accessories", icon: "🎒" },
    { name: "Clothing", icon: "👕" },
  ];

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h3 className="font-semibold mb-4">Shop by Category</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {categories.map((category) => (
          <button
            key={category.name}
            className="p-4 border rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className="text-2xl mb-2">{category.icon}</div>
            <div className="font-medium">{category.name}</div>
          </button>
        ))}
      </div>
    </div>
  );
};

// Example 5: Page Access Control
const ProtectedPage = () => {
  const isPageAccessible = useSelector(
    (state: RootState) => state.storeSettings?.pages?.wishlist ?? true
  );

  if (!isPageAccessible) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg text-center max-w-md">
          <Lock className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-600 mb-2">
            Access Restricted
          </h1>
          <p className="text-gray-500 mb-4">
            This page is currently not accessible. Please contact the store
            administrator.
          </p>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg">
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Wishlist</h1>
      {/* Wishlist content */}
    </div>
  );
};

// Main Example Component
const FeatureImplementationExample = () => {
  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-4">
          Feature Implementation Examples
        </h1>
        <p className="text-gray-600">
          This page demonstrates how to properly implement feature hiding
          throughout your application.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Search Component */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Search & Filters</h2>
          <SearchComponent />
        </div>

        {/* Category Navigation */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Category Navigation</h2>
          <CategoryNavigation />
        </div>

        {/* Product Card */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Product Card</h2>
          <ProductCard
            product={{
              name: "Mountain Bike",
              category: "Bikes",
              image: "/bike-image.jpg",
              rating: 4.5,
              reviews: 128,
              price: 599.99,
              originalPrice: 799.99,
              discount: "25%",
              inStock: true,
              stockCount: 15,
            }}
          />
        </div>

        {/* Wishlist Button */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Wishlist Button</h2>
          <WishlistButton />
        </div>
      </div>

      <div className="bg-blue-50 p-6 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Implementation Notes</h2>
        <ul className="space-y-2 text-sm">
          <li>
            • Use <code>StoreSettingsWrapper</code> for simple show/hide logic
          </li>
          <li>
            • Use <code>selectIsFeatureEnabled</code> for complex conditional
            rendering
          </li>
          <li>• Always provide fallback UI for disabled features</li>
          <li>• Use appropriate icons and messaging for disabled states</li>
          <li>• Test all feature combinations to ensure proper hiding</li>
        </ul>
      </div>
    </div>
  );
};

export default FeatureImplementationExample;
