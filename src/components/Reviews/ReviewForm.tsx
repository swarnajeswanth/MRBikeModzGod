import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch, createReview, updateReview } from "../store";
import { IReview } from "../models/Review";
import { Star, X, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

interface ReviewFormProps {
  productId: string;
  review?: IReview | null;
  onClose: () => void;
  onSubmit?: () => void;
}

const ReviewForm: React.FC<ReviewFormProps> = ({
  productId,
  review,
  onClose,
  onSubmit,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.user);
  const { loading } = useSelector((state: RootState) => state.reviews);

  const [formData, setFormData] = useState({
    rating: review?.rating || 0,
    title: review?.title || "",
    comment: review?.comment || "",
  });

  const [hoveredRating, setHoveredRating] = useState(0);

  useEffect(() => {
    if (review) {
      setFormData({
        rating: review.rating,
        title: review.title,
        comment: review.comment,
      });
    }
  }, [review]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast.error("Please log in to submit a review");
      return;
    }

    if (formData.rating === 0) {
      toast.error("Please select a rating");
      return;
    }

    if (!formData.title.trim()) {
      toast.error("Please enter a review title");
      return;
    }

    if (!formData.comment.trim()) {
      toast.error("Please enter a review comment");
      return;
    }

    try {
      if (review) {
        // Update existing review
        await dispatch(
          updateReview({
            id: review._id,
            reviewData: {
              rating: formData.rating,
              title: formData.title.trim(),
              comment: formData.comment.trim(),
            },
          })
        ).unwrap();
      } else {
        // Create new review
        await dispatch(
          createReview({
            productId,
            userId: user.id,
            userName: user.name || "Anonymous",
            userEmail: user.email || "",
            rating: formData.rating,
            title: formData.title.trim(),
            comment: formData.comment.trim(),
          })
        ).unwrap();
      }

      toast.success(
        review ? "Review updated successfully" : "Review submitted successfully"
      );
      onSubmit?.();
      onClose();
    } catch (error) {
      console.error("Review submission failed:", error);
    }
  };

  const renderStars = () => {
    return Array.from({ length: 5 }, (_, index) => {
      const starValue = index + 1;
      const isFilled = starValue <= (hoveredRating || formData.rating);

      return (
        <button
          key={index}
          type="button"
          onClick={() =>
            setFormData((prev) => ({ ...prev, rating: starValue }))
          }
          onMouseEnter={() => setHoveredRating(starValue)}
          onMouseLeave={() => setHoveredRating(0)}
          className="transition-colors duration-200"
        >
          <Star
            className={`h-8 w-8 ${
              isFilled
                ? "text-yellow-400 fill-current"
                : "text-gray-300 hover:text-yellow-300"
            }`}
          />
        </button>
      );
    });
  };

  const getRatingText = (rating: number) => {
    const texts = ["", "Poor", "Fair", "Good", "Very Good", "Excellent"];
    return texts[rating] || "";
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              {review ? "Edit Review" : "Write a Review"}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Rating */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Rating *
              </label>
              <div className="flex items-center space-x-2">
                <div className="flex space-x-1">{renderStars()}</div>
                {formData.rating > 0 && (
                  <span className="text-sm text-gray-600 dark:text-gray-400 ml-2">
                    {getRatingText(formData.rating)}
                  </span>
                )}
              </div>
            </div>

            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Review Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, title: e.target.value }))
                }
                placeholder="Summarize your experience"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                maxLength={100}
                required
              />
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {formData.title.length}/100 characters
              </div>
            </div>

            {/* Comment */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Review Comment *
              </label>
              <textarea
                value={formData.comment}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, comment: e.target.value }))
                }
                placeholder="Share your detailed experience with this product..."
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                maxLength={1000}
                required
              />
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {formData.comment.length}/1000 characters
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || formData.rating === 0}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : review ? (
                  "Update Review"
                ) : (
                  "Submit Review"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ReviewForm;
