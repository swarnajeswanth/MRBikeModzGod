// import { Card } from "@/components/ui/card";
// import { button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
"use client";
import ProductGrid from "@/components/Dashboard/ProductGrid";
import { useRouter } from "next/navigation";
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
  const Router = useRouter();
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
            onClick={() => Router.push("/product/allproducts")}
          >
            View All Products
          </button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
