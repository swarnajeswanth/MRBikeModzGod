"use client";

import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/components/store";
import {
  selectAllProducts,
  selectLoading,
  selectError,
  fetchProducts,
} from "@/components/store/productSlice";
import { toggleWishlist } from "@/components/store/UserSlice";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { selectIsCustomerExperienceEnabled } from "@/components/store/storeSettingsSlice";
import { useWishlist } from "@/components/hooks/useWishlist";
import IndividualProduct from "@/components/IndividualProduct";
import SimpleLoadingSpinner from "@/components/Loaders/SimpleLoadingSpinner";
import { useLoading } from "@/components/hooks/useLoading";

const AllProductsPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const products = useSelector(selectAllProducts);
  const loading = useSelector(selectLoading);
  const error = useSelector(selectError);
  const [isVisible, setIsVisible] = useState(false);
  const { isLoading: pageLoading, withLoading } = useLoading();

  const router = useRouter();
  const { isLoggedIn } = useSelector((state: RootState) => state.user);
  const requireLoginForWishlist = useSelector(
    selectIsCustomerExperienceEnabled("requireLoginForWishlist")
  );
  const { isInWishlist, toggleWishlistItem } = useWishlist();
  const [filters, setFilters] = useState({
    category: "",
    priceRange: "",
    sortBy: "",
    offers: "",
  });
  const [promoCode, setPromoCode] = useState("");
  const { role } = useSelector((state: any) => state.user);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  useEffect(() => {
    if (products.length === 0) {
      withLoading(() => dispatch(fetchProducts()), "Loading products...");
    }
  }, [dispatch, products.length, withLoading]);

  useEffect(() => {
    if (role === "retailer") {
      const updateSelectedDate = () => {
        const savedDate = localStorage.getItem("retailerSelectedDate");
        if (savedDate) setSelectedDate(new Date(savedDate));
      };
      updateSelectedDate();
      window.addEventListener("focus", updateSelectedDate);
      return () => window.removeEventListener("focus", updateSelectedDate);
    }
  }, [role]);

  // Trigger fade in animation when component mounts
  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Get unique categories from products (case-insensitive)
  const uniqueCategories = [
    ...new Set(
      products
        .map((product) => product.category?.toLowerCase().trim())
        .filter(Boolean)
    ),
  ].map((category) => category.charAt(0).toUpperCase() + category.slice(1));

  const handleToggleWishlist = (product: any) => {
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

    dispatch(toggleWishlist(wishlistItem));

    const isInWishlist = products.some((item) => item.id === product.id);
    if (isInWishlist) {
      toast.success("Removed from wishlist");
    } else {
      toast.success("Added to wishlist");
    }
  };

  const filterProducts = () => {
    let filtered = [...products];

    // Category filter
    if (filters.category) {
      filtered = filtered.filter(
        (product) =>
          product.category.toLowerCase() === filters.category.toLowerCase()
      );
    }

    // Price range filter
    if (filters.priceRange) {
      const [min, max] = filters.priceRange.split("-").map(Number);
      filtered = filtered.filter((product) => {
        if (max) {
          return product.price >= min && product.price <= max;
        }
        return product.price >= min;
      });
    }

    // Sort products
    if (filters.sortBy) {
      filtered.sort((a, b) => {
        switch (filters.sortBy) {
          case "price-low":
            return a.price - b.price;
          case "price-high":
            return b.price - a.price;
          case "rating":
            return b.rating - a.rating;
          case "reviews":
            return b.reviews - a.reviews;
          default:
            return 0;
        }
      });
    }

    // Offers filter
    if (filters.offers) {
      filtered = filtered.filter((product) => {
        switch (filters.offers) {
          case "discount":
            return (
              product.originalPrice && product.originalPrice > product.price
            );
          case "new":
            return product.labelType === "new";
          case "bestseller":
            return product.labelType === "bestseller";
          default:
            return true;
        }
      });
    }

    return filtered;
  };

  const clearFilters = () => {
    setFilters({
      category: "",
      priceRange: "",
      sortBy: "",
      offers: "",
    });
  };

  const filteredProducts = filterProducts();

  // Show loading spinner while products are being fetched
  if (loading || pageLoading || products.length === 0) {
    return (
      <div className="min-h-screen bg-black/90">
        <SimpleLoadingSpinner
          isLoading={true}
          message="Loading products..."
          className="min-h-screen"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black/90">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">All Products</h1>
          <p className="text-gray-400 text-lg">
            Discover our complete collection of premium auto parts and
            accessories
          </p>
        </div>

        {/* Filters */}
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Category Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Category
              </label>
              <select
                value={filters.category}
                onChange={(e) =>
                  setFilters({ ...filters, category: e.target.value })
                }
                className="w-full bg-gray-700 text-white rounded px-3 py-2 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                <option value="">All Categories</option>
                {uniqueCategories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            {/* Price Range Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Price Range
              </label>
              <select
                value={filters.priceRange}
                onChange={(e) =>
                  setFilters({ ...filters, priceRange: e.target.value })
                }
                className="w-full bg-gray-700 text-white rounded px-3 py-2 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                <option value="">All Prices</option>
                <option value="0-100">Under ₹100</option>
                <option value="100-500">₹100 - ₹500</option>
                <option value="500-1000">₹500 - ₹1,000</option>
                <option value="1000-5000">₹1,000 - ₹5,000</option>
                <option value="5000-">Above ₹5,000</option>
              </select>
            </div>

            {/* Sort By */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Sort By
              </label>
              <select
                value={filters.sortBy}
                onChange={(e) =>
                  setFilters({ ...filters, sortBy: e.target.value })
                }
                className="w-full bg-gray-700 text-white rounded px-3 py-2 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                <option value="">Default</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
                <option value="reviews">Most Reviewed</option>
              </select>
            </div>

            {/* Offers Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Offers
              </label>
              <select
                value={filters.offers}
                onChange={(e) =>
                  setFilters({ ...filters, offers: e.target.value })
                }
                className="w-full bg-gray-700 text-white rounded px-3 py-2 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                <option value="">All Items</option>
                <option value="discount">On Sale</option>
                <option value="new">New Arrivals</option>
                <option value="bestseller">Best Sellers</option>
              </select>
            </div>
          </div>

          {/* Clear Filters Button */}
          <div className="mt-4 text-center">
            <button
              onClick={clearFilters}
              className="text-red-400 hover:text-red-300 text-sm font-medium"
            >
              Clear All Filters
            </button>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-400">
            Showing {filteredProducts.length} of {products.length} products
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <IndividualProduct
              key={product.id}
              id={product.id}
              label={product.label}
              labelType={product.labelType}
              backgroundColor={product.backgroundColor}
              category={product.category}
              title={product.title}
              rating={product.rating}
              reviews={product.reviews}
              price={product.price}
              originalPrice={product.originalPrice}
              discount={product.discount}
              images={product.images}
            />
          ))}
        </div>

        {/* No Results */}
        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">
              No products found matching your criteria.
            </p>
            <button
              onClick={clearFilters}
              className="mt-4 text-red-400 hover:text-red-300 font-medium"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllProductsPage;
