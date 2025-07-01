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
} from "lucide-react";
import { useRouter } from "next/navigation";
const ProductCategories = () => {
  const router = useRouter();
  const categories = [
    {
      name: "Engine Parts",
      description: "High-performance engine components",
      icon: Cog,
      color: "from-red-500 to-red-600",
      borderColor: "border-red-500/30",
      textColor: "text-red-400",
      slug: "engine-parts",
    },
    {
      name: "Exhaust Systems",
      description: "Custom exhaust solutions",
      icon: Zap,
      color: "from-orange-500 to-orange-600",
      borderColor: "border-orange-500/30",
      textColor: "text-orange-400",
      slug: "exhaust-systems",
    },
    {
      name: "Suspension",
      description: "Premium suspension upgrades",
      icon: Gauge,
      color: "from-blue-500 to-blue-600",
      borderColor: "border-blue-500/30",
      textColor: "text-blue-400",
      slug: "suspension",
    },
    {
      name: "Electronics",
      description: "Advanced automotive electronics",
      icon: Settings,
      color: "from-purple-500 to-purple-600",
      borderColor: "border-purple-500/30",
      textColor: "text-purple-400",
      slug: "electronics",
    },
    {
      name: "Body Parts",
      description: "Styling and body modifications",
      icon: Car,
      color: "from-green-500 to-green-600",
      borderColor: "border-green-500/30",
      textColor: "text-green-400",
      slug: "body-parts",
    },
    {
      name: "Tools & Equipment",
      description: "Professional automotive tools",
      icon: Wrench,
      color: "from-yellow-500 to-yellow-600",
      borderColor: "border-yellow-500/30",
      textColor: "text-yellow-400",
      slug: "tools-equipment",
    },
    {
      name: "Electrical",
      description: "Wiring and electrical components",
      icon: Battery,
      color: "from-indigo-500 to-indigo-600",
      borderColor: "border-indigo-500/30",
      textColor: "text-indigo-400",
      slug: "electrical",
    },
    {
      name: "Brakes",
      description: "High-performance brake systems",
      icon: Disc,
      color: "from-pink-500 to-pink-600",
      borderColor: "border-pink-500/30",
      textColor: "text-pink-400",
      slug: "brakes",
    },
  ];

  const handleCategoryClick = (slug: string) => {
    router.push(`/category/${slug}`);
  };

  return (
    <section id="categories" className="py-6 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4">
            Shop by Category
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Find exactly what you need with our comprehensive selection of auto
            parts and accessories
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category, index) => {
            const Icon = category.icon;
            return (
              <div
                key={category.name}
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
