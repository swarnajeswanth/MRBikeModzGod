"use client";
import { useState } from "react";

import { Star, ShoppingCart, Filter, X } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useRouter } from "next/navigation";
import AddToCartButton from "./Cart/AddToCart";
import { FaRegHeart, FaHeart } from "react-icons/fa";

// Mock products data
const allProducts = [
  {
    id: "racing-brake-pads",
    name: "Racing Brake Pads",
    price: 199.99,
    originalPrice: 249.99,
    rating: 4.8,
    reviews: 178,
    category: "brakes",
    image: "bg-gradient-to-br from-purple-500 to-purple-700",
    badge: "SALE",
    badgeColor: "bg-purple-600",
    hasOffer: true,
    isDeal: true,
  },
  {
    id: "racing-helmet",
    name: "Professional Racing Helmet",
    price: 299.99,
    originalPrice: 399.99,
    rating: 4.9,
    reviews: 234,
    category: "helmet",
    image: "bg-gradient-to-br from-red-500 to-red-700",
    badge: "HOT DEAL",
    badgeColor: "bg-red-600",
    hasOffer: true,
    isDeal: true,
  },
  {
    id: "sport-bike",
    name: "Mountain Bike Pro",
    price: 1299.99,
    rating: 4.7,
    reviews: 89,
    category: "bike",
    image: "bg-gradient-to-br from-green-500 to-green-700",
    badge: "NEW",
    badgeColor: "bg-green-600",
    hasOffer: false,
    isDeal: false,
  },
  {
    id: "bike-accessories-kit",
    name: "Complete Accessories Kit",
    price: 89.99,
    originalPrice: 119.99,
    rating: 4.6,
    reviews: 156,
    category: "accessories",
    image: "bg-gradient-to-br from-blue-500 to-blue-700",
    badge: "POPULAR",
    badgeColor: "bg-blue-600",
    hasOffer: true,
    isDeal: false,
  },
  {
    id: "custom-keychain",
    name: "Premium Custom Keychain",
    price: 19.99,
    originalPrice: 29.99,
    rating: 4.5,
    reviews: 267,
    category: "keychains",
    image: "bg-gradient-to-br from-yellow-500 to-yellow-700",
    badge: "BESTSELLER",
    badgeColor: "bg-yellow-600",
    hasOffer: true,
    isDeal: false,
  },
  {
    id: "racing-toy-car",
    name: "Mini Racing Car Set",
    price: 49.99,
    rating: 4.8,
    reviews: 198,
    category: "toys",
    image: "bg-gradient-to-br from-pink-500 to-pink-700",
    badge: "PREMIUM",
    badgeColor: "bg-pink-600",
    hasOffer: false,
    isDeal: false,
  },
];

const AllProductsPage = () => {
  const [filters, setFilters] = useState({
    category: "",
    priceRange: "",
    sortBy: "",
    offers: "",
  });
  const [promoCode, setPromoCode] = useState("");
  const router = useRouter();
  const [wishlist, setWishlist] = useState<{ [productId: string]: boolean }>(
    {}
  );

  const toggleWishlist = (productId: string) => {
    setWishlist((prev) => ({
      ...prev,
      [productId]: !prev[productId],
    }));
  };

  const filterProducts = () => {
    let filtered = [...allProducts];

    if (filters.category) {
      filtered = filtered.filter(
        (product) => product.category === filters.category
      );
    }

    if (filters.priceRange) {
      filtered = filtered.filter((product) => {
        switch (filters.priceRange) {
          case "under-50":
            return product.price < 50;
          case "50-200":
            return product.price >= 50 && product.price <= 200;
          case "200-500":
            return product.price >= 200 && product.price <= 500;
          case "over-500":
            return product.price > 500;
          default:
            return true;
        }
      });
    }

    if (filters.offers === "offers") {
      filtered = filtered.filter((product) => product.hasOffer);
    } else if (filters.offers === "deals") {
      filtered = filtered.filter((product) => product.isDeal);
    }

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

    return filtered;
  };

  const filteredProducts = filterProducts();

  const clearFilters = () => {
    setFilters({ category: "", priceRange: "", sortBy: "", offers: "" });
  };

  const hasActiveFilters = Object.values(filters).some((val) => val !== "");

  return (
    <div className="min-h-screen bg-black">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">All Products</h1>
          <p className="text-gray-400">
            Showing {filteredProducts.length} of {allProducts.length} products
          </p>
        </div>

        {/* Filters */}
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-white flex items-center">
              <Filter className="h-5 w-5 mr-2" /> Filters
            </h2>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="text-red-400 hover:text-red-300 flex items-center"
              >
                <X className="h-4 w-4 mr-2" /> Clear All
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {[
              {
                label: "Category",
                value: filters.category,
                options: [
                  "",
                  "helmet",
                  "bike",
                  "accessories",
                  "keychains",
                  "toys",
                  "brakes",
                ],
                key: "category",
              },
              {
                label: "Price Range",
                value: filters.priceRange,
                options: ["", "under-50", "50-200", "200-500", "over-500"],
                key: "priceRange",
              },
              {
                label: "Special Offers",
                value: filters.offers,
                options: ["", "offers", "deals"],
                key: "offers",
              },
              {
                label: "Sort By",
                value: filters.sortBy,
                options: ["", "price-low", "price-high", "rating", "reviews"],
                key: "sortBy",
              },
            ].map((filter) => (
              <div key={filter.key}>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  {filter.label}
                </label>
                <select
                  value={filter.value}
                  onChange={(e) =>
                    setFilters({ ...filters, [filter.key]: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-gray-700 text-white border border-gray-600 rounded"
                >
                  {filter.options.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt
                        ? opt
                            .replace(/-/g, " ")
                            .replace(/\b\w/g, (l) => l.toUpperCase())
                        : `All ${filter.label}`}
                    </option>
                  ))}
                </select>
              </div>
            ))}
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="bg-gray-800/50 border border-gray-700 hover:border-red-500/30 transition-all duration-300 rounded-lg overflow-hidden cursor-pointer"
            >
              <div
                className={`h-48 ${product.image} relative flex items-center justify-center`}
              >
                <span
                  className={`absolute top-4 left-4 px-2 py-1 text-sm bg-red-500 text-white rounded`}
                >
                  {product.badge}
                </span>

                <button
                  className="absolute top-4 right-4 p-1 rounded-full bg-white/10 hover:bg-white/20 transition-all"
                  onClick={() => toggleWishlist(product.id)}
                >
                  {wishlist[product.id] ? (
                    <FaHeart className="w-5 h-5 text-red-500 transition-transform duration-200 scale-110" />
                  ) : (
                    <FaRegHeart className="w-5 h-5 text-white" />
                  )}
                </button>

                <div className="text-white text-6xl font-bold opacity-20">
                  {product.name.charAt(0)}
                </div>
              </div>

              <div className="p-4">
                <h3
                  className="text-lg font-semibold text-white mb-2 line-clamp-2"
                  onClick={() => router.push(`/product/${product.id}`)}
                >
                  {product.name}
                </h3>
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
                      ${product.price}
                    </span>
                    {product.originalPrice && (
                      <span className="text-sm text-gray-500 line-through">
                        ${product.originalPrice}
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

                <AddToCartButton />
              </div>
            </div>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl text-gray-600 mb-4">🔍</div>
            <h3 className="text-2xl font-semibold text-white mb-2">
              No products found
            </h3>
            <p className="text-gray-400 mb-6">
              Try adjusting your filters to see more results
            </p>
            <button
              onClick={clearFilters}
              className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded"
            >
              Clear All Filters
            </button>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default AllProductsPage;
