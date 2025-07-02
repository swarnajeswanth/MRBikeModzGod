import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Review {
  id: string;
  username: string;
  rating: number;
  comment: string;
  date: string;
  verified: boolean;
}

interface ReviewsState {
  items: Review[];
  filteredItems: Review[];
  filterRating: number | null; // NEW: for UI state
}

const initialState: ReviewsState = {
  items: [
    {
      id: "1",
      username: "Mike Johnson",
      rating: 5,
      comment: "Absolutely fantastic experience!",
      date: "2024-06-15",
      verified: true,
    },
    {
      id: "2",
      username: "Sarah Chen",
      rating: 4,
      comment: "Great selection. Fast shipping and support.",
      date: "2024-06-10",
      verified: true,
    },
    {
      id: "3",
      username: "Alex Rodriguez",
      rating: 5,
      comment: "Suspension components improved handling greatly.",
      date: "2024-06-05",
      verified: false,
    },
    {
      id: "4",
      username: "Jennifer Smith",
      rating: 4,
      comment: "Electronics worked flawlessly with my car.",
      date: "2024-05-28",
      verified: true,
    },
    {
      id: "5",
      username: "David Lee",
      rating: 3,
      comment: "Good product, weak packaging.",
      date: "2024-05-21",
      verified: false,
    },
  ],
  filteredItems: [],
  filterRating: null, // NEW
};

type SortType = "newest" | "oldest" | "highest" | "lowest";

const reviewsSlice = createSlice({
  name: "reviews",
  initialState,
  reducers: {
    addReview: (state, action: PayloadAction<Omit<Review, "id" | "date">>) => {
      const newReview: Review = {
        ...action.payload,
        id: Date.now().toString(),
        date: new Date().toISOString().split("T")[0],
      };
      state.items.unshift(newReview);
      if (state.filterRating !== null) {
        state.filteredItems = state.items.filter(
          (review) => review.rating >= state.filterRating!
        );
      }
    },

    deleteReview: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((r) => r.id !== action.payload);
      if (state.filterRating !== null) {
        state.filteredItems = state.items.filter(
          (review) => review.rating >= state.filterRating!
        );
      }
    },

    sortReviews: (state, action: PayloadAction<SortType>) => {
      const sorted = [
        ...(state.filterRating !== null ? state.filteredItems : state.items),
      ];
      switch (action.payload) {
        case "newest":
          sorted.sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
          );
          break;
        case "oldest":
          sorted.sort(
            (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
          );
          break;
        case "highest":
          sorted.sort((a, b) => b.rating - a.rating);
          break;
        case "lowest":
          sorted.sort((a, b) => a.rating - b.rating);
          break;
      }
      state.filteredItems = sorted;
    },

    filterByRating: (state, action: PayloadAction<number>) => {
      const minRating = action.payload;
      state.filterRating = minRating;
      state.filteredItems = state.items.filter(
        (review) => review.rating >= minRating
      );
    },

    clearFilter: (state) => {
      state.filteredItems = [];
      state.filterRating = null;
    },
  },
});

export const {
  addReview,
  deleteReview,
  sortReviews,
  filterByRating,
  clearFilter,
} = reviewsSlice.actions;

export default reviewsSlice.reducer;
