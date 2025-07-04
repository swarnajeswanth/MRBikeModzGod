// import { Card } from "@/components/ui/card";
"use client";
import {
  Cog,
  Zap,
  Gauge,
  Settings,
  Car,
  Wrench,
  Battery,
  Disc,
  Shield,
  Bike,
  Key,
  Gift,
  Grid3X3,
  XCircle,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { startLoading, stopLoading } from "@/components/store/LoadingSlice"; // Adjust path if needed
import { useTransition } from "react";
import { RootState } from "@/components/store";
import { selectAllProducts } from "@/components/store/productSlice";
import { selectFeatures } from "@/components/store/storeSettingsSlice";

const ProductCategories = () => {
  const [isPending, startTransition] = useTransition();
  const products = useSelector(selectAllProducts);
  const features = useSelector(selectFeatures);
  const dispatch = useDispatch();
  const router = useRouter();

  // Dynamic category mapping with icons and colors
  const categoryConfig = {
    helmet: {
      name: "Helmets",
      description: "Safety helmets for all riders",
      icon: Shield,
      color: "from-red-500 to-red-600",
      borderColor: "border-red-500/30",
      textColor: "text-red-400",
    },
    bike: {
      name: "Bikes",
      description: "Complete bikes for every need",
      icon: Bike,
      color: "from-blue-500 to-blue-600",
      borderColor: "border-blue-500/30",
      textColor: "text-blue-400",
    },
    accessories: {
      name: "Accessories",
      description: "Essential bike accessories",
      icon: Wrench,
      color: "from-green-500 to-green-600",
      borderColor: "border-green-500/30",
      textColor: "text-green-400",
    },
    keychains: {
      name: "Keychains",
      description: "Unique bike-themed keychains",
      icon: Key,
      color: "from-purple-500 to-purple-600",
      borderColor: "border-purple-500/30",
      textColor: "text-purple-400",
    },
    toys: {
      name: "Toys",
      description: "Fun bike toys and collectibles",
      icon: Gift,
      color: "from-yellow-500 to-yellow-600",
      borderColor: "border-yellow-500/30",
      textColor: "text-yellow-400",
    },
    // Additional common categories
    parts: {
      name: "Parts",
      description: "Bike parts and components",
      icon: Cog,
      color: "from-indigo-500 to-indigo-600",
      borderColor: "border-indigo-500/30",
      textColor: "text-indigo-400",
    },
    tools: {
      name: "Tools",
      description: "Bike maintenance tools",
      icon: Wrench,
      color: "from-orange-500 to-orange-600",
      borderColor: "border-orange-500/30",
      textColor: "text-orange-400",
    },
    clothing: {
      name: "Clothing",
      description: "Bike riding apparel",
      icon: Shield,
      color: "from-pink-500 to-pink-600",
      borderColor: "border-pink-500/30",
      textColor: "text-pink-400",
    },
    electronics: {
      name: "Electronics",
      description: "Bike electronics and gadgets",
      icon: Zap,
      color: "from-cyan-500 to-cyan-600",
      borderColor: "border-cyan-500/30",
      textColor: "text-cyan-400",
    },
    // Default configuration for any new categories
    default: {
      name: "Other",
      description: "Various products and accessories",
      icon: Grid3X3,
      color: "from-gray-500 to-gray-600",
      borderColor: "border-gray-500/30",
      textColor: "text-gray-400",
    },
  };

  // Get unique categories from products
  const uniqueCategories = [
    ...new Set(products.map((product) => product.category)),
  ];

  // Create categories array with configuration
  const categories = uniqueCategories.map((category) => {
    const config =
      categoryConfig[category as keyof typeof categoryConfig] ||
      categoryConfig.default;
    return {
      ...config,
      slug: category,
      name:
        config === categoryConfig.default
          ? category.charAt(0).toUpperCase() + category.slice(1)
          : config.name,
      description:
        config === categoryConfig.default
          ? `${category} products and accessories`
          : config.description,
    };
  });

  const handleCategoryClick = (slug: string) => {
    if (!features?.categories) {
      return; // Don't navigate if categories feature is disabled
    }

    dispatch(startLoading());
    startTransition(() => {
      router.push(`/category/${slug}`);
      // stopLoading should ideally happen after route load
      // but for now we simulate delay if needed
      setTimeout(() => {
        dispatch(stopLoading());
      }, 800); // adjust if your route loads slowly
    });
  };

  // Show disabled state if categories feature is disabled
  if (!features?.categories) {
    return (
      <section id="categories" className="py-6 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center gap-3 mb-4">
              <XCircle className="text-gray-400 text-4xl" />
              <h2 className="text-4xl lg:text-5xl font-bold text-gray-400">
                Shop by Category (Disabled)
              </h2>
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
      </section>
    );
  }

  return (
    <section id="categories" className="py-6 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4">
            Shop by Category
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Find exactly what you need with our comprehensive selection of bike
            parts and accessories
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {categories.map((category, index) => {
            const Icon = category.icon;
            return (
              <div
                key={category.slug}
                onClick={() => handleCategoryClick(category.slug)}
                className={`bg-gray-800/50 backdrop-blur-sm border ${category.borderColor} hover:bg-gray-700/50 transition-all duration-300 cursor-pointer group animate-fade-in`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="p-6 text-center">
                  <div
                    className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r ${category.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}
                  >
                    <Icon className="h-8 w-8 text-white" />
                  </div>

                  <h3
                    className={`text-xl font-semibold ${category.textColor} mb-2`}
                  >
                    {category.name}
                  </h3>

                  <p className="text-gray-400 text-sm">
                    {category.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ProductCategories;
