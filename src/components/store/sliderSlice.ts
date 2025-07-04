import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

export interface SlideImage {
  id: string;
  url: string;
  alt: string;
  title?: string;
  description?: string;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

interface SliderState {
  images: SlideImage[];
  loading: boolean;
  error: string | null;
}

const initialState: SliderState = {
  images: [],
  loading: false,
  error: null,
};

// Async thunks
export const fetchSliderImages = createAsyncThunk(
  "slider/fetchImages",
  async () => {
    const response = await fetch("/api/slider");
    if (!response.ok) {
      throw new Error("Failed to fetch slider images");
    }
    return response.json();
  }
);

export const uploadSliderImage = createAsyncThunk(
  "slider/uploadImage",
  async (imageData: {
    file: File;
    alt: string;
    title?: string;
    description?: string;
  }) => {
    const formData = new FormData();
    formData.append("file", imageData.file);
    formData.append("alt", imageData.alt);
    formData.append("title", imageData.title || "");
    formData.append("description", imageData.description || "");

    const response = await fetch("/api/slider/upload", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Failed to upload image");
    }

    return response.json();
  }
);

export const updateSliderImage = createAsyncThunk(
  "slider/updateImage",
  async ({ id, imageData }: { id: string; imageData: Partial<SlideImage> }) => {
    const response = await fetch(`/api/slider/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(imageData),
    });

    if (!response.ok) {
      throw new Error("Failed to update image");
    }

    return response.json();
  }
);

export const deleteSliderImage = createAsyncThunk(
  "slider/deleteImage",
  async (id: string) => {
    const response = await fetch(`/api/slider/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Failed to delete image");
    }

    return { id };
  }
);

export const reorderSliderImages = createAsyncThunk(
  "slider/reorderImages",
  async (imageIds: string[]) => {
    const response = await fetch("/api/slider/reorder", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ imageIds }),
    });

    if (!response.ok) {
      throw new Error("Failed to reorder images");
    }

    return response.json();
  }
);

const sliderSlice = createSlice({
  name: "slider",
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch images
    builder
      .addCase(fetchSliderImages.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSliderImages.fulfilled, (state, action) => {
        state.loading = false;
        state.images = action.payload.images || action.payload;
      })
      .addCase(fetchSliderImages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch images";
      });

    // Upload image
    builder
      .addCase(uploadSliderImage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(uploadSliderImage.fulfilled, (state, action) => {
        state.loading = false;
        state.images.push(action.payload.image);
      })
      .addCase(uploadSliderImage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to upload image";
      });

    // Update image
    builder
      .addCase(updateSliderImage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateSliderImage.fulfilled, (state, action) => {
        state.loading = false;
        const updatedImage = action.payload.image;
        const index = state.images.findIndex(
          (img) => img.id === updatedImage.id
        );
        if (index !== -1) {
          state.images[index] = updatedImage;
        }
      })
      .addCase(updateSliderImage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to update image";
      });

    // Delete image
    builder
      .addCase(deleteSliderImage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteSliderImage.fulfilled, (state, action) => {
        state.loading = false;
        state.images = state.images.filter(
          (img) => img.id !== action.payload.id
        );
      })
      .addCase(deleteSliderImage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to delete image";
      });

    // Reorder images
    builder
      .addCase(reorderSliderImages.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(reorderSliderImages.fulfilled, (state, action) => {
        state.loading = false;
        state.images = action.payload.images;
      })
      .addCase(reorderSliderImages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to reorder images";
      });
  },
});

export const { setLoading, setError, clearError } = sliderSlice.actions;

// Selectors
export const selectSliderImages = (state: { slider: SliderState }) =>
  state.slider.images;

export const selectSliderLoading = (state: { slider: SliderState }) =>
  state.slider.loading;

export const selectSliderError = (state: { slider: SliderState }) =>
  state.slider.error;

export default sliderSlice.reducer;
