"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  ArrowLeft,
  Heart,
  Minus,
  Plus,
  Share2,
  ShoppingCart,
  Star,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const ProductPage = () => {
  const router = useRouter();
  const params = useParams().productId as string;
  const [quantity, setQuantity] = useState<number>(1);
  const [selectedImage, setSelectedImage] = useState<number>(0);

  const products = [
    {
      id: "racing-brake-pads",
      name: "Racing Brake Pads",
      label: "SALE",
      labelType: "sale",
      backgroundColor: "#a855f7",
      category: "Brakes",
      title: "Racing Brake Pads",
      rating: 4.8,
      reviews: 178,
      price: 199.99,
      originalPrice: 249.99,
      discount: "20%",
      description:
        "High-performance racing brake pads designed for maximum stopping power and durability. Perfect for track days and aggressive street driving.",
      features: [
        "Superior heat dissipation",
        "Extended pad life",
        "Reduced brake fade",
        "Compatible with most brake systems",
        "Professional grade compound",
      ],
      specifications: {
        Material: "Ceramic composite",
        "Temperature Range": "-40°C to 650°C",
        Compatibility: "Universal fit",
        Warranty: "2 years",
      },
      images: [
        "bg-gradient-to-br from-purple-500 to-purple-700",
        "bg-gradient-to-br from-purple-400 to-purple-600",
        "bg-gradient-to-br from-purple-600 to-purple-800",
      ],
      inStock: true,
      stockCount: 15,
    },
    {
      id: "led-headlight-kit",
      name: "LED Headlight Kit",
      label: "PREMIUM",
      labelType: "premium",
      backgroundColor: "#facc15",
      category: "Lighting",
      title: "LED Headlight Kit",
      rating: 4.9,
      reviews: 267,
      price: 449.99,
      originalPrice: 499.99,
      discount: "10%",
      description:
        "High-brightness LED headlight kit for enhanced visibility and energy efficiency. Designed for easy installation and long-lasting performance.",
      features: [
        "Ultra-bright output",
        "Low power consumption",
        "Plug-and-play installation",
        "Waterproof and dustproof",
        "Long lifespan (30,000+ hrs)",
      ],
      specifications: {
        Voltage: "12V",
        Lumens: "8000lm",
        Compatibility: "Universal",
        Warranty: "1 year",
      },
      images: [
        "bg-gradient-to-br from-yellow-400 to-yellow-600",
        "bg-gradient-to-br from-yellow-300 to-yellow-500",
        "bg-gradient-to-br from-yellow-500 to-yellow-700",
      ],
      inStock: true,
      stockCount: 25,
    },
    {
      id: "coilover-kit",
      name: "Coilover Kit",
      label: "HOT",
      labelType: "sale",
      backgroundColor: "#f472b6",
      category: "Suspension",
      title: "Coilover Kit",
      rating: 4.7,
      reviews: 134,
      price: 299.99,
      originalPrice: 359.99,
      discount: "17%",
      description:
        "Adjustable coilover kit designed to improve handling and ride quality. Suitable for both street and track applications.",
      features: [
        "Ride height adjustability",
        "High-strength materials",
        "Improved cornering stability",
        "Corrosion-resistant finish",
        "Track-ready performance",
      ],
      specifications: {
        Material: "Aluminum & Steel",
        Adjustment: "Height & Preload",
        Compatibility: "Vehicle-specific",
        Warranty: "2 years",
      },
      images: [
        "bg-gradient-to-br from-pink-500 to-pink-700",
        "bg-gradient-to-br from-pink-400 to-pink-600",
        "bg-gradient-to-br from-pink-600 to-pink-800",
      ],
      inStock: true,
      stockCount: 10,
    },
    {
      id: "ecu-tuner",
      name: "ECU Tuner",
      label: "NEW",
      labelType: "premium",
      backgroundColor: "#60a5fa",
      category: "Electronics",
      title: "ECU Tuner",
      rating: 4.5,
      reviews: 89,
      price: 579.99,
      originalPrice: 649.99,
      discount: "11%",
      description:
        "Advanced ECU tuning device that allows customization of vehicle performance parameters. Unlock the true potential of your engine.",
      features: [
        "Real-time diagnostics",
        "Preloaded and custom maps",
        "Plug-and-play setup",
        "Improves fuel efficiency",
        "Boosts horsepower and torque",
      ],
      specifications: {
        Interface: "USB/OBD2",
        Compatibility: "Most cars 2008+",
        Updates: "Over-the-air",
        Warranty: "1 year",
      },
      images: [
        "bg-gradient-to-br from-blue-500 to-blue-700",
        "bg-gradient-to-br from-blue-400 to-blue-600",
        "bg-gradient-to-br from-blue-600 to-blue-800",
      ],
      inStock: true,
      stockCount: 8,
    },
  ];

  const relatedProducts = [
    {
      id: "brake-fluid",
      name: "Premium Brake Fluid",
      price: 29.99,
      originalPrice: 39.99,
      rating: 4.7,
      image: "bg-gradient-to-br from-blue-500 to-blue-700",
    },
    {
      id: "brake-rotors",
      name: "Performance Brake Rotors",
      price: 299.99,
      rating: 4.6,
      image: "bg-gradient-to-br from-red-500 to-red-700",
    },
    {
      id: "brake-lines",
      name: "Stainless Steel Brake Lines",
      price: 149.99,
      originalPrice: 179.99,
      rating: 4.8,
      image: "bg-gradient-to-br from-gray-500 to-gray-700",
    },
  ];

  const product = useMemo(() => {
    if (!params) return undefined;

    return products.find(
      (p) => p.title.toLowerCase() === decodeURIComponent(params).toLowerCase()
    );
  }, [params, products]);

  if (!product) {
    return (
      <div className="min-h-screen bg-black text-white p-12">
        <Header />
        <h1 className="text-3xl font-bold">Product not found</h1>
      </div>
    );
  }
  const handleQuantityChange = (delta: number) => {
    setQuantity(Math.max(1, Math.min(product.stockCount, quantity + delta)));
  };
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={() => router.back()}
          className="flex items-center text-gray-400 hover:text-white mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" /> Back
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Product Images */}
          <div className="space-y-4">
            <div
              className={`aspect-square ${product.images[selectedImage]} rounded-lg flex items-center justify-center`}
            >
              <div className="text-8xl font-bold opacity-20">B</div>
            </div>
            <div className="flex space-x-2">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`w-20 h-20 ${img} rounded-lg flex items-center justify-center ${
                    selectedImage === idx ? "ring-2 ring-red-500" : "opacity-70"
                  }`}
                >
                  <div className="text-sm font-bold opacity-50">B</div>
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <span className="bg-purple-600 text-white px-2 py-1 rounded text-sm inline-block mb-2">
                {product.category}
              </span>
              <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${
                      i < Math.floor(product.rating)
                        ? "text-yellow-400"
                        : "text-gray-600"
                    }`}
                  />
                ))}
                <span className="ml-2 text-gray-400">
                  {product.rating} ({product.reviews} reviews)
                </span>
              </div>
              <div className="flex items-center space-x-3 mb-6">
                <span className="text-3xl font-bold">${product.price}</span>
                {product.originalPrice && (
                  <>
                    <span className="text-xl text-gray-500 line-through">
                      ${product.originalPrice}
                    </span>
                    <span className="bg-green-600 px-2 py-1 text-xs rounded">
                      SAVE{" "}
                      {Math.round(
                        ((product.originalPrice - product.price) /
                          product.originalPrice) *
                          100
                      )}
                      %
                    </span>
                  </>
                )}
              </div>
            </div>

            <p className="text-gray-300 text-lg">{product.description}</p>

            <div>
              <h3 className="font-semibold mb-3">Key Features:</h3>
              <ul className="space-y-2">
                {product.features.map((f, i) => (
                  <li key={i} className="flex items-center text-gray-300">
                    <span className="w-2 h-2 bg-red-500 rounded-full mr-3"></span>
                    {f}
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <span>Quantity:</span>
                <div className="flex items-center border border-gray-600 rounded-lg">
                  <button
                    onClick={() => handleQuantityChange(-1)}
                    className="text-gray-400 hover:text-white px-2 py-1"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="px-4 py-2">{quantity}</span>
                  <button
                    onClick={() => handleQuantityChange(1)}
                    className="text-gray-400 hover:text-white px-2 py-1"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                <span className="text-gray-400">
                  ({product.stockCount} in stock)
                </span>
              </div>
              <div className="flex space-x-3">
                <button className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded flex items-center justify-center">
                  <ShoppingCart className="h-5 w-5 mr-2" /> Add to Cart
                </button>
                <button className="border border-gray-600 text-gray-400 hover:text-white p-3 rounded">
                  <Heart className="h-5 w-5" />
                </button>
                <button className="border border-gray-600 text-gray-400 hover:text-white p-3 rounded">
                  <Share2 className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-3">Specifications:</h3>
              <div className="space-y-2">
                {Object.entries(product.specifications).map(([key, val]) => (
                  <div
                    key={key}
                    className="flex justify-between py-2 border-b border-gray-700"
                  >
                    <span className="text-gray-400">{key}:</span>
                    <span>{val}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-8">Related Products</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedProducts.map((item) => (
              <div
                key={item.id}
                className="bg-gray-800/50 border border-gray-700 hover:border-red-500/30 rounded-lg overflow-hidden cursor-pointer"
              >
                <div
                  className={`h-48 ${item.image} flex items-center justify-center`}
                >
                  <div className="text-white text-4xl font-bold opacity-20">
                    P
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold mb-2">{item.name}</h3>
                  <div className="flex items-center mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < Math.floor(item.rating)
                            ? "text-yellow-400"
                            : "text-gray-600"
                        }`}
                      />
                    ))}
                    <span className="text-gray-400 text-sm ml-2">
                      {item.rating}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-white font-bold">
                        ${item.price}
                      </span>
                      {item.originalPrice && (
                        <span className="text-gray-500 line-through text-sm">
                          ${item.originalPrice}
                        </span>
                      )}
                    </div>
                    <button className="bg-red-600 hover:bg-red-700 text-sm text-white px-3 py-1 rounded">
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
