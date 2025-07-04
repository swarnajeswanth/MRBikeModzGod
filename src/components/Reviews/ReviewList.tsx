"use client";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch, fetchReviews, deleteReview } from "../store";
import { IReview } from "../models/Review";
import ReviewCard from "./ReviewCard";
import { Star, Filter, SortAsc, SortDesc, Loader2 } from "lucide-react";

interface ReviewListProps {
  productId?: string;
  userId?: string;
  showFilters?: boolean;
  showActions?: boolean;
  onEdit?: (review: IReview) => void;
}

const ReviewList: React.FC<ReviewListProps> = ({
  productId,
  userId,
  showFilters = true,
  showActions = true,
  onEdit,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const { reviews, loading, pagination } = useSelector(
    (state: RootState) => state.reviews
  );
  const user = useSelector((state: RootState) => state.user);

  const [filterRating, setFilterRating] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState<"createdAt" | "rating" | "helpful">(
    "createdAt"
  );
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const params: any = {
      limit: 10,
      page: currentPage,
      sort: sortBy,
      order: sortOrder,
    };

    if (productId) params.productId = productId;
    if (userId) params.userId = userId;

    dispatch(fetchReviews(params));
  }, [dispatch, productId, userId, currentPage, sortBy, sortOrder]);

  const handleDelete = async (reviewId: string) => {
    if (window.confirm("Are you sure you want to delete this review?")) {
      try {
        await dispatch(deleteReview(reviewId)).unwrap();
      } catch (error) {
        console.error("Failed to delete review:", error);
      }
    }
  };

  const filteredReviews = filterRating
    ? reviews.filter((review) => review.rating >= filterRating)
    : reviews;

  const handleSort = (field: "createdAt" | "rating" | "helpful") => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("desc");
    }
  };

  const renderSortButton = (
    field: "createdAt" | "rating" | "helpful",
    label: string
  ) => (
    <button
      onClick={() => handleSort(field)}
      className={`flex items-center space-x-1 px-3 py-1 rounded-md text-sm transition-colors ${
        sortBy === field
          ? "bg-blue-600 text-white"
          : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
      }`}
    >
      <span>{label}</span>
      {sortBy === field &&
        (sortOrder === "asc" ? (
          <SortAsc className="h-3 w-3" />
        ) : (
          <SortDesc className="h-3 w-3" />
        ))}
    </button>
  );

  if (loading && reviews.length === 0) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        <span className="ml-2 text-gray-600 dark:text-gray-400">
          Loading reviews...
        </span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters and Sorting */}
      {showFilters && (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Filter className="h-4 w-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Filter:
                </span>
              </div>
              <select
                value={filterRating || ""}
                onChange={(e) =>
                  setFilterRating(
                    e.target.value ? Number(e.target.value) : null
                  )
                }
                className="text-sm border border-gray-300 dark:border-gray-600 rounded-md px-3 py-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="">All Ratings</option>
                <option value="5">5 Stars</option>
                <option value="4">4+ Stars</option>
                <option value="3">3+ Stars</option>
                <option value="2">2+ Stars</option>
                <option value="1">1+ Stars</option>
              </select>
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Sort by:
              </span>
              {renderSortButton("createdAt", "Date")}
              {renderSortButton("rating", "Rating")}
              {renderSortButton("helpful", "Helpful")}
            </div>
          </div>
        </div>
      )}

      {/* Reviews Count */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Reviews ({filteredReviews.length})
        </h3>
        {pagination && (
          <span className="text-sm text-gray-500 dark:text-gray-400">
            Page {pagination.page} of {pagination.pages}
          </span>
        )}
      </div>

      {/* Reviews List */}
      {filteredReviews.length === 0 ? (
        <div className="text-center py-8">
          <Star className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400">No reviews found</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredReviews.map((review) => (
            <ReviewCard
              key={review._id}
              review={review}
              showActions={showActions}
              onEdit={onEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagination && pagination.pages > 1 && (
        <div className="flex items-center justify-center space-x-2">
          <button
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 text-sm bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300 dark:hover:bg-gray-600"
          >
            Previous
          </button>

          {Array.from({ length: Math.min(5, pagination.pages) }, (_, i) => {
            const page = i + 1;
            return (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-1 text-sm rounded-md ${
                  currentPage === page
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
                }`}
              >
                {page}
              </button>
            );
          })}

          <button
            onClick={() =>
              setCurrentPage(Math.min(pagination.pages, currentPage + 1))
            }
            disabled={currentPage === pagination.pages}
            className="px-3 py-1 text-sm bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300 dark:hover:bg-gray-600"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default ReviewList;
