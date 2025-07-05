// components/CategoryClient.tsx
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import {
  Shield,
  Bike,
  Wrench,
  Key,
  Gift,
  Search,
  ShoppingCart,
  ArrowLeft,
} from "lucide-react";
import AddToCartButton from "../Cart/AddToCart";
import { RootState, AppDispatch } from "@/components/store";
import {
  selectProductsByCategory,
  fetchProducts,
  selectAllProducts,
} from "@/components/store/productSlice";
import { selectIsCustomerExperienceEnabled } from "@/components/store/storeSettingsSlice";
import { toggleWishlist } from "@/components/store/UserSlice";
import { toast } from "react-hot-toast";
import { FaRegHeart, FaHeart } from "react-icons/fa";
import { useEffect } from "react";

interface Props {
  categoryName: string;
}

// Dynamic category configuration
const categoryConfig = {
  helmet: {
    name: "Helmets",
    description: "Safety helmets for all riders",
    icon: Shield,
    color: "from-red-500 to-red-600",
    textColor: "text-red-400",
  },
  bike: {
    name: "Bikes",
    description: "Complete bikes for every need",
    icon: Bike,
    color: "from-blue-500 to-blue-600",
    textColor: "text-blue-400",
  },
  accessories: {
    name: "Accessories",
    description: "Essential bike accessories",
    icon: Wrench,
    color: "from-green-500 to-green-600",
    textColor: "text-green-400",
  },
  keychains: {
    name: "Keychains",
    description: "Unique bike-themed keychains",
    icon: Key,
    color: "from-purple-500 to-purple-600",
    textColor: "text-purple-400",
  },
  toys: {
    name: "Toys",
    description: "Fun bike toys and collectibles",
    icon: Gift,
    color: "from-yellow-500 to-yellow-600",
    textColor: "text-yellow-400",
  },
};

export default function CategoryClient({ categoryName }: Props) {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const [searchTerm, setSearchTerm] = useState("");

  // Get products from Redux store
  const products = useSelector((state: RootState) =>
    selectProductsByCategory(state, categoryName)
  );

  // Get all products to check if they're loaded
  const allProducts = useSelector(selectAllProducts);

  // Load products if not already loaded
  useEffect(() => {
    if (allProducts.length === 0) {
      dispatch(fetchProducts());
    }
  }, [dispatch, allProducts.length]);

  // If no products found in category but products are loaded, try refreshing
  useEffect(() => {
    if (products.length === 0 && allProducts.length > 0) {
      // Try to refresh products after a short delay
      const timer = setTimeout(() => {
        dispatch(fetchProducts());
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [products.length, allProducts.length, dispatch]);

  const { wishlist, isLoggedIn } = useSelector(
    (state: RootState) => state.user
  );
  const requireLoginForWishlist = useSelector(
    selectIsCustomerExperienceEnabled("requireLoginForWishlist")
  );

  const currentCategory =
    categoryConfig[categoryName.toLowerCase() as keyof typeof categoryConfig];

  if (!currentCategory) {
    return (
      <div className="min-h-screen bg-black">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center text-white">
            <h1 className="text-4xl mb-4">Category Not Found</h1>
            <button
              onClick={() => router.back()}
              className="bg-red-600 hover:bg-red-700 py-2 px-4 rounded"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  const Icon = currentCategory.icon;
  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black">
      <section className="py-6 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <button
            onClick={() => router.push("/")}
            className="text-gray-300 hover:text-red-400 mb-8 flex items-center"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </button>

          <div className="text-center mb-12">
            <div
              className={`w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-r ${currentCategory.color} flex items-center justify-center`}
            >
              <Icon className="h-12 w-12 text-white" />
            </div>
            <h1
              className={`text-4xl lg:text-5xl font-bold ${currentCategory.textColor} mb-4`}
            >
              {currentCategory.name}
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              {currentCategory.description}
            </p>
          </div>

          <div className="max-w-md mx-auto mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-gray-800/50 border border-gray-700 text-white rounded px-3 py-2 w-full"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="bg-gray-800/50 backdrop-blur-sm border-gray-700 hover:bg-gray-700/50 transition-all duration-300 group cursor-pointer relative"
                onClick={() => router.push(`/product/${product.id}`)}
              >
                <div className="aspect-video overflow-hidden rounded-t-lg">
                  {product.images && product.images.length > 0 ? (
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div
                      className="w-full h-full flex items-center justify-center text-4xl font-bold text-white opacity-20"
                      style={{ background: product.backgroundColor }}
                    >
                      {product.name.charAt(0)}
                    </div>
                  )}
                </div>

                {/* Wishlist Button */}
                <button
                  className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-all z-10"
                  onClick={(e) => handleToggleWishlist(product, e)}
                >
                  {wishlist.some((item) => item.id === product.id) ? (
                    <FaHeart className="w-5 h-5 text-red-500 transition-transform duration-200 scale-110" />
                  ) : (
                    <FaRegHeart className="w-5 h-5 text-white" />
                  )}
                </button>

                <div className="p-6">
                  <h3 className="text-xl font-semibold text-white mb-2">
                    {product.name}
                  </h3>
                  <div className="flex flex-col items-left justify-between">
                    <span className="text-2xl font-bold text-green-400">
                      ₹{product.price}
                    </span>
                    <AddToCartButton product={product} />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-400 text-lg">
                No products found matching your search.
              </p>
              {products.length === 0 && (
                <p className="text-gray-500 text-sm mt-2">
                  No products found in category "{categoryName}". Total products
                  loaded: {allProducts.length}
                </p>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
