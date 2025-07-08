import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface LoadingState {
  isLoading: boolean;
  loadingStates: {
    [key: string]: boolean;
  };
  loadingMessages: {
    [key: string]: string;
  };
}

const initialState: LoadingState = {
  isLoading: false,
  loadingStates: {},
  loadingMessages: {},
};

const loadingSlice = createSlice({
  name: "loading",
  initialState,
  reducers: {
    startLoading: {
      reducer: (state, action: PayloadAction<string | undefined>) => {
        state.isLoading = true;
        if (action.payload) {
          state.loadingStates[action.payload] = true;
        }
      },
      prepare: (key?: string) => ({ payload: key }),
    },
    stopLoading: {
      reducer: (state, action: PayloadAction<string | undefined>) => {
        if (action.payload) {
          state.loadingStates[action.payload] = false;
          delete state.loadingMessages[action.payload];
        } else {
          state.isLoading = false;
          state.loadingStates = {};
          state.loadingMessages = {};
        }
      },
      prepare: (key?: string) => ({ payload: key }),
    },
    setLoadingMessage: (
      state,
      action: PayloadAction<{ key: string; message: string }>
    ) => {
      state.loadingMessages[action.payload.key] = action.payload.message;
    },
    clearAllLoading: (state) => {
      state.isLoading = false;
      state.loadingStates = {};
      state.loadingMessages = {};
    },
  },
});

export const { startLoading, stopLoading, setLoadingMessage, clearAllLoading } =
  loadingSlice.actions;

// Selectors
export const selectIsLoading = (state: { loading: LoadingState }) =>
  state.loading.isLoading;
export const selectLoadingState =
  (key: string) => (state: { loading: LoadingState }) =>
    state.loading.loadingStates[key] || false;
export const selectLoadingMessage =
  (key: string) => (state: { loading: LoadingState }) =>
    state.loading.loadingMessages[key] || "";

export default loadingSlice.reducer;
