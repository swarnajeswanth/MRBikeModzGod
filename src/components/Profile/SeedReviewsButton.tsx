import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../store";
import { seedReviews } from "../store/ReviewSlice";
import { Database, Loader2 } from "lucide-react";

const SeedReviewsButton: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { loading } = useSelector((state: RootState) => state.reviews);

  const handleSeedReviews = async () => {
    if (
      window.confirm("This will add 5 dummy reviews to the database. Continue?")
    ) {
      try {
        await dispatch(seedReviews()).unwrap();
      } catch (error) {
        console.error("Failed to seed reviews:", error);
      }
    }
  };

  return (
    <button
      onClick={handleSeedReviews}
      disabled={loading}
      className="flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Database className="h-4 w-4" />
      )}
      <span>{loading ? "Seeding..." : "Seed Reviews"}</span>
    </button>
  );
};

export default SeedReviewsButton;
