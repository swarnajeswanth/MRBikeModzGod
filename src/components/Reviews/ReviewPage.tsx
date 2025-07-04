"use client";

import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch, fetchReviews } from "@/components/store";
import { IReview } from "@/components/models/Review";
import ReviewList from "@/components/Reviews/ReviewList";
import ReviewForm from "@/components/Reviews/ReviewForm";
import { Star } from "lucide-react";

const ReviewPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { reviews, loading } = useSelector((state: RootState) => state.reviews);
  const [showReviewForm, setShowReviewForm] = useState(false);

  useEffect(() => {
    // Fetch all reviews when component mounts
    dispatch(fetchReviews({ limit: 50 }));
  }, [dispatch]);

  const averageRating =
    reviews.length > 0
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
      : 0;

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`h-5 w-5 ${
          index < rating ? "text-yellow-400 fill-current" : "text-gray-300"
        }`}
      />
    ));
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="absolute inset-0 bg-black/20" />

        <div className="relative container mx-auto px-4 sm:px-6 py-12 sm:py-16 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold text-white mb-4 sm:mb-6">
            Customer Reviews
          </h1>

          <p className="text-base sm:text-lg md:text-xl text-gray-200 mb-6 sm:mb-8 max-w-xl mx-auto">
            See what our customers say about their experience with premium auto
            parts
          </p>

          {/* Rating Summary */}
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-3 sm:space-y-0 sm:space-x-4 bg-white/10 backdrop-blur-sm rounded-2xl px-6 py-4 sm:px-8">
            <div className="text-2xl sm:text-3xl font-bold text-white">
              {averageRating.toFixed(1)}
            </div>
            <div className="flex space-x-1">
              {renderStars(Math.round(averageRating))}
            </div>
            <div className="text-sm sm:text-base text-gray-200">
              Based on {reviews.length} reviews
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Action Buttons */}
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              All Reviews
            </h2>
            <button
              onClick={() => setShowReviewForm(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
            >
              Write a Review
            </button>
          </div>

          {/* Reviews List */}
          <ReviewList showFilters={true} showActions={true} />

          {/* Review Form Modal */}
          {showReviewForm && (
            <ReviewForm
              productId="general"
              onClose={() => setShowReviewForm(false)}
              onSubmit={() => {
                setShowReviewForm(false);
                // Refresh reviews after submission
                dispatch(fetchReviews({ limit: 50 }));
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ReviewPage;
