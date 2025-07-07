"use client";

import React, { useEffect } from "react";
import "./AllCategoriesClient.css";
import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { ArrowLeft, Grid3X3, XCircle } from "lucide-react";
import { RootState, AppDispatch } from "@/components/store";
import {
  selectUniqueCategories,
  selectCategoriesWithCount,
  selectLoading,
  fetchProducts,
  selectAllProducts,
} from "@/components/store/productSlice";
import { selectFeatures } from "@/components/store/storeSettingsSlice";
import { startLoading, stopLoading } from "@/components/store/LoadingSlice";
import MiniCategoryCard from "@/components/Dashboard/MiniCategoryCard";

// Category background images and configurations
const categoryConfig: Record<string, { color: string }> = {
  helmet: { color: "bg-gradient-to-br from-gray-800 via-red-700 to-gray-900" },
  bike: { color: "bg-gradient-to-br from-gray-800 via-blue-700 to-gray-900" },
  accessories: {
    color: "bg-gradient-to-br from-gray-800 via-green-700 to-gray-900",
  },
  keychains: {
    color: "bg-gradient-to-br from-gray-800 via-purple-700 to-gray-900",
  },
  toys: { color: "bg-gradient-to-br from-gray-800 via-yellow-700 to-gray-900" },
  parts: {
    color: "bg-gradient-to-br from-gray-800 via-indigo-700 to-gray-900",
  },
  tools: {
    color: "bg-gradient-to-br from-gray-800 via-orange-700 to-gray-900",
  },
  clothing: {
    color: "bg-gradient-to-br from-gray-800 via-pink-700 to-gray-900",
  },
  electronics: {
    color: "bg-gradient-to-br from-gray-800 via-cyan-700 to-gray-900",
  },
  default: {
    color: "bg-gradient-to-br from-gray-800 via-gray-700 to-gray-900",
  },
};

const AllCategoriesClient: React.FC = () => {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const uniqueCategories = useSelector(selectUniqueCategories);
  const categoriesWithCount = useSelector(selectCategoriesWithCount);
  const loading = useSelector(selectLoading);
  const features = useSelector(selectFeatures);
  const allProducts = useSelector(selectAllProducts);

  // Fetch products if not already loaded
  useEffect(() => {
    if (uniqueCategories.length === 0) {
      dispatch(fetchProducts());
    }
  }, [dispatch, uniqueCategories.length]);

  const handleCategoryClick = (slug: string) => {
    if (!features?.categories) {
      return; // Don't navigate if categories feature is disabled
    }

    dispatch(startLoading());
    router.push(`/category/${slug}`);
    // Stop loading after a delay to allow route transition
    setTimeout(() => {
      dispatch(stopLoading());
    }, 800);
  };

  // Use the same categoryImages mapping as in MiniProductCategories
  const categoryImages: Record<string, string> = {
    accessories: "/Accessories1.png",
    bike: "/Bike1.png",
    crashgurds: "/Crashguards1.png",
    exhausts: "/Exhausts1.png",
    grips: "/Grips1.png",
    horns: "/Horns1.png",
    // Add more as needed
  };

  // Use the same mapping logic as MiniProductCategories
  const categories = uniqueCategories.map((category) => {
    const config =
      categoryConfig[category.toLowerCase() as keyof typeof categoryConfig] ||
      categoryConfig.default;
    const name = category.charAt(0).toUpperCase() + category.slice(1);
    const description = `${category} products and accessories`;
    // Find the first product in this category with an image
    const product = allProducts.find(
      (p) => p.category && p.category.trim().toLowerCase() === category
    );
    const backgroundImage =
      product && product.images && product.images[0]
        ? product.images[0]
        : categoryImages[category];
    return {
      ...config,
      slug: category,
      name,
      description,
      letter: name.charAt(0),
      count:
        categoriesWithCount.find((c) => c.category === category)?.count || 0,
      backgroundImage,
    };
  });

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center mb-16">
            <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">
              All Categories
            </h1>
            <p className="text-xl text-gray-400">Loading categories...</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, index) => (
              <div
                key={index}
                className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 animate-pulse rounded-lg overflow-hidden"
                style={{ height: "300px" }}
              >
                <div className="w-full h-full bg-gray-700"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Show message if no categories found
  if (uniqueCategories.length === 0 && !loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">
              All Categories
            </h1>
            <p className="text-xl text-gray-400 mb-8">
              No categories found. Add some products to see categories here.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Show disabled state if categories feature is disabled
  if (!features?.categories) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center gap-3 mb-4">
              <XCircle className="text-gray-400 text-4xl" />
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-400">
                All Categories (Disabled)
              </h1>
            </div>
            <p className="text-xl text-gray-500 max-w-3xl mx-auto">
              Category browsing is currently disabled by the store administrator
            </p>
          </div>

          <div className="flex items-center justify-center">
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-600/30 p-12 rounded-lg">
              <Grid3X3 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-400 text-center">
                Categories feature is currently unavailable
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <button
          onClick={() => router.push("/")}
          className="text-gray-300 hover:text-red-400 mb-8 flex items-center transition-colors duration-200"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </button>

        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">
            Shop by Category
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Explore our comprehensive collection of bike parts and accessories
            organized by category
          </p>
          <p className="text-lg text-gray-500 mt-2">
            {categories.length} categories •{" "}
            {categories.reduce((sum, cat) => sum + cat.count, 0)} total products
          </p>
        </div>

        {/* Categories Grid */}
        <div className="category-grid grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {categories.map((cat) => (
            <MiniCategoryCard
              key={cat.slug}
              name={cat.name}
              description={cat.description}
              count={cat.count}
              color={cat.color}
              letter={cat.letter}
              backgroundImage={cat.backgroundImage}
              onClick={() => handleCategoryClick(cat.slug)}
            />
          ))}
        </div>

        {/* Footer Info */}
        <div className="text-center mt-16 pt-8 border-t border-gray-800">
          <p className="text-gray-400">
            Can't find what you're looking for? Try browsing our{" "}
            <button
              onClick={() => router.push("/product/allproducts")}
              className="text-red-400 hover:text-red-300 transition-colors duration-200 underline"
            >
              complete product catalog
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AllCategoriesClient;
