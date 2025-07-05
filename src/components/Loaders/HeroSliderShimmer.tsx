"use client";
import React from "react";

const HeroSliderShimmer: React.FC = () => {
  return (
    <div className="relative overflow-hidden rounded-xl">
      {/* Main Slider Container */}
      <div className="relative w-full h-96 md:h-[500px] lg:h-[600px] bg-gray-800/50 backdrop-blur-sm border border-gray-700">
        {/* Shimmer Background */}
        <div className="absolute inset-0 bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 animate-pulse">
          {/* Content Placeholder */}
          <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
            <div className="text-center text-white px-6">
              {/* Title Shimmer */}
              <div className="h-8 md:h-12 bg-gray-600 rounded-lg mb-4 w-64 md:w-96 mx-auto animate-pulse"></div>

              {/* Description Shimmer */}
              <div className="h-4 md:h-6 bg-gray-600 rounded-lg mb-4 w-48 md:w-80 mx-auto animate-pulse"></div>
              <div className="h-4 md:h-6 bg-gray-600 rounded-lg mb-4 w-56 md:w-72 mx-auto animate-pulse"></div>

              {/* Button Shimmer */}
              <div className="h-10 md:h-12 bg-gray-600 rounded-lg w-32 md:w-40 mx-auto animate-pulse"></div>
            </div>
          </div>
        </div>

        {/* Navigation Dots Shimmer */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2 z-10">
          {[1, 2, 3, 4, 5].map((dot) => (
            <div
              key={dot}
              className="w-3 h-3 rounded-full bg-gray-600 animate-pulse"
              style={{ animationDelay: `${dot * 0.1}s` }}
            ></div>
          ))}
        </div>

        {/* Arrow Navigation Shimmer */}
        <div className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-gray-600/50 rounded-full animate-pulse"></div>
        <div className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-gray-600/50 rounded-full animate-pulse"></div>
      </div>

      {/* Bottom Content Shimmer */}
      <div className="mt-8">
        {/* Shop Now Button Shimmer */}
        <div className="flex justify-center mb-8">
          <div className="h-12 bg-gray-600 rounded-lg w-32 animate-pulse"></div>
        </div>

        {/* Stats Shimmer */}
        <div className="grid grid-cols-3 gap-8 pt-8 border-t border-gray-800">
          {[1, 2, 3].map((stat) => (
            <div key={stat} className="text-center">
              <div className="h-8 bg-gray-600 rounded-lg mb-2 animate-pulse"></div>
              <div className="h-4 bg-gray-600 rounded w-20 mx-auto animate-pulse"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HeroSliderShimmer;
