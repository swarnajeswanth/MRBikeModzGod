import React from "react";
import { Review } from "@/components/store/ReviewSlice";

interface ReviewCardProps {
  review: Review;
  onDelete?: (id: string) => void;
}

const ReviewCard: React.FC<ReviewCardProps> = ({ review, onDelete }) => {
  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 sm:p-6 border border-white/20 hover:bg-white/15 transition-all duration-300 hover:scale-[1.02]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-4 space-y-4 sm:space-y-0">
        {/* User Info */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center text-white font-bold text-base sm:text-lg">
            {review.username.charAt(0)}
          </div>
          <div>
            <div className="flex items-center flex-wrap gap-2">
              <h3 className="text-white font-semibold text-sm sm:text-base">
                {review.username}
              </h3>
              {review.verified && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-red-500/20 text-red-400 border border-red-500/30">
                  ✓ Verified
                </span>
              )}
            </div>
            <p className="text-gray-400 text-xs sm:text-sm mt-1">
              {new Date(review.date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
              })}
            </p>
          </div>
        </div>

        {/* Rating */}
        <div className="flex space-x-1 mt-2 sm:mt-0">
          {[1, 2, 3, 4, 5].map((star) => (
            <div
              key={star}
              className={`w-4 h-4 sm:w-5 sm:h-5 ${
                star <= review.rating ? "text-red-400" : "text-gray-500"
              }`}
            >
              ★
            </div>
          ))}
        </div>
      </div>

      {/* Comment */}
      <p className="text-gray-300 text-sm sm:text-base leading-relaxed mb-2 sm:mb-0">
        {review.comment}
      </p>

      {/* Footer */}
      <div className="mt-4 pt-4 border-t border-white/10">
        <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 text-xs sm:text-sm text-gray-400">
          <button className="hover:text-white transition-colors flex items-center space-x-1">
            <span>👍</span>
            <span>Helpful</span>
          </button>
          <button className="hover:text-white transition-colors">Reply</button>
          {onDelete && (
            <button
              onClick={() => onDelete(review.id)}
              className="text-red-400 hover:text-red-500 ml-auto"
            >
              Delete
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReviewCard;
