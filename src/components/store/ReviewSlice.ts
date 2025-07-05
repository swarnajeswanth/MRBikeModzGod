import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { IReview } from "../models/Review";
import toast from "react-hot-toast";

// Async thunks
export const fetchReviews = createAsyncThunk(
  "reviews/fetchReviews",
  async (params?: {
    productId?: string;
    userId?: string;
    limit?: number;
    page?: number;
  }) => {
    const searchParams = new URLSearchParams();
    if (params?.productId) searchParams.append("productId", params.productId);
    if (params?.userId) searchParams.append("userId", params.userId);
    if (params?.limit) searchParams.append("limit", params.limit.toString());
    if (params?.page) searchParams.append("page", params.page.toString());

    const response = await fetch(`/api/reviews?${searchParams}`);
    const data = await response.json();

    if (!data.success) {
      throw new Error(data.error || "Failed to fetch reviews");
    }

    return data;
  }
);

export const createReview = createAsyncThunk(
  "reviews/createReview",
  async (reviewData: {
    productId: string;
    userId: string;
    userName: string;
    userEmail: string;
    rating: number;
    title: string;
    comment: string;
  }) => {
    const response = await fetch("/api/reviews", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(reviewData),
    });

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.error || "Failed to create review");
    }

    return data;
  }
);

export const updateReview = createAsyncThunk(
  "reviews/updateReview",
  async ({
    id,
    reviewData,
  }: {
    id: string;
    reviewData: { rating: number; title: string; comment: string };
  }) => {
    const response = await fetch(`/api/reviews/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(reviewData),
    });

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.error || "Failed to update review");
    }

    return data;
  }
);

export const deleteReview = createAsyncThunk(
  "reviews/deleteReview",
  async (id: string) => {
    const response = await fetch(`/api/reviews/${id}`, {
      method: "DELETE",
    });

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.error || "Failed to delete review");
    }

    return { id };
  }
);

export const voteReview = createAsyncThunk(
  "reviews/voteReview",
  async ({
    id,
    voteType,
  }: {
    id: string;
    voteType: "helpful" | "notHelpful";
  }) => {
    const response = await fetch(`/api/reviews/${id}/vote`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ voteType }),
    });

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.error || "Failed to vote on review");
    }

    return data;
  }
);

export const seedReviews = createAsyncThunk("reviews/seedReviews", async () => {
  const response = await fetch("/api/seed-reviews", {
    method: "POST",
  });

  const data = await response.json();

  if (!data.success) {
    throw new Error(data.error || "Failed to seed reviews");
  }

  return data;
});

interface ReviewState {
  reviews: IReview[];
  loading: boolean;
  error: string | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  } | null;
  selectedReview: IReview | null;
  // Individual operation loading states
  createLoading: boolean;
  updateLoading: boolean;
  deleteLoading: boolean;
  fetchLoading: boolean;
  voteLoading: boolean;
}

const initialState: ReviewState = {
  reviews: [],
  loading: false,
  error: null,
  pagination: null,
  selectedReview: null,
  createLoading: false,
  updateLoading: false,
  deleteLoading: false,
  fetchLoading: false,
  voteLoading: false,
};

const reviewSlice = createSlice({
  name: "reviews",
  initialState,
  reducers: {
    setSelectedReview: (state, action: PayloadAction<IReview | null>) => {
      state.selectedReview = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    clearReviews: (state) => {
      state.reviews = [];
      state.pagination = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch reviews
    builder
      .addCase(fetchReviews.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.fetchLoading = true;
      })
      .addCase(fetchReviews.fulfilled, (state, action) => {
        state.loading = false;
        state.reviews = action.payload.data;
        state.pagination = action.payload.pagination;
        state.fetchLoading = false;
      })
      .addCase(fetchReviews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch reviews";
        toast.error("Failed to fetch reviews");
        state.fetchLoading = false;
      });

    // Create review
    builder
      .addCase(createReview.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.createLoading = true;
      })
      .addCase(createReview.fulfilled, (state, action) => {
        state.loading = false;
        state.reviews.unshift(action.payload.data);
        toast.success("Review created successfully");
        state.createLoading = false;
      })
      .addCase(createReview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to create review";
        toast.error(action.error.message || "Failed to create review");
        state.createLoading = false;
      });

    // Update review
    builder
      .addCase(updateReview.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.updateLoading = true;
      })
      .addCase(updateReview.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.reviews.findIndex(
          (review) => review._id === action.payload.data._id
        );
        if (index !== -1) {
          state.reviews[index] = action.payload.data;
        }
        if (state.selectedReview?._id === action.payload.data._id) {
          state.selectedReview = action.payload.data;
        }
        toast.success("Review updated successfully");
        state.updateLoading = false;
      })
      .addCase(updateReview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to update review";
        toast.error(action.error.message || "Failed to update review");
        state.updateLoading = false;
      });

    // Delete review
    builder
      .addCase(deleteReview.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.deleteLoading = true;
      })
      .addCase(deleteReview.fulfilled, (state, action) => {
        state.loading = false;
        state.reviews = state.reviews.filter(
          (review) => review._id !== action.payload.id
        );
        if (state.selectedReview?._id === action.payload.id) {
          state.selectedReview = null;
        }
        toast.success("Review deleted successfully");
        state.deleteLoading = false;
      })
      .addCase(deleteReview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to delete review";
        toast.error(action.error.message || "Failed to delete review");
        state.deleteLoading = false;
      });

    // Vote review
    builder
      .addCase(voteReview.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.voteLoading = true;
      })
      .addCase(voteReview.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.reviews.findIndex(
          (review) => review._id === action.payload.data._id
        );
        if (index !== -1) {
          state.reviews[index] = action.payload.data;
        }
        if (state.selectedReview?._id === action.payload.data._id) {
          state.selectedReview = action.payload.data;
        }
        toast.success("Vote recorded successfully");
        state.voteLoading = false;
      })
      .addCase(voteReview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to vote on review";
        toast.error(action.error.message || "Failed to vote on review");
        state.voteLoading = false;
      });

    // Seed reviews
    builder
      .addCase(seedReviews.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(seedReviews.fulfilled, (state, action) => {
        state.loading = false;
        state.reviews = action.payload.data;
        toast.success("Reviews seeded successfully");
      })
      .addCase(seedReviews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to seed reviews";
        toast.error(action.error.message || "Failed to seed reviews");
      });
  },
});

export const { setSelectedReview, clearError, clearReviews } =
  reviewSlice.actions;
export default reviewSlice.reducer;

// Selectors
export const selectReviews = (state: { reviews: ReviewState }) =>
  state.reviews.reviews;
export const selectReviewsLoading = (state: { reviews: ReviewState }) =>
  state.reviews.loading;
export const selectReviewsError = (state: { reviews: ReviewState }) =>
  state.reviews.error;
export const selectReviewsPagination = (state: { reviews: ReviewState }) =>
  state.reviews.pagination;
export const selectSelectedReview = (state: { reviews: ReviewState }) =>
  state.reviews.selectedReview;

// Individual loading state selectors
export const selectCreateReviewLoading = (state: { reviews: ReviewState }) =>
  state.reviews.createLoading;
export const selectUpdateReviewLoading = (state: { reviews: ReviewState }) =>
  state.reviews.updateLoading;
export const selectDeleteReviewLoading = (state: { reviews: ReviewState }) =>
  state.reviews.deleteLoading;
export const selectFetchReviewsLoading = (state: { reviews: ReviewState }) =>
  state.reviews.fetchLoading;
export const selectVoteReviewLoading = (state: { reviews: ReviewState }) =>
  state.reviews.voteLoading;
