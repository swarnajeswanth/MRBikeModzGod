// import { Card } from "@/components/ui/card";
// import { button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
"use client";
import ProductGrid from "@/components/Dashboard/ProductGrid";
import { useRouter } from "next/navigation";

import { useDispatch, useSelector } from "react-redux";
import { startLoading, stopLoading } from "@/components/store/LoadingSlice"; // Adjust path if needed
import { useTransition } from "react";
import { useEffect } from "react";
import {
  fetchProducts,
  selectAllProducts,
  selectLoading,
} from "@/components/store/productSlice";
import { AppDispatch } from "@/components/store";
import { RootState } from "@/components/store";
import { toggleWishlist } from "@/components/store/UserSlice";
import { toast } from "react-hot-toast";
import { selectIsCustomerExperienceEnabled } from "@/components/store/storeSettingsSlice";
import FeaturedProductsShimmer from "../Loaders/FeaturedProductsShimmer";

const FeaturedProducts = () => {
  // const products = [
  //   {
  //     name: "Turbo Charger Kit",
  //     price: "$1,299.99",
  //     originalPrice: "$1,499.99",
  //     rating: 4.8,
  //     reviews: 124,
  //     category: "Engine",
  //     image: "bg-gradient-to-br from-red-500 to-red-700",
  //     badge: "BESTSELLER",
  //     badgeColor: "bg-red-600",
  //   },
  //   {
  //     name: "Performance Exhaust System",
  //     price: "$899.99",
  //     originalPrice: "$1,099.99",
  //     rating: 4.9,
  //     reviews: 89,
  //     category: "Exhaust",
  //     image: "bg-gradient-to-br from-orange-500 to-orange-700",
  //     badge: "HOT DEAL",
  //     badgeColor: "bg-orange-600",
  //   },
  //   {
  //     name: "Coilover Suspension Kit",
  //     price: "$1,599.99",
  //     originalPrice: null,
  //     rating: 4.7,
  //     reviews: 156,
  //     category: "Suspension",
  //     image: "bg-gradient-to-br from-blue-500 to-blue-700",
  //     badge: "NEW",
  //     badgeColor: "bg-blue-600",
  //   },
  //   {
  //     name: "Cold Air Intake System",
  //     price: "$299.99",
  //     originalPrice: "$349.99",
  //     rating: 4.6,
  //     reviews: 203,
  //     category: "Engine",
  //     image: "bg-gradient-to-br from-green-500 to-green-700",
  //     badge: "POPULAR",
  //     badgeColor: "bg-green-600",
  //   },
  //   {
  //     name: "Racing Brake Pads",
  //     price: "$199.99",
  //     originalPrice: "$249.99",
  //     rating: 4.8,
  //     reviews: 178,
  //     category: "Brakes",
  //     image: "bg-gradient-to-br from-purple-500 to-purple-700",
  //     badge: "SALE",
  //     badgeColor: "bg-purple-600",
  //   },
  //   {
  //     name: "LED Headlight Kit",
  //     price: "$449.99",
  //     originalPrice: null,
  //     rating: 4.9,
  //     reviews: 267,
  //     category: "Lighting",
  //     image: "bg-gradient-to-br from-yellow-500 to-yellow-700",
  //     badge: "PREMIUM",
  //     badgeColor: "bg-yellow-600",
  //   },
  // ];
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const [isPending, startTransition] = useTransition();
  const products = useSelector(selectAllProducts);
  const loading = useSelector(selectLoading);
  const { wishlist, isLoggedIn } = useSelector(
    (state: RootState) => state.user
  );
  const requireLoginForWishlist = useSelector(
    selectIsCustomerExperienceEnabled("requireLoginForWishlist")
  );

  useEffect(() => {
    console.log(
      "FeaturedProducts useEffect - products length:",
      products.length
    );
    if (products.length === 0) {
      console.log("Dispatching fetchProducts...");
      dispatch(fetchProducts());
    }
  }, [dispatch, products.length]);

  const handleAllClick = () => {
    dispatch(startLoading());
    startTransition(() => {
      router.push(`/product/allproducts`);
      // stopLoading should ideally happen after route load
      // but for now we simulate delay if needed
      setTimeout(() => {
        dispatch(stopLoading());
      }, 800); // adjust if your route loads slowly
    });
  };

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

    dispatch(toggleWishlist(wishlistItem));

    const isInWishlist = wishlist.some((item) => item.id === product.id);
    if (isInWishlist) {
      toast.success("Removed from wishlist");
    } else {
      toast.success("Added to wishlist");
    }
  };

  // Show shimmer while loading
  if (loading || products.length === 0) {
    return <FeaturedProductsShimmer />;
  }

  return (
    <section id="products" className="py-5 bg-gray-900/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4">
            Featured Products
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Discover our most popular and highest-rated automotive parts and
            accessories
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-8">
          <ProductGrid />
        </div>

        {/* View All button */}
        <div className="text-center mt-12">
          <button
            className="border-red-600 text-red-400 hover:bg-red-600 hover:text-white px-8 py-1"
            onClick={() => {
              handleAllClick();
            }}
          >
            View All Products
          </button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
