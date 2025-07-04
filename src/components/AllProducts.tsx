"use client";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Star, ShoppingCart, Filter, X } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useRouter } from "next/navigation";
import AddToCartButton from "./Cart/AddToCart";
import { FaRegHeart, FaHeart } from "react-icons/fa";
import {
  selectAllProducts,
  selectLoading,
  selectError,
  fetchProducts,
} from "@/components/store/productSlice";
import { RootState } from "@/components/store";
import { toggleWishlist } from "@/components/store/UserSlice";
import { toast } from "react-hot-toast";
import { AppDispatch } from "@/components/store";

const AllProductsPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const products = useSelector(selectAllProducts);
  const loading = useSelector(selectLoading);
  const error = useSelector(selectError);

  const router = useRouter();
  const { wishlist } = useSelector((state: RootState) => state.user);

  // Get unique categories from products
  const uniqueCategories = [
    ...new Set(products.map((product) => product.category)),
  ];

  const [filters, setFilters] = useState({
    category: "",
    priceRange: "",
    sortBy: "",
    offers: "",
  });
  const [promoCode, setPromoCode] = useState("");

  useEffect(() => {
    if (products.length === 0) {
      dispatch(fetchProducts());
    }
  }, [dispatch, products.length]);

  const handleToggleWishlist = (product: any) => {
    const wishlistItem = {
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      category: product.category,
    };

    dispatch(toggleWishlist(wishlistItem));

    const isInWishlist = wishlist.some((item) => item.id === product.id);
    if (isInWishlist) {
      toast.success("Removed from wishlist");
    } else {
      toast.success("Added to wishlist");
    }
  };

  const filterProducts = () => {
    let filtered = [...products];

    if (filters.category) {
      filtered = filtered.filter(
        (product) =>
          product.category.toLowerCase() === filters.category.toLowerCase()
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
      filtered = filtered.filter(
        (product) => product.discount && product.discount !== ""
      );
    } else if (filters.offers === "deals") {
      filtered = filtered.filter(
        (product) =>
          product.originalPrice && product.originalPrice > product.price
      );
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

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl">Loading products...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-red-400 text-xl">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">All Products</h1>
          <p className="text-gray-400">
            Showing {filteredProducts.length} of {products.length} products
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
                options: ["", ...uniqueCategories],
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
                className="h-48 relative flex items-center justify-center cursor-pointer bg-gray-700"
                onClick={() => router.push(`/product/${product.id}`)}
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
                  className="absolute top-4 right-4 p-1 rounded-full bg-white/10 hover:bg-white/20 transition-all"
                  onClick={() => handleToggleWishlist(product)}
                >
                  {wishlist.some((item) => item.id === product.id) ? (
                    <FaHeart className="w-5 h-5 text-red-500 transition-transform duration-200 scale-110" />
                  ) : (
                    <FaRegHeart className="w-5 h-5 text-white" />
                  )}
                </button>

                {product.images && product.images.length > 0 ? (
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-white text-6xl font-bold opacity-20">
                    {product.name.charAt(0)}
                  </div>
                )}
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
