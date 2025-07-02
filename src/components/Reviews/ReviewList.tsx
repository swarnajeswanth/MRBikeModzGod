import React from "react";
import { Review } from "@/components/store/ReviewSlice";
import ReviewCard from "./ReviewCard";

interface ReviewsListProps {
  reviews: Review[];
  onDelete: (id: string) => void;
  onSort: (criteria: "newest" | "oldest" | "highest" | "lowest") => void;
  onFilter: (rating: number) => void;
  onClearFilter: () => void;
  currentFilter: number | null;
}

const ReviewsList: React.FC<ReviewsListProps> = ({
  reviews,
  onDelete,
  onSort,
  onFilter,
  onClearFilter,
  currentFilter,
}) => {
  return (
    <div className="space-y-6">
      {/* Header & Sorting */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="text-2xl font-bold text-white">Customer Reviews</h2>

        <select
          className="bg-white/10 border border-white/20 rounded-xl px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
          onChange={(e) =>
            onSort(e.target.value as "newest" | "oldest" | "highest" | "lowest")
          }
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="highest">Highest Rated</option>
          <option value="lowest">Lowest Rated</option>
        </select>
      </div>

      {/* Filter by Rating */}
      <div className="flex items-center flex-wrap gap-2 text-sm text-white">
        <span className="mr-2">Filter by Rating:</span>
        {[5, 4, 3, 2, 1].map((rating) => (
          <button
            key={rating}
            onClick={() => onFilter(rating)}
            className={`px-3 py-1 rounded-full border ${
              currentFilter === rating
                ? "bg-red-600 text-white border-red-600"
                : "bg-white/10 text-gray-300 border-white/20 hover:bg-white/20"
            } transition-all`}
          >
            {rating} ★
          </button>
        ))}
        {currentFilter !== null && (
          <button
            onClick={onClearFilter}
            className="ml-4 text-red-400 hover:underline"
          >
            Clear Filter
          </button>
        )}
      </div>

      {/* Review Cards */}
      <div className="space-y-4">
        {reviews.map((review) => (
          <ReviewCard key={review.id} review={review} onDelete={onDelete} />
        ))}
      </div>

      {/* Empty State */}
      {reviews.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📝</div>
          <h3 className="text-xl font-semibold text-white mb-2">
            No reviews found
          </h3>
          <p className="text-gray-400">
            Try a different filter or sorting option.
          </p>
        </div>
      )}
    </div>
  );
};

export default ReviewsList;
