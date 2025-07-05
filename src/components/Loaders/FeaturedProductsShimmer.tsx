"use client";
import React from "react";

const FeaturedProductsShimmer: React.FC = () => {
  return (
    <section id="products" className="py-5 bg-gray-900/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Shimmer */}
        <div className="text-center mb-8">
          <div className="h-10 md:h-12 bg-gray-600 rounded-lg mb-4 w-64 md:w-80 mx-auto animate-pulse"></div>
          <div className="h-6 bg-gray-600 rounded-lg mb-2 w-48 md:w-64 mx-auto animate-pulse"></div>
          <div className="h-6 bg-gray-600 rounded-lg w-56 md:w-72 mx-auto animate-pulse"></div>
        </div>

        {/* Products Grid Shimmer */}
        <div className="scroll-container">
          {/* Navigation Arrows Shimmer */}
          <div className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-gray-600/50 rounded-full animate-pulse"></div>
          <div className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-gray-600/50 rounded-full animate-pulse"></div>

          {/* Products Carousel Shimmer */}
          <div className="product-grid-scrollable">
            {[1, 2, 3, 4, 5, 6].map((product) => (
              <div
                key={product}
                className="card-wrapper bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg overflow-hidden"
                style={{ animationDelay: `${product * 0.1}s` }}
              >
                {/* Product Image Shimmer */}
                <div className="h-48 bg-gray-700 animate-pulse relative">
                  {/* Label Shimmer */}
                  <div className="absolute top-4 left-4 w-16 h-6 bg-gray-600 rounded-full animate-pulse"></div>

                  {/* Wishlist Button Shimmer */}
                  <div className="absolute top-4 right-4 w-8 h-8 bg-gray-600 rounded-full animate-pulse"></div>
                </div>

                {/* Product Info Shimmer */}
                <div className="p-4">
                  {/* Category Tag Shimmer */}
                  <div className="w-20 h-4 bg-gray-600 rounded-full mb-2 animate-pulse"></div>

                  {/* Product Title Shimmer */}
                  <div className="h-6 bg-gray-600 rounded-lg mb-3 animate-pulse"></div>
                  <div className="h-4 bg-gray-600 rounded-lg mb-3 w-3/4 animate-pulse"></div>

                  {/* Rating Shimmer */}
                  <div className="flex items-center mb-3">
                    <div className="flex space-x-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <div
                          key={star}
                          className="w-4 h-4 bg-gray-600 rounded animate-pulse"
                          style={{ animationDelay: `${star * 0.05}s` }}
                        ></div>
                      ))}
                    </div>
                    <div className="ml-2 w-12 h-4 bg-gray-600 rounded animate-pulse"></div>
                  </div>

                  {/* Price Shimmer */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="h-6 bg-gray-600 rounded-lg w-16 animate-pulse"></div>
                    <div className="h-4 bg-gray-600 rounded w-12 animate-pulse"></div>
                  </div>

                  {/* Add to Cart Button Shimmer */}
                  <div className="h-10 bg-gray-600 rounded-lg animate-pulse"></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* View All Button Shimmer */}
        <div className="text-center mt-12">
          <div className="h-12 bg-gray-600 rounded-lg w-40 mx-auto animate-pulse"></div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProductsShimmer;
