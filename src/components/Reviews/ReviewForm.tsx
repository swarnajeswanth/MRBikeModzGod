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
  const user = useSelector((state: RootState) => state.user);
  const { loading } = useSelector((state: RootState) => state.reviews);

  // Helper function to check if user is actually logged in
  const isUserLoggedIn = () => {
    return user?.isLoggedIn || (user?.id && user?.username);
  };

  // Debug: Log user state to see what's happening
  console.log("ReviewForm - User state:", {
    isLoggedIn: user?.isLoggedIn,
    id: user?.id,
    username: user?.username,
    fullUser: user,
  });

  // Debug: Check localStorage directly
  if (typeof window !== "undefined") {
    try {
      const persistedState = localStorage.getItem("persist:root");
      if (persistedState) {
        const parsedState = JSON.parse(persistedState);
        console.log("Persisted state from localStorage:", parsedState);
        if (parsedState.user) {
          const userState = JSON.parse(parsedState.user);
          console.log("User state from localStorage:", userState);

          // Check if user state is corrupted (has ID but not isLoggedIn)
          if (userState.id && userState.username && !userState.isLoggedIn) {
            console.log(
              "Detected corrupted user state - user has ID but isLoggedIn is false"
            );
            console.log(
              "This might be a persistence issue. Consider clearing localStorage."
            );
          }
        }
      }
    } catch (error) {
      console.error("Error reading localStorage:", error);
    }
  }

  const [formData, setFormData] = useState({
    userName: user?.username || "",
    userEmail: "", // Don't pre-fill email for security/privacy
    rating: review?.rating || 0,
    title: review?.title || "",
    comment: review?.comment || "",
  });

  // Update form data when user data changes
  useEffect(() => {
    if (user?.username && !formData.userName) {
      setFormData((prev) => ({
        ...prev,
        userName: user.username,
      }));
    }
  }, [user?.username, formData.userName]);

  const [hoveredRating, setHoveredRating] = useState(0);

  useEffect(() => {
    if (review) {
      setFormData({
        userName: review.userName,
        userEmail: review.userEmail,
        rating: review.rating,
        title: review.title,
        comment: review.comment,
      });
    }
  }, [review]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Enhanced validation
    if (!formData.userName.trim()) {
      toast.error("Please enter your name");
      return;
    }
    if (!formData.userEmail.trim()) {
      toast.error("Please enter your email");
      return;
    }
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.userEmail.trim())) {
      toast.error("Please enter a valid email address");
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
    if (formData.title.trim().length < 3) {
      toast.error("Review title must be at least 3 characters long");
      return;
    }
    if (!formData.comment.trim()) {
      toast.error("Please enter a review comment");
      return;
    }
    if (formData.comment.trim().length < 10) {
      toast.error("Review comment must be at least 10 characters long");
      return;
    }

    // Check if user is logged in and has an ID
    if (!isUserLoggedIn()) {
      toast.error("Please log in to submit a review");
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
            userId: user.id || "",
            userName: formData.userName.trim(),
            userEmail: formData.userEmail.trim(),
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
    } catch (error: any) {
      console.error("Review submission failed:", error);
      const errorMessage =
        error?.message || "Failed to submit review. Please try again.";
      toast.error(errorMessage);
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
            {/* Login Check */}
            {!isUserLoggedIn() && (
              <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-md p-4 mb-4">
                <p className="text-yellow-800 dark:text-yellow-200 text-sm">
                  Please log in to submit a review. Your review will be
                  associated with your account.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    // Clear localStorage and reload to fix state issues
                    if (typeof window !== "undefined") {
                      localStorage.removeItem("persist:root");
                      window.location.reload();
                    }
                  }}
                  className="mt-2 text-xs text-blue-600 dark:text-blue-400 hover:underline"
                >
                  Clear state and reload
                </button>
              </div>
            )}

            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Name *
              </label>
              <input
                type="text"
                value={formData.userName}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, userName: e.target.value }))
                }
                placeholder="Enter your full name"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
                minLength={2}
                maxLength={50}
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email *
              </label>
              <input
                type="email"
                value={formData.userEmail}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    userEmail: e.target.value,
                  }))
                }
                placeholder="Enter your email address"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
                maxLength={100}
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Your email will not be displayed publicly
              </p>
            </div>

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
                placeholder="Brief summary of your experience (e.g., 'Great quality, fast delivery')"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                maxLength={100}
                minLength={3}
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
                placeholder="Share your detailed experience with this product. What did you like or dislike? How was the quality, delivery, and overall experience?"
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                maxLength={1000}
                minLength={10}
                required
              />
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {formData.comment.length}/1000 characters
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || !isUserLoggedIn()}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Submitting...</span>
                  </>
                ) : !isUserLoggedIn() ? (
                  <span>Please Log In</span>
                ) : (
                  <span>{review ? "Update Review" : "Submit Review"}</span>
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
