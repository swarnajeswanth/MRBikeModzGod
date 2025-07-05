"use client";
import React from "react";

interface RatingShimmerProps {
  showText?: boolean;
  showCount?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const RatingShimmer: React.FC<RatingShimmerProps> = ({
  showText = true,
  showCount = true,
  size = "md",
  className = "",
}) => {
  const getStarSize = () => {
    switch (size) {
      case "sm":
        return "w-3 h-3";
      case "lg":
        return "w-5 h-5";
      default:
        return "w-4 h-4";
    }
  };

  const getTextSize = () => {
    switch (size) {
      case "sm":
        return "text-xs";
      case "lg":
        return "text-lg";
      default:
        return "text-sm";
    }
  };

  return (
    <div className={`flex items-center ${className}`}>
      {/* Stars Shimmer */}
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <div
            key={star}
            className={`${getStarSize()} bg-gray-600 rounded animate-pulse`}
            style={{ animationDelay: `${star * 0.1}s` }}
          ></div>
        ))}
      </div>

      {/* Rating Text Shimmer */}
      {showText && (
        <div className={`ml-2 ${getTextSize()}`}>
          <div className="w-8 h-3 bg-gray-600 rounded animate-pulse"></div>
        </div>
      )}

      {/* Review Count Shimmer */}
      {showCount && (
        <div className={`ml-2 ${getTextSize()}`}>
          <div className="w-12 h-3 bg-gray-600 rounded animate-pulse"></div>
        </div>
      )}
    </div>
  );
};

// Variant for product cards
export const ProductRatingShimmer: React.FC<{ className?: string }> = ({
  className = "",
}) => {
  return (
    <div className={`flex items-center mb-3 ${className}`}>
      {/* Stars */}
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <div
            key={star}
            className="w-4 h-4 bg-gray-600 rounded animate-pulse"
            style={{ animationDelay: `${star * 0.05}s` }}
          ></div>
        ))}
      </div>

      {/* Rating and Review Count */}
      <div className="ml-2 text-sm">
        <div className="w-8 h-3 bg-gray-600 rounded animate-pulse mb-1"></div>
        <div className="w-12 h-3 bg-gray-600 rounded animate-pulse"></div>
      </div>
    </div>
  );
};

// Variant for review cards
export const ReviewRatingShimmer: React.FC<{ className?: string }> = ({
  className = "",
}) => {
  return (
    <div className={`flex items-center ${className}`}>
      {/* Stars */}
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <div
            key={star}
            className="w-4 h-4 bg-gray-600 rounded animate-pulse"
            style={{ animationDelay: `${star * 0.05}s` }}
          ></div>
        ))}
      </div>

      {/* Rating Text */}
      <div className="ml-2 text-sm text-gray-400">
        <div className="w-12 h-3 bg-gray-600 rounded animate-pulse"></div>
      </div>
    </div>
  );
};

// Variant for detailed product pages
export const DetailedRatingShimmer: React.FC<{ className?: string }> = ({
  className = "",
}) => {
  return (
    <div className={`space-y-2 ${className}`}>
      {/* Overall Rating */}
      <div className="flex items-center">
        <div className="flex space-x-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <div
              key={star}
              className="w-5 h-5 bg-gray-600 rounded animate-pulse"
              style={{ animationDelay: `${star * 0.05}s` }}
            ></div>
          ))}
        </div>
        <div className="ml-3">
          <div className="w-12 h-4 bg-gray-600 rounded animate-pulse mb-1"></div>
          <div className="w-20 h-3 bg-gray-600 rounded animate-pulse"></div>
        </div>
      </div>

      {/* Rating Breakdown */}
      <div className="space-y-1">
        {[5, 4, 3, 2, 1].map((rating) => (
          <div key={rating} className="flex items-center">
            <div className="w-8 h-3 bg-gray-600 rounded animate-pulse mr-2"></div>
            <div className="flex-1 h-2 bg-gray-700 rounded-full mr-2">
              <div
                className="h-2 bg-gray-600 rounded-full animate-pulse"
                style={{ width: `${rating * 20}%` }}
              ></div>
            </div>
            <div className="w-8 h-3 bg-gray-600 rounded animate-pulse"></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RatingShimmer;
