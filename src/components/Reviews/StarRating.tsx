import React, { useState } from "react";

interface StarRatingProps {
  rating: number;
  onRatingChange: (rating: number) => void;
  interactive?: boolean;
}

const StarRating: React.FC<StarRatingProps> = ({
  rating,
  onRatingChange,
  interactive = true,
}) => {
  const [hoverRating, setHoverRating] = useState(0);

  const handleStarClick = (star: number) => {
    if (interactive) {
      onRatingChange(star);
    }
  };

  const handleStarHover = (star: number) => {
    if (interactive) {
      setHoverRating(star);
    }
  };

  const handleStarLeave = () => {
    if (interactive) {
      setHoverRating(0);
    }
  };

  return (
    <div className="flex space-x-1">
      {[1, 2, 3, 4, 5].map((star) => {
        const isActive = star <= (hoverRating || rating);
        return (
          <button
            key={star}
            type="button"
            onClick={() => handleStarClick(star)}
            onMouseEnter={() => handleStarHover(star)}
            onMouseLeave={handleStarLeave}
            className={`w-8 h-8 transition-all duration-200 transform hover:scale-110 ${
              interactive ? "cursor-pointer" : "cursor-default"
            } ${isActive ? "text-red-400" : "text-gray-500"}`}
            disabled={!interactive}
          >
            ★
          </button>
        );
      })}
    </div>
  );
};

export default StarRating;
