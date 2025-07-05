import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch, voteReview } from "../store";
import { IReview } from "../models/Review";
import {
  Star,
  ThumbsUp,
  ThumbsDown,
  CheckCircle,
  Calendar,
  User,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { selectVoteReviewLoading } from "@/components/store/ReviewSlice";
import { selectAllProducts } from "../store/productSlice";
import { fetchProducts } from "../store/productSlice";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { selectIsCustomerExperienceEnabled } from "@/components/store/storeSettingsSlice";

interface ReviewCardProps {
  review: IReview;
  showActions?: boolean;
  onEdit?: (review: IReview) => void;
  onDelete?: (reviewId: string) => void;
}

const ReviewCard: React.FC<ReviewCardProps> = ({
  review,
  showActions = true,
  onEdit,
  onDelete,
}) => {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.user);
  const voteLoading = useSelector(selectVoteReviewLoading);
  const requireLoginForPurchase = useSelector(
    selectIsCustomerExperienceEnabled("requireLoginForPurchase")
  );
  const products = useSelector(selectAllProducts) || [];

  useEffect(() => {
    if (products.length === 0) {
      dispatch(fetchProducts());
    }
  }, [dispatch, products.length]);

  const handleVote = async (voteType: "helpful" | "notHelpful") => {
    if (requireLoginForPurchase && !user?.isLoggedIn) {
      toast.error("Please log in to vote on reviews.");
      router.push("/auth");
      return;
    }

    try {
      await dispatch(voteReview({ id: review._id, voteType })).unwrap();
    } catch (error) {
      console.error("Failed to vote:", error);
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`h-4 w-4 ${
          index < rating ? "text-yellow-400 fill-current" : "text-gray-300"
        }`}
      />
    ));
  };

  const isOwner = user?.id === review.userId;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 sm:p-6 border border-gray-200 dark:border-gray-700">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-4 gap-3">
        <div className="flex items-center space-x-3 min-w-0 flex-1">
          <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
            <User className="h-5 w-5 text-white" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center space-x-2">
              <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                {review.userName}
              </h3>
              {review.verified && (
                <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
              )}
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
              <Calendar className="h-3 w-3 flex-shrink-0" />
              <span className="truncate">
                {formatDistanceToNow(new Date(review.createdAt), {
                  addSuffix: true,
                })}
              </span>
            </div>
          </div>
        </div>

        {/* Rating */}
        <div className="flex items-center space-x-1 flex-shrink-0">
          {renderStars(review.rating)}
          <span className="ml-2 text-sm font-medium text-gray-900 dark:text-white">
            {review.rating}/5
          </span>
        </div>
      </div>

      {/* Review Content */}
      <div className="mb-4">
        <h4 className="font-medium text-gray-900 dark:text-white mb-2 break-words">
          {review.title}
        </h4>
        <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed break-words">
          {review.comment}
        </p>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center space-x-4">
          {/* Helpful Vote */}
          <button
            onClick={() => handleVote("helpful")}
            disabled={voteLoading}
            className="flex items-center space-x-1 text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors disabled:opacity-50"
          >
            <ThumbsUp className="h-4 w-4" />
            <span>{review.helpful}</span>
          </button>

          {/* Not Helpful Vote */}
          <button
            onClick={() => handleVote("notHelpful")}
            disabled={voteLoading}
            className="flex items-center space-x-1 text-sm text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors disabled:opacity-50"
          >
            <ThumbsDown className="h-4 w-4" />
            <span>{review.notHelpful}</span>
          </button>
        </div>

        {/* Owner Actions */}
        {showActions && isOwner && (
          <div className="flex items-center space-x-2">
            {onEdit && (
              <button
                onClick={() => onEdit(review)}
                className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
              >
                Edit
              </button>
            )}
            {onDelete && (
              <button
                onClick={() => onDelete(review._id)}
                className="text-sm text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 transition-colors"
              >
                Delete
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewCard;
