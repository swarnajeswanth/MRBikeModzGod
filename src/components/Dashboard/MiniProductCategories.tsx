"use client";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import type { AppDispatch } from "@/components/store";
import MiniCategoryCard from "./MiniCategoryCard";
import {
  selectUniqueCategories,
  selectCategoriesWithCount,
  fetchProducts,
  selectAllProducts,
} from "@/components/store/productSlice";
import { selectFeatures } from "@/components/store/storeSettingsSlice";
import { startLoading, stopLoading } from "@/components/store/LoadingSlice";

// Example: If you have a selector for full category objects, use it here
// import { selectAllCategories } from "@/components/store/categorySlice";
// const allCategories = useSelector(selectAllCategories);
// For now, we'll simulate with a map of Redux category data
const reduxCategoryData: Record<
  string,
  { name?: string; description?: string }
> = {
  accessories: {
    name: "Accessories",
    description: "Essential bike accessories",
  },
  bike: {
    name: "Bike Shining Polish",
    description: "bike shining polish products and accessories",
  },
  clothing: { name: "Clothing", description: "Bike riding apparel" },
  // ...add more as needed
};

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

const MiniProductCategories: React.FC = () => {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const uniqueCategories = useSelector(selectUniqueCategories);
  const categoriesWithCount = useSelector(selectCategoriesWithCount);
  const features = useSelector(selectFeatures);
  const allProducts = useSelector(selectAllProducts);

  useEffect(() => {
    if (uniqueCategories.length === 0) {
      dispatch(fetchProducts());
    }
  }, [dispatch, uniqueCategories.length]);

  const handleCategoryClick = (slug: string) => {
    if (!features?.categories) return;
    dispatch(startLoading());
    router.push(`/category/${slug}`);
    setTimeout(() => dispatch(stopLoading()), 800);
  };

  const categoryImages: Record<string, string> = {
    accessories: "/Accessories1.png",
    bike: "/Bike1.png",
    crashgurds: "/Crashguards1.png",
    exhausts: "/Exhausts1.png",
    grips: "/Grips1.png",
    horns: "/Horns1.png",
    // Add more as needed
  };

  const categories = uniqueCategories.map((category) => {
    const reduxData = reduxCategoryData[category] || {};
    const config = categoryConfig[category] || categoryConfig.default;
    const name =
      reduxData.name || category.charAt(0).toUpperCase() + category.slice(1);
    const description =
      reduxData.description || `${category} products and accessories`;
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

  // Only show the first 5 categories
  const categoriesToShow = categories.slice(0, 5);

  return (
    <section id="categories" className="py-6 bg-gray-900/95 rounded-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-white mb-2">
            Shop by Category
          </h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 flex-wrap">
          {categoriesToShow.map((cat) => (
            <MiniCategoryCard
              key={cat.slug}
              name={cat.name}
              description={cat.description}
              count={cat.count}
              color={cat.color}
              letter={cat.letter}
              compact
              onClick={() => handleCategoryClick(cat.slug)}
              backgroundImage={cat.backgroundImage}
            />
          ))}
        </div>
        <div className="flex justify-center mt-8">
          <button
            onClick={() => router.push("/categories")}
            className="px-6 py-2 rounded-lg bg-[#8e0005] text-white font-semibold shadow hover:bg-[#a80008] transition-colors duration-200"
          >
            View All Categories
          </button>
        </div>
      </div>
    </section>
  );
};

export default MiniProductCategories;
