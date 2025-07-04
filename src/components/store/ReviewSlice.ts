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
}

const initialState: ReviewState = {
  reviews: [],
  loading: false,
  error: null,
  pagination: null,
  selectedReview: null,
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
      })
      .addCase(fetchReviews.fulfilled, (state, action) => {
        state.loading = false;
        state.reviews = action.payload.data;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchReviews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch reviews";
        toast.error("Failed to fetch reviews");
      });

    // Create review
    builder
      .addCase(createReview.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createReview.fulfilled, (state, action) => {
        state.loading = false;
        state.reviews.unshift(action.payload.data);
        toast.success("Review created successfully");
      })
      .addCase(createReview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to create review";
        toast.error(action.error.message || "Failed to create review");
      });

    // Update review
    builder
      .addCase(updateReview.pending, (state) => {
        state.loading = true;
        state.error = null;
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
      })
      .addCase(updateReview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to update review";
        toast.error(action.error.message || "Failed to update review");
      });

    // Delete review
    builder
      .addCase(deleteReview.pending, (state) => {
        state.loading = true;
        state.error = null;
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
      })
      .addCase(deleteReview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to delete review";
        toast.error(action.error.message || "Failed to delete review");
      });

    // Vote review
    builder
      .addCase(voteReview.pending, (state) => {
        state.loading = true;
        state.error = null;
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
      })
      .addCase(voteReview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to vote on review";
        toast.error(action.error.message || "Failed to vote on review");
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
