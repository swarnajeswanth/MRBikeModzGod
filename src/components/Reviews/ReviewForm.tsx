import React, { useState } from "react";
import { Review } from "./ReviewPage";
import StarRating from "./StarRating";

interface ReviewFormProps {
  onSubmit: (review: Omit<Review, "id" | "date">) => void;
}

const ReviewForm: React.FC<ReviewFormProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    username: "",
    rating: 0,
    comment: "",
    verified: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.username || !formData.comment || formData.rating === 0) {
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    onSubmit(formData);

    // Reset form
    setFormData({
      username: "",
      rating: 0,
      comment: "",
      verified: false,
    });

    setIsSubmitting(false);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRatingChange = (rating: number) => {
    setFormData((prev) => ({
      ...prev,
      rating,
    }));
  };

  return (
    <div className="sticky top-8">
      <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
        <h3 className="text-xl font-bold text-white mb-6">Write a Review</h3>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Username */}
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-300 mb-2"
            >
              Your Name
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              placeholder="Enter your name"
              required
            />
          </div>

          {/* Rating */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Rating
            </label>
            <div className="flex items-center space-x-4">
              <StarRating
                rating={formData.rating}
                onRatingChange={handleRatingChange}
              />
              <span className="text-gray-400 text-sm">
                {formData.rating === 0
                  ? "Select a rating"
                  : `${formData.rating} star${formData.rating > 1 ? "s" : ""}`}
              </span>
            </div>
          </div>

          {/* Comment */}
          <div>
            <label
              htmlFor="comment"
              className="block text-sm font-medium text-gray-300 mb-2"
            >
              Your Review
            </label>
            <textarea
              id="comment"
              name="comment"
              value={formData.comment}
              onChange={handleInputChange}
              rows={4}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
              placeholder="Share your experience with our products..."
              required
            />
          </div>

          {/* Verified Purchase */}
          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              id="verified"
              checked={formData.verified}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, verified: e.target.checked }))
              }
              className="w-4 h-4 text-red-600 bg-white/10 border-white/20 rounded focus:ring-red-500"
            />
            <label htmlFor="verified" className="text-sm text-gray-300">
              This is a verified purchase
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={
              isSubmitting ||
              !formData.username ||
              !formData.comment ||
              formData.rating === 0
            }
            className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 disabled:from-gray-600 disabled:to-gray-600 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-[1.02] disabled:scale-100 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Submitting...</span>
              </div>
            ) : (
              "Submit Review"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ReviewForm;
