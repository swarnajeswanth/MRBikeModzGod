"use client";
import React, { useState } from "react";
import ReviewsList from "@/components/Reviews/ReviewList";
import ReviewForm from "@/components/Reviews/ReviewForm";

export interface Review {
  id: string;
  username: string;
  rating: number;
  comment: string;
  date: string;
  verified: boolean;
}

const ReviewPage = () => {
  const [reviews, setReviews] = useState<Review[]>([
    {
      id: "1",
      username: "Mike Johnson",
      rating: 5,
      comment:
        "Absolutely fantastic experience! The premium auto parts transformed my ride completely. Quality is top-notch and installation was smooth.",
      date: "2024-06-15",
      verified: true,
    },
    {
      id: "2",
      username: "Sarah Chen",
      rating: 4,
      comment:
        "Great selection of performance parts. The exhaust system I ordered exceeded my expectations. Fast shipping and excellent customer service.",
      date: "2024-06-10",
      verified: true,
    },
    {
      id: "3",
      username: "Alex Rodriguez",
      rating: 5,
      comment:
        "Been using their suspension components for months now. The difference in handling is incredible. Highly recommend for any serious car enthusiast.",
      date: "2024-06-05",
      verified: false,
    },
    {
      id: "4",
      username: "Jennifer Smith",
      rating: 4,
      comment:
        "Electronics package was exactly what I needed. Latest tech integration worked flawlessly with my vehicle. Professional installation guide included.",
      date: "2024-05-28",
      verified: true,
    },
  ]);

  const addReview = (newReview: Omit<Review, "id" | "date">) => {
    const review: Review = {
      ...newReview,
      id: Date.now().toString(),
      date: new Date().toISOString().split("T")[0],
    };
    setReviews((prev) => [review, ...prev]);
  };

  const averageRating =
    reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#0f172a" }}>
      {/* Header Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 to-red-600/20" />

        <div className="relative container mx-auto px-4 sm:px-6 py-12 sm:py-16 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold text-white mb-4 sm:mb-6">
            Customer Reviews
          </h1>

          <p className="text-base sm:text-lg md:text-xl text-gray-300 mb-6 sm:mb-8 max-w-xl mx-auto">
            See what our customers say about their experience with premium auto
            parts
          </p>

          {/* Rating Summary */}
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-3 sm:space-y-0 sm:space-x-4 bg-white/10 backdrop-blur-sm rounded-2xl px-6 py-4 sm:px-8">
            <div className="text-2xl sm:text-3xl font-bold text-white">
              {averageRating.toFixed(1)}
            </div>
            <div className="flex space-x-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <div
                  key={star}
                  className={`w-5 h-5 sm:w-6 sm:h-6 ${
                    star <= Math.round(averageRating)
                      ? "text-red-400"
                      : "text-gray-400"
                  }`}
                >
                  ★
                </div>
              ))}
            </div>
            <div className="text-sm sm:text-base text-gray-300">
              Based on {reviews.length} reviews
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Reviews List */}
          <div className="lg:col-span-2">
            <ReviewsList reviews={reviews} />
          </div>

          {/* Review Form */}
          <div className="lg:col-span-1">
            <ReviewForm onSubmit={addReview} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewPage;
